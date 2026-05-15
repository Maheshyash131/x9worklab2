from fastapi import FastAPI, APIRouter, Request, HTTPException, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import secrets
from clerk_backend_api import Clerk
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone, timedelta


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI()
api_router = APIRouter(prefix="/api")

ALLOWED_ROLES = {"associate", "designer", "client"}
CLERK_SECRET_KEY = os.environ["CLERK_SECRET_KEY"]
clerk = Clerk(bearer_auth=CLERK_SECRET_KEY)

# ---------- Models ----------
class ClerkAuthIn(BaseModel):
    clerk_user_id: str
    role: str

class ReferralIn(BaseModel):
    client_name: str
    phone: str
    email: Optional[str] = ""
    location: str
    bhk: str  # "1BHK" | "2BHK" | "3BHK" | "Villa" | etc.
    property_name: str
    ownership: Optional[str] = "Own"  # "Own" | "Rented"
    notes: Optional[str] = ""


class ProfileUpdateIn(BaseModel):
    name: Optional[str] = None
    picture: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    rera_no: Optional[str] = None
    department: Optional[str] = None
    office: Optional[str] = None
    pan: Optional[str] = None


class ConsultationIn(BaseModel):
    name: str
    phone: str
    email: Optional[str] = ""
    location: str
    bhk: str
    budget: Optional[str] = ""
    notes: Optional[str] = ""

class DesignerConnectIn(BaseModel):
    designer_id: str
    full_name: str
    phone: str
    email: str
    project_type: Optional[str] = ""
    bhk: Optional[str] = ""
    location: Optional[str] = ""
    budget: Optional[str] = ""
    requirements: Optional[str] = ""

class KarmicConsultationIn(BaseModel):
    dob: str
    full_name: str
    phone: str
    email: str
    concern: Optional[str] = ""
    consultation_fee: Optional[int] = 2999


class ReferralActionIn(BaseModel):
    referral_id: str
    action: str  # "accept" | "reject"

class DesignerRegistrationIn(BaseModel):
    full_name: str
    company_name: Optional[str] = ""
    email: str
    phone: Optional[str] = ""
    specialization: Optional[str] = ""
    experience: Optional[str] = ""
    license_number: Optional[str] = ""


class PlanIn(BaseModel):
    plan: str  # "basic" | "premium"
    payment_completed: Optional[bool] = False


# ---------- Helpers ----------
def utcnow():
    return datetime.now(timezone.utc)


async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")
    token = authorization.split(" ", 1)[1]
    session = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    expires_at = session.get("expires_at")
    if isinstance(expires_at, datetime):
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        if expires_at < utcnow():
            raise HTTPException(status_code=401, detail="Session expired")
    user = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


# ---------- Auth ----------
@api_router.post("/auth/clerk/session")
async def clerk_session(payload: ClerkAuthIn):
    print("CLERK PAYLOAD:", payload)

    if payload.role not in ALLOWED_ROLES:
        raise HTTPException(status_code=400, detail="Invalid role")

    try:
        print("CLERK USER ID:", payload.clerk_user_id)
        clerk_user = clerk.users.get(user_id=payload.clerk_user_id)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Clerk user")

    email = ""
    if clerk_user.email_addresses:
        email = clerk_user.email_addresses[0].email_address

    name = clerk_user.first_name or "User"
    if clerk_user.last_name:
        name += f" {clerk_user.last_name}"

    picture = clerk_user.image_url or ""
    session_token = secrets.token_urlsafe(32)

    existing = await db.users.find_one(
        {"email": email, "role": payload.role},
        {"_id": 0}
    )

    if existing:
        user = existing
    else:
        user = {
            "user_id": f"user_{uuid.uuid4().hex[:12]}",
            "email": email,
            "name": name,
            "picture": picture,
            "role": payload.role,
            "wallet_balance": 0,
            "plan": None,
            "created_at": utcnow(),
        }
        await db.users.insert_one(user.copy())

    expires_at = utcnow() + timedelta(days=7)

    await db.user_sessions.update_one(
        {"session_token": session_token},
        {
            "$set": {
                "session_token": session_token,
                "user_id": user["user_id"],
                "expires_at": expires_at,
                "created_at": utcnow(),
            }
        },
        upsert=True,
    )

    return {
        "session_token": session_token,
        "user": {
            "user_id": user["user_id"],
            "email": user["email"],
            "name": user["name"],
            "picture": user.get("picture", ""),
            "role": user["role"],
            "plan": user.get("plan"),
            "wallet_balance": user.get("wallet_balance", 0),
        },
    }


