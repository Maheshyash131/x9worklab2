import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Dimensions,
  Animated,
  Pressable,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  ArrowRight,
  CalendarBlank,
  Clock,
  MapPin,
  User,
  Phone,
  EnvelopeSimple,
  NotePencil,
  Sparkle,
  ShieldCheck,
  Star,
  Lock,
} from "phosphor-react-native";
import DashboardBackground from "../../components/DashboardBackground"

import { api } from "../../lib/api";

const { width } = Dimensions.get("window");
const CONSULTATION_FEE = 2999;

function PremiumInput({
  icon,
  placeholder,
  value,
  onChangeText,
  multiline = false,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  multiline?: boolean;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View
      style={[
        styles.inputContainer,
        focused && styles.inputContainerFocused,
        multiline && { alignItems: "flex-start" },
      ]}
    >
      <View style={{ marginTop: multiline ? 16 : 0 }}>
        {icon}
      </View>

      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
        ]}
        placeholder={placeholder}
        placeholderTextColor="#A1A1AA"
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoCorrect={false}
        blurOnSubmit={!multiline}
      />
    </View>
  );
}

function FeatureCard({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <Pressable style={styles.featureCard}>
      <View style={styles.featureIcon}>
        {icon}
      </View>

      <Text style={styles.featureTitle}>
        {title}
      </Text>

      <Text style={styles.featureSubtitle}>
        {subtitle}
      </Text>
    </Pressable>
  );
}

function StatTile({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <View style={styles.statTile}>
      {icon}
      <Text style={styles.statText}>
        {title}
      </Text>
    </View>
  );
}

