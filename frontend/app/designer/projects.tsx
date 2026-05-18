import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Image,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Briefcase,
  CalendarBlank,
  Buildings,
  MapPin,
} from "phosphor-react-native";

import { api } from "../../lib/api";
import DashboardBackground from "../../components/DashboardBackground";

const IMGS = [
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=70",
  "https://images.unsplash.com/photo-1556909114-44e3e9399a2b?auto=format&fit=crop&w=400&q=70",
];

export default function Projects() {
  const [feed, setFeed] = useState<{
    referrals: any[];
    consultations: any[];
  }>({
    referrals: [],
    consultations: [],
  });

  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api("/designer/feed");
      setFeed(data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const acceptedProjects = [
  ...(feed.referrals || []).map((r) => ({
    ...r,
    _name: r.client_name,
    type: "referral",
  })),

  ...(feed.consultations || []).map((c) => ({
    ...c,
    _name: c.name,
    type: "consultation",
  })),
]
  .filter(
    (item) =>
      item.status === "accepted" &&
      item.designer_id
  )
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    );

  return (
    <View style={{ flex: 1, paddingTop: 20 }}>
      <DashboardBackground />

      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              tintColor="#D88D07"
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <View style={styles.container}>
            <Text style={styles.h1}>Projects</Text>
            <View style={styles.accent} />
            <Text style={styles.sub}>
              All accepted active projects
            </Text>

            {acceptedProjects.length === 0 ? (
              <View style={styles.empty}>
                <Briefcase size={38} color="#D88D07" />

                <Text style={styles.emptyTitle}>
                  No accepted projects yet
                </Text>

                <Text style={styles.emptySub}>
                  Accept a lead from Opportunities to begin working.
                </Text>
              </View>
            ) : (
              acceptedProjects.map((project, i) => (
                <TouchableOpacity
                  key={project.referral_id}
                  activeOpacity={0.92}
                  style={styles.card}
                  onPress={() =>
                    router.push({
                      pathname: "/designer/project-workspace",
                      params: {
                        project: JSON.stringify(project),
                        image: IMGS[i % IMGS.length],
                      },
                    })
                  }
                >
                  <Image
                    source={{ uri: IMGS[i % IMGS.length] }}
                    style={styles.img}
                  />

                  <View style={styles.body}>
                    <Text style={styles.title}>
                      {project.property_name ||
                        project.bhk ||
                        "Interior Project"}
                    </Text>

                    <View style={styles.row}>
                      <Buildings size={14} color="#D88D07" />
                      <Text style={styles.meta}>
                        {project._name || "Client"}
                      </Text>
                    </View>

                    <View style={[styles.row, { marginTop: 5 }]}>
                      <MapPin size={14} color="#D88D07" />
                      <Text style={styles.meta}>
                        {project.location || "Location unavailable"}
                      </Text>
                    </View>

                    <View style={[styles.row, { marginTop: 7 }]}>
                      <CalendarBlank
                        size={14}
                        color="#9A8E80"
                      />
                      <Text
                        style={[
                          styles.meta,
                          { color: "#9A8E80" },
                        ]}
                      >
                        Accepted{" "}
                        {new Date(
                          project.created_at
                        ).toLocaleDateString("en-IN")}
                      </Text>
                    </View>

                    <View style={styles.bar}>
                      <View
                        style={[
                          styles.fill,
                          { width: "35%" },
                        ]}
                      />
                    </View>

                    <Text style={styles.pct}>
                      Project initialized
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  h1: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1B1B1B",
  },

  sub: {
    fontSize: 13,
    color: "#7A7167",
    marginTop: 8,
  },

  accent: {
    width: 56,
    height: 4,
    backgroundColor: "#D88D07",
    borderRadius: 4,
    marginTop: 8,
  },

  empty: {
    padding: 36,
    marginTop: 20,
    alignItems: "center",
    borderRadius: 24,
    backgroundColor: "rgba(255,253,248,0.82)",
  },

  emptyTitle: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: "800",
    color: "#1B1B1B",
  },

  emptySub: {
    marginTop: 10,
    textAlign: "center",
    color: "#7A7167",
    lineHeight: 22,
    fontSize: 13,
  },

  card: {
    backgroundColor: "#FFFDF8",
    borderRadius: 24,
    marginTop: 16,
    overflow: "hidden",
    flexDirection: "row",
    shadowColor: "#B89B63",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  img: {
    width: 110,
    height: 145,
  },

  body: {
    flex: 1,
    padding: 14,
  },

  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1B1B1B",
    marginBottom: 8,
  },

  meta: {
    marginLeft: 6,
    color: "#3E3E3E",
    fontSize: 12,
    flex: 1,
  },

  bar: {
    height: 5,
    backgroundColor: "#F0E4CC",
    borderRadius: 999,
    marginTop: 12,
    overflow: "hidden",
  },

  fill: {
    height: "100%",
    backgroundColor: "#D88D07",
  },

  pct: {
    color: "#9A8E80",
    fontSize: 11,
    marginTop: 6,
    fontWeight: "600",
  },
});