@api_router.get("/auth/me")
async def auth_me(authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization)

    completed_projects = 0
    designer_earnings = 0

    if user["role"] == "designer":
        accepted_referrals = await db.referrals.find(
            {
                "designer_id": user["user_id"],
                "status": "accepted",
            },
            {"_id": 0},
        ).to_list(500)

        accepted_consultations = await db.consultations.find(
            {
                "designer_id": user["user_id"],
                "status": "accepted",
            },
            {"_id": 0},
        ).to_list(500)

        all_projects = accepted_referrals + accepted_consultations
        completed_projects = len(all_projects)

        def project_amount(bhk: str):
            bhk = (bhk or "").upper()

            if "1BHK" in bhk:
                return 20000
            elif "2BHK" in bhk:
                return 40000
            elif "3BHK" in bhk:
                return 65000
            elif "4BHK" in bhk:
                return 90000
            elif "VILLA" in bhk:
                return 150000
            else:
                return 25000

        designer_earnings = sum(
            project_amount(project.get("bhk", ""))
            for project in all_projects
        )

    return {
        "location": user.get("location", ""),
        "user_id": user["user_id"],
        "email": user["email"],
        "name": user["name"],
        "picture": user.get("picture", ""),
        "phone": user.get("phone", ""),
        "rera_no": user.get("rera_no", ""),
        "department": user.get("department", ""),
        "office": user.get("office", ""),
        "pan": user.get("pan", ""),
        "company_name": user.get("company_name", ""),
        "specialization": user.get("specialization", ""),
        "experience": user.get("experience", ""),
        "license_number": user.get("license_number", ""),
        "role": user["role"],
        "plan": user.get("plan"),
        "payment_completed": user.get("payment_completed", False),
        "registration_fee": user.get("registration_fee", 0),
        "plan_fee": user.get("plan_fee", 0),
        "total_paid": user.get("total_paid", 0),
        "wallet_balance": designer_earnings,
        "completed_projects": completed_projects,
    }

