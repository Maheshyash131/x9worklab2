import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  X,
  User,
  Phone,
  EnvelopeSimple,
  MapPin,
  House,
  NotePencil,
  PaperPlaneTilt,
  Buildings,
} from "phosphor-react-native";
import { api } from "../lib/api";

const BHK = ["1BHK", "2BHK", "3BHK", "Villa"];
const OWN = ["Own", "Rented"];

export default function ReferClientModal({
  visible,
  onClose,
  onSubmitted,
  designer,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
  designer: any;
}) {
  const [form, setForm] = useState({
    client_name: "",
    phone: "",
    email: "",
    location: "",
    property_name: "",
    notes: "",
  });
  const [bhk, setBhk] = useState("2BHK");
  const [ownership, setOwnership] = useState("Own");
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setForm({ client_name: "", phone: "", email: "", location: "", property_name: "", notes: "" });
    setBhk("2BHK");
    setOwnership("Own");
  };

  const submit = async () => {
  if (
    !form.client_name ||
    !form.phone ||
    !form.location ||
    !form.property_name
  ) {
    Alert.alert(
      "Missing fields",
      "Please fill name, phone, location and property."
    );
    return;
  }

  setBusy(true);

  try {
    await api("/client/connect-designer", {
      method: "POST",
      body: JSON.stringify({
        designer_id: designer?.user_id,
        full_name: form.client_name,
        phone: form.phone,
        email: form.email,
        project_type: form.property_name,
        bhk,
        location: form.location,
        requirements: form.notes,
      }),
    });

    reset();
    onSubmitted?.();
    onClose();

    Alert.alert(
      "Success",
      "Request sent to designer."
    );
  } catch (e: any) {
    Alert.alert(
      "Error",
      e?.message || "Failed"
    );
  } finally {
    setBusy(false);
  }
};

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="overFullScreen" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Refer New Client</Text>
              <Text style={styles.subtitle}>Quick details — we'll route to a designer</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} testID="close-refer-modal">
              <X size={22} color="#D88D07" weight="bold" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
            <Field icon={<User size={20} color="#D88D07" />} label="Client Name" value={form.client_name} onChangeText={(v: string) => setForm({ ...form, client_name: v })} placeholder="Full name" testID="m-name" />
            <Field icon={<Phone size={20} color="#D88D07" />} label="Phone" value={form.phone} onChangeText={(v: string) => setForm({ ...form, phone: v })} placeholder="+91…" keyboardType="phone-pad" testID="m-phone" />
            <Field icon={<EnvelopeSimple size={20} color="#D88D07" />} label="Email (optional)" value={form.email} onChangeText={(v: string) => setForm({ ...form, email: v })} placeholder="name@email.com" keyboardType="email-address" testID="m-email" />
            <Field icon={<Buildings size={20} color="#D88D07" />} label="Property / Project" value={form.property_name} onChangeText={(v: string) => setForm({ ...form, property_name: v })} placeholder="e.g. Palm Heights" testID="m-property" />
            <Field icon={<MapPin size={20} color="#D88D07" />} label="Location" value={form.location} onChangeText={(v: string) => setForm({ ...form, location: v })} placeholder="City / Area" testID="m-location" />

            <Text style={styles.lbl}>Home Type</Text>
            <View style={styles.chipRow}>
              {BHK.map((b) => (
                <TouchableOpacity key={b} testID={`m-bhk-${b}`} onPress={() => setBhk(b)} style={[styles.chip, bhk === b && styles.chipActive]}>
                  <Text style={[styles.chipText, bhk === b && { color: "#fff" }]}>{b}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.lbl}>Ownership</Text>
            <View style={styles.chipRow}>
              {OWN.map((o) => (
                <TouchableOpacity key={o} testID={`m-own-${o}`} onPress={() => setOwnership(o)} style={[styles.chip, ownership === o && styles.chipActive]}>
                  <Text style={[styles.chipText, ownership === o && { color: "#fff" }]}>{o}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.lbl}>Notes</Text>
            <View style={[styles.inputWrap, { alignItems: "flex-start", paddingVertical: 12, minHeight: 80 }]}>
              <NotePencil size={20} color="#D88D07" />
              <TextInput multiline value={form.notes} onChangeText={(v) => setForm({ ...form, notes: v })} placeholder="Any extra details…" placeholderTextColor="#9A8E80" style={[styles.input, { textAlignVertical: "top" }]} testID="m-notes" />
            </View>

            <TouchableOpacity testID="m-submit" activeOpacity={0.9} disabled={busy} onPress={submit} style={styles.shadowBtn}>
              <LinearGradient colors={["#FFB931", "#E19100"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btnGrad}>
                {busy ? <ActivityIndicator color="#fff" /> : (<><PaperPlaneTilt size={20} color="#fff" /><Text style={styles.btnText}>Move To Worklab</Text></>)}
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

function Field({ label, icon, value, onChangeText, placeholder, keyboardType, testID }: any) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={styles.lbl}>{label}</Text>
      <View style={styles.inputWrap}>
        {icon}
        <TextInput testID={testID} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#9A8E80" keyboardType={keyboardType} style={styles.input} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(20,15,5,0.35)", justifyContent: "flex-end" },
  sheet: { backgroundColor: "#FFFDF8", borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 22, paddingTop: 10, paddingBottom: 20, maxHeight: "92%" },
  handle: { alignSelf: "center", width: 50, height: 5, borderRadius: 3, backgroundColor: "#E8D7BA", marginBottom: 14 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  title: { fontSize: 22, fontWeight: "700", color: "#1B1B1B" },
  subtitle: { fontSize: 12, color: "#7A7167", marginTop: 2 },
  closeBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#FFF1DA", alignItems: "center", justifyContent: "center" },
  lbl: { fontSize: 13, color: "#1A1A1A", fontWeight: "700", marginBottom: 6, marginTop: 8 },
  inputWrap: { flexDirection: "row", alignItems: "center", backgroundColor: "#FBF4E6", borderWidth: 1, borderColor: "#F1DFB6", borderRadius: 16, paddingHorizontal: 12, height: 50 },
  input: { flex: 1, marginLeft: 8, fontSize: 15, color: "#111" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: "#FBF4E6", borderWidth: 1, borderColor: "#F1DFB6" },
  chipActive: { backgroundColor: "#D88D07", borderColor: "#D88D07" },
  chipText: { color: "#3E3E3E", fontWeight: "600", fontSize: 13 },
  shadowBtn: { marginTop: 20, borderRadius: 999, overflow: "hidden", shadowColor: "#D88D07", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 14, elevation: 5 },
  btnGrad: { paddingVertical: 16, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10 },
  btnText: { color: "#fff", fontSize: 17, fontWeight: "700", marginLeft: 8 },
});
