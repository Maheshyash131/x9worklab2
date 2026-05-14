# PRD — X9 WorkLab (Prototype)

A 3-role mobile app (Expo + FastAPI + MongoDB) connecting Associates, Designers and Clients.

## Roles & Flows
1. **Associate**: logs in via Google → adds new client referrals (BHK, property, location, notes) → sees status/earnings.
2. **Designer**: Google login → first time picks plan (Basic ₹7,999 / Premium ₹11,999 — mock, credits wallet) → dashboard with wallet, accepts/rejects incoming leads from associates & clients.
3. **Client**: Google login → submits consultation request (BHK, location, budget, notes) → request visible to designers → tracks status.

## Single-role enforcement
The same Google email can only register under ONE role. Switching requires deleting the account (DELETE /api/auth/account).

## Business hook
Wallet credit + plan selection at designer signup → encourages premium tier without coding real payment yet.

## Stack
- Frontend: Expo Router (file-based), StyleSheet, expo-secure-store, expo-web-browser, phosphor-react-native, expo-linear-gradient
- Backend: FastAPI + Motor (MongoDB) + Emergent Google Auth
