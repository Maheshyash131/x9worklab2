import * as SecureStore from "expo-secure-store";
import { ClerkProvider, useSignIn } from "@clerk/clerk-expo";
import { api, setToken } from "./api";

export type Role = "associate" | "designer" | "client";

const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

export async function googleLogin(role: Role): Promise<{ ok: boolean; user?: any; error?: string }> {
  try {
    return { ok: false, error: "Use Clerk login flow from UI" };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Auth failed" };
  }
}

export async function exchangeClerkUser(clerkUserId: string, role: Role) {
  const data = await api("/auth/clerk/session", {
    method: "POST",
    body: JSON.stringify({
      clerk_user_id: clerkUserId,
      role,
    }),
  });

  await setToken(data.session_token);
  return data;
}

export async function processWebSessionIfAny(role: Role) {
  return { ok: false };
}