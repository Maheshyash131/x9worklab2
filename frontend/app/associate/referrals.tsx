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
import {
  Buildings,
  CalendarBlank,
  CheckCircle,
  ClockCountdown,
  XCircle,
  MapPin,
} from "phosphor-react-native";
import { api } from "../../lib/api";
import DashboardBackground from "../../components/DashboardBackground";

export default function Referrals() {
  const [items, setItems] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const load = useCallback(async () => {
    try {
      setItems(await api("/referrals/mine"));
    } catch {}
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const STATUS: any = {
    accepted: { c: "#3F9B2E", bg: "#EAF8E1", I: CheckCircle, t: "Approved" },
    pending: { c: "#D88D07", bg: "#FFF1DA", I: ClockCountdown, t: "Pending" },
    rejected: { c: "#F04343", bg: "#FFEAEA", I: XCircle, t: "Rejected" },
  };

  const total = items.length;
  const approved = items.filter((i) => i.status === "accepted").length;
  const pending = items.filter((i) => i.status === "pending").length;

  return (
    <View style={{ flex: 1 }}>
      <DashboardBackground />
      <SafeAreaView style={{ flex: 1 }}>
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
          <View style={{ paddingHorizontal: 22, paddingTop: 60, paddingBottom: 22 }}>
            <Text style={styles.h1}>Referral Status</Text>
            <View style={styles.accent} />
            <Text style={styles.sub}>Track every client you’ve referred</Text>

            <View style={styles.summaryRow}>
              <SummaryPill label="Total" value={total} color="#3B82F6" bg="#EAF1FF" />
              <SummaryPill label="Approved" value={approved} color="#3F9B2E" bg="#EAF8E1" />
              <SummaryPill label="Pending" value={pending} color="#D88D07" bg="#FFF1DA" />
            </View>

            {items.length === 0 && (
              <View style={styles.emptyBox}>
                <Text style={styles.empty}>You haven’t referred anyone yet.</Text>
              </View>
            )}
            {items.map((it, i) => {
              const s = STATUS[it.status] || STATUS.pending;
              const I = s.I;
              return (
                <View key={i} style={styles.card}>
                  <View style={styles.row}>
                    <View style={[styles.iconBg, { backgroundColor: s.bg }]}>
                      <I size={26} color={s.c} weight="fill" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 14 }}>
                      <Text style={{ fontSize: 17, fontWeight: "700", color: "#1B1B1B" }}>
                        {it.client_name}
                      </Text>
                      <Text style={{ color: "#7A7167", marginTop: 2 }}>{it.phone}</Text>
                    </View>
                    <View style={{ backgroundColor: s.bg, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 }}>
                      <Text style={{ color: s.c, fontWeight: "700", fontSize: 11 }}>{s.t}</Text>
                    </View>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.row}>
                    <Buildings size={18} color="#D88D07" />
                    <Text style={styles.meta}>
                      {it.bhk} • {it.ownership || "Own"} • {it.property_name}
                    </Text>
                  </View>
                  <View style={[styles.row, { marginTop: 6 }] }>
                    <MapPin size={18} color="#D88D07" />
                    <Text style={styles.meta}>{it.location}</Text>
                  </View>
                  <View style={[styles.row, { marginTop: 6 }] }>
                    <CalendarBlank size={18} color="#D88D07" />
                    <Text style={styles.meta}>{new Date(it.created_at).toLocaleDateString()}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function SummaryPill({ label, value, color, bg }: any) {
  return (
    <View style={[styles.summaryPill, { backgroundColor: bg }]}>
      <Text style={{ color, fontWeight: "800", fontSize: 20 }}>{value}</Text>
      <Text style={{ color: "#5B5249", fontWeight: "600", fontSize: 11, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  h1: { fontSize: 32, fontWeight: "700", color: "#1B1B1B", marginTop: 4 },
  sub: { fontSize: 13, color: "#7A7167", marginTop: 8 },
  accent: { width: 56, height: 4, backgroundColor: "#D88D07", borderRadius: 4, marginTop: 10 },
  summaryRow: { flexDirection: "row", marginTop: 18, gap: 10 },
  summaryPill: { flex: 1, alignItems: "center", paddingVertical: 14, borderRadius: 18 },
  card: { backgroundColor: "#FFFDF8", borderRadius: 22, padding: 16, marginTop: 12 },
  iconBg: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center" },
  divider: { height: 1, backgroundColor: "#F0E4CC", marginVertical: 12 },
  meta: { marginLeft: 10, color: "#3E3E3E", fontSize: 13 },
  emptyBox: { padding: 28, alignItems: "center", borderRadius: 22, backgroundColor: "rgba(255,253,248,0.7)", marginTop: 18 },
  empty: { color: "#7A7167" },
});
