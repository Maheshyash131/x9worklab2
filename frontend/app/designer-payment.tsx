import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle,
  Crown,
  UserCircle,
  Headset,
  ClipboardText,
  ArrowRight,
  Lock,
  Square,
  CheckSquare,
} from "phosphor-react-native";

import DashboardBackground from "../components/DashboardBackground";
import { api } from "../lib/api";

export default function DesignerPayment() {
  const { plan } = useLocalSearchParams<{ plan: string }>();

  const selectedPlan = (plan as string) || "premium";
  const isPremium = selectedPlan === "premium";

  const registrationFee = 4999;
  const planFee = isPremium ? 9999 : 5999;
  const total = registrationFee + planFee;

  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);

  const pay = async () => {
    if (!agree) {
      Alert.alert("Required", "Please accept terms & conditions.");
      return;
    }

    try {
      setBusy(true);

      await api("/designer/plan", {
        method: "POST",
        body: JSON.stringify({
          plan: selectedPlan,
          payment_completed: true,
        }),
      });

      router.replace("/designer-success");
    } catch (e: any) {
      Alert.alert("Failed", e?.message || "Payment failed");
    } finally {
      setBusy(false);
    }
  };

  function SummaryRow({
    icon,
    title,
    sub,
    value,
    green,
  }: any) {
    return (
      <View style={styles.summaryRow}>
        <View style={styles.summaryIcon}>{icon}</View>

        <View style={{ flex: 1 }}>
          <Text style={styles.rowTitle}>{title}</Text>
          <Text style={styles.rowSub}>{sub}</Text>
        </View>

        <Text
          style={[
            styles.rowValue,
            green && { color: "#3F9B2E" },
          ]}
        >
          {value}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: 30 }}>
      <DashboardBackground />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View style={styles.container}>
            <View style={styles.headerRow}>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => router.back()}
              >
                <ArrowLeft size={22} color="#D88D07" />
              </TouchableOpacity>

              <View style={styles.iconBtn}>
                <ShieldCheck size={20} color="#D88D07" />
              </View>
            </View>

            <Text style={styles.title}>
              <Text style={{ color: "#D88D07" }}>Designer </Text>
              Portal
            </Text>

            <Text style={styles.subtitle}>
              Finalize your onboarding setup
            </Text>

            <View style={styles.progressWrap}>
              <View style={styles.stepBlock}>
                <View style={styles.completedStep}>
                  <CheckCircle
                    size={20}
                    color="#3F9B2E"
                    weight="fill"
                  />
                </View>
                <Text style={styles.completedLabel}>Registration</Text>
              </View>

              <View style={styles.line} />

              <View style={styles.stepBlock}>
                <View style={styles.completedStep}>
                  <CheckCircle
                    size={20}
                    color="#3F9B2E"
                    weight="fill"
                  />
                </View>
                <Text style={styles.completedLabel}>Plan Selection</Text>
              </View>

              <View style={styles.line} />

              <View style={styles.stepBlock}>
                <View style={styles.activeStep}>
                  <Text style={styles.activeStepText}>3</Text>
                </View>
                <Text style={styles.activeLabel}>Payment</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>
                Payment Summary
              </Text>

              <View style={styles.goldLine} />

              <Text style={styles.summarySub}>
                Complete your registration by making a secure payment.
              </Text>

              <SummaryRow
                icon={<UserCircle size={20} color="#D88D07" />}
                title="Registration Fee"
                sub="One-time onboarding fee"
                value="₹4,999"
              />

              <SummaryRow
                icon={<Crown size={20} color="#D88D07" />}
                title="Selected Plan"
                sub="Your chosen plan"
                value={isPremium ? "Premium Plan" : "Basic Plan"}
              />
                            <SummaryRow
                icon={<ShieldCheck size={20} color="#D88D07" />}
                title="Account Setup"
                sub="Verification and account setup included"
                value="Included ✓"
                green
              />

              <SummaryRow
                icon={<Headset size={20} color="#D88D07" />}
                title="Platform Support"
                sub="Customer support and resources"
                value="Included ✓"
                green
              />

              <View style={styles.totalCard}>
                <View style={styles.totalIcon}>
                  <ClipboardText
                    size={28}
                    color="#D88D07"
                    weight="fill"
                  />
                </View>

                <View style={styles.totalDivider} />

                <View style={{ flex: 1 }}>
                  <Text style={styles.totalLabel}>
                    Total Payable
                  </Text>

                  <Text style={styles.totalAmount}>
                    ₹{total.toLocaleString("en-IN")}
                  </Text>

                  <Text style={styles.totalSub}>
                    Secure payment for onboarding and membership
                    activation.
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.agreementCard}>
              <TouchableOpacity
                onPress={() => setAgree(!agree)}
                style={styles.checkRow}
              >
                {agree ? (
                  <CheckSquare
                    size={22}
                    color="#D88D07"
                    weight="fill"
                  />
                ) : (
                  <Square size={22} color="#D88D07" />
                )}

                <Text style={styles.agreeText}>
                  I agree to the platform{" "}
                  <Text style={{ color: "#D88D07" }}>
                    terms and conditions
                  </Text>
                  .
                </Text>
              </TouchableOpacity>

              <View style={styles.secureRow}>
                <View style={styles.secureItem}>
                  <Lock size={18} color="#D88D07" />
                  <Text style={styles.secureText}>
                    Your payment information is encrypted
                    and secure.
                  </Text>
                </View>

                <View style={styles.secureDivider} />

                <View style={styles.secureItem}>
                  <ShieldCheck size={18} color="#D88D07" />
                  <Text style={styles.secureText}>
                    100% Secure Payments{"\n"}
                    PCI DSS Compliant
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              disabled={busy}
              onPress={pay}
              style={styles.shadowBtn}
            >
              <LinearGradient
                colors={["#FFB931", "#E19100"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btnGrad}
              >
                {busy ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Lock size={20} color="#fff" />
                    <Text style={styles.btnText}>
                      Complete Registration
                    </Text>
                    <ArrowRight
                      size={22}
                      color="#fff"
                      weight="bold"
                    />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footer}>
              <ShieldCheck size={14} color="#B57B10" />
              <Text style={styles.footerText}>
                Secure • Trusted • Professional
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    paddingTop: 10,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFFDF8",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#B89B63",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#1B1B1B",
    marginTop: 18,
  },

  subtitle: {
    color: "#6D655B",
    fontSize: 14,
    marginTop: 8,
  },

  progressWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 26,
    marginBottom: 24,
  },

  stepBlock: {
    alignItems: "center",
    width: 95,
  },

  completedStep: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#EAF8E1",
    alignItems: "center",
    justifyContent: "center",
  },

  activeStep: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#E19100",
    alignItems: "center",
    justifyContent: "center",
  },

  activeStepText: {
    color: "#fff",
    fontWeight: "800",
  },

  completedLabel: {
    marginTop: 8,
    fontSize: 11,
    color: "#3F9B2E",
    fontWeight: "700",
    textAlign: "center",
  },

  activeLabel: {
    marginTop: 8,
    fontSize: 11,
    color: "#E19100",
    fontWeight: "700",
    textAlign: "center",
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E6D5BA",
    marginHorizontal: 4,
  },

  card: {
    backgroundColor: "rgba(255,253,248,0.95)",
    borderRadius: 22,
    padding: 18,
    shadowColor: "#B89B63",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1B1B1B",
  },

  goldLine: {
    width: 28,
    height: 3,
    backgroundColor: "#D88D07",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },

  summarySub: {
    color: "#6D655B",
    fontSize: 13,
    marginBottom: 12,
  },

  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0E4CC",
  },

  summaryIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFF1DA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  rowTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1B1B1B",
  },

  rowSub: {
    fontSize: 12,
    color: "#6D655B",
    marginTop: 4,
  },

  rowValue: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1B1B1B",
  },

  totalCard: {
    marginTop: 18,
    backgroundColor: "#FFF7EB",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  totalIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#FFF1DA",
    alignItems: "center",
    justifyContent: "center",
  },

  totalDivider: {
    width: 1,
    height: 70,
    backgroundColor: "#E7D8BF",
    marginHorizontal: 16,
  },

  totalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4F473E",
  },

  totalAmount: {
    fontSize: 36,
    fontWeight: "800",
    color: "#E19100",
    marginTop: 4,
  },

  totalSub: {
    fontSize: 12,
    color: "#6D655B",
    lineHeight: 18,
    marginTop: 4,
  },

  agreementCard: {
    marginTop: 16,
    backgroundColor: "rgba(255,253,248,0.95)",
    borderRadius: 18,
    padding: 16,
  },

  checkRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  agreeText: {
    marginLeft: 12,
    flex: 1,
    fontSize: 13,
    color: "#4F473E",
  },

  secureRow: {
    flexDirection: "row",
    marginTop: 18,
    alignItems: "center",
  },

  secureItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  secureDivider: {
    width: 1,
    height: 50,
    backgroundColor: "#E7D8BF",
    marginHorizontal: 14,
  },

  secureText: {
    marginLeft: 10,
    fontSize: 11,
    color: "#4F473E",
    flex: 1,
    lineHeight: 16,
  },

  shadowBtn: {
    marginTop: 18,
    borderRadius: 999,
    overflow: "hidden",
    shadowColor: "#D88D07",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 5,
  },

  btnGrad: {
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  btnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 20,
  },

  footerText: {
    marginLeft: 8,
    color: "#6D655B",
    fontSize: 12,
  },
});