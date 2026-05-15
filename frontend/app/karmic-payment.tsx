import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { router, useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CalendarBlank,
  User,
  Phone,
  EnvelopeSimple,
  NotePencil,
  ShieldCheck,
  Sparkle,
  Lock,
  Headset,
  ArrowLeft,
  ArrowRight,
} from "phosphor-react-native";

import DashboardBackground from "../components/DashboardBackground";
import { api } from "../lib/api";

const CONSULTATION_FEE = 2999;

export default function KarmicPayment() {
  const [me, setMe] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    dob: "",
    full_name: "",
    phone: "",
    email: "",
    concern: "",
  });

  const loadUser = useCallback(async () => {
    try {
      const data = await api("/auth/me");

      setMe(data);

      setForm((prev) => ({
        ...prev,
        full_name: data?.name || "",
        email: data?.email || "",
        phone: data?.phone || "",
      }));
    } catch {}
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [loadUser])
  );

  const proceedPayment = async () => {
    if (!form.dob.trim()) {
      Alert.alert("Required", "Enter date of birth");
      return;
    }

    if (!form.full_name.trim()) {
      Alert.alert("Required", "Enter full name");
      return;
    }

    if (!form.phone.trim()) {
      Alert.alert("Required", "Enter phone number");
      return;
    }

    if (!form.email.trim()) {
      Alert.alert("Required", "Enter email");
      return;
    }

    try {
      setBusy(true);

      await api("/client/karmic-consultation", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          consultation_fee: CONSULTATION_FEE,
        }),
      });

    Alert.alert(
  "Payment Successful",
  "Your karmic consultation has been booked.",
  [
    {
      text: "Continue",
      onPress: () => {
        router.replace("/single");
      },
    },
  ]
);

    } catch (e: any) {
      Alert.alert(
        "Error",
        e?.message || "Something went wrong"
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <DashboardBackground />

      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
            >
              <ArrowLeft
                size={20}
                color="#D88D07"
              />
            </TouchableOpacity>

            <Text style={styles.heading}>
              Karmic{"\n"}Consultancy
            </Text>

            <Text style={styles.sub}>
              Align your date of birth with perfect colors,
              energies and harmony for your living space.
            </Text>

            <View style={styles.accent} />

            <View style={styles.heroCard}>
              <View style={styles.heroLeft}>
                <View style={styles.sparkWrap}>
                  <Sparkle
                    size={28}
                    color="#fff"
                    weight="fill"
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.heroTitle}>
                    Personalized Color & Energy Guidance
                  </Text>

                  <Text style={styles.heroText}>
                    Based on your date of birth, we suggest
                    colors, placements and directions to
                    bring prosperity and harmony.
                  </Text>
                </View>
              </View>

              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1593696954577-ab3d39317b97?auto=format&fit=crop&w=300&q=80",
                }}
                style={styles.heroImg}
              />
            </View>

            <View style={styles.twoCol}>
              <View style={styles.leftCard}>
                <Text style={styles.sectionTitle}>
                  Consultation Includes
                </Text>
                                <FeatureRow
                  icon={
                    <Sparkle
                      size={16}
                      color="#D88D07"
                      weight="fill"
                    />
                  }
                  text="DOB-based karmic analysis"
                />

                <FeatureRow
                  icon={
                    <ShieldCheck
                      size={16}
                      color="#D88D07"
                      weight="fill"
                    />
                  }
                  text="Personalized color guidance"
                />

                <FeatureRow
                  icon={
                    <Lock
                      size={16}
                      color="#D88D07"
                      weight="fill"
                    />
                  }
                  text="Confidential consultation"
                />

                <FeatureRow
                  icon={
                    <Headset
                      size={16}
                      color="#D88D07"
                      weight="fill"
                    />
                  }
                  text="Expert recommendations"
                />
              </View>

              <View style={styles.priceCard}>
                <Text style={styles.priceLabel}>
                  Consultation Fee
                </Text>

                <Text style={styles.price}>
                  ₹{CONSULTATION_FEE.toLocaleString("en-IN")}
                </Text>

                <Text style={styles.priceSub}>
                  One-time premium consultation
                </Text>
              </View>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.formTitle}>
                Consultation Details
              </Text>

              <InputRow
                icon={
                  <CalendarBlank
                    size={18}
                    color="#D88D07"
                  />
                }
                placeholder="Date of Birth (DD/MM/YYYY)"
                value={form.dob}
                onChange={(t) =>
                  setForm({
                    ...form,
                    dob: t,
                  })
                }
              />

              <InputRow
                icon={
                  <User
                    size={18}
                    color="#D88D07"
                  />
                }
                placeholder="Full Name"
                value={form.full_name}
                onChange={(t) =>
                  setForm({
                    ...form,
                    full_name: t,
                  })
                }
              />

              <InputRow
                icon={
                  <Phone
                    size={18}
                    color="#D88D07"
                  />
                }
                placeholder="Phone Number"
                value={form.phone}
                onChange={(t) =>
                  setForm({
                    ...form,
                    phone: t,
                  })
                }
                keyboardType="phone-pad"
              />

              <InputRow
                icon={
                  <EnvelopeSimple
                    size={18}
                    color="#D88D07"
                  />
                }
                placeholder="Email"
                value={form.email}
                onChange={(t) =>
                  setForm({
                    ...form,
                    email: t,
                  })
                }
                keyboardType="email-address"
              />

              <InputRow
                icon={
                  <NotePencil
                    size={18}
                    color="#D88D07"
                  />
                }
                placeholder="Specific Concern / Requirement"
                value={form.concern}
                onChange={(t) =>
                  setForm({
                    ...form,
                    concern: t,
                  })
                }
                multiline
              />
            </View>

            <View style={styles.secureCard}>
              <FeatureRow
                icon={
                  <ShieldCheck
                    size={18}
                    color="#D88D07"
                    weight="fill"
                  />
                }
                text="Secure payment processing"
              />

              <FeatureRow
                icon={
                  <Lock
                    size={18}
                    color="#D88D07"
                    weight="fill"
                  />
                }
                text="Encrypted consultation data"
              />
            </View>

            <TouchableOpacity
              style={styles.payBtn}
              onPress={proceedPayment}
              disabled={busy}
            >
              {busy ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.payText}>
                    Proceed To Payment
                  </Text>

                  <ArrowRight
                    size={18}
                    color="#fff"
                    weight="bold"
                  />
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
              </SafeAreaView>
    </View>
  );
}

