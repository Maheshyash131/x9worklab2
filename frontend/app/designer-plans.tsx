import React, { useState } from "react";
import {
  View, Text, SafeAreaView, StatusBar, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Star, Crown, CheckCircle } from "phosphor-react-native";
import StepProgress from "../components/StepProgress";

export default function DesignerPlans() {
  const [selected, setSelected] = useState<"basic" | "premium">("premium");
  const [busy, setBusy] = useState(false);

  const proceed = async () => {
    setBusy(true);
    try {
      router.push({ pathname: "/designer-payment", params: { plan: selected } });
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.bgTopCircle} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 22, paddingTop: 8 }}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} testID="back-btn">
            <ArrowLeft size={24} color="#D88D07" />
          </TouchableOpacity>

          <Text style={styles.h1}>
            <Text style={{ color: "#D88D07" }}>Designer </Text>Portal
          </Text>
          <Text style={styles.sub}>Great! Your registration is complete.{"\n"}Now choose the plan that's right for you.</Text>

          <StepProgress step={2} labels={["Registration", "Plan Selection", "Final Payment"]} />

          <View style={{ marginTop: 30, alignItems: "center" }}>
            <Text style={styles.choose}>Choose Your Plan</Text>
            <View style={styles.accent} />
            <Text style={[styles.sub, { textAlign: "center" }]}>Select the plan that best fits your business needs</Text>
          </View>

          {/* Cards */}
          <View style={{ flexDirection: "row", marginTop: 22, gap: 12 }}>
            <PlanCard
              testID="plan-basic"
              title="Basic Plan"
              price="₹7,999"
              icon={<Star size={26} color="#D88D07" />}
              features={["Verified profile listing", "Client inquiry access", "Project showcase", "Basic lead visibility"]}
              selected={selected === "basic"}
              onPress={() => setSelected("basic")}
            />
            <PlanCard
              testID="plan-premium"
              title="Premium Plan"
              price="₹11,999"
              icon={<Crown size={26} color="#D88D07" />}
              features={["Priority profile visibility", "Higher inquiry volume", "Advanced portfolio section", "Early access to leads"]}
              selected={selected === "premium"}
              onPress={() => setSelected("premium")}
              popular
            />
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 22, backgroundColor: "#FFF6E8", padding: 12, borderRadius: 14 }}>
            <CheckCircle size={20} color="#D88D07" />
            <Text style={{ marginLeft: 10, color: "#6F6F6F", flex: 1, fontSize: 13 }}>
              All plans include platform support and wallet credit (no real payment in prototype).
            </Text>
          </View>

          <TouchableOpacity activeOpacity={0.9} disabled={busy} onPress={proceed} style={styles.shadowBtn} testID="continue-plan-btn">
            <LinearGradient colors={["#FFB931", "#E19100"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btnGrad}>
              {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Continue to Dashboard</Text>}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function PlanCard({ title, price, icon, features, selected, onPress, popular, testID }: any) {
  return (
    <TouchableOpacity testID={testID} activeOpacity={0.9} onPress={onPress} style={[styles.planCard, selected && styles.planCardActive]}>
      {popular && (
        <View style={styles.popularBadge}>
          <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>Most Popular</Text>
        </View>
      )}
      <View style={{ alignItems: "center" }}>
        <View style={styles.planIcon}>{icon}</View>
        <Text style={styles.planTitle}>{title}</Text>
        <Text style={styles.planPrice}>{price}</Text>
        <Text style={{ color: "#9A8E80", fontSize: 12, marginBottom: 10 }}>/ Year</Text>
      </View>
      {features.map((f: string, i: number) => (
        <View key={i} style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
          <CheckCircle size={14} color="#D88D07" />
          <Text style={{ marginLeft: 6, fontSize: 11, color: "#3E3E3E", flex: 1 }}>{f}</Text>
        </View>
      ))}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFF9F0" },
  bgTopCircle: {
    position: "absolute", top: -140, right: -120, width: 340, height: 340, borderRadius: 170,
    backgroundColor: "#F8E8D2",
  },
  backBtn: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: "#FFF",
    alignItems: "center", justifyContent: "center", marginBottom: 14,
    shadowColor: "#D7C8B7", shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4,
  },
  h1: { fontSize: 36, fontWeight: "700", color: "#111" },
  sub: { fontSize: 14, color: "#7A7167", marginTop: 8, lineHeight: 22 },
  choose: { fontSize: 22, fontWeight: "700", color: "#111" },
  accent: { width: 50, height: 3, backgroundColor: "#D88D07", borderRadius: 3, marginVertical: 8 },
  planCard: {
    flex: 1, backgroundColor: "#fff", borderRadius: 22, padding: 14, borderWidth: 2, borderColor: "#F2E6D8",
  },
  planCardActive: { borderColor: "#D88D07" },
  popularBadge: {
    position: "absolute", top: 8, right: 8, backgroundColor: "#D88D07", paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 10,
  },
  planIcon: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: "#FFF4E4",
    alignItems: "center", justifyContent: "center", marginTop: 8,
  },
  planTitle: { fontSize: 16, fontWeight: "700", color: "#111", marginTop: 10 },
  planPrice: { fontSize: 22, color: "#D88D07", fontWeight: "700", marginTop: 6 },
  shadowBtn: {
    marginTop: 24, borderRadius: 999, overflow: "hidden",
    shadowColor: "#D88D07", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 14, elevation: 5,
  },
  btnGrad: { paddingVertical: 18, alignItems: "center", justifyContent: "center" },
  btnText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
