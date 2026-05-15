import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import {
  ArrowRight,
  ShieldCheck,
  Headset,
  Star,
  Briefcase,
  Crown,
  X,
} from "phosphor-react-native";

import DashboardBackground from "../../components/DashboardBackground";
import { api } from "../../lib/api";

export default function ClientDashboard() {
  const [designers, setDesigners] = useState<any[]>([]);
  const [me, setMe] = useState<any>(null);
  const [busy, setBusy] = useState(true);
  const [selectedDesigner, setSelectedDesigner] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [sending, setSending] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    project_type: "",
    bhk: "",
    location: "",
    budget: "",
    requirements: "",
  });

  const load = useCallback(async () => {
    try {
      setBusy(true);

      const [user, list] = await Promise.all([
        api("/auth/me"),
        api("/client/recommended-designers"),
      ]);

      setMe(user);
      setDesigners(list);

      setForm((prev) => ({
        ...prev,
        full_name: user?.name || "",
        phone: user?.phone || "",
        email: user?.email || "",
        location: user?.location || "",
      }));
    } catch (e) {
      console.log(e);
    } finally {
      setBusy(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const openConnect = (designer: any) => {
    setSelectedDesigner(designer);
    setModalVisible(true);
  };

  const sendRequest = async () => {
    if (!selectedDesigner) return;

    if (!form.full_name.trim()) {
      Alert.alert("Required", "Enter full name");
      return;
    }

    if (!form.phone.trim()) {
      Alert.alert("Required", "Enter phone");
      return;
    }

    if (!form.project_type.trim()) {
      Alert.alert("Required", "Enter project type");
      return;
    }

    try {
      setSending(true);

      await api("/client/connect-designer", {
        method: "POST",
        body: JSON.stringify({
          designer_id: selectedDesigner.user_id,
          ...form,
        }),
      });

      setModalVisible(false);

      Alert.alert(
        "Request Sent",
        "Designer has received your request."
      );
    } catch (e: any) {
      Alert.alert(
        "Error",
        e?.message || "Failed to send request"
      );
    } finally {
      setSending(false);
    }
  };

  if (busy) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator
          size="large"
          color="#D88D07"
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <DashboardBackground />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <View style={styles.container}>
            <Text style={styles.heading}>
              Design Match
            </Text>

            <Text style={styles.sub}>
              Get matched with premium interior designers
            </Text>

            <View style={styles.accent} />

            <View style={styles.heroCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.heroTitle}>
                  We recommend the best designers
                </Text>

                <Text style={styles.heroText}>
                  Share your style, space details and
                  preferences. We'll match you with the
                  perfect designer.
                </Text>

                <TouchableOpacity style={styles.heroBtn}>
                  <Text style={styles.heroBtnText}>
                    Get Started
                  </Text>

                  <ArrowRight
                    size={16}
                    color="#D88D07"
                  />
                </TouchableOpacity>
              </View>

              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=400&q=80",
                }}
                style={styles.heroImage}
              />
            </View>

            <Text style={styles.sectionTitle}>
              Recommended Designers
            </Text>
                        {designers.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>
                  No designers available right now
                </Text>
              </View>
            ) : (
              designers.map((designer, i) => (
                <View
                  key={designer.user_id || i}
                  style={styles.designerCard}
                >
                  <View style={styles.topRow}>
                    <View style={styles.profileWrap}>
                      <Image
                        source={{
                          uri:
                            designer.picture ||
                            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
                        }}
                        style={styles.avatar}
                      />

                      {designer.plan === "premium" && (
                        <View style={styles.premiumBadge}>
                          <Crown
                            size={12}
                            color="#fff"
                            weight="fill"
                          />
                        </View>
                      )}
                    </View>

                    <View style={{ flex: 1, marginLeft: 14 }}>
                      <Text style={styles.designerName}>
                        {designer.name}
                      </Text>

                      <Text style={styles.specialization}>
                        {designer.specialization || "Interior Design"}
                      </Text>

                      <View style={styles.ratingRow}>
                        <Star
                          size={13}
                          color="#D88D07"
                          weight="fill"
                        />
                        <Text style={styles.ratingText}>
                          {designer.rating || 4.8}
                        </Text>
                      </View>

                      <View style={styles.metaRow}>
                        <View style={styles.metaChip}>
                          <Briefcase
                            size={12}
                            color="#D88D07"
                          />
                          <Text style={styles.metaText}>
                            {designer.completed_projects} Projects
                          </Text>
                        </View>

                        <View style={styles.metaChip}>
                          <ShieldCheck
                            size={12}
                            color="#D88D07"
                          />
                          <Text style={styles.metaText}>
                            {designer.experience || "0"} Years
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.connectBtn}
                    onPress={() => openConnect(designer)}
                  >
                    <Text style={styles.connectText}>
                      Connect
                    </Text>

                    <ArrowRight
                      size={16}
                      color="#fff"
                    />
                  </TouchableOpacity>
                </View>
              ))
            )}

            <Text style={styles.sectionTitle}>
              Why Choose Design Match?
            </Text>

            <View style={styles.whyRow}>
              <WhyCard
                icon={
                  <ShieldCheck
                    size={22}
                    color="#D88D07"
                  />
                }
                title="Trusted"
              />

              <WhyCard
                icon={
                  <Star
                    size={22}
                    color="#D88D07"
                    weight="fill"
                  />
                }
                title="Personalized"
              />

              <WhyCard
                icon={
                  <Headset
                    size={22}
                    color="#D88D07"
                  />
                }
                title="Support"
              />
            </View>

            <Modal
              visible={modalVisible}
              animationType="slide"
              transparent
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalCard}>
                  <View style={styles.modalHead}>
                    <Text style={styles.modalTitle}>
                      Connect Designer
                    </Text>

                    <TouchableOpacity
                      onPress={() =>
                        setModalVisible(false)
                      }
                    >
                      <X
                        size={22}
                        color="#1B1B1B"
                      />
                    </TouchableOpacity>
                  </View>

                  <InputField
                    placeholder="Full Name"
                    value={form.full_name}
                    onChange={(t) =>
                      setForm({
                        ...form,
                        full_name: t,
                      })
                    }
                  />

                  <InputField
                    placeholder="Phone"
                    value={form.phone}
                    onChange={(t) =>
                      setForm({
                        ...form,
                        phone: t,
                      })
                    }
                  />

                  <InputField
                    placeholder="Email"
                    value={form.email}
                    onChange={(t) =>
                      setForm({
                        ...form,
                        email: t,
                      })
                    }
                  />

                  <InputField
                    placeholder="Project Type"
                    value={form.project_type}
                    onChange={(t) =>
                      setForm({
                        ...form,
                        project_type: t,
                      })
                    }
                  />

                  <InputField
                    placeholder="BHK"
                    value={form.bhk}
                    onChange={(t) =>
                      setForm({
                        ...form,
                        bhk: t,
                      })
                    }
                  />
                                    <InputField
                    placeholder="Location"
                    value={form.location}
                    onChange={(t) =>
                      setForm({
                        ...form,
                        location: t,
                      })
                    }
                  />

                  <InputField
                    placeholder="Budget"
                    value={form.budget}
                    onChange={(t) =>
                      setForm({
                        ...form,
                        budget: t,
                      })
                    }
                  />

                  <InputField
                    placeholder="Requirements"
                    value={form.requirements}
                    onChange={(t) =>
                      setForm({
                        ...form,
                        requirements: t,
                      })
                    }
                    multiline
                  />

                  <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={sendRequest}
                    disabled={sending}
                  >
                    {sending ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.submitText}>
                        Send Request
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function WhyCard({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <View style={styles.whyCard}>
      {icon}
      <Text style={styles.whyText}>
        {title}
      </Text>
    </View>
  );
}