export default function KarmicPayment() {
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    dob: "",
    time_birth: "",
    place_birth: "",
    full_name: "",
    phone: "",
    email: "",
    concern: "",
  });

    const loadUser = async () => {
  try {
    const user = await api("/auth/me");

    setForm((prev) => ({
      ...prev,
      full_name: prev.full_name || user?.name || "",
      phone: prev.phone || user?.phone || "",
      email: prev.email || user?.email || "",
    }));
  } catch (err) {
    console.log(err);
  }
};

   useEffect(() => {
  loadUser();
}, []);

      const proceedPayment = async () => {
      if (!form.dob.trim()) {
        Alert.alert("Required", "Enter date of birth");
        return;
      }

      if (!form.time_birth.trim()) {
        Alert.alert("Required", "Enter time of birth");
        return;
      }

      if (!form.place_birth.trim()) {
        Alert.alert("Required", "Enter place of birth");
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
        Alert.alert("Required", "Enter email address");
        return;
      }

      try {
        setBusy(true);

        await api("/client/karmic-consultation", {
          method: "POST",
          body: JSON.stringify({
            dob: form.dob,
            time_birth: form.time_birth,
          place_birth: form.place_birth,
          full_name: form.full_name,
          phone: form.phone,
          email: form.email,
          concern: form.concern,
          consultation_fee: CONSULTATION_FEE,
        }),
      });

      Alert.alert(
        "Booking Confirmed",
        "Your karmic consultation has been booked successfully.",
        [
          {
            text: "Continue",
            onPress: () => router.replace("/single"),
          },
        ]
      );
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
   <View style={styles.root}>
  <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
    <DashboardBackground />
  </View>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View style={styles.container}>
            <View style={styles.topBar}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => router.back()}
              >
                <ArrowLeft size={22} color="#F97316" />
              </TouchableOpacity>

              <View style={styles.logoBadge}>
                <Sparkle size={18} color="#fff" weight="fill" />
              </View>
            </View>

            <Text style={styles.heading}>
              XNINE {"\n"}Karmic Lab
            </Text>

            <View style={styles.accentLine} />


            <Text style={styles.description}>
              Discover personalized karmic alignment,
              energy balancing, and spiritual guidance
              designed around your birth details.
            </Text>

            <View style={styles.heroCard}>
              <View style={styles.heroGlow} />

              <Text style={styles.heroTitle}>
                Premium Karmic Guidance
              </Text>

              <Text style={styles.heroDescription}>
                Personalized spiritual consultation with
                actionable remedies and energy alignment.
              </Text>

              {/* <TouchableOpacity style={styles.heroButton}>
                <Text style={styles.heroButtonText}>
                  Explore Benefits
                </Text>

                <ArrowRight
                  size={18}
                  color="#fff"
                  weight="bold"
                />
              </TouchableOpacity> */}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featureRow}
            >
              <FeatureCard
                icon={
                  <Sparkle
                    size={20}
                    color="#F97316"
                    weight="fill"
                  />
                }
                title="Personalized Color Palette"
                subtitle="Best colour for your living and space"
              />

              <FeatureCard
                icon={
                  <ShieldCheck
                    size={20}
                    color="#F97316"
                    weight="fill"
                  />
                }
                title="Expert Consulation"
                subtitle="1-on-1 session with our karmic expert"
              />

              <FeatureCard
                icon={
                  <Star
                    size={20}
                    color="#F97316"
                    weight="fill"
                  />
                }
                title="Remedies"
                subtitle="Personalized solutions"
              />

              <FeatureCard
                icon={
                  <Lock
                    size={20}
                    color="#F97316"
                    weight="fill"
                  />
                }
                title="Private"
                subtitle="100% confidential"
              />
            </ScrollView>

            <View style={styles.formCard}>
              <Text style={styles.formTitle}>
                Book Your Session
              </Text>

              <PremiumInput
                icon={
                  <CalendarBlank
                    size={20}
                    color="#71717A"
                  />
                }
                placeholder="Date of Birth"
                value={form.dob}
                onChangeText={(v) =>
                  setForm({ ...form, dob: v })
                }
              />

              <PremiumInput
                icon={
                  <Clock
                    size={20}
                    color="#71717A"
                  />
                }
                placeholder="Time of Birth"
                value={form.time_birth}
                onChangeText={(v) =>
                  setForm({ ...form, time_birth: v })
                }
              />

              <PremiumInput
                icon={
                  <MapPin
                    size={20}
                    color="#71717A"
                  />
                }
                placeholder="Place of Birth"
                value={form.place_birth}
                onChangeText={(v) =>
                  setForm({ ...form, place_birth: v })
                }
              />

              <PremiumInput
                icon={
                  <User
                    size={20}
                    color="#71717A"
                  />
                }
                placeholder="Full Name"
                value={form.full_name}
                onChangeText={(v) =>
                  setForm({ ...form, full_name: v })
                }
              />

              <PremiumInput
                icon={
                  <Phone
                    size={20}
                    color="#71717A"
                  />
                }
                placeholder="Phone Number"
                value={form.phone}
                onChangeText={(v) =>
                  setForm({ ...form, phone: v })
                }
              />

              <PremiumInput
                icon={
                  <EnvelopeSimple
                    size={20}
                    color="#71717A"
                  />
                }
                placeholder="Email Address"
                value={form.email}
                onChangeText={(v) =>
                  setForm({ ...form, email: v })
                }
              />

              <PremiumInput
                icon={
                  <NotePencil
                    size={20}
                    color="#71717A"
                  />
                }
                placeholder="Specific Concern"
                value={form.concern}
                onChangeText={(v) =>
                  setForm({ ...form, concern: v })
                }
                multiline
              />
               <View style={styles.priceCard}>
  <View style={{ flex: 1, paddingRight: 10 }}>
    <Text style={styles.priceLabel}>
      Consultation Fee
    </Text>

    <Text style={styles.priceSub}>
      One-time premium karmic session
    </Text>
  </View>

  <Text style={styles.priceAmount}>
    ₹2,999
  </Text>
