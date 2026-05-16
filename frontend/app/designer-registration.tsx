import React, { useEffect, useState, memo } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  ShieldCheck,
  User,
  Buildings,
  EnvelopeSimple,
  Phone,
  Briefcase,
  CalendarBlank,
  IdentificationCard,
  ArrowRight,
} from "phosphor-react-native";
import { Picker } from "@react-native-picker/picker";

import DashboardBackground from "../components/DashboardBackground";
import { api } from "../lib/api";

const InputRow = memo(
  ({
    icon,
    placeholder,
    value,
    onChangeText,
    editable = true,
  }: {
    icon: React.ReactNode;
    placeholder: string;
    value: string;
    onChangeText?: (text: string) => void;
    editable?: boolean;
  }) => {
    return (
      <View style={styles.inputRow}>
        <View style={styles.iconWrap}>{icon}</View>

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#A69B8D"
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          autoCapitalize="none"
          autoCorrect={false}
          blurOnSubmit={false}
        />
      </View>
    );
  }
);

export default function DesignerRegistration() {
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    company_name: "",
    email: "",
    phone: "",
    role: "",
    experience: "",
    license_number: "",
  });

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      try {
        const me = await api("/auth/me");

        if (!isMounted) return;

        setForm((prev) => {
          if (
            prev.full_name ||
            prev.company_name ||
            prev.phone ||
            prev.role ||
            prev.experience ||
            prev.license_number
          ) {
            return prev;
          }

          return {
            full_name: me?.name ?? "",
            company_name: me?.company_name ?? "",
            email: me?.email ?? "",
            phone: me?.phone ?? "",
            role: me?.role ?? "",
            experience: me?.experience ?? "",
            license_number: me?.license_number ?? "",
          };
        });
      } catch (err) {
        console.log(err);
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const submit = async () => {
    try {
      if (
        !form.full_name ||
        !form.company_name ||
        !form.phone ||
        !form.role ||
        !form.experience
      ) {
        Alert.alert("Missing", "Please complete all required fields.");
        return;
      }

      setBusy(true);

      await api("/designer/register", {
        method: "POST",
        body: JSON.stringify(form),
      });

      router.push("/designer-plan");
    } catch (e: any) {
      Alert.alert("Failed", e?.message || "Could not continue");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <DashboardBackground />

      <SafeAreaView style={{ flex: 1, paddingTop: 30 }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View style={styles.container}>
            <View style={styles.headerRow}>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => router.back()}
              >
                <ArrowLeft size={22} color="#D88D07" />
              </TouchableOpacity>

              <View style={styles.iconBtn}>
                <ShieldCheck size={20} color="#D88D07" />
              </View>
            </View>

            <Text style={styles.title}>
              <Text style={{ color: "#D88D07" }}>Designer </Text>
              Portal
            </Text>

            <Text style={styles.subtitle}>
              Complete your registration to get started
            </Text>

            <View style={styles.progressWrap}>
              <View style={styles.stepBlock}>
                <View style={styles.activeStep}>
                  <Text style={styles.activeStepText}>1</Text>
                </View>
                <Text style={styles.activeLabel}>Registration</Text>
              </View>

              <View style={styles.line} />

              <View style={styles.stepBlock}>
                <View style={styles.inactiveStep}>
                  <Text style={styles.inactiveStepText}>2</Text>
                </View>
                <Text style={styles.inactiveLabel}>Plan Selection</Text>
              </View>

              <View style={styles.line} />

              <View style={styles.stepBlock}>
                <View style={styles.inactiveStep}>
                  <Text style={styles.inactiveStepText}>3</Text>
                </View>
                <Text style={styles.inactiveLabel}>Final Payment</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Designer Information</Text>
              <View style={styles.goldLine} />
                            <InputRow
                icon={<User size={18} color="#D88D07" />}
                placeholder="Full Name"
                value={form.full_name}
                onChangeText={(t: string) =>
                  setForm((prev) => ({ ...prev, full_name: t }))
                }
              />

              <InputRow
                icon={<Buildings size={18} color="#D88D07" />}
                placeholder="Firm / Company Name"
                value={form.company_name}
                onChangeText={(t: string) =>
                  setForm((prev) => ({ ...prev, company_name: t }))
                }
              />

              <InputRow
                icon={<EnvelopeSimple size={18} color="#D88D07" />}
                placeholder="Email Address"
                value={form.email}
                editable={false}
              />

              <InputRow
                icon={<Phone size={18} color="#D88D07" />}
                placeholder="Phone Number"
                value={form.phone}
                onChangeText={(t: string) =>
                  setForm((prev) => ({ ...prev, phone: t }))
                }
              />

             <View style={styles.dropdownRow}>
  <View style={styles.iconWrap}>
    <Briefcase size={18} color="#D88D07" />
  </View>

  <Picker
    selectedValue={form.role}
    onValueChange={(value) =>
      setForm((prev) => ({ ...prev, role: value }))
    }
    style={styles.picker}
  >
    <Picker.Item label="Select role" value="" />
    <Picker.Item label="Architect" value="architect" />
    <Picker.Item label="Designer" value="designer" />
  </Picker>
</View>

              <InputRow
                icon={<CalendarBlank size={18} color="#D88D07" />}
                placeholder="Years of Experience"
                value={form.experience}
                onChangeText={(t: string) =>
                  setForm((prev) => ({ ...prev, experience: t }))
                }
              />

              <InputRow
                icon={<IdentificationCard size={18} color="#D88D07" />}
                placeholder="License / Registration Number (Optional)"
                value={form.license_number}
                onChangeText={(t: string) =>
                  setForm((prev) => ({ ...prev, license_number: t }))
                }
              />
            </View>

            <View style={styles.feeCard}>
              <Text style={styles.sectionTitle}>Registration Fee</Text>
              <View style={styles.goldLine} />

              <View style={styles.feeRow}>
                <View style={styles.feeIcon}>
                  <IdentificationCard
                    size={28}
                    color="#D88D07"
                    weight="fill"
                  />
                </View>

                <View>
                  <Text style={styles.price}>₹4,999</Text>
                  <Text style={styles.oneTime}>One-Time Payment</Text>
                  <Text style={styles.feeSub}>
                    Includes designer verification{"\n"}
                    and onboarding process.
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              disabled={busy}
              onPress={submit}
              style={styles.shadowBtn}
            >
              <LinearGradient
                colors={["#FFB931", "#E19100"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btnGrad}
              >
                {busy ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.btnText}>
                      Continue to Plan Selection
                    </Text>
                    <ArrowRight
                      size={22}
                      color="#fff"
                      weight="bold"
                    />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footer}>
              <ShieldCheck size={14} color="#B57B10" />
              <Text style={styles.footerText}>Secure & Encrypted</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    paddingTop: 10,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFFDF8",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#B89B63",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#1B1B1B",
    marginTop: 18,
  },

  subtitle: {
    color: "#6D655B",
    fontSize: 14,
    marginTop: 8,
  },

  progressWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 28,
    marginBottom: 24,
    justifyContent: "space-between",
  },

  dropdownRow: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 14,
},




  stepBlock: {
    alignItems: "center",
    width: 90,
  },

  activeStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E19100",
    alignItems: "center",
    justifyContent: "center",
  },

  inactiveStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D8B37A",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  activeStepText: {
    color: "#fff",
    fontWeight: "800",
  },

  inactiveStepText: {
    color: "#C28A2E",
    fontWeight: "800",
  },

  activeLabel: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: "700",
    color: "#E19100",
    textAlign: "center",
  },

  inactiveLabel: {
    marginTop: 8,
    fontSize: 11,
    color: "#5E564D",
    textAlign: "center",
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E6D5BA",
    marginHorizontal: 4,
  },

  card: {
    backgroundColor: "rgba(255,253,248,0.95)",
    borderRadius: 22,
    padding: 18,
    shadowColor: "#B89B63",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  feeCard: {
    backgroundColor: "rgba(255,253,248,0.95)",
    borderRadius: 22,
    padding: 18,
    marginTop: 16,
    shadowColor: "#B89B63",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1B1B1B",
  },

  picker: {
  flex: 1,
  height: 60,
  color: "#1B1B1B",
},

  goldLine: {
    width: 28,
    height: 3,
    backgroundColor: "#D88D07",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 18,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF1DA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#E7D8BF",
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    fontSize: 14,
    color: "#1B1B1B",
  },

  feeRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  feeIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FFF1DA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  price: {
    fontSize: 30,
    fontWeight: "800",
    color: "#E19100",
  },

  oneTime: {
    fontSize: 14,
    fontWeight: "700",
    color: "#D88D07",
    marginTop: 2,
  },

  feeSub: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 20,
    color: "#6D655B",
  },

  shadowBtn: {
    marginTop: 18,
    borderRadius: 999,
    overflow: "hidden",
    shadowColor: "#D88D07",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 5,
  },

  btnGrad: {
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  btnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 20,
  },

  footerText: {
    marginLeft: 8,
    color: "#6D655B",
    fontSize: 12,
  },
});