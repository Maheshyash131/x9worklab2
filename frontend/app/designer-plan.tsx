import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  CheckCircle,
  ShieldCheck,
  Star,
  Crown,
  Check,
  ArrowRight,
} from "phosphor-react-native";

import DashboardBackground from "../components/DashboardBackground";

export default function DesignerPlanSelection() {
  const [selected, setSelected] = useState<"basic" | "premium">("premium");

  const goNext = () => {
    router.push({
      pathname: "/designer-payment",
      params: { plan: selected },
    });
  };

  function PlanCard({
    type,
    title,
    price,
    features,
    premium,
  }: any) {
    const active = selected === type;

    return (
      <View
        style={[
          styles.planCard,
          active && styles.activePlanCard,
          
        ]}
      >
        {premium && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>Most Popular</Text>
          </View>
        )}

        <View style={styles.planIcon}>
          {premium ? (
            <Crown size={24} color="#D88D07" weight="fill" />
          ) : (
            <Star size={24} color="#D88D07" />
          )}
        </View>

        <Text style={styles.planTitle}>{title}</Text>

        <Text style={styles.price}>₹{price}</Text>
        <Text style={styles.year}>/ Year</Text>

        <View style={styles.divider} />

        {features.map((f: string, i: number) => (
          <View key={i} style={styles.featureRow}>
            <Check size={14} color="#D88D07" weight="bold" />
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setSelected(type)}
          style={{ marginTop: 20 }}
        >
          {active ? (
            <LinearGradient
              colors={["#FFB931", "#E19100"]}
              style={styles.chooseBtn}
            >
              <Text style={styles.chooseBtnText}>
                {premium ? "Choose Premium" : "Choose Basic"}
              </Text>
            </LinearGradient>
          ) : (
            <View style={styles.outlineBtn}>
              <Text style={styles.outlineBtnText}>
                {premium ? "Choose Premium" : "Choose Basic"}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <DashboardBackground />

      <SafeAreaView style={{ flex: 1, paddingTop: 30 }}>
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
              Great! Your registration is complete.{"\n"}
              Now choose the plan that’s right for you.
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
                <View style={styles.activeStep}>
                  <Text style={styles.activeStepText}>2</Text>
                </View>
                <Text style={styles.activeLabel}>Plan Selection</Text>
              </View>

              <View style={styles.line} />

              <View style={styles.stepBlock}>
                <View style={styles.inactiveStep}>
                  <Text style={styles.inactiveStepText}>3</Text>
                </View>
                <Text style={styles.inactiveLabel}>Final Payment</Text>
              </View>
            </View>

            <Text style={styles.heading}>Choose Your Plan</Text>
            <View style={styles.goldLine} />

            <Text style={styles.subHeading}>
              Select the plan that best fits your business needs
            </Text>

            <View style={styles.planWrap}>
              <PlanCard
                type="basic"
                title="Basic Plan"
                price="7,999"
                features={[
                  "Verified profile listing",
                  "Client inquiry access",
                  "Project showcase",
                  "Basic lead visibility",
                ]}
              />

              <PlanCard
                type="premium"
                title="Premium Plan"
                price="11,999"
                premium
                features={[
                  "Priority profile visibility",
                  "Higher inquiry visibility",
                  "Advanced portfolio section",
                  "Early access to selected opportunities",
                ]}
              />
            </View>
                        <View style={styles.noteCard}>
              <ShieldCheck size={18} color="#D88D07" />
              <Text style={styles.noteText}>
                All plans include platform support and secure payments.
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={goNext}
              style={styles.shadowBtn}
            >
              <LinearGradient
                colors={["#FFB931", "#E19100"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btnGrad}
              >
                <Text style={styles.btnText}>
                  Continue to Payment Summary
                </Text>
                <ArrowRight size={22} color="#fff" weight="bold" />
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
    lineHeight: 22,
  },

  progressWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 26,
    marginBottom: 26,
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

  inactiveStep: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#D8B37A",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  activeStepText: {
    color: "#fff",
    fontWeight: "800",
  },

  inactiveStepText: {
    color: "#C28A2E",
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

  inactiveLabel: {
    marginTop: 8,
    fontSize: 11,
    color: "#5E564D",
    textAlign: "center",
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E6D5BA",
    marginHorizontal: 4,
  },

  heading: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1B1B1B",
    textAlign: "center",
  },

  goldLine: {
    width: 38,
    height: 3,
    backgroundColor: "#D88D07",
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 10,
  },

  subHeading: {
    marginTop: 14,
    textAlign: "center",
    color: "#6D655B",
    fontSize: 14,
  },

 planWrap: {
  marginTop: 22,
  gap: 16,
},

 planCard: {
  width: "100%",
  backgroundColor: "rgba(255,253,248,0.95)",
  borderRadius: 22,
  padding: 18,
  borderWidth: 1,
  borderColor: "#F0E4CC",
},

  activePlanCard: {
    borderColor: "#E19100",
  },

  popularBadge: {
    position: "absolute",
    top: -10,
    right: 14,
    backgroundColor: "#E19100",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    zIndex: 2,
  },

  popularText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
  },

  planIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFF1DA",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 8,
  },

  planTitle: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "800",
    color: "#1B1B1B",
    marginTop: 18,
  },

  price: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "800",
    color: "#E19100",
    marginTop: 16,
  },

  year: {
    textAlign: "center",
    color: "#6D655B",
    fontSize: 14,
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: "#F0E4CC",
    marginVertical: 18,
  },

 featureRow: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 12,
},

  featureText: {
    marginLeft: 10,
    fontSize: 13,
    color: "#4F473E",
    flex: 1,
    lineHeight: 18,
  },

  chooseBtn: {
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },

  chooseBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },

  outlineBtn: {
    paddingVertical: 14,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#E19100",
    alignItems: "center",
  },

  outlineBtnText: {
    color: "#E19100",
    fontWeight: "800",
    fontSize: 15,
  },

  noteCard: {
    marginTop: 18,
    backgroundColor: "rgba(255,253,248,0.95)",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  noteText: {
    marginLeft: 10,
    color: "#4F473E",
    fontSize: 13,
    flex: 1,
  },

  shadowBtn: {
    marginTop: 22,
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