</View>
              <TouchableOpacity
                style={[
                  styles.payButton,
                  busy && { opacity: 0.7 },
                ]}
                onPress={proceedPayment}
                disabled={busy}
                activeOpacity={0.9}
              >
                {busy ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.payButtonText}>
                      Proceed To Payment
                    </Text>

                    <View style={styles.payArrow}>
                      <ArrowRight
                        size={18}
                        color="#fff"
                        weight="bold"
                      />
                    </View>
                  </>
                )}
              </TouchableOpacity>

              <Text style={styles.secureText}>
                Secure encrypted booking
              </Text>
            </View>

            <View style={styles.statsRow}>
              <StatTile
                icon={<Sparkle size={18} color="#F97316" weight="fill" />}
                title="Personalized"
              />
              <StatTile
                icon={<ShieldCheck size={18} color="#F97316" weight="fill" />}
                title="Expert Guided"
              />
              <StatTile
                icon={<Lock size={18} color="#F97316" weight="fill" />}
                title="Secure"
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFF8F1",
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  accentLine: {
  width: 60,
  height: 4,
  backgroundColor: "#D9A23A",
  borderRadius: 4,
  marginTop: 14,
  margin:"auto",
},

  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F97316",
    justifyContent: "center",
    alignItems: "center",
  },

  heading: {
    fontSize: 42,
    fontWeight: "800",
    fontFamily: "PlayfairDisplay-Bold",
    color: "#111827",
    marginTop: 24,
    textAlign: "center",
  },

  subHeading: {
    fontSize: 28,
    fontWeight: "300",
    color: "#111827",
  },

  description: {
    marginTop: 14,
    fontSize: 15,
    lineHeight: 24,
    color: "#6B7280",
  },

  heroCard: {
    marginTop: 26,
    borderRadius: 28,
    padding: 24,
    backgroundColor: "#F97316",
    overflow: "hidden",
    position: "relative",
  },

  heroGlow: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.08)",
    top: -50,
    right: -30,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
  },

  heroDescription: {
    marginTop: 12,
    color: "#fff",
    lineHeight: 22,
    fontSize: 14,
  },

  heroButton: {
    marginTop: 18,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 18,
  },

  heroButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  featureRow: {
    paddingTop: 20,
    paddingBottom: 8,
    paddingRight: 10,
  },

  featureCard: {
    width: width * 0.42,
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    marginRight: 14,
    elevation: 3,
  },

  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF4E6",
    justifyContent: "center",
    alignItems: "center",
  },

  featureTitle: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  featureSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#6B7280",
  },

  formCard: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 20,
    marginTop: 18,
    elevation: 4,
  },

  formTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 18,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F3E2D2",
    borderRadius: 18,
    paddingHorizontal: 16,
    marginBottom: 14,
    backgroundColor: "#fff",
  },

  inputContainerFocused: {
  borderColor: "#F97316",
  backgroundColor: "#FFFDF9",
},

multilineInput: {
  minHeight: 100,
  textAlignVertical: "top",
  paddingTop: 16,
},

  input: {
    flex: 1,
    paddingVertical: 16,
    paddingLeft: 12,
    fontSize: 15,
    color: "#111827",
  },

 priceCard: {
  marginTop: 8,
  borderRadius: 20,
  padding: 18,
  backgroundColor: "#FFF7ED",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 10,
},

priceLabel: {
  fontSize: 16,
  fontWeight: "700",
  color: "#111827",
},

priceSub: {
  marginTop: 4,
  fontSize: 12,
  color: "#6B7280",
  lineHeight: 18,
  maxWidth: width * 0.45,
},

priceAmount: {
  fontSize: 26,
  fontWeight: "900",
  color: "#F97316",
  flexShrink: 1,
},

  payButton: {
    height: 62,
    borderRadius: 20,
    backgroundColor: "#F97316",
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  payButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
    marginRight: 12,
  },

  payArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  secureText: {
    marginTop: 14,
    textAlign: "center",
    color: "#6B7280",
    fontSize: 13,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: 20,
  },

  statTile: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    marginHorizontal: 4,
    elevation: 2,
  },

  statText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },
});