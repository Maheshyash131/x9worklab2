import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  CheckCircle,
  ShieldCheck,
  CreditCard,
  Crown,
  Star,
  ArrowRight,
} from "phosphor-react-native";
import { api } from "../lib/api";
import XNineBackground from "../components/XNineBackground";
import StepProgress from "../components/StepProgress";

export default function DesignerPayment() {
  const { plan } = useLocalSearchParams<{ plan: string }>();
  const selected = (plan as string) || "premium";
  const isPremium = selected === "premium";
  const price = isPremium ? 11999 : 7999;
  const tax = Math.round(price * 0.18);
  const total = price + tax;
  const [busy, setBusy] = useState(false);

  const pay = async () => {
    setBusy(true);
    try {
      await api("/designer/plan", { method: "POST", body: JSON.stringify({ plan: selected }) });
      router.replace({ pathname: "/designer-success", params: { plan: selected } });
    } catch (e: any) {
      Alert.alert("Failed", e?.message || "Could not complete payment");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <XNineBackground />
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <View style={{ paddingHorizontal: 22, paddingTop: 8 }}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} testID="back-btn">
              <ArrowLeft size={24} color="#D88D07" />
            </TouchableOpacity>

            <Text style={styles.h1}>
              <Text style={{ color: "#D88D07" }}>Designer </Text>Portal
            </Text>
            <Text style={styles.sub}>Final payment to activate your plan</Text>

            <StepProgress step={3} labels={["Registration", "Plan Selection", "Final Payment"]} />

            {/* Selected Plan Card */}
            <View style={styles.planCard}>
              <View style={styles.planHeader}>
                <View style={styles.planIcon}>
                  {isPremium ? <Crown size={26} color="#D88D07" weight="fill" /> : <Star size={26} color="#D88D07" weight="fill" />}
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.planTitle}>{isPremium ? "Premium Plan" : "Basic Plan"}</Text>
                  <Text style={styles.planSub}>Annual subscription • 1 year</Text>
                </View>
                {isPremium && (
                  <View style={styles.popular}>
                    <Text style={{ color: "#fff", fontSize: 10, fontWeight: "800" }}>POPULAR</Text>
                  </View>
                )}
              </View>
              <View style={styles.divider} />
              <Row label="Plan price" value={`₹${price.toLocaleString("en-IN")}`} />
              <Row label="GST (18%)" value={`₹${tax.toLocaleString("en-IN")}`} />
              <View style={styles.divider} />
              <Row label="Total payable" value={`₹${total.toLocaleString("en-IN")}`} bold />
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 14, backgroundColor: "#FFF1DA", padding: 12, borderRadius: 14 }}>
                <CheckCircle size={18} color="#3F9B2E" weight="fill" />
                <Text style={{ marginLeft: 8, color: "#5B5249", fontSize: 12, flex: 1 }}>
                  Wallet bonus credited on activation ({isPremium ? "₹12,000" : "₹5,000"}).
                </Text>
              </View>
            </View>

            {/* Mock payment method */}
            <View style={styles.payMethod}>
              <CreditCard size={22} color="#D88D07" weight="fill" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ fontWeight: "700", color: "#1B1B1B" }}>Demo Payment</Text>
                <Text style={{ color: "#7A7167", fontSize: 12 }}>No real charge • prototype only</Text>
              </View>
              <CheckCircle size={22} color="#3F9B2E" weight="fill" />
            </View>

            <TouchableOpacity testID="pay-now" activeOpacity={0.9} disabled={busy} onPress={pay} style={styles.shadowBtn}>
              <LinearGradient colors={["#FFB931", "#E19100"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btnGrad}>
                {busy ? <ActivityIndicator color="#fff" /> : (<><Text style={styles.btnText}>Pay ₹{total.toLocaleString("en-IN")}</Text><ArrowRight size={22} color="#fff" weight="bold" /></>)}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footer}>
              <ShieldCheck size={16} color="#B57B10" />
              <Text style={styles.footerText}>Secure  •  Trusted  •  Professional</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Row({ label, value, bold }: any) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 }}>
      <Text style={{ color: "#7A7167", fontSize: 14, fontWeight: bold ? "700" : "400" }}>{label}</Text>
      <Text style={{ color: "#1B1B1B", fontSize: bold ? 18 : 14, fontWeight: bold ? "800" : "600" }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#FFFDF8", alignItems: "center", justifyContent: "center", marginBottom: 14 },
  h1: { fontSize: 30, fontWeight: "700", color: "#1B1B1B" },
  sub: { fontSize: 14, color: "#7A7167", marginTop: 8, lineHeight: 22 },
  planCard: { backgroundColor: "#FFFDF8", borderRadius: 22, padding: 18, marginTop: 18 },
  planHeader: { flexDirection: "row", alignItems: "center" },
  planIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#FFF1DA", alignItems: "center", justifyContent: "center" },
  planTitle: { fontSize: 18, fontWeight: "800", color: "#1B1B1B" },
  planSub: { color: "#7A7167", fontSize: 12, marginTop: 2 },
  popular: { backgroundColor: "#D88D07", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  divider: { height: 1, backgroundColor: "#F0E4CC", marginVertical: 10 },
  payMethod: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFFDF8", padding: 14, borderRadius: 18, marginTop: 14 },
  shadowBtn: { marginTop: 22, borderRadius: 999, overflow: "hidden", shadowColor: "#D88D07", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 14, elevation: 5 },
  btnGrad: { paddingVertical: 18, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10 },
  btnText: { color: "#fff", fontSize: 18, fontWeight: "800", marginRight: 8 },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 18, gap: 6 },
  footerText: { color: "#7A7167", fontSize: 12, marginLeft: 6 },
});
