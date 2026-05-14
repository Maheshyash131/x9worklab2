import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  PencilSimple,
  EnvelopeSimple,
  Phone,
  ShieldCheck,
  CalendarBlank,
  Buildings,
  MapPin,
  IdentificationCard,
  IdentificationBadge,
  SignOut,
  User as UserIcon,
  ClipboardText,
  Trash,
  Camera,
} from "phosphor-react-native";
import { api, clearToken } from "../../lib/api";
import DashboardBackground from "../../components/DashboardBackground";

export default function AssociateProfile() {
  const [me, setMe] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try { setMe(await api("/auth/me")); } catch {}
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const pickPicture = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) { Alert.alert("Permission needed", "Allow photo access to change picture."); return; }
      const r = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.6, base64: true, mediaTypes: ["images"] as any });
      if (r.canceled) return;
      const asset = r.assets[0];
      const data = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
      setBusy(true);
      const u = await api("/auth/profile", { method: "PATCH", body: JSON.stringify({ picture: data }) });
      setMe(u);
    } catch (e: any) { Alert.alert("Error", e?.message || "Failed"); }
    finally { setBusy(false); }
  };

  const logout = async () => {
    try { await api("/auth/logout", { method: "POST" }); } catch {}
    await clearToken();
    router.replace("/");
  };

  const associateId = me ? `XNL-ASSO-${String(me.user_id || "").slice(-5).padStart(5, "0")}` : "—";
  const joinDate = me?.created_at ? new Date(me.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <View style={{ flex: 1 }}>
      <DashboardBackground />
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView contentContainerStyle={{ paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
          <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} testID="back-btn">
                <ArrowLeft size={22} color="#1B1B1B" />
              </TouchableOpacity>
              <TouchableOpacity onPress={pickPicture} style={styles.iconBtn} testID="edit-btn">
                <PencilSimple size={20} color="#D88D07" weight="fill" />
              </TouchableOpacity>
            </View>

            {/* Avatar + name */}
            <View style={styles.heroRow}>
              <View style={styles.avatarWrap}>
                {me?.picture ? (
                  <Image source={{ uri: me.picture }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, { backgroundColor: "#FFF1DA", alignItems: "center", justifyContent: "center" }]}>
                    <Text style={{ fontSize: 38, fontWeight: "800", color: "#D88D07" }}>{(me?.name || "A").slice(0, 1).toUpperCase()}</Text>
                  </View>
                )}
                <TouchableOpacity testID="pick-pic" onPress={pickPicture} disabled={busy} style={styles.camBtn}>
                  {busy ? <ActivityIndicator color="#fff" size="small" /> : <Camera size={14} color="#fff" weight="fill" />}
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.name} numberOfLines={1}>{me?.name || "Associate"}</Text>
                <Text style={styles.roleLabel}>Associate</Text>
                <View style={styles.idChip}>
                  <IdentificationCard size={14} color="#D88D07" weight="fill" />
                  <View style={{ marginLeft: 6 }}>
                    <Text style={styles.idLbl}>Associate ID</Text>
                    <Text style={styles.idVal}>{associateId}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Contact Information */}
            <View style={styles.card}>
              <SectionHeader icon={<UserIcon size={20} color="#D88D07" weight="fill" />} title="Contact Information" />
              <InfoRow icon={<EnvelopeSimple size={18} color="#D88D07" />} label="Email Address" value={me?.email || "—"} />
              <InfoRow icon={<Phone size={18} color="#D88D07" />} label="Phone Number" value={me?.phone || "+91 — — — — — —"} />
            </View>

            {/* Professional Information */}
            <View style={styles.card}>
              <SectionHeader icon={<ClipboardText size={20} color="#D88D07" weight="fill" />} title="Professional Information" />
              <InfoRow icon={<ShieldCheck size={18} color="#D88D07" />} label="RERA Registration No." value={me?.rera_no || "RAJ/RA/2024/1234"} />
              <InfoRow icon={<CalendarBlank size={18} color="#D88D07" />} label="Date of Joining" value={joinDate} />
              <InfoRow icon={<Buildings size={18} color="#D88D07" />} label="Department" value={me?.department || "Client Management"} />
              <InfoRow icon={<MapPin size={18} color="#D88D07" />} label="Office Location" value={me?.office || "Jaipur, Rajasthan"} />
            </View>

            {/* Additional Information */}
            <View style={styles.card}>
              <SectionHeader icon={<IdentificationBadge size={20} color="#D88D07" weight="fill" />} title="Additional Information" />
              <View style={styles.rowBetween}>
                <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                  <View style={styles.iconBg}><ShieldCheck size={18} color="#D88D07" /></View>
                  <Text style={styles.label}>RERA Status</Text>
                </View>
                <View style={styles.badgeGreen}>
                  <Text style={styles.badgeGreenText}>Registered</Text>
                </View>
              </View>
              <View style={styles.rowBetween}>
                <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                  <View style={styles.iconBg}><IdentificationCard size={18} color="#D88D07" /></View>
                  <Text style={styles.label}>PAN Number</Text>
                </View>
                <Text style={styles.value}>{me?.pan || "ABCDE1234F"}</Text>
              </View>
            </View>

            {/* Danger zone */}
            <TouchableOpacity
              testID="delete-account"
              onPress={() => Alert.alert("Delete account?", "This is permanent.", [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: async () => { try { await api("/auth/account", { method: "DELETE" }); } catch {} await clearToken(); router.replace("/"); } },
              ])}
              style={[styles.card, { flexDirection: "row", alignItems: "center", padding: 14 }]}
            >
              <View style={[styles.iconBg, { backgroundColor: "#FFEAEA" }]}><Trash size={18} color="#F04343" /></View>
              <Text style={[styles.label, { color: "#F04343", fontWeight: "700" }]}>Delete Account</Text>
            </TouchableOpacity>

            {/* Sign Out */}
            <TouchableOpacity testID="logout-btn" activeOpacity={0.9} onPress={logout} style={styles.shadowBtn}>
              <LinearGradient colors={["#FFB931", "#E19100"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btnGrad}>
                <SignOut size={20} color="#fff" weight="bold" />
                <Text style={styles.btnText}>Sign Out</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function SectionHeader({ icon, title }: any) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
      <View style={styles.sectionIcon}>{icon}</View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}
