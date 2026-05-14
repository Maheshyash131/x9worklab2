"""
X9 WorkLab Backend Regression Tests

Authentication note: Real Emergent Google OAuth requires an actual browser flow.
We bypass the OAuth call and directly seed users + user_sessions in MongoDB so we
can hit the protected endpoints with a Bearer token.

Tests cover:
1) Multi-role per email + unique compound index (email, role)
2) Referral CRUD with ownership default + explicit
3) Earnings = accepted_count * 50000
4) Designer feed (referrals & consultations)
5) Consultations create + mine
6) Designer plan + wallet
7) PATCH /api/auth/profile
8) Logout + delete account
9) RBAC 403 checks
"""

import asyncio
import os
import sys
import uuid
from datetime import datetime, timezone, timedelta
from pathlib import Path

import httpx
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import DuplicateKeyError

# Load backend env
ROOT_DIR = Path("/app/backend")
load_dotenv(ROOT_DIR / ".env")

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]

# Public URL for the FastAPI app
FRONTEND_ENV = Path("/app/frontend/.env")
PUBLIC_URL = None
for line in FRONTEND_ENV.read_text().splitlines():
    if line.startswith("EXPO_PUBLIC_BACKEND_URL="):
        PUBLIC_URL = line.split("=", 1)[1].strip().strip('"')
        break

assert PUBLIC_URL, "EXPO_PUBLIC_BACKEND_URL missing from /app/frontend/.env"
API = f"{PUBLIC_URL}/api"
print(f"[i] Backend API base: {API}")


def utcnow():
    return datetime.now(timezone.utc)


# Test results aggregator
RESULTS = []


def record(name, passed, detail=""):
    RESULTS.append((name, passed, detail))
    status = "PASS" if passed else "FAIL"
    print(f"[{status}] {name}  {('- ' + detail) if detail else ''}")


async def seed_user(db, email, role, name=None, picture="", plan=None, wallet=0):
    """Insert a user with a fresh user_id and create a session_token, returning (user, token)."""
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    doc = {
        "user_id": user_id,
        "email": email,
        "name": name or email.split("@")[0],
        "picture": picture,
        "role": role,
        "wallet_balance": wallet,
        "plan": plan,
        "created_at": utcnow(),
    }
    await db.users.insert_one(doc)
    token = f"tok_{uuid.uuid4().hex}"
    await db.user_sessions.insert_one(
        {
            "session_token": token,
            "user_id": user_id,
            "expires_at": utcnow() + timedelta(days=7),
            "created_at": utcnow(),
        }
    )
    return doc, token


def H(token):
    return {"Authorization": f"Bearer {token}"}


async def cleanup_email(db, email):
    users = await db.users.find({"email": email}).to_list(50)
    uids = [u["user_id"] for u in users]
    if uids:
        await db.user_sessions.delete_many({"user_id": {"$in": uids}})
        await db.users.delete_many({"user_id": {"$in": uids}})
        await db.referrals.delete_many({"associate_id": {"$in": uids}})
        await db.consultations.delete_many({"client_id": {"$in": uids}})


