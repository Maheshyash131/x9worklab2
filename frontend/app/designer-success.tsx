import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  ShieldCheck,
  HourglassMedium,
  IdentificationCard,
  Crown,
  CheckCircle,
  UserCircle,
  Monitor,
  Bell,
  SquaresFour,
  Headset,
  ArrowRight,
} from "phosphor-react-native";

import DashboardBackground from "../components/DashboardBackground";
import { api } from "../lib/api";

export default function DesignerSuccess() {
  const [busy, setBusy] = useState(true);
  const [me, setMe] = useState<any>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await api("/auth/me");
      setMe(data);
    } finally {
      setBusy(false);
    }
  };

  const registrationId = me?.user_id
    ? `XN-DP-${String(me.user_id).slice(-4).toUpperCase()}`
    : "XN-DP-2048";

  const selectedPlan =
    me?.plan === "basic" ? "Basic Plan" : "Premium Plan";

  const paymentStatus = me?.payment_completed
    ? "Successful"
    : "Pending";

  if (busy) {
    return (
      <View style={{ flex: 1 }}>
        <DashboardBackground />
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#D88D07" />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
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

            <View style={styles.heroShield}>
              <ShieldCheck
                size={78}
                color="#D88D07"
                weight="fill"
              />
            </View>

            <Text style={styles.successTitle}>
              Registration{" "}
              <Text style={{ color: "#D88D07" }}>Successful</Text>
            </Text>

            <Text style={styles.subtitle}>
              Your onboarding request has been successfully submitted.
            </Text>

            <View style={styles.statusCard}>
              <View style={styles.statusIcon}>
                <HourglassMedium
                  size={28}
                  color="#D88D07"
                  weight="fill"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.smallLabel}>
                  Current Status
                </Text>

                <Text style={styles.statusTitle}>
                  Verification in Progress
                </Text>

                <Text style={styles.statusSub}>
                  Our team is setting up your Designer Portal access.
                </Text>
              </View>

              <View style={styles.statusRight}>
                <IdentificationCard
                  size={38}
                  color="#D88D07"
                />
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                What happens next?
              </Text>

              <View style={styles.stepRow}>
                <View style={styles.stepNum}>
                  <Text style={styles.stepNumText}>1</Text>
                </View>

                <View style={styles.stepIcon}>
                  <UserCircle size={20} color="#D88D07" />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.stepTitle}>
                    Profile Verification
                  </Text>
                  <Text style={styles.stepSub}>
                    Your submitted details are being verified.
                  </Text>
                </View>
              </View>

              <View style={styles.stepDivider} />

              <View style={styles.stepRow}>
                <View style={styles.stepNum}>
                  <Text style={styles.stepNumText}>2</Text>
                </View>

                <View style={styles.stepIcon}>
                  <Monitor size={20} color="#D88D07" />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.stepTitle}>
                    Portal Activation
                  </Text>
                  <Text style={styles.stepSub}>
                    Your Designer Portal access will be enabled after
                    verification.
                  </Text>
                </View>
              </View>

              <View style={styles.stepDivider} />

              <View style={styles.stepRow}>
                <View style={styles.stepNum}>
                  <Text style={styles.stepNumText}>3</Text>
                </View>

                <View style={styles.stepIcon}>
                  <Bell size={20} color="#D88D07" />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.stepTitle}>
                    Confirmation Update
                  </Text>
                  <Text style={styles.stepSub}>
                    You'll receive updates through your registered
                    contact details.
                  </Text>
                </View>
              </View>
            </View>
                        <View style={styles.refCard}>
              <Text style={styles.cardTitle}>Reference Details</Text>

              <View style={styles.refRow}>
                <View style={styles.refItem}>
                  <View style={styles.refIcon}>
                    <IdentificationCard
                      size={18}
                      color="#D88D07"
                    />
                  </View>

                  <View>
                    <Text style={styles.refLabel}>
                      Registration ID
                    </Text>
                    <Text style={styles.refValue}>
                      {registrationId}
                    </Text>
                  </View>
                </View>

                <View style={styles.refDivider} />

                <View style={styles.refItem}>
                  <View style={styles.refIcon}>
                    <Crown size={18} color="#D88D07" />
                  </View>

                  <View>
                    <Text style={styles.refLabel}>
                      Selected Plan
                    </Text>
                    <Text style={styles.refValue}>
                      {selectedPlan}
                    </Text>
                  </View>
                </View>

                <View style={styles.refDivider} />

                <View style={styles.refItem}>
                  <View
                    style={[
                      styles.refIcon,
                      { backgroundColor: "#EAF8E1" },
                    ]}
                  >
                    <CheckCircle
                      size={18}
                      color="#3F9B2E"
                      weight="fill"
                    />
                  </View>

                  <View>
                    <Text style={styles.refLabel}>
                      Payment Status
                    </Text>
                    <Text
                      style={[
                        styles.refValue,
                        { color: "#3F9B2E" },
                      ]}
                    >
                      {paymentStatus}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.replace("/designer")}
              style={styles.shadowBtn}
            >
              <LinearGradient
                colors={["#FFB931", "#E19100"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btnGrad}
              >
                <SquaresFour size={20} color="#fff" />
                <Text style={styles.btnText}>
                  Go to Dashboard
                </Text>
                <ArrowRight
                  size={22}
                  color="#fff"
                  weight="bold"
                />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.supportBtn}
              activeOpacity={0.9}
            >
              <Headset size={20} color="#D88D07" />
              <Text style={styles.supportText}>
                Contact Support
              </Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <ShieldCheck size={14} color="#B57B10" />
              <Text style={styles.footerText}>
                Secure. Encrypted. Trusted.
              </Text>

              <ShieldCheck
                size={14}
                color="#B57B10"
                style={{ marginLeft: 18 }}
              />

              <Text style={styles.footerText}>
                Your data is safe with us.
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

  heroShield: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: "center",
    marginTop: 20,
    backgroundColor: "rgba(255,241,218,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },

  successTitle: {
    fontSize: 34,
    fontWeight: "800",
    textAlign: "center",
    color: "#1B1B1B",
    marginTop: 22,
  },

  subtitle: {
    fontSize: 14,
    color: "#6D655B",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
  },

  statusCard: {
    marginTop: 22,
    backgroundColor: "rgba(255,253,248,0.95)",
    borderRadius: 22,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#B89B63",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  statusIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFF1DA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  statusRight: {
    width: 60,
    alignItems: "center",
  },

  smallLabel: {
    fontSize: 12,
    color: "#7B7267",
  },

  statusTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#D88D07",
    marginTop: 4,
  },

  statusSub: {
    fontSize: 12,
    color: "#6D655B",
    lineHeight: 18,
    marginTop: 6,
  },

  card: {
    marginTop: 18,
    backgroundColor: "rgba(255,253,248,0.95)",
    borderRadius: 22,
    padding: 18,
    shadowColor: "#B89B63",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1B1B1B",
    marginBottom: 14,
  },

  stepRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  stepNum: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFF1DA",
    alignItems: "center",
    justifyContent: "center",
  },

  stepNumText: {
    color: "#D88D07",
    fontWeight: "800",
  },

  stepIcon: {
    width: 42,
    alignItems: "center",
  },

  stepTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1B1B1B",
  },

  stepSub: {
    fontSize: 12,
    color: "#6D655B",
    lineHeight: 18,
    marginTop: 4,
  },

  stepDivider: {
    height: 1,
    backgroundColor: "#F0E4CC",
    marginVertical: 16,
  },

  refCard: {
    marginTop: 18,
    backgroundColor: "rgba(255,253,248,0.95)",
    borderRadius: 22,
    padding: 18,
    shadowColor: "#B89B63",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  refRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  refItem: {
    flex: 1,
    alignItems: "center",
  },

  refIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFF1DA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  refDivider: {
    width: 1,
    height: 80,
    backgroundColor: "#E7D8BF",
    marginHorizontal: 8,
  },

  refLabel: {
    fontSize: 11,
    color: "#7B7267",
    textAlign: "center",
  },

  refValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1B1B1B",
    textAlign: "center",
    marginTop: 4,
  },

  shadowBtn: {
    marginTop: 20,
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

  supportBtn: {
    marginTop: 14,
    borderWidth: 1.5,
    borderColor: "#D88D07",
    borderRadius: 999,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,253,248,0.9)",
  },

  supportText: {
    marginLeft: 10,
    color: "#1B1B1B",
    fontWeight: "700",
    fontSize: 16,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 18,
    marginBottom: 20,
  },

  footerText: {
    marginLeft: 6,
    color: "#6D655B",
    fontSize: 11,
  },
});