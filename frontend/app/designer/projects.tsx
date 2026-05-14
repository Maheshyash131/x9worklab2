import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, StyleSheet, RefreshControl, Image } from "react-native";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Briefcase, CalendarBlank, Buildings, MapPin } from "phosphor-react-native";
import { api } from "../../lib/api";
import DashboardBackground from "../../components/DashboardBackground";

const IMGS = [
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1556909114-44e3e9399a2b?auto=format&fit=crop&w=400&q=70",
];

export default function Projects() {
  const [feed, setFeed] = useState<{ referrals: any[]; consultations: any[] }>({ referrals: [], consultations: [] });
  const [refreshing, setRefreshing] = useState(false);
  const load = useCallback(async () => { try { setFeed(await api("/designer/feed")); } catch {} }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const accepted = [
    ...(feed.referrals || []).map((r) => ({ ...r, _name: r.client_name })),
    ...(feed.consultations || []).map((c) => ({ ...c, _name: c.name })),
  ].filter((i) => i.status === "accepted").sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <View style={{ flex: 1 }}>
      <DashboardBackground />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView refreshControl={<RefreshControl tintColor="#D88D07" refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />} contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
          <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 }}>
            <Text style={styles.h1}>Projects</Text>
            <View style={styles.accent} />
            <Text style={styles.sub}>Your active and completed projects</Text>

            {accepted.length === 0 && (
              <View style={styles.empty}>
                <Briefcase size={36} color="#D88D07" />
                <Text style={{ color: "#7A7167", marginTop: 10, textAlign: "center" }}>No projects yet.{"\n"}Accept a lead to start.</Text>
              </View>
            )}
            {accepted.map((it, i) => (
              <View key={i} style={styles.card}>
                <Image source={{ uri: IMGS[i % IMGS.length] }} style={styles.img} />
                <View style={styles.body}>
                  <Text style={styles.title}>{it.bhk} — {it._name}</Text>
                  <View style={styles.row}><Buildings size={14} color="#D88D07" /><Text style={styles.meta}>{it.property_name || "Consultation"}</Text></View>
                  <View style={[styles.row, { marginTop: 4 }] }><MapPin size={14} color="#D88D07" /><Text style={styles.meta}>{it.location}</Text></View>
                  <View style={[styles.row, { marginTop: 6 }] }><CalendarBlank size={14} color="#9A8E80" /><Text style={[styles.meta, { color: "#9A8E80" }] }>{new Date(it.created_at).toLocaleDateString()}</Text></View>
                  <View style={styles.bar}><View style={[styles.fill, { width: "55%" }]} /></View>
                  <Text style={styles.pct}>55% complete</Text>
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
  h1: { fontSize: 30, fontWeight: "800", color: "#1B1B1B" },
  sub: { fontSize: 13, color: "#7A7167", marginTop: 8 },
  accent: { width: 56, height: 4, backgroundColor: "#D88D07", borderRadius: 4, marginTop: 8 },
  card: { backgroundColor: "#FFFDF8", borderRadius: 22, marginTop: 14, overflow: "hidden", flexDirection: "row" },
  img: { width: 100, height: 130 },
  body: { flex: 1, padding: 12 },
  title: { fontSize: 15, fontWeight: "800", color: "#1B1B1B", marginBottom: 6 },
  meta: { marginLeft: 6, color: "#3E3E3E", fontSize: 12 },
  bar: { height: 4, backgroundColor: "#F0E4CC", borderRadius: 2, marginTop: 8, overflow: "hidden" },
  fill: { height: "100%", backgroundColor: "#D88D07" },
  pct: { color: "#9A8E80", fontSize: 10, marginTop: 4 },
  empty: { padding: 36, marginTop: 16, alignItems: "center", borderRadius: 22, backgroundColor: "rgba(255,253,248,0.7)" },
});
