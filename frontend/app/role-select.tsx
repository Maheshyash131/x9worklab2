import React from "react";
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowRight, User, Ruler, House, ArrowLeft, Sparkle, } from "phosphor-react-native";
import XNineBackground from "../components/XNineBackground";

export default function RoleSelect() {
  const roles = [
    { title: "Associate", subtitle: "Manage clients & deals", icon: User, role: "associate", tint: "#3B82F6", bg: "#EAF1FF" },
    { title: "Designer", subtitle: "Design & planning", icon: Ruler, role: "designer", tint: "#D88D07", bg: "#FFF1DA" },
    { title: "Client", subtitle: "Find & connect", icon: House, role: "client", tint: "#3F9B2E", bg: "#EAF8E1" },
  ];

  return (
    <View style={{ flex: 1 }}>
      <XNineBackground />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <StatusBar barStyle="dark-content" />
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <View style={{ paddingHorizontal: 22, paddingTop: 4 }}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} testID="back-btn">
              <ArrowLeft size={22} color="#B57B10" />
            </TouchableOpacity>

            <View style={{ alignItems: "center", marginTop: 28 }} />

            <View style={{ height:40 }} />

            <View style={{ alignItems: "center" }}>
  <View style={styles.pill}>
    <Sparkle size={12} color="#B57B10" weight="fill" />
    <Text style={styles.pillText}>X9 WORK LAB</Text>
  </View>

  <Text style={styles.welcome}>Welcome to</Text>

  <Text style={styles.welcomeAccent}>X9 Work Lab</Text>

  <Text style={styles.subtitle}>
    Connect Associates, Designers & Clients in one trusted workspace.
  </Text>

  {/* <View style={styles.accentLine} /> */}
</View >
            
          <View style={{ marginTop:50 }} >  
            {/* <Text style={styles.h1}>Login / Sign up</Text> */}
            <Text style={[styles.sub, styles.h2]}>Choose your role to continue</Text>
            {/* <View style={styles.accent} /> */}

            <View style={{ marginTop: 22 }}>
              {roles.map((r) => {
                const Icon = r.icon;
                return (
                  <TouchableOpacity
                    key={r.role}
                    testID={`role-${r.role}`}
                    activeOpacity={0.85}
                    onPress={() => router.push({ pathname: "/login", params: { role: r.role } })}
                    style={styles.card}
                  >
                    <View style={[styles.iconWrap, { backgroundColor: r.bg }]}>
                      <Icon size={30} color={r.tint} weight="fill" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 16 }}>
                      <Text style={styles.cardTitle}>{r.title}</Text>
                      <Text style={styles.cardSub}>{r.subtitle}</Text>
                    </View>
                    <View style={styles.arrowDot}>
                      <ArrowRight size={20} color="#fff" weight="bold" />
                    </View>
                  </TouchableOpacity>
                );
              })}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  backBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#FFFDF8", alignItems: "center", justifyContent: "center", shadowColor: "#B89B63", shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 3 },
  brand: { fontSize: 56, fontWeight: "300", color: "#B77B14", letterSpacing: 1 },
  labs: { color: "#B77B14", letterSpacing: 6, marginTop: 2, fontSize: 13, fontWeight: "700" },
  h1: { fontSize: 30, color: "#111", fontWeight: "800", marginTop: 4 },
  h2: { fontSize: 20, color: "#111", fontWeight: "800", marginTop: 4, textAlign: "center" },
  sub: { fontSize: 14, color: "#746B61", marginTop: 8 },
  accent: { width: 60, height: 4, backgroundColor: "#D9A23A", borderRadius: 4, marginTop: 12 },
  card: { backgroundColor: "#FFFDF8", borderRadius: 22, padding: 18, flexDirection: "row", alignItems: "center", marginBottom: 14, shadowColor: "#B69055", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 14, elevation: 4 },
  iconWrap: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center" },
  cardTitle: { fontSize: 22, color: "#111", fontWeight: "800" },
  cardSub: { fontSize: 13, color: "#746B61", marginTop: 2 },
  arrowDot: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#D88D07", alignItems: "center", justifyContent: "center" },
  pill: {
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
  borderWidth: 1,
  borderColor: "#D9A23A",
  borderRadius: 30,
  paddingHorizontal: 16,
  paddingVertical: 7,
  marginBottom: 14,
  backgroundColor: "rgba(255,255,255,0.4)",
},

pillText: {
  color: "#B57B10",
  fontSize: 11,
  letterSpacing: 2,
  fontWeight: "700",
  marginLeft: 4,
},

welcome: {
  fontSize: 32,
  color: "#111",
  fontWeight: "300",
},

welcomeAccent: {
  fontSize: 34,
  color: "#C58B16",
  fontWeight: "800",
  marginTop: 2,
},

subtitle: {
  fontSize: 14,
  color: "#6F6253",
  textAlign: "center",
  marginTop: 12,
  paddingHorizontal: 12,
  lineHeight: 21,
},

accentLine: {
  width: 60,
  height: 4,
  backgroundColor: "#D9A23A",
  borderRadius: 4,
  marginTop: 14,
},
});
