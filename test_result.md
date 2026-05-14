#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: |
  X9 WorkLab — 3-role mobile app (Associate / Designer / Client) with Emergent Google Auth,
  MongoDB persistence, persistent login, multi-role per email, profile picture upload,
  Associate bottom-tab module (Dashboard / Status / Earnings / Profile), modal-based client referral
  capture (1/2/3 BHK, Rented/Own), and a designer onboarding flow (plan → payment summary → dashboard).

backend:
  - task: "Multi-role per email (unique (email, role))"
    implemented: true
    working: true
    file: "/app/backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Dropped legacy email unique index, switched to compound (email,role) unique. Same Google email can now register/login as associate, designer and client without conflict."
      - working: true
        agent: "testing"
        comment: "Verified via direct MongoDB inspection: legacy email_1 unique index is absent; compound index email_1_role_1 exists with unique=true. Seeded three users with identical email and roles {associate, designer, client} — all inserts succeeded. A 4th insert reusing (email, role=associate) raised DuplicateKeyError as expected."

  - task: "Referral schema with ownership (Own/Rented)"
    implemented: true
    working: true
    file: "/app/backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "ReferralIn now accepts ownership (default Own). Stored in DB and returned in /referrals/mine and /designer/feed."
      - working: true
        agent: "testing"
        comment: "POST /api/referrals with ownership=\"Rented\" returns ownership=\"Rented\". POST without ownership returns ownership=\"Own\" (default). Both referrals are returned by GET /api/referrals/mine and by GET /api/designer/feed (designer role)."

  - task: "PATCH /api/auth/profile (name + base64 picture)"
    implemented: true
    working: true
    file: "/app/backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "New endpoint to update profile name and base64 picture (data URL). Returns full user."
      - working: true
        agent: "testing"
        comment: "PATCH /api/auth/profile updates both name and base64 data-URL picture and returns the updated user. A subsequent GET /api/auth/me reflects the new name and picture. Returns 401 when called without a token."

  - task: "Existing endpoints still working (auth/me, referrals CRUD, designer feed, consultations, earnings, plan)"
    implemented: true
    working: true
    file: "/app/backend/server.py"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Untouched logic — verify regression-free."
      - working: true
        agent: "testing"
        comment: "Full regression: GET /api/auth/me (200 with token; 401 missing/invalid). POST /api/consultations (client) + GET /api/consultations/mine OK. GET /api/designer/feed returns both referrals and consultations arrays. POST /api/designer/referral-action accept/reject mutates referral status correctly. GET /api/referrals/earnings returns total=count_accepted*50000 (verified: 1 accepted → total 50000). POST /api/designer/plan premium sets plan and adds 12000 to wallet (basic adds 5000); GET /api/wallet returns {balance, role}. RBAC enforced: associate-only endpoints return 403 for designer/client tokens; designer/client endpoints return 403 for associate tokens. POST /api/auth/logout deletes the session and the token is invalidated. DELETE /api/auth/account removes the user, their sessions, their referrals (for associate) and their consultations (for client)."

  - task: "Auth (Emergent Google OAuth) /api/auth/google/session"
    implemented: true
    working: "NA"
    file: "/app/backend/server.py"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "testing"
        comment: "Not exercised end-to-end because real Emergent Google OAuth requires a real browser flow. Logic is reachable (returns 401 when the upstream Google session is invalid, observed in backend.out.log). All protected endpoints were validated by seeding user_sessions directly in MongoDB and using Bearer tokens, which exercises the same get_current_user path used after OAuth."

