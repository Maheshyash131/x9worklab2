import React from "react";
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  ShieldCheck,
  Hourglass,
  UserCircle,
  Monitor,
  Bell,
  IdentificationBadge,
  Crown,
  CheckCircle,
  ArrowRight,
  Headset,
  ArrowLeft,
  Lock,
} from "phosphor-react-native";
import XNineBackground from "../components/XNineBackground";

export default function DesignerSuccess() {
  const { plan } = useLocalSearchParams<{ plan: string }>();
  const planLabel = (plan as string) === "basic" ? "Basic Plan" : "Premium Plan";
  const regId = `XN-DP-${Math.floor(1000 + Math.random() * 9000)}`;

  return (
    <View style={{ flex: 1 }}>
      <XNineBackground />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <View style={{ paddingHorizontal: 22, paddingTop: 4 }}>
            <View style={styles.topRow}>
              <TouchableOpacity onPress={() => router.replace("/designer")} style={styles.backBtn}>
                <ArrowLeft size={22} color="#D88D07" />
              </TouchableOpacity>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "#FFFDF8", alignItems: "center", justifyContent: "center" }}>
                <ShieldCheck size={22} color="#D88D07" weight="fill" />
              </View>
            </View>

            {/* Trophy */}
            <View style={styles.trophyWrap}>
              <View style={styles.trophyGlow} />
              <LinearGradient colors={["#F6B341", "#B57B10"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.trophyBadge}>
                <ShieldCheck size={64} color="#fff" weight="fill" />
              </LinearGradient>
            </View>

            <View style={{ alignItems: "center" }}>
              <Text style={styles.title}>
                Registration <Text style={{ color: "#D88D07" }}>Successful</Text>
              </Text>
              <Text style={styles.subtitle}>Your onboarding request has been successfully submitted.</Text>
            </View>

            {/* Status */}
            <View style={styles.statusCard}>
              <View style={styles.hourIcon}>
                <Hourglass size={28} color="#D88D07" weight="fill" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.statusLabel}>Current Status</Text>
                <Text style={styles.statusValue}>Verification in Progress</Text>
                <Text style={styles.statusSub}>Our team is setting up your Designer Portal access.</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>What happens next?</Text>
            <View style={styles.stepsCard}>
              <Step n={1} icon={<UserCircle size={22} color="#D88D07" weight="fill" />} title="Profile Verification" sub="Your submitted details are being verified." />
              <View style={styles.stepDivider} />
              <Step n={2} icon={<Monitor size={22} color="#D88D07" weight="fill" />} title="Portal Activation" sub="Your Designer Portal access will be enabled after verification." />
              <View style={styles.stepDivider} />
              <Step n={3} icon={<Bell size={22} color="#D88D07" weight="fill" />} title="Confirmation Update" sub="You'll receive status updates through your registered contact details." />
            </View>

            <Text style={styles.sectionTitle}>Reference Details</Text>
            <View style={styles.refCard}>
              <RefItem icon={<IdentificationBadge size={20} color="#D88D07" />} label="Registration ID" value={regId} />
              <View style={styles.refSep} />
              <RefItem icon={<Crown size={20} color="#D88D07" weight="fill" />} label="Selected Plan" value={planLabel} />
              <View style={styles.refSep} />
              <RefItem icon={<CheckCircle size={20} color="#3F9B2E" weight="fill" />} label="Payment Status" value="Successful" valueColor="#3F9B2E" />
            </View>

            <TouchableOpacity testID="go-dashboard" activeOpacity={0.9} onPress={() => router.replace("/designer")} style={styles.primary}>
              <LinearGradient colors={["#FFB931", "#E19100"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.primaryGrad}>
                <Text style={styles.primaryText}>Go to Dashboard</Text>
                <ArrowRight size={20} color="#fff" weight="bold" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity testID="contact-support" activeOpacity={0.85} style={styles.support}>
              <Headset size={20} color="#D88D07" weight="fill" />
              <Text style={styles.supportText}>Contact Support</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <ShieldCheck size={14} color="#9A8E80" />
                <Text style={styles.footerText}>Secure. Encrypted. Trusted.</Text>
              </View>
              <View style={styles.footerSep} />
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Lock size={14} color="#9A8E80" />
                <Text style={styles.footerText}>Your data is safe with us.</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Step({ n, icon, title, sub }: any) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", padding: 14 }}>
      <View style={styles.stepNum}><Text style={styles.stepNumText}>{n}</Text></View>
      <View style={styles.stepIcon}>{icon}</View>
      <View style={{ flex: 1, marginLeft: 4 }}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepSub}>{sub}</Text>
      </View>
    </View>
  );
}
function RefItem({ icon, label, value, valueColor }: any) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", padding: 14 }}>
      <View style={styles.refIcon}>{icon}</View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.refLabel}>{label}</Text>
        <Text style={[styles.refValue, valueColor && { color: valueColor }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#FFFDF8", alignItems: "center", justifyContent: "center" },
  trophyWrap: { alignItems: "center", marginTop: 18, marginBottom: 18 },
  trophyGlow: { position: "absolute", width: 200, height: 200, borderRadius: 100, backgroundColor: "#FFF1DA", opacity: 0.7 },
  trophyBadge: { width: 120, height: 120, borderRadius: 32, alignItems: "center", justifyContent: "center", shadowColor: "#D88D07", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 8 },
  title: { fontSize: 28, fontWeight: "800", color: "#1B1B1B", textAlign: "center" },
  subtitle: { fontSize: 13, color: "#7A7167", textAlign: "center", marginTop: 8, paddingHorizontal: 20 },
  statusCard: { backgroundColor: "#FFF6E5", borderRadius: 18, padding: 16, marginTop: 22, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#F1DFB6" },
  hourIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: "#FFF1DA", alignItems: "center", justifyContent: "center" },
  statusLabel: { color: "#9A8E80", fontSize: 11, fontWeight: "700" },
  statusValue: { color: "#D88D07", fontSize: 17, fontWeight: "800", marginTop: 2 },
  statusSub: { color: "#5B5249", fontSize: 11, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#1B1B1B", marginTop: 22, marginBottom: 10 },
  stepsCard: { backgroundColor: "#FFFDF8", borderRadius: 18, paddingVertical: 6 },
  stepNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#FFF1DA", alignItems: "center", justifyContent: "center", marginRight: 12 },
  stepNumText: { color: "#D88D07", fontWeight: "800", fontSize: 13 },
  stepIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#FFF1DA", alignItems: "center", justifyContent: "center", marginRight: 10 },
  stepTitle: { fontSize: 13, fontWeight: "800", color: "#1B1B1B" },
  stepSub: { color: "#7A7167", fontSize: 11, marginTop: 2 },
  stepDivider: { height: 1, backgroundColor: "#F0E4CC", marginLeft: 54 },
  refCard: { backgroundColor: "#FFFDF8", borderRadius: 18 },
  refIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#FFF1DA", alignItems: "center", justifyContent: "center" },
  refLabel: { color: "#9A8E80", fontSize: 11, fontWeight: "700" },
  refValue: { color: "#1B1B1B", fontSize: 14, fontWeight: "800", marginTop: 2 },
  refSep: { height: 1, backgroundColor: "#F0E4CC", marginLeft: 54 },
  primary: { marginTop: 22, borderRadius: 999, overflow: "hidden", shadowColor: "#D88D07", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 14, elevation: 5 },
  primaryGrad: { paddingVertical: 17, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  primaryText: { color: "#fff", fontSize: 17, fontWeight: "800", marginRight: 8 },
  support: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14, borderRadius: 999, borderWidth: 1.5, borderColor: "#D88D07", marginTop: 12, backgroundColor: "#FFFDF8" },
  supportText: { color: "#D88D07", fontWeight: "800", fontSize: 15, marginLeft: 6 },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 18, gap: 10 },
  footerSep: { width: 1, height: 14, backgroundColor: "#D9CFBE" },
  footerText: { color: "#9A8E80", fontSize: 11, marginLeft: 6 },
});
