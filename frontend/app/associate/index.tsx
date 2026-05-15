import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  Image,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  Plus,
  House,
  Buildings,
  UsersThree,
  CheckCircle,
  ClockCountdown,
  CurrencyInr,
  Bell,
  Sparkle,
} from "phosphor-react-native";
import { api } from "../../lib/api";
import DashboardBackground from "../../components/DashboardBackground";
import ReferClientModal from "../../components/ReferClientModal";

export default function AssociateDashboard() {
  const [me, setMe] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modal, setModal] = useState(false);

  const load = useCallback(async () => {
    try {
      const u = await api("/auth/me");
      setMe(u);
      const refs = await api("/referrals/mine");
      setItems(refs || []);
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed");
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const total = items.length;
  const approved = items.filter((i) => i.status === "accepted").length;
  const pending = items.filter((i) => i.status === "pending").length;
  const earnings = approved * 50000;

  return (
    <View style={{ flex: 1 }}>
      <DashboardBackground />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          refreshControl={
            <RefreshControl
              tintColor="#D88D07"
              refreshing={refreshing}
              onRefresh={async () => {
                setRefreshing(true);
                await load();
                setRefreshing(false);
              }}
            />
          }
          contentContainerStyle={{ paddingBottom: 110 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ paddingHorizontal: 20, paddingTop: 4 }}>
            {/* Header */}
            <View style={styles.row}>
              <View style={styles.avatar}>
                {me?.picture ? (
                  <Image source={{ uri: me.picture }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                ) : (
                  <Text style={{ fontSize: 18, fontWeight: "700", color: "#D88D07" }}>
                    {(me?.name || "A").slice(0, 1).toUpperCase()}
                  </Text>
                )}
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.welcome}>Welcome back</Text>
                <Text style={styles.name}>{me?.name || "Associate"}</Text>
              </View>
              <TouchableOpacity style={styles.iconBtn} testID="bell-btn">
                <Bell size={22} color="#D88D07" />
              </TouchableOpacity>
            </View>

            <Text style={styles.h1}>Dashboard</Text>
            <View style={styles.accent} />
            {/* <Text style={styles.sub}>Manage referrals, earnings and client activities</Text> */}

            {/* Earnings hero */}
            <View style={styles.hero}>
              <LinearGradient
                colors={["#F6B341", "#D88D07"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.heroLabel}>Total Earnings</Text>
                <Text style={styles.heroValue}>₹{earnings.toLocaleString("en-IN")}</Text>
                <Text style={styles.heroFoot}>{approved} approved referrals • ₹50k each</Text>
              </View>
              <View style={styles.heroIcon}>
                <CurrencyInr size={32} color="#fff" weight="bold" />
              </View>
            </View>

            {/* Stats */}
            <View style={styles.statsGrid}>
              <Stat title="Referrals" value={String(total)} icon={<UsersThree size={22} color="#3B82F6" />} bg="#EAF1FF" />
              <Stat title="Approved" value={String(approved)} icon={<CheckCircle size={22} color="#3F9B2E" />} bg="#EAF8E1" />
              <Stat title="Pending" value={String(pending)} icon={<ClockCountdown size={22} color="#D88D07" />} bg="#FFF1DA" />
            </View>

            {/* CTA */}
            <TouchableOpacity activeOpacity={0.9} onPress={() => setModal(true)} testID="open-refer-modal" style={styles.shadowBtn}>
              <LinearGradient colors={["#FFB931", "#E19100"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btnGrad}>
                <Plus size={22} color="#fff" weight="bold" />
                <Text style={styles.btnText}>Refer New Client</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={[styles.row, { marginTop: 26, marginBottom: 6 }] }>
              <Sparkle size={18} color="#D88D07" weight="fill" />
              <Text style={styles.h2}>  Recent Referrals</Text>
            </View>
            {items.length === 0 && (
              <View style={styles.emptyBox}>
                <House size={32} color="#D88D07" />
                <Text style={styles.empty}>No referrals yet.{"\n"}Tap “Refer New Client” above to start.</Text>
              </View>
            )}
            {items.slice(0, 5).map((it, i) => (
              <View key={i} style={styles.card}>
                <View style={styles.row}>
                  <View style={styles.cardIcon}>
                    <House size={24} color="#D88D07" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={{ fontSize: 17, fontWeight: "700", color: "#1B1B1B" }}>{it.client_name}</Text>
                    <Text style={{ fontSize: 12, color: "#7A7167", marginTop: 2 }}>{it.phone}</Text>
                  </View>
                  <StatusBadge status={it.status} />
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                  <Buildings size={16} color="#D88D07" />
                  <Text style={styles.meta}>
                    {it.bhk} • {it.ownership || "Own"} • {it.property_name}
                  </Text>
                </View>
                <Text style={[styles.meta, { marginTop: 4, marginLeft: 24 }]}>📍 {it.location}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <ReferClientModal visible={modal} onClose={() => setModal(false)} onSubmitted={load} />
      </SafeAreaView>
    </View>
  );
}

function Stat({ title, value, icon, bg }: any) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: bg }]}>{icon}</View>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: any = {
    accepted: ["#EAF8E1", "#3F9B2E", "Approved"],
    pending: ["#FFF1DA", "#D88D07", "Pending"],
    rejected: ["#FFEAEA", "#F04343", "Rejected"],
  };
  const [bg, color, label] = map[status] || map.pending;
  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 }}>
      <Text style={{ color, fontWeight: "700", fontSize: 11 }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#FFF1DA", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  iconBtn: { width: 46, height: 46, borderRadius: 23, backgroundColor: "#FFFDF8", alignItems: "center", justifyContent: "center" },
  welcome: { fontSize: 13, color: "#7A7167" },
  name: { fontSize: 18, fontWeight: "700", color: "#1B1B1B" },
  h1: { fontSize: 36, fontWeight: "700", color: "#1B1B1B", marginTop: 20 },
  h2: { fontSize: 18, fontWeight: "700", color: "#1B1B1B" },
  sub: { fontSize: 13, color: "#7A7167", marginTop: 8, lineHeight: 20 },
  accent: { width: 56, height: 4, backgroundColor: "#D88D07", borderRadius: 4, marginTop: 10 },
  hero: { marginTop: 22, borderRadius: 24, overflow: "hidden", padding: 20, flexDirection: "row", alignItems: "center", minHeight: 110 },
  heroLabel: { color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: "600" },
  heroValue: { color: "#fff", fontSize: 30, fontWeight: "800", marginTop: 6 },
  heroFoot: { color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 4 },
  heroIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: "rgba(255,255,255,0.22)", alignItems: "center", justifyContent: "center" },
  statsGrid: { flexDirection: "row", marginTop: 14, gap: 10 },
  statCard: { flex: 1, backgroundColor: "#FFFDF8", borderRadius: 20, padding: 14, alignItems: "flex-start" },
  statIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  statTitle: { fontSize: 12, color: "#7A7167", marginTop: 10 },
  statValue: { fontSize: 22, fontWeight: "800", color: "#1B1B1B", marginTop: 2 },
  shadowBtn: { marginTop: 22, borderRadius: 999, overflow: "hidden", shadowColor: "#D88D07", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 14, elevation: 5 },
  btnGrad: { paddingVertical: 16, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10 },
  btnText: { color: "#fff", fontSize: 17, fontWeight: "700", marginLeft: 8 },
  card: { backgroundColor: "#FFFDF8", borderRadius: 22, padding: 16, marginTop: 12 },
  cardIcon: { width: 46, height: 46, borderRadius: 23, backgroundColor: "#FFF1DA", alignItems: "center", justifyContent: "center" },
  divider: { height: 1, backgroundColor: "#F0E4CC", marginVertical: 12 },
  meta: { marginLeft: 8, color: "#3E3E3E", fontSize: 13 },
  emptyBox: { marginTop: 16, padding: 24, backgroundColor: "rgba(255,253,248,0.7)", borderRadius: 22, alignItems: "center", gap: 8 },
  empty: { color: "#7A7167", textAlign: "center", fontSize: 13, lineHeight: 20 },
});