frontend:
  - task: "App rename to x9worklab"
    implemented: true
    working: "NA"
    file: "/app/frontend/app.json"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "expo.name and slug updated to x9worklab."

  - task: "Associate bottom-tab navigation (Dashboard / Status / Earnings / Profile)"
    implemented: true
    working: "NA"
    file: "/app/frontend/app/associate/_layout.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Pill tab bar with phosphor icons; index/referrals/earnings/profile screens created."

  - task: "Refer Client modal (mini-screen) with 1/2/3 BHK + Rented/Own"
    implemented: true
    working: "NA"
    file: "/app/frontend/components/ReferClientModal.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Bottom sheet modal with all required fields; pushes to /api/referrals."

  - task: "Profile picture upload via expo-image-picker"
    implemented: true
    working: "NA"
    file: "/app/frontend/app/associate/profile.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Picker → base64 data URL → PATCH /auth/profile."

  - task: "Designer onboarding: plan → payment summary → dashboard"
    implemented: true
    working: "NA"
    file: "/app/frontend/app/designer-payment.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "3-step progress, mocked payment summary, finally calls /designer/plan and routes to dashboard."

  - task: "Persistent login + multi-role login (same email allowed)"
    implemented: true
    working: "NA"
    file: "/app/frontend/app/index.tsx, /app/frontend/lib/auth.ts"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Root index already checks token and auto-routes. Backend now allows multi-role per email."

metadata:
  created_by: "main_agent"
  version: "1.1"
  test_sequence: 1
  run_ui: false

test_plan:
  current_focus: []
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: |
      Backend updated for multi-role per email, ownership field on referrals, and profile picture upload.
      All 40 backend regression tests PASSED in earlier round.
  - agent: "main"
    message: |
      Round 2 — major frontend overhaul:
      • Welcome screen: 4 feature cards with real Unsplash images, scrollable, refreshed branding pill.
      • Role-select: hero image + colorful per-role icons + bigger gold arrow CTAs.
      • Login: house/interior hero, Google-only login (no email/password fields), unified XNine background.
      • Associate: reduced top padding; bottom-tab nav (Dashboard / Status / Earnings / Profile) stays.
      • Designer module rewritten with bottom-tab nav (Dashboard / Opportunities / Projects / Profile):
        - Dashboard: greeting, 2x2 cards (Opportunities, Active Projects, Profile View, Workspace Open), featured-lead hero with image, horizontal active-projects carousel.
        - Opportunities: list of pending leads with filter chips (All/From Associates/Direct), Accept/Reject actions.
        - Projects: accepted leads list with progress bar.
        - Profile: avatar upload, wallet card with plan, info/account actions.
      • Designer onboarding: Registration Successful screen added between payment and dashboard, with "What happens next?" steps, Reference Details, Go to Dashboard + Contact Support buttons.
      • All routes updated: /associate, /designer, /client/dashboard.
      No new backend changes in this round.
  - agent: "testing"
    message: |
      Backend regression complete via /app/backend_test.py — 40/40 assertions PASSED against the public
      ingress URL (EXPO_PUBLIC_BACKEND_URL + /api). Real Emergent Google OAuth was NOT exercised
      end-to-end (requires a real browser session); instead, users and user_sessions were seeded
      directly in MongoDB and protected endpoints were hit with Bearer tokens — this exercises the
      same get_current_user path used after OAuth, so all RBAC and business logic is verified.

      Verified:
      - Indexes: legacy email_1 unique index absent; compound (email, role) unique index present.
        Same email can register as associate+designer+client; duplicate (email, role) is blocked.
      - Referrals: ownership=Rented persisted; default ownership=Own when omitted; visible in
        /referrals/mine and /designer/feed.
      - Earnings: total = count_accepted * 50000 (verified 1 accepted = 50000).
      - Designer feed returns both referrals and consultations arrays.
      - Consultations create + /consultations/mine work for client.
      - Designer plan: premium adds 12000 to wallet; invalid plan -> 400; associate -> 403.
        /wallet returns {balance, role}; /auth/me reflects plan + wallet.
      - PATCH /api/auth/profile updates name + base64 picture; reflected in /auth/me; 401 w/o token.
      - Logout removes session and invalidates the token. DELETE /api/auth/account removes the user,
        their sessions, their referrals (associate) and consultations (client).
      - RBAC: associate-only endpoints return 403 for designer/client; designer/client endpoints
        return 403 for associate; missing/invalid token returns 401.

      No blocking issues found. Recommend main agent summarise and finish.
