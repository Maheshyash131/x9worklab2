import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, StyleSheet, RefreshControl, TouchableOpacity, Alert, Image } from "react-native";
import { useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { House, Buildings, MapPin, CheckCircle, XCircle, ClockCountdown, Person } from "phosphor-react-native";
import { api } from "../../lib/api";
import DashboardBackground from "../../components/DashboardBackground";

const PLACEHOLDER = "https://images.unsplash.com/photo-1556909114-44e3e9399a2b?auto=format&fit=crop&w=300&q=70";

export default function Opportunities() {
  const [feed, setFeed] = useState<{ referrals: any[]; consultations: any[] }>({ referrals: [], consultations: [] });
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"all" | "associate" | "client">("all");

  const load = useCallback(async () => {
    try { setFeed(await api("/designer/feed")); } catch {}
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const act = async (id: string, action: "accept" | "reject") => {
    try { await api("/designer/referral-action", { method: "POST", body: JSON.stringify({ referral_id: id, action }) }); await load(); }
    catch (e: any) { Alert.alert("Error", e?.message || "Failed"); }
  };

  const all = [
    ...(feed.referrals || []).map((r) => ({ ...r, _name: r.client_name, _src: "associate" })),
    ...(feed.consultations || []).map((c) => ({ ...c, _name: c.name, _src: "client" })),
  ].filter((i) => i.status === "pending")
    .filter((i) => filter === "all" || i._src === filter)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <View style={{ flex: 1 }}>
      <DashboardBackground />
      <SafeAreaView style={{ flex: 1, paddingTop:20 }} edges={["top"]}>
        <ScrollView refreshControl={<RefreshControl tintColor="#D88D07" refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />} contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
          <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 }}>
            <Text style={styles.h1}>Opportunities</Text>
            <View style={styles.accent} />
            <Text style={styles.sub}>Fresh client leads from associates and direct inquiries</Text>

            <View style={styles.filterRow}>
              {(["all", "associate", "client"] as const).map((f) => (
                <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[styles.filterChip, filter === f && styles.filterActive]} testID={`filter-${f}`}>
                  <Text style={[styles.filterText, filter === f && { color: "#fff" }]}>{f === "all" ? "All" : f === "associate" ? "From Associates" : "Direct"}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {all.length === 0 && (
              <View style={styles.empty}><Text style={{ color: "#7A7167" }}>No pending leads right now.</Text></View>
            )}
            {all.map((it, i) => (
              <View key={i} style={styles.card}>
                <Image source={{ uri: PLACEHOLDER }} style={styles.cardImg} />
                <View style={styles.cardBody}>
                  <View style={styles.row}>
                    <Text style={styles.clientName}>{it._name}</Text>
                    <View style={styles.src}><Text style={styles.srcText}>{it._src === "associate" ? "via Associate" : "Direct"}</Text></View>
                  </View>
                  <View style={[styles.row, { marginTop: 6 }] }>
                    <Buildings size={14} color="#D88D07" />
                    <Text style={styles.meta}>{it.bhk} • {it.property_name || "Consultation"}</Text>
                  </View>
                  <View style={[styles.row, { marginTop: 4 }] }>
                    <MapPin size={14} color="#D88D07" />
                    <Text style={styles.meta}>{it.location}</Text>
                  </View>
                  {it.budget && <View style={[styles.row, { marginTop: 4 }] }><Person size={14} color="#D88D07" /><Text style={styles.meta}>Budget: {it.budget}</Text></View>}
                  {it.notes && <Text style={styles.notes} numberOfLines={2}>“{it.notes}”</Text>}
                  <View style={[styles.row, { marginTop: 12, gap: 10 }] }>
                    <TouchableOpacity testID={`rej-${it.referral_id}`} onPress={() => act(it.referral_id, "reject")} style={[styles.actBtn, { backgroundColor: "#FFEAEA" }]}>
                      <XCircle size={18} color="#F04343" /><Text style={{ color: "#F04343", marginLeft: 6, fontWeight: "700" }}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity testID={`acc-${it.referral_id}`} onPress={() => act(it.referral_id, "accept")} style={{ flex: 1, borderRadius: 999, overflow: "hidden" }}>
                      <LinearGradient colors={["#FFB931", "#E19100"]} style={[styles.actBtn, { backgroundColor: "transparent" }]}>
                        <CheckCircle size={18} color="#fff" /><Text style={{ color: "#fff", marginLeft: 6, fontWeight: "700" }}>Accept</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
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
  filterRow: { flexDirection: "row", gap: 8, marginTop: 16, marginBottom: 4 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: "#FFFDF8", borderWidth: 1, borderColor: "#F1DFB6" },
  filterActive: { backgroundColor: "#D88D07", borderColor: "#D88D07" },
  filterText: { color: "#5B5249", fontWeight: "700", fontSize: 12 },
  card: { backgroundColor: "#FFFDF8", borderRadius: 22, marginTop: 14, overflow: "hidden" },
  cardImg: { width: "100%", height: 130 },
  cardBody: { padding: 16 },
  clientName: { flex: 1, fontSize: 18, fontWeight: "800", color: "#1B1B1B" },
  src: { backgroundColor: "#FFF1DA", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  srcText: { color: "#D88D07", fontWeight: "700", fontSize: 10 },
  meta: { marginLeft: 8, color: "#3E3E3E", fontSize: 13 },
  notes: { color: "#666", marginTop: 8, fontStyle: "italic", fontSize: 13 },
  actBtn: { flex: 1, paddingVertical: 11, borderRadius: 999, flexDirection: "row", alignItems: "center", justifyContent: "center" },
  empty: { padding: 28, marginTop: 16, alignItems: "center", borderRadius: 22, backgroundColor: "rgba(255,253,248,0.7)" },
});