@api_router.post("/auth/logout")
async def logout(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        return {"ok": True}
    token = authorization.split(" ", 1)[1]
    await db.user_sessions.delete_one({"session_token": token})
    return {"ok": True}


@api_router.get("/client/recommended-designers")
async def recommended_designers(
    authorization: Optional[str] = Header(None)
):
    user = await get_current_user(authorization)

    if user["role"] != "client":
        raise HTTPException(status_code=403, detail="Client only")

    designers = await db.users.find(
        {
            "role": "designer",
            "payment_completed": True,
        },
        {"_id": 0},
    ).to_list(500)

    def plan_rank(plan):
        if plan == "premium":
            return 3
        elif plan == "basic":
            return 2
        return 1

    enriched = []

    for designer in designers:
        accepted_referrals = await db.referrals.count_documents({
            "designer_id": designer["user_id"],
            "status": "accepted",
        })

        accepted_consultations = await db.consultations.count_documents({
            "designer_id": designer["user_id"],
            "status": "accepted",
        })

        total_projects = accepted_referrals + accepted_consultations

        enriched.append({
            "user_id": designer["user_id"],
            "name": designer.get("name", ""),
            "picture": designer.get("picture", ""),
            "specialization": designer.get("specialization", ""),
            "experience": designer.get("experience", ""),
            "plan": designer.get("plan"),
            "completed_projects": total_projects,
            "rating": designer.get("rating", 4.8),
        })

    enriched.sort(
        key=lambda d: (
            -plan_rank(d["plan"]),
            -d["completed_projects"],
            -float(d["rating"]),
        )
    )

    return enriched

@api_router.post("/client/connect-designer")
async def connect_designer(
    payload: DesignerConnectIn,
    authorization: Optional[str] = Header(None)
):
    user = await get_current_user(authorization)

    if user["role"] != "client":
        raise HTTPException(status_code=403, detail="Client only")

    doc = {
        "referral_id": f"con_{uuid.uuid4().hex[:12]}",
        "client_id": user["user_id"],
        "designer_id": payload.designer_id,
        "name": payload.full_name,
        "phone": payload.phone,
        "email": payload.email,
        "location": payload.location,
        "bhk": payload.bhk,
        "budget": payload.budget,
        "notes": payload.requirements,
        "project_type": payload.project_type,
        "status": "pending",
        "source": "design_match",
        "created_at": utcnow(),
    }

    await db.consultations.insert_one(doc)

    return {"ok": True}

@api_router.post("/client/karmic-consultation")
async def create_karmic_consultation(
    payload: KarmicConsultationIn,
    authorization: Optional[str] = Header(None)
):
    user = await get_current_user(authorization)

    if user["role"] != "client":
        raise HTTPException(status_code=403, detail="Client only")

    doc = {
        "referral_id": f"kar_{uuid.uuid4().hex[:12]}",
        "client_id": user["user_id"],
        "name": payload.full_name,
        "phone": payload.phone,
        "email": payload.email,
        "dob": payload.dob,
        "concern": payload.concern,
        "consultation_fee": payload.consultation_fee,
        "status": "paid",
        "source": "karmic_consultation",
        "created_at": utcnow(),
    }

    await db.consultations.insert_one(doc)

    return {
        "ok": True,
        "message": "Karmic consultation booked"
    }

@api_router.patch("/auth/profile")
async def update_profile(payload: ProfileUpdateIn, authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization)
    update: dict = {}

    if payload.name is not None and payload.name.strip():
        update["name"] = payload.name.strip()

    if payload.picture is not None:
        update["picture"] = payload.picture

    if payload.location is not None:
        update["location"] = payload.location

    if payload.phone is not None:
        update["phone"] = payload.phone

    if payload.rera_no is not None:
        update["rera_no"] = payload.rera_no

    if payload.department is not None:
        update["department"] = payload.department

    if payload.office is not None:
        update["office"] = payload.office

    if payload.pan is not None:
        update["pan"] = payload.pan

    if update:
        await db.users.update_one(
            {"user_id": user["user_id"]},
            {"$set": update}
        )

    fresh = await db.users.find_one(
        {"user_id": user["user_id"]},
        {"_id": 0}
    )

    return {
    "user_id": fresh["user_id"],
    "email": fresh["email"],
    "name": fresh["name"],
    "picture": fresh.get("picture", ""),
    "phone": fresh.get("phone", ""),
    "location": fresh.get("location", ""),
    "rera_no": fresh.get("rera_no", ""),
    "department": fresh.get("department", ""),
    "office": fresh.get("office", ""),
    "pan": fresh.get("pan", ""),
    "role": fresh["role"],
    "plan": fresh.get("plan"),
    "wallet_balance": fresh.get("wallet_balance", 0),
}

@api_router.delete("/auth/account")
async def delete_account(authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization)
    await db.users.delete_one({"user_id": user["user_id"]})
    await db.user_sessions.delete_many({"user_id": user["user_id"]})
    await db.referrals.delete_many({"associate_id": user["user_id"]})
    await db.consultations.delete_many({"client_id": user["user_id"]})
    return {"ok": True}


# ---------- Designer Plan ----------
@api_router.post("/designer/plan")
async def select_plan(
    payload: PlanIn,
    authorization: Optional[str] = Header(None)
):
    user = await get_current_user(authorization)

    if user["role"] != "designer":
        raise HTTPException(status_code=403, detail="Designer only")

    if payload.plan not in {"basic", "premium"}:
        raise HTTPException(status_code=400, detail="Invalid plan")

    onboarding_fee = 4999
    plan_fee = 7999 if payload.plan == "basic" else 11999
    total_paid = onboarding_fee + plan_fee
    bonus = 5000 if payload.plan == "basic" else 12000

    update = {
        "plan": payload.plan,
    }

    if payload.payment_completed:
        update.update({
            "payment_completed": True,
            "registration_fee": onboarding_fee,
            "plan_fee": plan_fee,
            "total_paid": total_paid,
            "payment_date": utcnow(),
            "wallet_balance": bonus,
        })

    await db.users.update_one(
        {"user_id": user["user_id"]},
        {"$set": update}
    )

    fresh = await db.users.find_one(
        {"user_id": user["user_id"]},
        {"_id": 0}
    )

    return {
        "ok": True,
        "plan": fresh.get("plan"),
        "payment_completed": fresh.get("payment_completed", False),
        "registration_fee": fresh.get("registration_fee", onboarding_fee),
        "plan_fee": fresh.get("plan_fee", plan_fee),
        "total_paid": fresh.get("total_paid", total_paid),
        "wallet_balance": fresh.get("wallet_balance", 0),
    }


@api_router.post("/designer/register")

async def designer_register(

    payload: DesignerRegistrationIn,
    authorization: Optional[str] = Header(None)
):
    user = await get_current_user(authorization)

    if user["role"] != "designer":
        raise HTTPException(status_code=403, detail="Designer only")

    update = {
        "name": payload.full_name,
        "company_name": payload.company_name,
        "phone": payload.phone,
        "specialization": payload.specialization,
        "experience": payload.experience,
        "license_number": payload.license_number,
    }

    await db.users.update_one(
        {"user_id": user["user_id"]},
        {"$set": update}
    )

    fresh = await db.users.find_one(
        {"user_id": user["user_id"]},
        {"_id": 0}
    )

    return {
        "ok": True,
        "user": {
            "user_id": fresh["user_id"],
            "name": fresh["name"],
            "email": fresh["email"],
            "company_name": fresh.get("company_name", ""),
            "phone": fresh.get("phone", ""),
            "specialization": fresh.get("specialization", ""),
            "experience": fresh.get("experience", ""),
            "license_number": fresh.get("license_number", ""),
            "role": fresh["role"],
        },
    }


# ---------- Associate: Referrals ----------
@api_router.post("/referrals")
async def create_referral(payload: ReferralIn, authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization)
    if user["role"] != "associate":
        raise HTTPException(status_code=403, detail="Associate only")
    doc = {
        "referral_id": f"ref_{uuid.uuid4().hex[:12]}",
        "associate_id": user["user_id"],
        "associate_name": user["name"],
        "client_name": payload.client_name,
        "phone": payload.phone,
        "email": payload.email or "",
        "location": payload.location,
        "bhk": payload.bhk,
        "property_name": payload.property_name,
        "ownership": payload.ownership or "Own",
        "notes": payload.notes or "",
        "status": "pending",  # pending | accepted | rejected
        "designer_id": None,
        "source": "associate",
        "created_at": utcnow(),
    }
    await db.referrals.insert_one(doc.copy())
    doc.pop("_id", None)
    return doc


@api_router.get("/referrals/mine")
async def my_referrals(authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization)
    if user["role"] != "associate":
        raise HTTPException(status_code=403, detail="Associate only")
    cur = db.referrals.find({"associate_id": user["user_id"]}, {"_id": 0}).sort("created_at", -1)
    return await cur.to_list(500)


@api_router.get("/referrals/earnings")
async def earnings(authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization)
    if user["role"] != "associate":
        raise HTTPException(status_code=403, detail="Associate only")
    cur = db.referrals.find(
        {"associate_id": user["user_id"], "status": "accepted"}, {"_id": 0}
    ).sort("created_at", -1)
    accepted = await cur.to_list(500)
    # mock commission: 50000 per accepted referral
    total = len(accepted) * 50000
    return {"total": total, "count_accepted": len(accepted), "items": accepted}


# ---------- Designer: View & Act on referrals + consultations ----------
@api_router.get("/designer/feed")
async def designer_feed(authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization)
    if user["role"] != "designer":
        raise HTTPException(status_code=403, detail="Designer only")
    referrals = await db.referrals.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    consultations = await db.consultations.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return {"referrals": referrals, "consultations": consultations}


@api_router.post("/designer/referral-action")
async def referral_action(payload: ReferralActionIn, authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization)
    if user["role"] != "designer":
        raise HTTPException(status_code=403, detail="Designer only")
    if payload.action not in {"accept", "reject"}:
        raise HTTPException(status_code=400, detail="Invalid action")
    new_status = "accepted" if payload.action == "accept" else "rejected"
    res = await db.referrals.update_one(
        {"referral_id": payload.referral_id},
        {"$set": {"status": new_status, "designer_id": user["user_id"]}},
    )
    if res.matched_count == 0:
        # maybe a consultation
        res2 = await db.consultations.update_one(
            {"referral_id": payload.referral_id},
            {"$set": {"status": new_status, "designer_id": user["user_id"]}},
        )
        if res2.matched_count == 0:
            raise HTTPException(status_code=404, detail="Referral not found")
    return {"ok": True, "status": new_status}


# ---------- Client: Consultation ----------
@api_router.post("/consultations")
async def create_consultation(payload: ConsultationIn, authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization)
    if user["role"] != "client":
        raise HTTPException(status_code=403, detail="Client only")
    doc = {
        "referral_id": f"con_{uuid.uuid4().hex[:12]}",
        "client_id": user["user_id"],
        "name": payload.name,
        "phone": payload.phone,
        "email": payload.email or "",
        "location": payload.location,
        "bhk": payload.bhk,
        "budget": payload.budget or "",
        "notes": payload.notes or "",
        "status": "pending",
        "designer_id": None,
        "source": "client",
        "created_at": utcnow(),
    }
    await db.consultations.insert_one(doc.copy())
    doc.pop("_id", None)
    return doc


@api_router.get("/consultations/mine")
async def my_consultations(authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization)
    if user["role"] != "client":
        raise HTTPException(status_code=403, detail="Client only")
    cur = db.consultations.find({"client_id": user["user_id"]}, {"_id": 0}).sort("created_at", -1)
    return await cur.to_list(500)


# ---------- Wallet ----------
@api_router.get("/wallet")
async def wallet(authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization)
    return {"balance": user.get("wallet_balance", 0), "role": user["role"]}


@api_router.get("/")
async def root():
    return {"message": "X9 WorkLab API"}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup():
    # drop legacy single-email unique index if present
    try:
        idx = await db.users.index_information()
        if "email_1" in idx and idx["email_1"].get("unique"):
            await db.users.drop_index("email_1")
    except Exception:
        pass
    await db.users.create_index([("email", 1), ("role", 1)], unique=True)
    await db.users.create_index("user_id", unique=True)
    await db.user_sessions.create_index("session_token", unique=True)
    await db.user_sessions.create_index("expires_at", expireAfterSeconds=0)
    await db.referrals.create_index("referral_id", unique=True)
    await db.consultations.create_index("referral_id", unique=True)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
