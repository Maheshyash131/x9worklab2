import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import {
  PencilSimple,
  EnvelopeSimple,
  Phone,
  SignOut,
  Camera,
  Buildings,
  MapPin,
  ShieldCheck,
  Star,
  CurrencyInr,
  Briefcase,
  Trophy,
  Trash,
  IdentificationCard,
  Crown,
} from "phosphor-react-native";

import { api, clearToken } from "../../lib/api";
import { useAuth } from "@clerk/clerk-expo";
import DashboardBackground from "../../components/DashboardBackground";
import * as WebBrowser from "expo-web-browser";

export default function DesignerProfile() {
  const [me, setMe] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    experience: "",
    license_no: "",
    office: "",
    specialization: "",
    portfolio_residential: "0",
    portfolio_commercial: "0",
    portfolio_concepts: "0",
  });

  const { signOut } = useAuth();

  const load = useCallback(async () => {
    try {
      const data = await api("/auth/me");
      setMe(data);
    } catch (e) {
      console.log(e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  useEffect(() => {
    if (!me) return;

    setForm({
      name: me.name || "",
      phone: me.phone || "",
      experience: me.experience || "",
      license_no: me.license_no || "",
      office: me.office || "",
      specialization: me.specialization || "",
      portfolio_residential: String(
        me?.portfolio_residential ?? 0
      ),
      portfolio_commercial: String(
        me?.portfolio_commercial ?? 0
      ),
      portfolio_concepts: String(
        me?.portfolio_concepts ?? 0
      ),
    });
  }, [me]);

  const saveProfile = async () => {
    try {
      setBusy(true);

      const updated = await api("/auth/profile", {
        method: "PATCH",
        body: JSON.stringify(form),
      });

      setMe(updated);
      setEditing(false);

      Alert.alert(
        "Success",
        "Profile updated successfully"
      );
    } catch (e: any) {
      Alert.alert(
        "Error",
        e?.message || "Update failed"
      );
    } finally {
      setBusy(false);
    }
  };

  const pickPicture = async () => {
    try {
      const perm =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!perm.granted) {
        Alert.alert(
          "Permission needed",
          "Allow photo access."
        );
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.6,
          base64: true,
          mediaTypes: ["images"] as any,
        });

      if (result.canceled) return;

      const asset = result.assets[0];

      const picture = asset.base64
        ? `data:image/jpeg;base64,${asset.base64}`
        : asset.uri;

      setBusy(true);

      const updated = await api("/auth/profile", {
        method: "PATCH",
        body: JSON.stringify({
          picture,
        }),
      });

      setMe(updated);
    } catch (e: any) {
      Alert.alert(
        "Error",
        e?.message || "Image update failed"
      );
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    try {
      await api("/auth/logout", {
        method: "POST",
      });
    } catch {}

    try {
      await signOut();
      await WebBrowser.dismissBrowser();
    } catch {}

    await clearToken();
    router.replace("/");
  };

  const deleteAccount = async () => {
    Alert.alert(
      "Delete account?",
      "This action is permanent.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await api("/auth/account", {
                method: "DELETE",
              });
            } catch {}

            await clearToken();
            router.replace("/");
          },
        },
      ]
    );
  };

  const designerId = me
    ? `XNL-DES-${String(me.user_id || "")
        .slice(-5)
        .padStart(5, "0")}`
    : "—";

  const completedProjects = String(
    me?.completed_projects ?? 0
  );

  const rating = String(
    me?.rating ?? 0
  );

  const earnings = `₹${Number(
  me?.wallet_balance ?? 0
).toLocaleString("en-IN")}`;

  const purchasedPlan =
    me?.plan || "No Plan";

  const profileImage =
    me?.picture || null;

  return (
    <View style={{ flex: 1 }}>
      <DashboardBackground />

      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 140 }}
        >
          <View style={styles.container}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.pageTitle}>
                  Profile
                </Text>
                <View style={styles.accent} />
              </View>

              <TouchableOpacity
                onPress={() => setEditing(!editing)}
                style={styles.iconBtn}
              >
                <PencilSimple
                  size={20}
                  color="#D88D07"
                  weight="fill"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.heroCard}>
              <View style={styles.avatarWrap}>
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={styles.avatarFallback}>
                    <Text style={styles.avatarLetter}>
                      {(me?.name || "D")
                        .charAt(0)
                        .toUpperCase()}
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.camBtn}
                  onPress={pickPicture}
                  disabled={busy}
                >
                  {busy ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Camera
                      size={14}
                      color="#fff"
                      weight="fill"
                    />
                  )}
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1, marginLeft: 16 }}>
                {editing ? (
                  <TextInput
                    style={styles.nameInput}
                    value={form.name}
                    onChangeText={(t) =>
                      setForm({
                        ...form,
                        name: t,
                      })
                    }
                  />
                ) : (
                  <Text style={styles.name}>
                    {me?.name || "—"}
                  </Text>
                )}

                <Text style={styles.roleLabel}>
                  {form.specialization || "—"}
                </Text>

                <View style={styles.idChip}>
                  <IdentificationCard
                    size={14}
                    color="#D88D07"
                    weight="fill"
                  />
                  <Text style={styles.idText}>
                    {designerId}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.statsRow}>
              <StatCard
                icon={
                  <Briefcase
                    size={20}
                    color="#D88D07"
                  />
                }
                value={completedProjects}
                label="Projects"
              />

              <StatCard
                icon={
                  <Star
                    size={20}
                    color="#D88D07"
                    weight="fill"
                  />
                }
                value={rating}
                label="Rating"
              />

              <StatCard
                icon={
                  <CurrencyInr
                    size={20}
                    color="#D88D07"
                  />
                }
                value={earnings}
                label="Earnings"
              />
            </View>

            <View style={styles.card}>
              <SectionTitle title="Membership Plan" />

              <InfoRow
                icon={
                  <Crown
                    size={18}
                    color="#D88D07"
                  />
                }
                label="Current Plan"
                value={purchasedPlan}
                editable={false}
              />
            </View>

            <View style={styles.card}>
              <SectionTitle title="Contact Information" />

              <InfoRow
                icon={
                  <EnvelopeSimple
                    size={18}
                    color="#D88D07"
                  />
                }
                label="Email"
                value={me?.email || "—"}
                editable={false}
              />

              <InfoRow
                icon={
                  <Phone
                    size={18}
                    color="#D88D07"
                  />
                }
                label="Phone Number"
                value={form.phone}
                editable={editing}
                onChange={(t) =>
                  setForm({
                    ...form,
                    phone: t,
                  })
                }
              />
            </View>

            <View style={styles.card}>
              <SectionTitle title="Professional Details" />

              <InfoRow
                icon={
                  <Trophy
                    size={18}
                    color="#D88D07"
                  />
                }
                label="Experience"
                value={form.experience}
                editable={editing}
                onChange={(t) =>
                  setForm({
                    ...form,
                    experience: t,
                  })
                }
              />

              <InfoRow
                icon={
                  <ShieldCheck
                    size={18}
                    color="#D88D07"
                  />
                }
                label="License Number"
                value={form.license_no}
                editable={editing}
                onChange={(t) =>
                  setForm({
                    ...form,
                    license_no: t,
                  })
                }
              />

              <InfoRow
                icon={
                  <MapPin
                    size={18}
                    color="#D88D07"
                  />
                }
                label="Office Location"
                value={form.office}
                editable={editing}
                onChange={(t) =>
                  setForm({
                    ...form,
                    office: t,
                  })
                }
              />
            </View>
                        <View style={styles.card}>
              <SectionTitle title="Portfolio Categories" />

              <View style={styles.portfolioRow}>
                <PortfolioCard
                  title="Residential"
                  count={form.portfolio_residential}
                  editable={editing}
                  onChange={(t) =>
                    setForm({
                      ...form,
                      portfolio_residential: t,
                    })
                  }
                />

                <PortfolioCard
                  title="Commercial"
                  count={form.portfolio_commercial}
                  editable={editing}
                  onChange={(t) =>
                    setForm({
                      ...form,
                      portfolio_commercial: t,
                    })
                  }
                />

                <PortfolioCard
                  title="Concepts"
                  count={form.portfolio_concepts}
                  editable={editing}
                  onChange={(t) =>
                    setForm({
                      ...form,
                      portfolio_concepts: t,
                    })
                  }
                />
              </View>
            </View>

            {editing && (
              <TouchableOpacity
                style={styles.saveBtnWrap}
                onPress={saveProfile}
                disabled={busy}
              >
                <LinearGradient
                  colors={["#FFB931", "#E19100"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.saveBtn}
                >
                  {busy ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.saveText}>
                      Save Changes
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            )}

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={logout}
              >
                <SignOut
                  size={18}
                  color="#D88D07"
                  weight="fill"
                />
                <Text style={styles.actionText}>
                  Logout
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={deleteAccount}
              >
                <Trash
                  size={18}
                  color="#C84B31"
                  weight="fill"
                />
                <Text style={styles.deleteText}>
                  Delete Account
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function SectionTitle({
  title,
}: {
  title: string;
}) {
  return (
    <Text style={styles.sectionTitle}>
      {title}
    </Text>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.statCard}>
      {icon}
      <Text style={styles.statValue}>
        {value}
      </Text>
      <Text style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
  editable,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  editable?: boolean;
  onChange?: (v: string) => void;
}) {
  return (
    <View style={styles.infoBlock}>
      <View style={styles.infoLeft}>
        {icon}
        <Text style={styles.infoLabel}>
          {label}
        </Text>
      </View>

      {editable ? (
        <TextInput
          style={styles.infoInput}
          value={value}
          onChangeText={onChange}
        />
      ) : (
        <Text style={styles.infoValue}>
          {value || "—"}
        </Text>
      )}
    </View>
  );
}

