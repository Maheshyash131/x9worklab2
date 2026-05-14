import React, { useCallback, useState } from "react";
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, RefreshControl } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SignOut, User, Phone, EnvelopeSimple, MapPin, NotePencil, PaperPlaneTilt, House, CurrencyInr, Buildings, ClockCountdown, CheckCircle, XCircle } from "phosphor-react-native";
import { api, clearToken } from "../../lib/api";

const BHK = ["1BHK", "2BHK", "3BHK", "Villa"];

export default function ClientDashboard() {
  const [me, setMe] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", location: "", budget: "", notes: "" });
  const [bhk, setBhk] = useState("2BHK");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try { const u = await api("/auth/me"); setMe(u); setForm((f) => ({ ...f, name: f.name || u.name, email: f.email || u.email })); setItems(await api("/consultations/mine")); }
    catch (e: any) { Alert.alert("Error", e?.message || "Failed"); }
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const submit = async () => {
    if (!form.name || !form.phone || !form.location) { Alert.alert("Missing", "Fill name, phone, location"); return; }
    setBusy(true);
    try {
      await api("/consultations", { method: "POST", body: JSON.stringify({ ...form, bhk }) });
      Alert.alert("Submitted", "Our team will contact you. Designers can now see your request.");
      setForm({ name: me?.name || "", phone: "", email: me?.email || "", location: "", budget: "", notes: "" });
      await load();
    } catch (e: any) { Alert.alert("Error", e?.message || "Failed"); }
    finally { setBusy(false); }
  };
  const logout = async () => { try { await api("/auth/logout", { method: "POST" }); } catch {} await clearToken(); router.replace("/"); };

  const STATUS: any = { accepted: { c: "#57A428", bg: "#EEF7E5", I: CheckCircle, t: "Accepted" }, pending: { c: "#D88D07", bg: "#FFF5E4", I: ClockCountdown, t: "In Review" }, rejected: { c: "#F04343", bg: "#FFEAEA", I: XCircle, t: "Declined" } };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.bgTopCircle} /><View style={styles.bgBottom} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />} contentContainerStyle={{ paddingBottom: 50 }}>
          <View style={{ padding: 22 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#7A7A7A" }}>Welcome</Text>
                <Text style={{ fontSize: 22, fontWeight: "700" }}>{me?.name || "Client"}</Text>
              </View>
              <TouchableOpacity testID="logout-btn" onPress={logout} style={styles.iconBtn}><SignOut size={22} color="#D88D07" /></TouchableOpacity>
            </View>

            <Text style={styles.h1}>Request Consultation</Text>
            <Text style={styles.sub}>Share your home plans — our team will contact you and assign a designer.</Text>
            <View style={styles.accent} />

            <View style={styles.card}>
              <Field label="Your Name" icon={<User size={22} color="#D88D07" />} value={form.name} onChangeText={(v: string) => setForm({ ...form, name: v })} placeholder="Full name" testID="c-name" />
              <Field label="Phone" icon={<Phone size={22} color="#D88D07" />} value={form.phone} onChangeText={(v: string) => setForm({ ...form, phone: v })} placeholder="Phone" keyboardType="phone-pad" testID="c-phone" />
              <Field label="Email" icon={<EnvelopeSimple size={22} color="#D88D07" />} value={form.email} onChangeText={(v: string) => setForm({ ...form, email: v })} placeholder="Email" keyboardType="email-address" testID="c-email" />
              <Field label="Preferred Location" icon={<MapPin size={22} color="#D88D07" />} value={form.location} onChangeText={(v: string) => setForm({ ...form, location: v })} placeholder="City / Area" testID="c-location" />
              <Field label="Budget (optional)" icon={<CurrencyInr size={22} color="#D88D07" />} value={form.budget} onChangeText={(v: string) => setForm({ ...form, budget: v })} placeholder="e.g. 50 Lakhs" keyboardType="numeric" testID="c-budget" />

              <Text style={styles.lbl}>Home Type</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
                {BHK.map((b) => (
                  <TouchableOpacity key={b} testID={`c-bhk-${b}`} onPress={() => setBhk(b)} style={[styles.chip, bhk === b && styles.chipActive]}>
                    <Text style={{ color: bhk === b ? "#fff" : "#3E3E3E", fontWeight: "600" }}>{b}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.lbl}>Notes</Text>
              <View style={[styles.inputWrap, { alignItems: "flex-start", paddingVertical: 12, minHeight: 90 }]}>
                <NotePencil size={22} color="#D88D07" />
                <TextInput multiline value={form.notes} onChangeText={(v) => setForm({ ...form, notes: v })} placeholder="Tell us what you need..." placeholderTextColor="#9A8E80" style={[styles.input, { textAlignVertical: "top" }]} testID="c-notes" />
              </View>

              <TouchableOpacity testID="submit-consult" disabled={busy} onPress={submit} activeOpacity={0.9} style={styles.shadowBtn}>
                <LinearGradient colors={["#FFB931", "#E19100"]} style={styles.btnGrad}>
                  {busy ? <ActivityIndicator color="#fff" /> : <><PaperPlaneTilt size={22} color="#fff" /><Text style={styles.btnText}>Submit Request</Text></>}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <Text style={styles.h2}>Your Requests</Text>
            {items.length === 0 && <Text style={styles.empty}>No requests yet.</Text>}
            {items.map((it, i) => {
              const s = STATUS[it.status] || STATUS.pending; const I = s.I;
              return (
                <View key={i} style={styles.card}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={[styles.iconBg, { backgroundColor: s.bg }]}><I size={24} color={s.c} /></View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={{ fontSize: 16, fontWeight: "700" }}>{it.bhk} in {it.location}</Text>
                      <Text style={{ color: "#7A7A7A" }}>{new Date(it.created_at).toLocaleDateString()}</Text>
                    </View>
                    <View style={{ backgroundColor: s.bg, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 }}>
                      <Text style={{ color: s.c, fontWeight: "700", fontSize: 12 }}>{s.t}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
function Field({ label, icon, value, onChangeText, placeholder, keyboardType, testID }: any) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.lbl}>{label}</Text>
      <View style={styles.inputWrap}>{icon}<TextInput testID={testID} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#9A8E80" keyboardType={keyboardType} style={styles.input} /></View>
    </View>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F7F3EE" },
  bgTopCircle: { position: "absolute", top: -140, right: -120, width: 340, height: 340, borderRadius: 170, backgroundColor: "#F8E8D2" },
  bgBottom: { position: "absolute", bottom: -120, left: -40, width: "120%", height: 220, borderTopLeftRadius: 180, borderTopRightRadius: 180, backgroundColor: "#F6E7D5" },
  iconBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#FBF8F4", alignItems: "center", justifyContent: "center" },
  h1: { fontSize: 32, fontWeight: "700", color: "#111", marginTop: 20 },
  h2: { fontSize: 22, fontWeight: "700", color: "#111", marginTop: 24, marginBottom: 8 },
  sub: { fontSize: 14, color: "#6F6F6F", marginTop: 8 },
  accent: { width: 60, height: 5, backgroundColor: "#D88D07", borderRadius: 5, marginTop: 14 },
  card: { backgroundColor: "#FBF9F6", borderRadius: 28, padding: 18, marginTop: 14, shadowColor: "#D7C8B7", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3 },
  lbl: { fontSize: 14, color: "#1A1A1A", fontWeight: "700", marginBottom: 8, marginTop: 6 },
  inputWrap: { flexDirection: "row", alignItems: "center", backgroundColor: "#F9F5F0", borderWidth: 1, borderColor: "#F2E6D8", borderRadius: 18, paddingHorizontal: 14, height: 54 },
  input: { flex: 1, marginLeft: 10, fontSize: 16, color: "#111" },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: "#F9F5F0", borderWidth: 1, borderColor: "#F2E6D8" },
  chipActive: { backgroundColor: "#D88D07", borderColor: "#D88D07" },
  shadowBtn: { marginTop: 16, borderRadius: 999, overflow: "hidden" },
  btnGrad: { paddingVertical: 16, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 18, marginLeft: 8 },
  iconBg: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  empty: { color: "#9A8E80", textAlign: "center", marginTop: 14 },
});
