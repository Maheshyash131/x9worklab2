import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import {
  PencilSimple,
  SignOut,
  Trash,
  EnvelopeSimple,
  Phone,
  MapPin,
  User,
  Camera,
  Crown,
} from "phosphor-react-native";
import { useAuth } from "@clerk/clerk-expo";
import DashboardBackground from "../../components/DashboardBackground";
import { api, clearToken } from "../../lib/api";

export default function ClientProfile() {
  const { signOut } = useAuth();

  const [me, setMe] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
  });

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
      location: me.location || "",
    });
  }, [me]);

  const saveProfile = async () => {
    try {
      setBusy(true);

      const updated = await api("/auth/profile", {
        method: "PATCH",
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          location: form.location,
        }),
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

  const pickImage = async () => {
    try {
      const perm =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!perm.granted) {
        Alert.alert(
          "Permission needed",
          "Allow gallery access"
        );
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          quality: 0.6,
          base64: true,
          aspect: [1, 1],
          mediaTypes: ["images"] as any,
        });

      if (result.canceled) return;

      const asset = result.assets[0];

      const updated = await api("/auth/profile", {
        method: "PATCH",
        body: JSON.stringify({
          picture: `data:image/jpeg;base64,${asset.base64}`,
        }),
      });

      setMe(updated);
    } catch {
      Alert.alert("Error", "Image update failed");
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
    } catch {}

    await clearToken();
    router.replace("/");
  };

  const deleteAccount = async () => {
    Alert.alert(
      "Delete Account?",
      "This action cannot be undone.",
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

  return (
    <View style={{ flex: 1 }}>
      <DashboardBackground />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <View style={styles.container}>
            <View style={styles.headerRow}>
              <View />

              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => {
                  if (editing) {
                    saveProfile();
                  } else {
                    setEditing(true);
                  }
                }}
              >
                {busy ? (
                  <ActivityIndicator color="#D88D07" />
                ) : (
                  <PencilSimple
                    size={20}
                    color="#D88D07"
                    weight="fill"
                  />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.avatarWrap}>
              {me?.picture ? (
                <Image
                  source={{ uri: me.picture }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarLetter}>
                    {(me?.name || "C")
                      .charAt(0)
                      .toUpperCase()}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.camBtn}
                onPress={pickImage}
              >
                <Camera
                  size={14}
                  color="#D88D07"
                  weight="fill"
                />
              </TouchableOpacity>
            </View>
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
                {me?.name || "Client"}
              </Text>
            )}

            <View style={styles.planRow}>
              <Crown
                size={14}
                color="#D88D07"
                weight="fill"
              />
              <Text style={styles.planText}>
                {me?.plan
                  ? `${String(me.plan)
                      .charAt(0)
                      .toUpperCase()}${String(
                      me.plan
                    ).slice(1)} Client`
                  : "Premium Client"}
              </Text>
            </View>

            <View style={styles.card}>
              <ProfileRow
                icon={
                  <User
                    size={18}
                    color="#D88D07"
                  />
                }
                label="Full Name"
                value={form.name}
                editable={editing}
                onChange={(t) =>
                  setForm({
                    ...form,
                    name: t,
                  })
                }
              />

              <ProfileRow
                icon={
                  <EnvelopeSimple
                    size={18}
                    color="#D88D07"
                  />
                }
                label="Email Address"
                value={me?.email || ""}
                editable={false}
              />

              <ProfileRow
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

              <ProfileRow
                icon={
                  <MapPin
                    size={18}
                    color="#D88D07"
                  />
                }
                label="Location"
                value={form.location}
                editable={editing}
                onChange={(t) =>
                  setForm({
                    ...form,
                    location: t,
                  })
                }
              />
            </View>

            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={logout}
            >
              <SignOut
                size={20}
                color="#fff"
              />

              <Text style={styles.logoutText}>
                Sign Out
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={deleteAccount}
            >
              <Trash
                size={20}
                color="#C84B31"
              />

              <Text style={styles.deleteText}>
                Delete Account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function ProfileRow({
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
  onChange?: (t: string) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.iconWrap}>
        {icon}
      </View>

      <View style={{ flex: 1, marginLeft: 14 }}>
        <Text style={styles.label}>
          {label}
        </Text>

        {editable ? (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
          />
        ) : (
          <Text style={styles.value}>
            {value || "—"}
          </Text>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    paddingTop: 18,
    alignItems: "center",
  },

  headerRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },

  editBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFFDF8",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#B89B63",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  avatarWrap: {
    position: "relative",
    marginTop: 8,
  },

  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: "#E7C37D",
  },

  avatarFallback: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#FFF3D9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#E7C37D",
  },

  avatarLetter: {
    fontSize: 48,
    fontWeight: "800",
    color: "#D88D07",
  },

  camBtn: {
    position: "absolute",
    right: 6,
    bottom: 6,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFDF8",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#B89B63",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  name: {
    marginTop: 20,
    fontSize: 34,
    fontWeight: "800",
    color: "#111",
    textAlign: "center",
  },

  nameInput: {
    marginTop: 20,
    fontSize: 30,
    fontWeight: "800",
    color: "#111",
    textAlign: "center",
    minWidth: 220,
  },

  planRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 26,
  },

  planText: {
    marginLeft: 6,
    color: "#D88D07",
    fontWeight: "700",
    fontSize: 15,
  },

  card: {
    width: "100%",
    backgroundColor: "#FFFDF8",
    borderRadius: 26,
    padding: 18,
    shadowColor: "#B89B63",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F2E7D2",
  },

  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF6E8",
    justifyContent: "center",
    alignItems: "center",
  },

  label: {
    fontSize: 13,
    color: "#8A7B67",
  },

  value: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginTop: 4,
  },

  input: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginTop: 4,
    paddingVertical: 2,
  },

  logoutBtn: {
    width: "100%",
    marginTop: 24,
    backgroundColor: "#D88D07",
    borderRadius: 20,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  logoutText: {
    marginLeft: 10,
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },

  deleteBtn: {
    width: "100%",
    marginTop: 16,
    backgroundColor: "#FFF1EE",
    borderRadius: 20,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },

  deleteText: {
    marginLeft: 10,
    color: "#C84B31",
    fontSize: 16,
    fontWeight: "800",
  },
});