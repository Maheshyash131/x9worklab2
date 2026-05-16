import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowRight,
  ShieldCheck,
  Sparkle,
  SealCheck,
  Crown,
  TrendUp,
  MedalMilitary,
} from "phosphor-react-native";
import { api, getToken, clearToken } from "../lib/api";
import XNineBackground from "../components/XNineBackground";

const FEATURES = [
  { title: "100% Verified", sub: "Verified leads only", Icon: SealCheck, color: "#3F9B2E", bg: "#EAF8E1" },
  { title: "Premium Quality", sub: "Top-tier projects", Icon: Crown, color: "#D88D07", bg: "#FFF1DA" },
  { title: "Grow 3× Faster", sub: "Boost your business", Icon: TrendUp, color: "#3B82F6", bg: "#EAF1FF" },
  { title: "Build Presence", sub: "Showcase portfolio", Icon: MedalMilitary, color: "#9333EA", bg: "#F3E8FF" },
];

export default function Welcome() {
  const [checking, setChecking] = useState(true);

  const routeForUser = (user: any) => {
    if (user.role === "associate") {
      router.replace("/associate");
    } else if (user.role === "designer") {
      if (!user.plan) {
        router.replace("/designer-welcome");
      } else {
        router.replace("/designer");
      }
    } else if (user.role === "client") {
      router.replace("/single");
    } else {
      setChecking(false);
    }
  };

 useEffect(() => {
  const checkSession = async () => {
    try {
      const token = await getToken();

      if (!token) {
        setChecking(false);
        return;
      }

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 3000)
      );

      const me = await Promise.race([
        api("/auth/me"),
        timeoutPromise,
      ]);

      routeForUser(me);
    } catch {
      await clearToken();
      setChecking(false);
    }
  };

  checkSession();
}, []);

 if (checking) {
  return (
    <View style={{ flex: 1 }}>
      <XNineBackground />
      <SafeAreaView style={[styles.center, { flex: 1 }]}>
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.92)",
            paddingHorizontal: 28,
            paddingVertical: 22,
            borderRadius: 24,
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#D88D07" />
          <Text
            style={{
              marginTop: 14,
              fontSize: 16,
              fontWeight: "700",
              color: "#B57B10",
            }}
          >
            Loading your workspace...
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

  return (
    <View style={{ flex: 1 }}>
      <XNineBackground />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={{ height: 100 }} />

            <View style={{ alignItems: "center" }}>
              <View style={styles.pill}>
                <Sparkle size={12} color="#B57B10" weight="fill" />
                <Text style={styles.pillText}>X9 worklab</Text>
              </View>

              <Text style={styles.welcome}>Welcome to</Text>
              <Text style={styles.welcomeAccent}>X9 worklab</Text>

              <Text style={styles.subtitle}>
                Connect Associates, Designers & Clients in one trusted workspace.
              </Text>

              <View style={styles.accentLine} />
            </View>

            <View style={styles.featuresGrid}>
              {FEATURES.map((f, i) => {
                const Ico = f.Icon;
                return (
                  <View key={i} style={styles.featureCard}>
                    <View style={[styles.featureIcon, { backgroundColor: f.bg }]}>
                      <Ico size={28} color={f.color} weight="fill" />
                    </View>
                    <Text style={styles.featureTitle}>{f.title}</Text>
                    <Text style={styles.featureSub}>{f.sub}</Text>
                  </View>
                );
              })}
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push("/role-select")}
              style={styles.shadowBtn}
            >
              <LinearGradient
                colors={["#F5C45D", "#D78B07"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btnGrad}
              >
                <Text style={styles.btnText}>Get Started</Text>
                <ArrowRight size={24} color="#fff" weight="bold" />
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footerSecure}>
              <ShieldCheck size={16} color="#B57B10" />
              <Text style={styles.footerText}>Secure • Trusted • Professional</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 22 },
  center: { alignItems: "center", justifyContent: "center" },
  pill: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderColor: "#D9A23A", borderRadius: 30, paddingHorizontal: 16, paddingVertical: 7, marginBottom: 14, backgroundColor: "rgba(255,255,255,0.4)" },
  pillText: { color: "#B57B10", fontSize: 11, letterSpacing: 2, fontWeight: "700", marginLeft: 4 },
  welcome: { fontSize: 32, color: "#111", fontWeight: "300" },
  welcomeAccent: { fontSize: 34, color: "#C58B16", fontWeight: "800", marginTop: 2 },
  subtitle: { fontSize: 14, color: "#6F6253", textAlign: "center", marginTop: 12, paddingHorizontal: 12, lineHeight: 21 },
  accentLine: { width: 60, height: 4, backgroundColor: "#D9A23A", borderRadius: 4, marginTop: 14 },
  featuresGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 22 },
  featureCard: { width: "48%", backgroundColor: "#FFFDF8", borderRadius: 20, padding: 16, marginBottom: 12, alignItems: "flex-start" },
  featureIcon: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  featureTitle: { fontSize: 15, fontWeight: "800", color: "#1B1B1B" },
  featureSub: { fontSize: 12, color: "#7A7167", marginTop: 3 },
  shadowBtn: { marginTop: 18, borderRadius: 999, overflow: "hidden" },
  btnGrad: { paddingVertical: 17, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  btnText: { color: "#fff", fontSize: 19, fontWeight: "800", marginRight: 8 },
  footerSecure: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 16, gap: 6 },
  footerText: { color: "#7A7167", fontSize: 12, marginLeft: 6 },
});