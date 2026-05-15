import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
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
} from "phosphor-react-native";

import DashboardBackground from "../../components/DashboardBackground";

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

  const project = useMemo(() => {
    try {
      return params.project
        ? JSON.parse(params.project as string)
        : null;
    } catch {
      return null;
    }
  }, [params.project]);

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
    {
      no: 3,
      title: "Design Planning",
      sub: "Awaiting planning stage.",
      status: "Pending",
      color: "#D88D07",
      bg: "#FFF3D9",
    },
    {
      no: 4,
      title: "Execution",
      sub: "Execution not started.",
      status: "Pending",
      color: "#D88D07",
      bg: "#FFF3D9",
    },
    {
      no: 5,
      title: "Final Delivery",
      sub: "Final handover pending.",
      status: "Pending",
      color: "#D88D07",
      bg: "#FFF3D9",
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <DashboardBackground />

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

            <Text style={styles.subHeading}>
              Manage accepted project workflow
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
                  <Buildings size={14} color="#1B1B1B" />
                  <Text style={styles.infoText}>
                    {project.bhk || "Interior"}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <MapPin size={14} color="#1B1B1B" />
                  <Text style={styles.infoText}>
                    {location}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <CalendarBlank
                    size={14}
                    color="#1B1B1B"
                  />
                  <Text style={styles.infoText}>
                    Accepted: {acceptedDate}
                  </Text>
                </View>
              </View>

              <View style={styles.progressWrap}>
                <Text style={styles.progressNum}>
                  35%
                </Text>
                <Text style={styles.progressLbl}>
                  Progress
                </Text>
              </View>
            </View>

            <View style={styles.stageCard}>
              <View style={styles.stageHeader}>
                <Text style={styles.sectionTitle}>
                  Project Stages
                </Text>

                <TouchableOpacity style={styles.addBtn}>
                  <Plus size={14} color="#D88D07" />
                  <Text style={styles.addText}>
                    Add Stage
                  </Text>
                </TouchableOpacity>
              </View>
                            {stages.map((stage) => (
                <View key={stage.no}>
                  <View style={styles.stageRow}>
                    <View style={styles.stageNo}>
                      <Text style={styles.stageNoText}>
                        {stage.no}
                      </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <View style={styles.stageTitleRow}>
                        <Text style={styles.stageTitle}>
                          {stage.title}
                        </Text>

                        <StageBadge
                          text={stage.status}
                          color={stage.color}
                          bg={stage.bg}
                        />
                      </View>

                      <Text style={styles.stageSub}>
                        {stage.sub}
                      </Text>
                    </View>

                    <TouchableOpacity>
                      <DotsThreeVertical
                        size={18}
                        color="#6D655B"
                      />
                    </TouchableOpacity>
                  </View>

                  {stage.no !== stages.length && (
                    <View style={styles.stageDivider} />
                  )}
                </View>
              ))}
            </View>

            <View style={styles.noteCard}>
              <View style={styles.noteHeader}>
                <View style={styles.noteTitleRow}>
                  <NotePencil size={18} color="#D88D07" />
                  <Text style={styles.sectionTitle}>
                    Project Notes
                  </Text>
                </View>
              </View>

              <Text style={styles.noteText}>
                Client accepted the opportunity.{"\n"}
                Workspace initialized for execution tracking.
              </Text>
            </View>

            <View style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <View style={styles.noteTitleRow}>
                  <Clock size={18} color="#D88D07" />
                  <Text style={styles.sectionTitle}>
                    Recent Activity
                  </Text>
                </View>
              </View>

              <View style={styles.activityRow}>
                <View style={styles.activityDot} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.activityTitle}>
                    Opportunity accepted
                  </Text>
                  <Text style={styles.activitySub}>
                    {acceptedDate}
                  </Text>
                </View>
              </View>

              <View style={styles.activityDivider} />

              <View style={styles.activityRow}>
                <View style={styles.activityDot} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.activityTitle}>
                    Workspace created
                  </Text>
                  <Text style={styles.activitySub}>
                    Tracking enabled
                  </Text>
                </View>
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
  },

  subHeading: {
    fontSize: 13,
    color: "#7A7167",
    marginTop: 6,
  },

  heroCard: {
    marginTop: 18,
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
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  infoText: {
    marginLeft: 8,
    fontSize: 12,
    color: "#4F473E",
    flex: 1,
  },

  progressWrap: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 4,
    borderColor: "#D88D07",
    backgroundColor: "#FFF3D9",
    alignItems: "center",
    justifyContent: "center",
  },

  progressNum: {
    fontSize: 16,
    fontWeight: "800",
    color: "#D88D07",
  },

  progressLbl: {
    fontSize: 10,
    color: "#7A7167",
    marginTop: 2,
  },

  stageCard: {
    marginTop: 18,
    backgroundColor: "#FFFDF8",
    borderRadius: 24,
    padding: 16,
    shadowColor: "#B89B63",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  stageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1B1B1B",
  },

  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3D9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },

  addText: {
    marginLeft: 6,
    color: "#D88D07",
    fontWeight: "700",
    fontSize: 12,
  },

  stageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 14,
  },

  stageNo: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFF1DA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  stageNoText: {
    fontWeight: "800",
    color: "#D88D07",
  },

  stageTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  stageTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1B1B1B",
    flex: 1,
  },

  stageSub: {
    marginTop: 6,
    fontSize: 12,
    color: "#6D655B",
    lineHeight: 18,
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

  stageDivider: {
    height: 1,
    backgroundColor: "#F0E4CC",
  },

  noteCard: {
    marginTop: 18,
    backgroundColor: "#FFFDF8",
    borderRadius: 24,
    padding: 16,
    shadowColor: "#B89B63",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  noteHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  noteTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  noteText: {
    marginTop: 14,
    fontSize: 13,
    color: "#4F473E",
    lineHeight: 22,
  },

  activityCard: {
    marginTop: 18,
    backgroundColor: "#FFFDF8",
    borderRadius: 24,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#B89B63",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  activityHeader: {
    marginBottom: 12,
  },

  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },

  activityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#D88D07",
  },

  activityTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1B1B1B",
  },

  activitySub: {
    marginTop: 4,
    fontSize: 11,
    color: "#6D655B",
  },

  activityDivider: {
    height: 1,
    backgroundColor: "#F0E4CC",
  },
});