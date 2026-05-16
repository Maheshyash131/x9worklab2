import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Bell,
  User,
  CalendarBlank,
  Buildings,
  MapPin,
  Clock,
  NotePencil,
  Plus,
  DotsThreeVertical,
  Phone,
  X,
  Lock,
} from "phosphor-react-native";

import DashboardBackground from "../../components/DashboardBackground";
import { api } from "../../lib/api";

function StageBadge({
  text,
  color,
  bg,
}: {
  text: string;
  color: string;
  bg: string;
}) {
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color }]}>
        {text}
      </Text>
    </View>
  );
}

export default function ProjectWorkspace() {
  const params = useLocalSearchParams();

  const baseProject = useMemo(() => {
    try {
      return params.project
        ? JSON.parse(params.project as string)
        : null;
    } catch {
      return null;
    }
  }, [params.project]);

  const [project, setProject] = useState(baseProject);
  const [unlockVisible, setUnlockVisible] = useState(false);
  const [busy, setBusy] = useState(false);

  const image = (params.image as string) || "";

  if (!project) {
    return (
      <View style={{ flex: 1 }}>
        <DashboardBackground />
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>No workspace data found</Text>
        </SafeAreaView>
      </View>
    );
  }

 const unlockContact = async () => {
  try {
    setBusy(true);

    await api("/designer/unlock-contact", {
      method: "POST",
      body: JSON.stringify({
        referral_id: project.referral_id,
      }),
    });

    const refreshed = await api("/designer/feed");

    const allProjects = [
      ...(refreshed.referrals || []),
      ...(refreshed.consultations || []),
    ];

    const updatedProject = allProjects.find(
      (item) => item.referral_id === project.referral_id
    );

    if (updatedProject) {
      setProject(updatedProject);
    }

    setUnlockVisible(false);

    Alert.alert(
      "Payment Successful",
      "Client phone number unlocked successfully."
    );
  } catch (e: any) {
    Alert.alert(
      "Error",
      e?.message || "Payment failed"
    );
  } finally {
    setBusy(false);
  }
};

  const acceptedDate = project.created_at
    ? new Date(project.created_at).toLocaleDateString("en-IN")
    : "N/A";

  const projectTitle =
    project.property_name ||
    project.bhk ||
    "Interior Project";

  const clientName =
    project._name ||
    project.client_name ||
    project.name ||
    "Client";

  const location =
    project.location || "Location unavailable";

  const stages = [
    {
      no: 1,
      title: "Lead Accepted",
      sub: "Project accepted by designer.",
      status: "Completed",
      color: "#3F9B2E",
      bg: "#EAF8E1",
    },
    {
      no: 2,
      title: "Client Consultation",
      sub: "Initial consultation pending.",
      status: "Pending",
      color: "#D88D07",
      bg: "#FFF3D9",
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <DashboardBackground />

      <Modal
        transparent
        visible={unlockVisible}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity
              onPress={() => setUnlockVisible(false)}
              style={styles.closeBtn}
            >
              <X size={20} color="#1B1B1B" />
            </TouchableOpacity>

            <View style={styles.lockCircle}>
              <Lock size={28} color="#D88D07" />
            </View>

            <Text style={styles.modalTitle}>
              Unlock Client Contact
            </Text>

            <Text style={styles.modalSub}>
              Pay ₹399 to reveal the client phone number.
            </Text>

            <TouchableOpacity
              style={styles.payBtn}
              disabled={busy}
              onPress={unlockContact}
            >
              {busy ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.payText}>
                  Pay ₹399
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View style={styles.container}>
            <View style={styles.headerRow}>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => router.back()}
              >
                <ArrowLeft size={22} color="#1B1B1B" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconBtn}>
                <Bell size={20} color="#1B1B1B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.heading}>
              Project Workspace
            </Text>

            <View style={styles.heroCard}>
              <Image
                source={{ uri: image }}
                style={styles.heroImg}
              />

              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.projectTitle}>
                  {projectTitle}
                </Text>

                <View style={styles.infoRow}>
                  <User size={14} color="#1B1B1B" />
                  <Text style={styles.infoText}>
                    Client: {clientName}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Phone size={14} color="#1B1B1B" />
                  <Text style={styles.infoText}>
                    {project.phone}
                  </Text>
                </View>

                {!project.contact_unlocked && (
                  <TouchableOpacity
                    style={styles.unlockBtn}
                    onPress={() =>
                      setUnlockVisible(true)
                    }
                  >
                    <Text style={styles.unlockText}>
                      Unlock Contact ₹399
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 14,
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

  heading: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1B1B1B",
    marginTop: 18,
    marginBottom: 18,
  },

  heroCard: {
    backgroundColor: "#FFFDF8",
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#B89B63",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  heroImg: {
    width: 92,
    height: 92,
    borderRadius: 18,
  },

  projectTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1B1B1B",
    marginBottom: 6,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  infoText: {
    marginLeft: 8,
    fontSize: 13,
    color: "#4F473E",
    flex: 1,
  },

  unlockBtn: {
    marginTop: 14,
    backgroundColor: "#D88D07",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignSelf: "flex-start",
  },

  unlockText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 12,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  modalCard: {
    width: "100%",
    backgroundColor: "#FFFDF8",
    borderRadius: 28,
    padding: 24,
    alignItems: "center",
  },

  closeBtn: {
    position: "absolute",
    right: 16,
    top: 16,
    zIndex: 10,
  },

  lockCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFF1DA",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1B1B1B",
    marginTop: 18,
  },

  modalSub: {
    textAlign: "center",
    color: "#6D655B",
    marginTop: 10,
    lineHeight: 22,
  },

  payBtn: {
    marginTop: 22,
    backgroundColor: "#D88D07",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 999,
    minWidth: 160,
    alignItems: "center",
  },

  payText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginLeft: 8,
  },

  badgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
});