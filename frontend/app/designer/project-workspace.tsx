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
  Phone,
  X,
  Lock,
  CalendarBlank,
  Plus,
  DotsThreeVertical,
  Clock,
  ArrowRight,
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
        (item) =>
          item.referral_id === project.referral_id
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

  const projectTitle =
    project.property_name ||
    project.bhk ||
    "Interior Project";

  const clientName =
    project._name ||
    project.client_name ||
    project.name ||
    "Client";

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
              Pay ₹399 to reveal the client phone
              number.
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
          contentContainerStyle={{
            paddingBottom: 40,
          }}
        >
          <View style={styles.container}>
            <View style={styles.headerRow}>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => router.back()}
              >
                <ArrowLeft
                  size={22}
                  color="#1B1B1B"
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconBtn}>
                <Bell
                  size={20}
                  color="#1B1B1B"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.heading}>
              Project Workspace
            </Text>
                        <View style={styles.topTabs}>
              <TouchableOpacity style={styles.activeTab}>
                <Text style={styles.activeTabText}>
                  {project.bhk || "3BHK Interior"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.tab}>
                <Text style={styles.tabText}>
                  Villa Renovation
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.tab}>
                <Text style={styles.tabText}>
                  + New Project
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.workspaceCard}>
              <Image
                source={{ uri: image }}
                style={styles.workspaceImage}
              />

              <View style={styles.workspaceInfo}>
                <Text style={styles.workspaceTitle}>
                  {projectTitle}
                </Text>

                <View style={styles.infoRow}>
                  <User size={14} color="#1B1B1B" />
                  <Text style={styles.infoText}>
                    Client: {clientName}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <CalendarBlank
                    size={14}
                    color="#1B1B1B"
                  />
                  <Text style={styles.infoText}>
                    Deadline: Aug 2026
                  </Text>
                </View>

                <View style={styles.progressWrap}>
                  <View style={styles.progressCircle}>
                    <Text style={styles.progressPct}>
                      68%
                    </Text>

                    <Text
                      style={styles.progressLabel}
                    >
                      Completed
                    </Text>
                  </View>
                </View>
              </View>
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

            {project.contact_unlocked && (
              <View style={styles.phoneCard}>
                <Phone
                  size={16}
                  color="#D88D07"
                />

                <Text style={styles.phoneText}>
                  {project.phone}
                </Text>
              </View>
            )}

            <View style={styles.sectionCard}>
              <View style={styles.sectionHead}>
                <Text style={styles.sectionTitle}>
                  Project Stages
                </Text>

                <TouchableOpacity
                  style={styles.addStageBtn}
                >
                  <Plus
                    size={14}
                    color="#D88D07"
                  />

                  <Text
                    style={styles.addStageText}
                  >
                    Add Stage
                  </Text>
                </TouchableOpacity>
              </View>

              {[
                {
                  no: 1,
                  title: "Site Survey",
                  sub: "Site visit completed & initial measurements taken.",
                  status: "Completed",
                  color: "#3F9B2E",
                  bg: "#EAF8E1",
                },
                {
                  no: 2,
                  title: "Concept Design",
                  sub: "Initial concepts shared with client.",
                  status: "In Review",
                  color: "#4B79D8",
                  bg: "#EAF2FF",
                },
                {
                  no: 3,
                  title: "Material Selection",
                  sub: "Finish palettes & materials shortlisted.",
                  status: "Pending Approval",
                  color: "#D88D07",
                  bg: "#FFF3D9",
                },
                {
                  no: 4,
                  title: "Execution",
                  sub: "Work in progress at site.",
                  status: "Ongoing",
                  color: "#7B4FD3",
                  bg: "#F3EAFF",
                },
                {
                  no: 5,
                  title: "Final Handover",
                  sub: "Final styling & handover.",
                  status: "Scheduled",
                  color: "#7A7167",
                  bg: "#F3F0EB",
                },
              ].map((stage) => (
                <View
                  key={stage.no}
                  style={styles.stageCard}
                >
                  <View style={styles.stageLeft}>
                    <View
                      style={styles.stageNo}
                    >
                      <Text
                        style={
                          styles.stageNoText
                        }
                      >
                        {stage.no}
                      </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <View
                        style={
                          styles.stageTitleRow
                        }
                      >
                        <Text
                          style={
                            styles.stageTitle
                          }
                        >
                          {stage.title}
                        </Text>

                        <StageBadge
                          text={stage.status}
                          color={stage.color}
                          bg={stage.bg}
                        />
                      </View>

                      <Text
                        style={styles.stageSub}
                      >
                        {stage.sub}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={styles.stageActions}
                  >
                    <TouchableOpacity>
                      <DotsThreeVertical
                        size={18}
                        color="#7A7167"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.plusBtn}
                    >
                      <Plus
                        size={14}
                        color="#D88D07"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
                        <View style={styles.notesCard}>
              <View style={styles.sectionHead}>
                <Text style={styles.sectionTitle}>
                  Project Notes
                </Text>

                <TouchableOpacity style={styles.editBtn}>
                  <Text style={styles.editText}>
                    Edit Notes
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.noteText}>
                Warm palette preferred
              </Text>

              <Text style={styles.noteText}>
                Vendor shortlist pending
              </Text>
            </View>

            <View style={styles.activityCard}>
              <View style={styles.sectionHead}>
                <Text style={styles.sectionTitle}>
                  Recent Activity
                </Text>

                <TouchableOpacity
                  style={styles.viewAll}
                >
                  <Text style={styles.viewAllText}>
                    View All
                  </Text>

                  <ArrowRight
                    size={14}
                    color="#D88D07"
                  />
                </TouchableOpacity>
              </View>

              {[
                {
                  title: "Site survey completed",
                  by: "Arjun",
                  date: "20 May, 2025",
                  time: "11:30 AM",
                },
                {
                  title: "Concept designs uploaded",
                  by: "Meera",
                  date: "18 May, 2025",
                  time: "04:15 PM",
                },
                {
                  title: "Material list shared",
                  by: "Arjun",
                  date: "16 May, 2025",
                  time: "10:20 AM",
                },
              ].map((item, idx) => (
                <View
                  key={idx}
                  style={styles.activityItem}
                >
                  <View
                    style={styles.activityLeft}
                  >
                    <View
                      style={styles.activityIcon}
                    >
                      <Clock
                        size={14}
                        color="#D88D07"
                      />
                    </View>

                    <View>
                      <Text
                        style={
                          styles.activityTitle
                        }
                      >
                        {item.title}
                      </Text>

                      <Text
                        style={
                          styles.activityMeta
                        }
                      >
                        by {item.by} ·{" "}
                        {item.date}
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={styles.activityTime}
                  >
                    {item.time}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
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
    fontSize: 28,
    fontWeight: "800",
    color: "#1B1B1B",
    marginBottom: 14,
  },

  topTabs: {
    flexDirection: "row",
    marginBottom: 14,
  },

  activeTab: {
    backgroundColor: "#FFF7E7",
    borderWidth: 1,
    borderColor: "#E8D7BA",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
  },

  activeTabText: {
    color: "#1B1B1B",
    fontWeight: "700",
    fontSize: 12,
  },

  tab: {
    backgroundColor: "#FFFDF8",
    borderWidth: 1,
    borderColor: "#ECE2D3",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
  },

  tabText: {
    color: "#6D655B",
    fontWeight: "600",
    fontSize: 12,
  },

  workspaceCard: {
    backgroundColor: "#FFFDF8",
    borderRadius: 24,
    padding: 14,
    flexDirection: "row",
    shadowColor: "#B89B63",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  workspaceImage: {
    width: 94,
    height: 94,
    borderRadius: 16,
  },

  workspaceInfo: {
    flex: 1,
    marginLeft: 14,
  },

  workspaceTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1B1B1B",
    marginBottom: 8,
    paddingRight: 90,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  infoText: {
    marginLeft: 8,
    color: "#4F473E",
    fontSize: 13,
    flex: 1,
  },

  progressWrap: {
    position: "absolute",
    right: 0,
    top: 0,
  },

  progressCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 5,
    borderColor: "#D6A14A",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFDF8",
  },

  progressPct: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1B1B1B",
  },

  progressLabel: {
    fontSize: 9,
    color: "#7A7167",
    marginTop: 2,
  },

  unlockBtn: {
    marginTop: 14,
    backgroundColor: "#D88D07",
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
  },

  unlockText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },

  phoneCard: {
    marginTop: 14,
    backgroundColor: "#FFF3D9",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  phoneText: {
    marginLeft: 8,
    fontWeight: "700",
    color: "#1B1B1B",
  },

  sectionCard: {
    backgroundColor: "#FFFDF8",
    borderRadius: 22,
    padding: 14,
    marginTop: 16,
    shadowColor: "#B89B63",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  sectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1B1B1B",
  },

  addStageBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3D9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  addStageText: {
    marginLeft: 6,
    fontSize: 11,
    fontWeight: "700",
    color: "#D88D07",
  },

  stageCard: {
    backgroundColor: "#FFFCF6",
    borderRadius: 18,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  stageLeft: {
    flexDirection: "row",
    flex: 1,
  },

  stageNo: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F3E9D7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  stageNoText: {
    fontWeight: "800",
    color: "#5B5249",
  },

  stageTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },

  stageTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1B1B1B",
  },

  stageSub: {
    color: "#7A7167",
    fontSize: 11,
    marginTop: 4,
  },

  stageActions: {
    alignItems: "center",
  },

  plusBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFF3D9",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  notesCard: {
    backgroundColor: "#FFFDF8",
    borderRadius: 22,
    padding: 16,
    marginTop: 16,
  },

  editBtn: {
    backgroundColor: "#FFF3D9",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },

  editText: {
    color: "#D88D07",
    fontWeight: "700",
    fontSize: 11,
  },

  noteText: {
    fontSize: 13,
    color: "#3E3E3E",
    marginTop: 6,
  },

  activityCard: {
    backgroundColor: "#FFFDF8",
    borderRadius: 22,
    padding: 16,
    marginTop: 16,
    marginBottom: 30,
  },

  viewAll: {
    flexDirection: "row",
    alignItems: "center",
  },

  viewAllText: {
    color: "#D88D07",
    fontWeight: "700",
    fontSize: 12,
    marginRight: 5,
  },

  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2EBDD",
  },

  activityLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  activityIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFF3D9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  activityTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1B1B1B",
  },

  activityMeta: {
    fontSize: 11,
    color: "#8B8175",
    marginTop: 3,
  },

  activityTime: {
    fontSize: 11,
    color: "#8B8175",
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