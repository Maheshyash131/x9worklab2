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
  ImageBackground,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  Bell,
  CaretRight,
  Sparkle,
  UsersThree,
  Briefcase,
  UserCircle,
  FolderOpen,
  ArrowRight,
  MapPin,
  CurrencyInr,
} from "phosphor-react-native";
import { api } from "../../lib/api";
import DashboardBackground from "../../components/DashboardBackground";

const FEATURED_IMG = "https://images.unsplash.com/photo-1556117153-659e8ce704c1?auto=format&fit=crop&w=900&q=70";
const PROJECT_IMGS = [
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=70",
];

export default function DesignerDashboard() {
  const [me, setMe] = useState<any>(null);
  const [feed, setFeed] = useState<{ referrals: any[]; consultations: any[] }>({ referrals: [], consultations: [] });
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setMe(await api("/auth/me"));
      setFeed(await api("/designer/feed"));
    } catch (e: any) { Alert.alert("Error", e?.message || "Failed"); }
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const all = [
    ...(feed.referrals || []).map((r) => ({ ...r, _name: r.client_name, _src: "associate" })),
    ...(feed.consultations || []).map((c) => ({ ...c, _name: c.name, _src: "client" })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const opportunities = all.filter((i) => i.status === "pending").length;
  const activeProjects = all.filter((i) => i.status === "accepted").length;
  const featured = all.find((i) => i.status === "pending") || all[0];
  const greet = (() => { const h = new Date().getHours(); return h < 12 ? "Good Morning," : h < 18 ? "Good Afternoon," : "Good Evening,"; })();

  return (
    <View style={{ flex: 1 }}>
      <DashboardBackground />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          refreshControl={<RefreshControl tintColor="#D88D07" refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}
          contentContainerStyle={{ paddingBottom: 110 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 }}>
            {/* Header */}
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.greet}>{greet}</Text>
                <View style={[styles.row, { marginTop: 4 }] }>
                  <Text style={styles.name} numberOfLines={1}>{me?.name || "Designer"}</Text>
                  <Sparkle size={18} color="#D88D07" weight="fill" style={{ marginLeft: 6 }} />
                </View>
                <Text style={styles.greetSub}>Here's what's happening today</Text>
              </View>
              <TouchableOpacity style={styles.bell} testID="bell-btn">
                <Bell size={22} color="#D88D07" weight="fill" />
                {opportunities > 0 && <View style={styles.bellDot} />}
              </TouchableOpacity>
            </View>

            {/* 2x2 cards */}
            <View style={styles.grid}>
              <BigCard title="Opportunities" value={String(opportunities)} sub="New leads available" icon={<UsersThree size={26} color="#D88D07" weight="fill" />} onPress={() => router.push("/designer/opportunities")} />
              <BigCard title="Active Projects" value={String(activeProjects)} sub="In progress" icon={<Briefcase size={26} color="#D88D07" weight="fill" />} onPress={() => router.push("/designer/projects")} />
              <BigCard title="Profile" value="View" valueAccent sub="Edit your profile" icon={<UserCircle size={26} color="#D88D07" weight="fill" />} onPress={() => router.push("/designer/profile")} />
              <BigCard title="Workspace" value="Open" valueAccent sub="Track & update projects" icon={<FolderOpen size={26} color="#D88D07" weight="fill" />} onPress={() => router.push("/designer/projects")} />
            </View>

            {/* Featured Project */}
            {featured && (
              <View style={styles.featured}>
                <ImageBackground source={{ uri: FEATURED_IMG }} style={styles.featuredImg} imageStyle={{ borderRadius: 22 }}>
                  <LinearGradient colors={["rgba(255,253,248,0.95)", "rgba(255,253,248,0.4)", "transparent"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
                  <View style={styles.featuredContent}>
                    <View style={styles.featuredBadge}>
                      <Sparkle size={11} color="#D88D07" weight="fill" />
                      <Text style={styles.featuredBadgeText}>FEATURED PROJECT</Text>
                    </View>
                    <Text style={styles.featuredName}>Client: {featured._name}</Text>
                    <Text style={styles.featuredKind}>{featured.bhk} Interior Design</Text>
                    <View style={styles.row}>
                      <MapPin size={14} color="#7A7167" />
                      <Text style={styles.featuredMeta}>{featured.location}</Text>
                    </View>
                    {featured.budget && (
                      <View style={[styles.row, { marginTop: 4 }] }>
                        <CurrencyInr size={14} color="#7A7167" />
                        <Text style={styles.featuredMeta}>{featured.budget}</Text>
                      </View>
                    )}
                    <View style={styles.newPill}>
                      <Text style={{ color: "#D88D07", fontSize: 10, fontWeight: "800", letterSpacing: 1 }}>NEW LEAD</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.featuredArrow} onPress={() => router.push("/designer/opportunities")}>
                    <CaretRight size={18} color="#D88D07" weight="bold" />
                  </TouchableOpacity>
                </ImageBackground>
                <TouchableOpacity testID="view-lead" onPress={() => router.push("/designer/opportunities")} style={styles.viewLeadBtn}>
                  <LinearGradient colors={["#FFB931", "#E19100"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.viewLeadGrad}>
                    <Text style={styles.viewLeadText}>View Lead</Text>
                    <ArrowRight size={18} color="#fff" weight="bold" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}

            {/* Active Projects */}
            <View style={[styles.row, { justifyContent: "space-between", marginTop: 22, marginBottom: 8 }] }>
              <Text style={styles.sectionTitle}>Active Projects</Text>
              <TouchableOpacity onPress={() => router.push("/designer/opportunities")} style={styles.row}>
                <Text style={{ color: "#D88D07", fontWeight: "700", fontSize: 13 }}>View all</Text>
                <ArrowRight size={14} color="#D88D07" weight="bold" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 14 }}>
              {(all.filter((i) => i.status === "accepted").slice(0, 5)).map((it, i) => (
                <View key={i} style={styles.projCard}>
                  <Image source={{ uri: PROJECT_IMGS[i % PROJECT_IMGS.length] }} style={styles.projImg} />
                  <View style={{ padding: 10 }}>
                    <Text style={styles.projTitle} numberOfLines={1}>{it.bhk} — {it._name}</Text>
                    <View style={styles.projBadge}><Text style={styles.projBadgeText}>In Progress</Text></View>
                    <Text style={{ color: "#9A8E80", fontSize: 11, marginTop: 4 }}>{new Date(it.created_at).toLocaleDateString()}</Text>
                    <View style={styles.projBar}><View style={[styles.projBarFill, { width: "60%" }]} /></View>
                  </View>
                </View>
              ))}
              {activeProjects === 0 && (
                <View style={styles.emptyProj}>
                  <Text style={{ color: "#7A7167", fontSize: 13 }}>Accept a lead to start your first project.</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function BigCard({ title, value, valueAccent, sub, icon, onPress }: any) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.bigCard}>
      <View style={styles.row}>
        <View style={styles.bigIcon}>{icon}</View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <View style={[styles.row, { justifyContent: "space-between" }] }>
            <Text style={styles.bigTitle} numberOfLines={1}>{title}</Text>
            <CaretRight size={14} color="#9A8E80" />
          </View>
          <Text style={[styles.bigValue, valueAccent && { color: "#D88D07" }] }>{value}</Text>
        </View>
      </View>
      <Text style={styles.bigSub}>{sub}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  greet: { color: "#7A7167", fontSize: 13 },
  name: { fontSize: 28, fontWeight: "800", color: "#1B1B1B" },
  greetSub: { color: "#7A7167", fontSize: 13, marginTop: 4 },
  bell: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#FFFDF8", alignItems: "center", justifyContent: "center", position: "relative", shadowColor: "#B89B63", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  bellDot: { position: "absolute", top: 12, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: "#F04343" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 22 },
  bigCard: { width: "48%", backgroundColor: "#FFFDF8", borderRadius: 18, padding: 14, marginBottom: 12, shadowColor: "#B89B63", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  bigIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#FFF1DA", alignItems: "center", justifyContent: "center" },
  bigTitle: { fontSize: 13, color: "#5B5249", fontWeight: "600" },
  bigValue: { fontSize: 22, color: "#1B1B1B", fontWeight: "800", marginTop: 2 },
  bigSub: { color: "#9A8E80", fontSize: 11, marginTop: 8 },
  featured: { backgroundColor: "#FFFDF8", borderRadius: 22, marginTop: 6, overflow: "hidden", shadowColor: "#B89B63", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 4 },
  featuredImg: { height: 200, width: "100%", justifyContent: "flex-end" },
  featuredContent: { padding: 16, maxWidth: "60%" },
  featuredBadge: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#FFF1DA", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: "flex-start" },
  featuredBadgeText: { color: "#D88D07", fontSize: 9, fontWeight: "800", letterSpacing: 1, marginLeft: 4 },
  featuredName: { color: "#1B1B1B", fontSize: 20, fontWeight: "800", marginTop: 8 },
  featuredKind: { color: "#3E3E3E", fontSize: 13, marginTop: 2, fontWeight: "600" },
  featuredMeta: { color: "#7A7167", fontSize: 12, marginLeft: 6 },
  newPill: { backgroundColor: "#FFF1DA", alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginTop: 8 },
  featuredArrow: { position: "absolute", top: 14, right: 14, width: 32, height: 32, borderRadius: 16, backgroundColor: "#FFFDF8", alignItems: "center", justifyContent: "center", shadowColor: "#B89B63", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 3 },
  viewLeadBtn: { padding: 12 },
  viewLeadGrad: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 13, borderRadius: 999, gap: 8 },
  viewLeadText: { color: "#fff", fontWeight: "800", fontSize: 15, marginRight: 6 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#1B1B1B" },
  projCard: { width: 200, backgroundColor: "#FFFDF8", borderRadius: 18, marginRight: 12, overflow: "hidden", shadowColor: "#B89B63", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
  projImg: { width: "100%", height: 90, backgroundColor: "#F4DDB4" },
  projTitle: { fontSize: 13, fontWeight: "700", color: "#1B1B1B" },
  projBadge: { alignSelf: "flex-start", backgroundColor: "#FFF1DA", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginTop: 6 },
  projBadgeText: { color: "#D88D07", fontSize: 10, fontWeight: "800" },
  projBar: { height: 4, backgroundColor: "#F0E4CC", borderRadius: 2, marginTop: 8, overflow: "hidden" },
  projBarFill: { height: "100%", backgroundColor: "#D88D07" },
  emptyProj: { padding: 20, borderRadius: 18, backgroundColor: "#FFFDF8", justifyContent: "center" },
});
