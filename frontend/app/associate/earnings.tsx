import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { TrendUp, CheckCircle, House, CurrencyInr, CalendarBlank } from "phosphor-react-native";
import { api } from "../../lib/api";
import DashboardBackground from "../../components/DashboardBackground";

export default function Earnings() {
  const [data, setData] = useState<{ total: number; count_accepted: number; items: any[] }>({ total: 0, count_accepted: 0, items: [] });
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await api("/referrals/earnings");
      setData(r);
    } catch {}
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <View style={{ flex: 1 }}>
      <DashboardBackground />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          refreshControl={<RefreshControl tintColor="#D88D07" refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}
          contentContainerStyle={{ paddingBottom: 110 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ paddingHorizontal: 22, paddingTop: 16, paddingBottom: 22 }}>
            <Text style={styles.h1}>Earnings</Text>
            <View style={styles.accent} />
            <Text style={styles.sub}>Your total earnings from approved referrals</Text>

            {/* Hero balance card */}
            <View style={styles.hero}>
              <LinearGradient colors={["#F6B341", "#D88D07"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
              <Text style={styles.heroLabel}>Total Earnings</Text>
              <Text style={styles.heroValue}>₹{(data.total || 0).toLocaleString("en-IN")}</Text>
              <View style={styles.row}>
                <View style={styles.heroBadge}>
                  <CheckCircle size={14} color="#fff" weight="fill" />
                  <Text style={styles.heroBadgeText}>{data.count_accepted} approved</Text>
                </View>
                <View style={styles.heroBadge}>
                  <CurrencyInr size={14} color="#fff" />
                  <Text style={styles.heroBadgeText}>₹50,000 each</Text>
                </View>
              </View>
            </View>

            <View style={[styles.row, { marginTop: 22 }] }>
              <TrendUp size={20} color="#D88D07" weight="fill" />
              <Text style={styles.h2}>  Approved Referrals</Text>
            </View>

            {(!data.items || data.items.length === 0) && (
              <View style={styles.emptyBox}>
                <Text style={styles.empty}>No approved referrals yet.</Text>
              </View>
            )}
            {(data.items || []).map((it, i) => (
              <View key={i} style={styles.card}>
                <View style={styles.row}>
                  <View style={styles.cardIcon}>
                    <House size={22} color="#D88D07" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={{ fontSize: 16, fontWeight: "700", color: "#1B1B1B" }}>{it.client_name}</Text>
                    <Text style={{ fontSize: 12, color: "#7A7167", marginTop: 2 }}>
                      {it.bhk} • {it.ownership || "Own"} • {it.property_name}
                    </Text>
                  </View>
                  <Text style={styles.amount}>+₹50,000</Text>
                </View>
                <View style={[styles.row, { marginTop: 10 }] }>
                  <CalendarBlank size={16} color="#9A8E80" />
                  <Text style={{ color: "#9A8E80", marginLeft: 6, fontSize: 12 }}>
                    {new Date(it.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  h1: { fontSize: 32, fontWeight: "700", color: "#1B1B1B", marginTop: 4 },
  h2: { fontSize: 18, fontWeight: "700", color: "#1B1B1B" },
  sub: { fontSize: 13, color: "#7A7167", marginTop: 8 },
  accent: { width: 56, height: 4, backgroundColor: "#D88D07", borderRadius: 4, marginTop: 10 },
  hero: { marginTop: 22, borderRadius: 26, overflow: "hidden", padding: 22 },
  heroLabel: { color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: "600" },
  heroValue: { color: "#fff", fontSize: 38, fontWeight: "800", marginTop: 6, marginBottom: 14 },
  heroBadge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(255,255,255,0.22)", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, marginRight: 8 },
  heroBadgeText: { color: "#fff", marginLeft: 6, fontWeight: "700", fontSize: 11 },
  card: { backgroundColor: "#FFFDF8", borderRadius: 22, padding: 16, marginTop: 12 },
  cardIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#FFF1DA", alignItems: "center", justifyContent: "center" },
  amount: { color: "#3F9B2E", fontWeight: "800", fontSize: 15 },
  emptyBox: { padding: 28, alignItems: "center", borderRadius: 22, backgroundColor: "rgba(255,253,248,0.7)", marginTop: 18 },
  empty: { color: "#7A7167" },
});
