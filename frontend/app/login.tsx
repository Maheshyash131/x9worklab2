import React, { useState } from "react";
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, ShieldCheck, GoogleLogo } from "phosphor-react-native";
import { Role, exchangeClerkUser } from "../lib/auth";
import XNineBackground from "../components/XNineBackground";
import { useOAuth } from "@clerk/clerk-expo";

const TITLES: Record<Role, { t: string; s: string }> = {
  associate: { t: "Associate Login", s: "Manage clients & deals" },
  designer: { t: "Designer Login", s: "Access your design projects" },
  client: { t: "Client Login", s: "Explore & connect easily" },
};

export default function LoginPage() {
  const { role } = useLocalSearchParams<{ role: Role }>();
  const r: Role = (role as Role) || "associate";
  const meta = TITLES[r];
  const [busy, setBusy] = useState(false);
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const handleGoogle = async () => {
    try {
      setBusy(true);

      const result = await startOAuthFlow();

if (!result.createdSessionId || !result.setActive) {
  throw new Error("Google login failed");
}

await result.setActive({ session: result.createdSessionId });

const userId =
  result.createdUserId ||
  result.signUp?.createdUserId ||
  result.signIn?.createdUserId;

if (!userId) {
  console.log("CLERK RESULT:", result);
  throw new Error("No Clerk user found");
}

      const res = await exchangeClerkUser(userId, r);
      console.log("USER ID SENT:", userId);
	
      const u = res.user;

      if (u.role === "associate") {
        router.replace("/associate");
      } else if (u.role === "designer") {
        if (!u.plan) router.replace("/designer-plans");
        else router.replace("/designer");
      } else {
        router.replace("/client/dashboard");
      }
    } catch (e: any) {
      Alert.alert("Login failed", e?.message || "Try again");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <XNineBackground />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <View style={{ paddingHorizontal: 22, paddingTop: 4 }}>
            <View style={styles.topRow}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <ArrowLeft size={22} color="#B57B10" />
              </TouchableOpacity>
              <View style={{ width: 56 }} />
              <View style={{ width: 56 }} />
            </View>

            <View style={{ height: 120 }} />

            <Text style={styles.h1}>{meta.t}</Text>
            <Text style={styles.sub}>{meta.s}</Text>
            <View style={styles.accent} />

            <View style={styles.card}>
              <View style={{ alignItems: "center", marginBottom: 18 }}>
                <View style={styles.lockBadge}>
                  <ShieldCheck size={28} color="#D59A1C" weight="fill" />
                </View>
                <Text style={styles.cardHint}>Sign in securely with Google.</Text>
                <Text style={styles.cardSubHint}>One Google email • multiple roles supported</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.9}
                disabled={busy}
                onPress={handleGoogle}
                style={styles.shadowBtn}
              >
                <LinearGradient
                  colors={["#FFB931", "#E19100"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.googleBtn}
                >
                  {busy ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <GoogleLogo size={24} color="#fff" weight="bold" />
                      <Text style={styles.googleText}>Continue with Google</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <Text style={styles.note}>
                By continuing, you agree to X9 WorkLab Terms & Privacy.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#FFFDF8", alignItems: "center", justifyContent: "center" },
  h1: { fontSize: 26, color: "#111", fontWeight: "800" },
  sub: { fontSize: 13, color: "#7A7167", marginTop: 6 },
  accent: { width: 60, height: 4, backgroundColor: "#D9A23A", borderRadius: 4, marginTop: 12 },
  card: { backgroundColor: "#FFFDF8", borderRadius: 28, padding: 22, marginTop: 22 },
  lockBadge: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#FFF1DA", alignItems: "center", justifyContent: "center", marginBottom: 10 },
  cardHint: { color: "#1B1B1B", fontSize: 15, textAlign: "center", fontWeight: "600" },
  cardSubHint: { color: "#9A8E80", fontSize: 12, textAlign: "center", marginTop: 4 },
  shadowBtn: { borderRadius: 999, overflow: "hidden" },
  googleBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16 },
  googleText: { color: "#fff", fontSize: 17, fontWeight: "800", marginLeft: 8 },
  note: { color: "#9A8E80", fontSize: 11, textAlign: "center", marginTop: 14 },
});