async def main():
    mongo = AsyncIOMotorClient(MONGO_URL)
    db = mongo[DB_NAME]

    # Trigger startup index creation by hitting root
    async with httpx.AsyncClient(timeout=20.0) as http:
        r = await http.get(f"{API}/")
        record("GET /api/ root", r.status_code == 200 and r.json().get("message"), f"status={r.status_code}")

    # --- Test 1: index state ---
    idx = await db.users.index_information()
    legacy_present = "email_1" in idx and idx["email_1"].get("unique")
    compound_key = [("email", 1), ("role", 1)]
    compound_name = None
    for name, info in idx.items():
        if info.get("key") == compound_key and info.get("unique"):
            compound_name = name
            break
    record("Legacy email_1 unique index dropped", not legacy_present, f"present={legacy_present}")
    record("Compound unique index (email,role) exists", bool(compound_name), f"name={compound_name}")

    # --- Cleanup test emails ---
    test_email_multi = "amrita.singh.qa@x9worklab.test"
    test_email_assoc = "ravi.kumar.assoc@x9worklab.test"
    test_email_designer = "neha.designer.qa@x9worklab.test"
    test_email_client = "arjun.client.qa@x9worklab.test"
    test_email_designer2 = "vikram.designer2.qa@x9worklab.test"

    for e in [
        test_email_multi,
        test_email_assoc,
        test_email_designer,
        test_email_client,
        test_email_designer2,
    ]:
        await cleanup_email(db, e)

    # --- Test 1b: same email, 3 roles allowed; 4th duplicate fails ---
    inserted_ok = []
    for role in ("associate", "designer", "client"):
        try:
            await db.users.insert_one(
                {
                    "user_id": f"user_{uuid.uuid4().hex[:12]}",
                    "email": test_email_multi,
                    "name": "Amrita Singh",
                    "picture": "",
                    "role": role,
                    "wallet_balance": 0,
                    "plan": None,
                    "created_at": utcnow(),
                }
            )
            inserted_ok.append(role)
        except DuplicateKeyError as e:
            record(f"Insert {role} for same email", False, str(e))

    record(
        "Multi-role per email allowed (associate+designer+client)",
        inserted_ok == ["associate", "designer", "client"],
        f"inserted={inserted_ok}",
    )

    duplicate_blocked = False
    try:
        await db.users.insert_one(
            {
                "user_id": f"user_{uuid.uuid4().hex[:12]}",
                "email": test_email_multi,
                "name": "Amrita Dup",
                "picture": "",
                "role": "associate",
                "wallet_balance": 0,
                "plan": None,
                "created_at": utcnow(),
            }
        )
    except DuplicateKeyError:
        duplicate_blocked = True
    record(
        "Duplicate (email, role) blocked by unique index",
        duplicate_blocked,
        "" if duplicate_blocked else "duplicate insert went through (BUG)",
    )

    # --- Seed canonical users for endpoint tests ---
    associate, assoc_token = await seed_user(db, test_email_assoc, "associate", name="Ravi Kumar")
    designer, designer_token = await seed_user(db, test_email_designer, "designer", name="Neha Designer")
    client_user, client_token = await seed_user(db, test_email_client, "client", name="Arjun Client")

    async with httpx.AsyncClient(timeout=20.0) as http:
        # --- Test: auth/me ---
        r = await http.get(f"{API}/auth/me", headers=H(assoc_token))
        ok = r.status_code == 200 and r.json().get("email") == test_email_assoc and r.json().get("role") == "associate"
        record("GET /api/auth/me (associate)", ok, f"status={r.status_code} body={r.text[:200]}")

        # Missing token
        r = await http.get(f"{API}/auth/me")
        record("GET /api/auth/me without token => 401", r.status_code == 401, f"status={r.status_code}")

        # Invalid token
        r = await http.get(f"{API}/auth/me", headers={"Authorization": "Bearer not-a-real-token"})
        record("GET /api/auth/me invalid token => 401", r.status_code == 401, f"status={r.status_code}")

        # --- Test 2: Referral CRUD with ownership ---
        referral_body = {
            "client_name": "Priya Sharma",
            "phone": "9876543210",
            "email": "priya.sharma@example.com",
            "location": "Whitefield, Bengaluru",
            "bhk": "2BHK",
            "property_name": "Prestige Lakeside Habitat",
            "ownership": "Rented",
            "notes": "Looking for full home interior",
        }
        r = await http.post(f"{API}/referrals", json=referral_body, headers=H(assoc_token))
        ok = r.status_code == 200 and r.json().get("ownership") == "Rented"
        created_ref = r.json() if r.status_code == 200 else {}
        record("POST /api/referrals with ownership=Rented", ok, f"status={r.status_code} body={r.text[:200]}")
        rented_referral_id = created_ref.get("referral_id")

        # Without ownership defaults to Own
        r = await http.post(
            f"{API}/referrals",
            json={
                "client_name": "Karthik Iyer",
                "phone": "9988776655",
                "location": "Indiranagar, Bengaluru",
                "bhk": "3BHK",
                "property_name": "Sobha Dream Acres",
            },
            headers=H(assoc_token),
        )
        ok = r.status_code == 200 and r.json().get("ownership") == "Own"
        default_referral = r.json() if r.status_code == 200 else {}
        record("POST /api/referrals default ownership=Own", ok, f"status={r.status_code} body={r.text[:200]}")
        own_referral_id = default_referral.get("referral_id")

        # GET /referrals/mine
        r = await http.get(f"{API}/referrals/mine", headers=H(assoc_token))
        rows = r.json() if r.status_code == 200 else []
        ids = {x.get("referral_id") for x in rows}
        record(
            "GET /api/referrals/mine includes created referrals",
            r.status_code == 200 and rented_referral_id in ids and own_referral_id in ids,
            f"count={len(rows)} status={r.status_code}",
        )

        # --- Test 9 (partial): RBAC – designer cannot POST /referrals ---
        r = await http.post(f"{API}/referrals", json=referral_body, headers=H(designer_token))
        record("POST /api/referrals as designer => 403", r.status_code == 403, f"status={r.status_code}")

        # RBAC – client cannot view /referrals/mine
        r = await http.get(f"{API}/referrals/mine", headers=H(client_token))
        record("GET /api/referrals/mine as client => 403", r.status_code == 403, f"status={r.status_code}")

        # RBAC – associate cannot get designer feed
        r = await http.get(f"{API}/designer/feed", headers=H(assoc_token))
        record("GET /api/designer/feed as associate => 403", r.status_code == 403, f"status={r.status_code}")

        # RBAC – associate cannot create consultation
        r = await http.post(
            f"{API}/consultations",
            json={"name": "x", "phone": "1", "location": "y", "bhk": "1BHK"},
            headers=H(assoc_token),
        )
        record("POST /api/consultations as associate => 403", r.status_code == 403, f"status={r.status_code}")

        # --- Test 5: Consultations as client ---
        cons_body = {
            "name": "Arjun Client",
            "phone": "9123456780",
            "email": test_email_client,
            "location": "HSR Layout, Bengaluru",
            "bhk": "2BHK",
            "budget": "8L-10L",
            "notes": "Modular kitchen + master bedroom",
        }
        r = await http.post(f"{API}/consultations", json=cons_body, headers=H(client_token))
        ok = r.status_code == 200 and r.json().get("name") == "Arjun Client"
        consultation = r.json() if r.status_code == 200 else {}
        record("POST /api/consultations as client", ok, f"status={r.status_code} body={r.text[:200]}")
        consultation_id = consultation.get("referral_id")

        r = await http.get(f"{API}/consultations/mine", headers=H(client_token))
        ok = r.status_code == 200 and any(x.get("referral_id") == consultation_id for x in r.json())
        record("GET /api/consultations/mine returns created consultation", ok, f"status={r.status_code}")

        # --- Test 4: Designer feed ---
        r = await http.get(f"{API}/designer/feed", headers=H(designer_token))
        body = r.json() if r.status_code == 200 else {}
        ok = (
            r.status_code == 200
            and isinstance(body.get("referrals"), list)
            and isinstance(body.get("consultations"), list)
            and any(x.get("referral_id") == rented_referral_id for x in body["referrals"])
            and any(x.get("referral_id") == consultation_id for x in body["consultations"])
        )
        record("GET /api/designer/feed (referrals + consultations)", ok, f"status={r.status_code}")

        # --- Test 3: Earnings after designer accepts a referral ---
        r = await http.post(
            f"{API}/designer/referral-action",
            json={"referral_id": rented_referral_id, "action": "accept"},
            headers=H(designer_token),
        )
        ok = r.status_code == 200 and r.json().get("status") == "accepted"
        record("POST /api/designer/referral-action accept referral", ok, f"status={r.status_code} body={r.text[:200]}")

        # Reject the other one
        r = await http.post(
            f"{API}/designer/referral-action",
            json={"referral_id": own_referral_id, "action": "reject"},
            headers=H(designer_token),
        )
        record("POST /api/designer/referral-action reject referral", r.status_code == 200, f"status={r.status_code}")

        # Earnings — should be 1 * 50000
        r = await http.get(f"{API}/referrals/earnings", headers=H(assoc_token))
        body = r.json() if r.status_code == 200 else {}
        ok = r.status_code == 200 and body.get("count_accepted") == 1 and body.get("total") == 50000
        record("GET /api/referrals/earnings = 1 * 50000", ok, f"status={r.status_code} body={r.text[:200]}")

        # --- Test 6: Plan + wallet (designer) ---
        r = await http.post(f"{API}/designer/plan", json={"plan": "premium"}, headers=H(designer_token))
        ok = r.status_code == 200 and r.json().get("plan") == "premium"
        record("POST /api/designer/plan premium", ok, f"status={r.status_code} body={r.text[:200]}")

        # Invalid plan
        r = await http.post(f"{API}/designer/plan", json={"plan": "gold"}, headers=H(designer_token))
        record("POST /api/designer/plan invalid => 400", r.status_code == 400, f"status={r.status_code}")

        # Associate cannot set plan
        r = await http.post(f"{API}/designer/plan", json={"plan": "basic"}, headers=H(assoc_token))
        record("POST /api/designer/plan as associate => 403", r.status_code == 403, f"status={r.status_code}")

        # Wallet should be 12000 for designer (started at 0)
        r = await http.get(f"{API}/wallet", headers=H(designer_token))
        body = r.json() if r.status_code == 200 else {}
        ok = r.status_code == 200 and body.get("balance") == 12000 and body.get("role") == "designer"
        record("GET /api/wallet designer = 12000 premium bonus", ok, f"status={r.status_code} body={r.text[:200]}")

        # Wallet associate = 0
        r = await http.get(f"{API}/wallet", headers=H(assoc_token))
        body = r.json() if r.status_code == 200 else {}
        ok = r.status_code == 200 and body.get("role") == "associate" and body.get("balance") == 0
        record("GET /api/wallet associate", ok, f"status={r.status_code}")

        # /auth/me reflects plan + wallet
        r = await http.get(f"{API}/auth/me", headers=H(designer_token))
        body = r.json() if r.status_code == 200 else {}
        ok = body.get("plan") == "premium" and body.get("wallet_balance") == 12000
        record("GET /api/auth/me reflects designer plan+wallet", ok, f"body={r.text[:200]}")

        # --- Test 7: PATCH /api/auth/profile ---
        new_name = "Ravi K. (Updated)"
        new_pic = (
            "data:image/png;base64,"
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
        )
        r = await http.patch(
            f"{API}/auth/profile",
            json={"name": new_name, "picture": new_pic},
            headers=H(assoc_token),
        )
        body = r.json() if r.status_code == 200 else {}
        ok = r.status_code == 200 and body.get("name") == new_name and body.get("picture") == new_pic
        record("PATCH /api/auth/profile returns updated user", ok, f"status={r.status_code} body={r.text[:200]}")

        # /auth/me reflects new profile
        r = await http.get(f"{API}/auth/me", headers=H(assoc_token))
        body = r.json() if r.status_code == 200 else {}
        ok = body.get("name") == new_name and body.get("picture") == new_pic
        record("GET /api/auth/me reflects updated profile", ok, f"body={r.text[:120]}")

        # PATCH unauthenticated
        r = await http.patch(f"{API}/auth/profile", json={"name": "X"})
        record("PATCH /api/auth/profile no token => 401", r.status_code == 401, f"status={r.status_code}")

        # --- Test 8a: Logout ---
        # Create extra session for client so we can test logout cleanly
        extra_token = f"tok_{uuid.uuid4().hex}"
        await db.user_sessions.insert_one(
            {
                "session_token": extra_token,
                "user_id": client_user["user_id"],
                "expires_at": utcnow() + timedelta(days=7),
                "created_at": utcnow(),
            }
        )
        r = await http.post(f"{API}/auth/logout", headers=H(extra_token))
        ok = r.status_code == 200 and r.json().get("ok") is True
        record("POST /api/auth/logout removes session", ok, f"status={r.status_code}")
        # Verify session gone
        sess = await db.user_sessions.find_one({"session_token": extra_token})
        record("Session token deleted after logout", sess is None, f"sess={sess}")
        # Token now invalid
        r = await http.get(f"{API}/auth/me", headers=H(extra_token))
        record("Token after logout => 401", r.status_code == 401, f"status={r.status_code}")

        # --- Test 8b: Delete account ---
        # designer2 with some data
        designer2, d2_token = await seed_user(db, test_email_designer2, "designer", name="Vikram D2")
        # Give designer2 a session (already done in seed_user)
        # Add referrals owned by designer2? referrals belong to associate; ensure delete cleans only their own
        # Just verify user + sessions are removed
        r = await http.delete(f"{API}/auth/account", headers=H(d2_token))
        ok = r.status_code == 200 and r.json().get("ok") is True
        record("DELETE /api/auth/account ok", ok, f"status={r.status_code}")
        u = await db.users.find_one({"user_id": designer2["user_id"]})
        s = await db.user_sessions.find_one({"user_id": designer2["user_id"]})
        record("User row removed after delete", u is None, f"user={u}")
        record("Sessions removed after delete", s is None, f"sess={s}")

        # Also verify deleting associate removes their referrals
        assoc_uid = associate["user_id"]
        r = await http.delete(f"{API}/auth/account", headers=H(assoc_token))
        record("DELETE associate account ok", r.status_code == 200, f"status={r.status_code}")
        rem = await db.referrals.count_documents({"associate_id": assoc_uid})
        record("Associate referrals cleaned up on delete", rem == 0, f"remaining={rem}")

        # Verify client consultations cleaned up too
        client_uid = client_user["user_id"]
        r = await http.delete(f"{API}/auth/account", headers=H(client_token))
        record("DELETE client account ok", r.status_code == 200, f"status={r.status_code}")
        rem = await db.consultations.count_documents({"client_id": client_uid})
        record("Client consultations cleaned up on delete", rem == 0, f"remaining={rem}")

        # --- Final cleanup of remaining seeded data ---
        for e in [
            test_email_multi,
            test_email_assoc,
            test_email_designer,
            test_email_client,
            test_email_designer2,
        ]:
            await cleanup_email(db, e)

    # ---- Summary ----
    print("\n=================== SUMMARY ===================")
    passed = sum(1 for _, p, _ in RESULTS if p)
    failed = [r for r in RESULTS if not r[1]]
    print(f"Total: {len(RESULTS)}, Passed: {passed}, Failed: {len(failed)}")
    if failed:
        print("\nFailed cases:")
        for name, _, detail in failed:
            print(f"  - {name}: {detail}")
    mongo.close()
    return 0 if not failed else 1


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
