import React, { useEffect, useState } from "react";
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
const PROPERTY = ["Apartment", "Villa", "Independent House"];

type Props = {
  visible: boolean;
  designer: any;
  client: any;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function ReferClientModal({
  visible,
  designer,
  client,
  onClose,
  onSuccess,
}: Props) {
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    project_type: "",
    bhk: "2BHK",
    property_type: "Apartment",
    location: "",
    budget: "",
    requirements: "",
  });

  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (client) {
      setForm((prev) => ({
        ...prev,
        full_name: client?.name || "",
        phone: client?.phone || "",
        email: client?.email || "",
        location: client?.location || "",
      }));
    }
  }, [client]);

  const submit = async () => {
    if (!designer) return;

    if (!form.full_name.trim()) {
      Alert.alert("Required", "Enter full name");
      return;
    }

    if (!form.phone.trim()) {
      Alert.alert("Required", "Enter phone number");
      return;
    }

    if (!form.project_type.trim()) {
      Alert.alert("Required", "Enter project type");
      return;
    }

    if (!form.location.trim()) {
      Alert.alert("Required", "Enter location");
      return;
    }

    if (!form.budget.trim()) {
      Alert.alert("Required", "Enter budget");
      return;
    }

    try {
      setBusy(true);

      const payload = {
  designer_id: designer?.user_id || "",
  full_name: form.full_name.trim(),
  phone: form.phone.trim(),
  email: form.email?.trim() || "",
  project_type: form.project_type.trim(),
  bhk: form.bhk || "2BHK",
  location: form.location.trim(),
  budget: form.budget.trim(),
  requirements: form.requirements?.trim() || "",
};

console.log("PUSH PAYLOAD:", payload);

await api("/client/connect-designer", {
  method: "POST",
  body: JSON.stringify(payload),
});

Alert.alert("Success", "Lead pushed successfully");

onSuccess?.();
onClose();
    } catch (e: any) {
      Alert.alert(
        "Error",
        e?.message || "Failed to send request"
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.sheet}
        >
          <View style={styles.handle} />

          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>
                Connect with {designer?.name || "Designer"}
              </Text>

              <Text style={styles.subtitle}>
                Share your project details
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
            >
              <X size={22} color="#D88D07" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Field
              icon={<User size={20} color="#D88D07" />}
              label="Full Name"
              value={form.full_name}
              onChangeText={(v: string) =>
                setForm({ ...form, full_name: v })
              }
            />

            <Field
              icon={<Phone size={20} color="#D88D07" />}
              label="Phone"
              value={form.phone}
              onChangeText={(v: string) =>
                setForm({ ...form, phone: v })
              }
            />

            <Field
              icon={<EnvelopeSimple size={20} color="#D88D07" />}
              label="Email"
              value={form.email}
              onChangeText={(v: string) =>
                setForm({ ...form, email: v })
              }
            />

            <Field
              icon={<Buildings size={20} color="#D88D07" />}
              label="Project Type"
              value={form.project_type}
              onChangeText={(v: string) =>
                setForm({ ...form, project_type: v })
              }
            />

            <Field
              icon={<House size={20} color="#D88D07" />}
              label="Location"
              value={form.location}
              onChangeText={(v: string) =>
                setForm({ ...form, location: v })
              }
            />

            <Field
              icon={<MapPin size={20} color="#D88D07" />}
              label="Budget"
              value={form.budget}
              onChangeText={(v: string) =>
                setForm({ ...form, budget: v })
              }
            />

            <View style={styles.inputWrapLarge}>
              <NotePencil size={20} color="#D88D07" />
              <TextInput
                multiline
                placeholder="Requirements"
                placeholderTextColor="#9A8E80"
                value={form.requirements}
                onChangeText={(v) =>
                  setForm({ ...form, requirements: v })
                }
                style={styles.input}
              />
            </View>

            <TouchableOpacity
              disabled={busy}
              onPress={submit}
              style={styles.shadowBtn}
            >
              <LinearGradient
                colors={["#FFB931", "#E19100"]}
                style={styles.btnGrad}
              >
                {busy ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <PaperPlaneTilt
                      size={20}
                      color="#fff"
                    />
                    <Text style={styles.btnText}>
                      Push To Worklab
                    </Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

function Field({
  icon,
  label,
  value,
  onChangeText,
}: any) {
  return (
    <>
      <Text style={styles.lbl}>{label}</Text>
      <View style={styles.inputWrap}>
        {icon}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFDF8",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: "92%",
  },
  handle: {
    width: 50,
    height: 5,
    backgroundColor: "#E8D7BA",
    alignSelf: "center",
    borderRadius: 5,
    marginBottom: 14,
  },
  header: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
  },
  subtitle: {
    color: "#7A7167",
    marginTop: 4,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFF1DA",
    justifyContent: "center",
    alignItems: "center",
  },
  lbl: {
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FBF4E6",
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 52,
  },
  inputWrapLarge: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FBF4E6",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 100,
    marginTop: 14,
  },
  input: {
    flex: 1,
    marginLeft: 8,
  },
  shadowBtn: {
    marginTop: 20,
    borderRadius: 999,
    overflow: "hidden",
  },
  btnGrad: {
    paddingVertical: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "800",
    marginLeft: 8,
  },
});