function InfoRow({ icon, label, value }: any) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.iconBg}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value} numberOfLines={1}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#FFFDF8", alignItems: "center", justifyContent: "center", shadowColor: "#B89B63", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  heroRow: { flexDirection: "row", alignItems: "center", marginTop: 12, marginBottom: 18 },
  avatarWrap: { width: 96, height: 96 },
  avatar: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: "#F1DFB6" },
  camBtn: { position: "absolute", bottom: 0, right: 0, width: 30, height: 30, borderRadius: 15, backgroundColor: "#D88D07", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#FFFDF8" },
  name: { fontSize: 22, fontWeight: "800", color: "#1B1B1B" },
  roleLabel: { color: "#D88D07", fontWeight: "700", marginTop: 2, fontSize: 14 },
  idChip: { marginTop: 8, alignSelf: "flex-start", flexDirection: "row", alignItems: "center", backgroundColor: "#FFF1DA", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  idLbl: { fontSize: 9, color: "#9A8E80", fontWeight: "700", letterSpacing: 0.5 },
  idVal: { fontSize: 12, color: "#1B1B1B", fontWeight: "800" },
  card: { backgroundColor: "#FFFDF8", borderRadius: 22, padding: 16, marginBottom: 14, shadowColor: "#B89B63", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  sectionIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#FFF1DA", alignItems: "center", justifyContent: "center", marginRight: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#1B1B1B" },
  infoRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  iconBg: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#FFF1DA", alignItems: "center", justifyContent: "center", marginRight: 10 },
  label: { fontSize: 11, color: "#9A8E80", fontWeight: "700" },
  value: { fontSize: 14, color: "#1B1B1B", marginTop: 2, fontWeight: "600" },
  rowBetween: { flexDirection: "row", alignItems: "center", paddingVertical: 8, justifyContent: "space-between" },
  badgeGreen: { backgroundColor: "#EAF8E1", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
  badgeGreenText: { color: "#3F9B2E", fontWeight: "800", fontSize: 12 },
  shadowBtn: { marginTop: 4, borderRadius: 999, overflow: "hidden", shadowColor: "#D88D07", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 14, elevation: 5 },
  btnGrad: { paddingVertical: 16, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10 },
  btnText: { color: "#fff", fontSize: 17, fontWeight: "800", marginLeft: 8 },
});