function FeatureRow({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <View style={styles.featureRow}>
      {icon}
      <Text style={styles.featureText}>
        {text}
      </Text>
    </View>
  );
}

function InputRow({
  icon,
  placeholder,
  value,
  onChange,
  keyboardType,
  multiline,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (t: string) => void;
  keyboardType?: any;
  multiline?: boolean;
}) {
  return (
    <View
      style={[
        styles.inputWrap,
        multiline && {
          alignItems: "flex-start",
          minHeight: 110,
        },
      ]}
    >
      <View style={{ marginTop: multiline ? 14 : 0 }}>
        {icon}
      </View>

      <TextInput
        style={[
          styles.input,
          multiline && {
            minHeight: 90,
            textAlignVertical: "top",
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor="#9E8E76"
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        multiline={multiline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },

  backBtn: {
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

  heading: {
    textAlign: "center",
    fontSize: 34,
    fontWeight: "800",
    color: "#1B1B1B",
    marginTop: 18,
    lineHeight: 40,
  },

  sub: {
    marginTop: 10,
    color: "#6D655B",
    fontSize: 13,
    lineHeight: 21,
  },

  accent: {
    width: 60,
    height: 4,
    backgroundColor: "#D88D07",
    borderRadius: 4,
    marginTop: 12,
  },

  heroCard: {
    marginTop: 20,
    backgroundColor: "#FFFDF8",
    borderRadius: 24,
    padding: 18,
    shadowColor: "#B89B63",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  heroLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  sparkWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#D88D07",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  heroTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1B1B1B",
  },

  heroText: {
    marginTop: 8,
    fontSize: 12,
    color: "#6D655B",
    lineHeight: 19,
  },

  heroImg: {
    width: "100%",
    height: 170,
    borderRadius: 18,
    marginTop: 16,
  },

  twoCol: {
    flexDirection: "row",
    marginTop: 18,
  },

  leftCard: {
    flex: 1,
    backgroundColor: "#FFFDF8",
    borderRadius: 22,
    padding: 16,
    marginRight: 8,
  },

  priceCard: {
    width: 145,
    backgroundColor: "#FFF3D9",
    borderRadius: 22,
    padding: 16,
    justifyContent: "center",
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1B1B1B",
    marginBottom: 10,
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 7,
  },

  featureText: {
    marginLeft: 10,
    color: "#4F473E",
    fontSize: 12,
    flex: 1,
  },

  priceLabel: {
    fontSize: 12,
    color: "#7A7167",
  },

  price: {
    fontSize: 28,
    fontWeight: "800",
    color: "#D88D07",
    marginTop: 8,
  },

  priceSub: {
    fontSize: 11,
    color: "#7A7167",
    marginTop: 8,
    lineHeight: 16,
  },

  formCard: {
    marginTop: 18,
    backgroundColor: "#FFFDF8",
    borderRadius: 24,
    padding: 18,
  },

  formTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1B1B1B",
    marginBottom: 14,
  },

  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8EA",
    borderRadius: 18,
    paddingHorizontal: 16,
    marginBottom: 14,
  },

  input: {
    flex: 1,
    paddingVertical: 16,
    paddingLeft: 12,
    fontSize: 14,
    color: "#1B1B1B",
  },

  secureCard: {
    marginTop: 18,
    backgroundColor: "#FFFDF8",
    borderRadius: 22,
    padding: 18,
  },

  payBtn: {
    marginTop: 22,
    backgroundColor: "#D88D07",
    borderRadius: 22,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },

  payText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    marginRight: 10,
  },
});