function PortfolioCard({
  title,
  count,
  editable,
  onChange,
}: {
  title: string;
  count: string;
  editable?: boolean;
  onChange?: (v: string) => void;
}) {
  return (
    <View style={styles.portCard}>
      {editable ? (
        <TextInput
          style={styles.portInput}
          value={count}
          keyboardType="numeric"
          onChangeText={onChange}
        />
      ) : (
        <Text style={styles.portCount}>
          {count}
        </Text>
      )}

      <Text style={styles.portTitle}>
        {title}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  pageTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1B1B1B",
  },

  accent: {
    width: 56,
    height: 4,
    backgroundColor: "#D88D07",
    borderRadius: 4,
    marginTop: 8,
    marginLeft: 2,
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

  heroCard: {
    marginTop: 18,
    backgroundColor: "#FFFDF8",
    borderRadius: 26,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#B89B63",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  avatarWrap: {
    position: "relative",
  },

  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
  },

  avatarFallback: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#FFF3D9",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarLetter: {
    fontSize: 30,
    fontWeight: "800",
    color: "#D88D07",
  },

  camBtn: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#D88D07",
    alignItems: "center",
    justifyContent: "center",
  },

  name: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1B1B1B",
  },

  nameInput: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1B1B1B",
    borderBottomWidth: 1,
    borderBottomColor: "#E7D8BF",
    paddingVertical: 4,
  },

  roleLabel: {
    marginTop: 6,
    fontSize: 13,
    color: "#6D655B",
  },

  idChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 10,
    backgroundColor: "#FFF3D9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },

  idText: {
    marginLeft: 6,
    color: "#D88D07",
    fontWeight: "700",
    fontSize: 12,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#FFFDF8",
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#B89B63",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  statValue: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "800",
    color: "#1B1B1B",
  },

  statLabel: {
    marginTop: 4,
    fontSize: 11,
    color: "#7A7167",
  },

  card: {
    marginTop: 18,
    backgroundColor: "#FFFDF8",
    borderRadius: 24,
    padding: 18,
    shadowColor: "#B89B63",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1B1B1B",
    marginBottom: 14,
  },

  infoBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0E4CC",
  },

  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  infoLabel: {
    marginLeft: 10,
    fontSize: 13,
    color: "#6D655B",
  },

  infoValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1B1B1B",
    flex: 1,
    textAlign: "right",
  },

  infoInput: {
    minWidth: 140,
    textAlign: "right",
    fontSize: 13,
    fontWeight: "700",
    color: "#1B1B1B",
  },

  portfolioRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  portCard: {
    flex: 1,
    backgroundColor: "#FFF8EA",
    borderRadius: 18,
    paddingVertical: 20,
    alignItems: "center",
    marginHorizontal: 4,
  },

  portCount: {
    fontSize: 22,
    fontWeight: "800",
    color: "#D88D07",
  },

  portInput: {
    fontSize: 20,
    fontWeight: "800",
    color: "#D88D07",
    textAlign: "center",
    minWidth: 50,
  },

  portTitle: {
    marginTop: 8,
    fontSize: 12,
    color: "#6D655B",
  },

  saveBtnWrap: {
    marginTop: 22,
    borderRadius: 999,
    overflow: "hidden",
  },

  saveBtn: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },

  actionRow: {
    marginTop: 20,
    gap: 14,
  },

  actionBtn: {
    backgroundColor: "#FFF3D9",
    borderRadius: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  actionText: {
    marginLeft: 8,
    color: "#D88D07",
    fontWeight: "800",
    fontSize: 15,
  },

  deleteBtn: {
    backgroundColor: "#FFF1EE",
    borderRadius: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  deleteText: {
    marginLeft: 8,
    color: "#C84B31",
    fontWeight: "800",
    fontSize: 15,
  },
});