function InputField({
  placeholder,
  value,
  onChange,
  multiline,
}: {
  placeholder: string;
  value: string;
  onChange: (t: string) => void;
  multiline?: boolean;
}) {
  return (
    <TextInput
      style={[
        styles.input,
        multiline && {
          minHeight: 100,
          textAlignVertical: "top",
        },
      ]}
      placeholder={placeholder}
      placeholderTextColor="#9E8E76"
      value={value}
      onChangeText={onChange}
      multiline={multiline}
    />
  );
}
const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAF7F2",
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },

  heading: {
    fontSize: 40,
    fontWeight: "800",
    color: "#111",
    lineHeight: 44,
  },

  sub: {
    marginTop: 10,
    fontSize: 14,
    color: "#6D655B",
  },

  accent: {
    width: 58,
    height: 4,
    borderRadius: 4,
    backgroundColor: "#D88D07",
    marginTop: 12,
  },

  heroCard: {
    marginTop: 20,
    backgroundColor: "#D88D07",
    borderRadius: 24,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  heroTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },

  heroText: {
    color: "#FFF6D8",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },

  heroBtn: {
    marginTop: 14,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },

  heroBtnText: {
    color: "#D88D07",
    fontWeight: "800",
    marginRight: 8,
  },

  heroImage: {
    width: 100,
    height: 100,
    borderRadius: 18,
    marginLeft: 12,
  },

  sectionTitle: {
    marginTop: 24,
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
  },

  emptyCard: {
    marginTop: 20,
    padding: 30,
    borderRadius: 22,
    backgroundColor: "#FFFDF8",
    alignItems: "center",
  },

  emptyText: {
    color: "#7A7167",
  },

  designerCard: {
    marginTop: 16,
    backgroundColor: "#FFFDF8",
    borderRadius: 24,
    padding: 16,
    shadowColor: "#B89B63",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  topRow: {
    flexDirection: "row",
  },

  profileWrap: {
    position: "relative",
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },

  premiumBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#D88D07",
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },

  designerName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
  },

  specialization: {
    color: "#6D655B",
    marginTop: 4,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  ratingText: {
    marginLeft: 6,
    color: "#111",
    fontWeight: "700",
  },

  metaRow: {
    flexDirection: "row",
    marginTop: 10,
    flexWrap: "wrap",
  },

  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3D9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },

  metaText: {
    marginLeft: 6,
    fontSize: 11,
    color: "#5A4E3B",
    fontWeight: "700",
  },

  connectBtn: {
    marginTop: 14,
    backgroundColor: "#D88D07",
    borderRadius: 16,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  connectText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    marginRight: 8,
  },

  whyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 40,
  },

  whyCard: {
    flex: 1,
    backgroundColor: "#FFFDF8",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    marginHorizontal: 4,
  },

  whyText: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "700",
    color: "#444",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },

  modalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
  },

  modalHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
  },

  input: {
    backgroundColor: "#FFF8EA",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
    fontSize: 14,
    color: "#111",
  },

  submitBtn: {
    backgroundColor: "#D88D07",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },

  submitText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
});