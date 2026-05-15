import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Animated,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  ShieldCheck,
  Briefcase,
  TrendUp,
  UserCircle,
  Sparkle,
  ArrowRight,
  User,
} from "phosphor-react-native";
import DashboardBackground from "../components/DashboardBackground";

function FloatingAvatar({
  delay,
  left,
}: {
  delay: number;
  left: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <Animated.View
      style={[
        styles.avatarBubble,
        {
          left,
          transform: [{ translateY }],
        },
      ]}
    >
      <User size={18} color="#B87413" weight="fill" />
    </Animated.View>
  );
}

function FeatureCard({
  icon,
  title,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <View style={styles.featureCard}>
      <View style={styles.iconWrap}>{icon}</View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureSub}>{sub}</Text>
    </View>
  );
}

export default function DesignerPortalIntro() {
  return (
    <View style={{ flex: 1 }}>
      <DashboardBackground />

      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View style={styles.container}>
            {/* <Text style={styles.logo}>XNine</Text> */}

            <View style={styles.pill}>
              <Text style={styles.pillText}>DESIGNER ACCESS PORTAL</Text>
            </View>

            <Text style={styles.welcome}>Welcome to</Text>

            <Text style={styles.portal}>
              Designer <Text style={styles.portalAccent}>Portal</Text>
            </Text>

            <View style={styles.dividerRow}>
              <View style={styles.line} />
              <Sparkle size={14} color="#C88A2C" weight="fill" />
              <View style={styles.line} />
            </View>

            <Text style={styles.subtitle}>
              Connect with verified project opportunities and grow your design
              career with XNine.
            </Text>

            <View style={styles.featuresGrid}>
              <FeatureCard
                icon={<ShieldCheck size={24} color="#C88A2C" />}
                title="Verified Leads"
                sub="Access verified client inquiries"
              />

              <FeatureCard
                icon={<Briefcase size={24} color="#C88A2C" />}
                title="Quality Projects"
                sub="Premium architecture & interiors"
              />

              <FeatureCard
                icon={<TrendUp size={24} color="#C88A2C" />}
                title="Grow Faster"
                sub="Tools and insights to scale"
              />

              <FeatureCard
                icon={<UserCircle size={24} color="#C88A2C" />}
                title="Build Presence"
                sub="Showcase your portfolio"
              />
            </View>

            <View style={styles.communityCard}>
              <View style={styles.communityLeft}>
                <View style={styles.communityIcon}>
                  <Sparkle size={20} color="#C88A2C" weight="fill" />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.communityTitle}>
                    Exclusive Community
                  </Text>
                  <Text style={styles.communitySub}>
                    Join a network of talented designers and architects.
                  </Text>
                </View>
              </View>

              <View style={styles.communityRight}>
                <View style={styles.avatarRow}>
                  <FloatingAvatar delay={0} left={0} />
                  <FloatingAvatar delay={400} left={22} />
                  <FloatingAvatar delay={800} left={44} />
                </View>

                <Text style={styles.communityCount}>500+ Designers</Text>
                <Text style={styles.communityJoined}>Already joined</Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push("/designer-registration")}
              style={styles.shadowBtn}
            >
              <LinearGradient
                colors={["#E8A743", "#B87413"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.btnGrad}
              >
                <Text style={styles.btnText}>Get Started</Text>
                <ArrowRight size={22} color="#fff" weight="bold" />
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footer}>
              <ShieldCheck size={14} color="#B87413" />
              <Text style={styles.footerText}>
                Secure • Trusted • Professional
              </Text>
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
    paddingTop: 24,
    alignItems: "center",
  },

  logo: {
    fontSize: 54,
    fontWeight: "200",
    color: "#8D6230",
    letterSpacing: -1,
    marginTop: 18,
  },

  pill: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#D8B37A",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.45)",
  },

  pillText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#B87413",
    letterSpacing: 1.4,
  },

  welcome: {
    fontSize: 22,
    fontWeight: "600",
    color: "#262626",
    marginTop: 24,
  },

  portal: {
    fontSize: 42,
    fontWeight: "800",
    color: "#2B2B2B",
    textAlign: "center",
    marginTop: 4,
  },

  portalAccent: {
    color: "#C88A2C",
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    gap: 10,
  },

  line: {
    width: 70,
    height: 1,
    backgroundColor: "#D9BE94",
  },

  subtitle: {
    marginTop: 16,
    textAlign: "center",
    color: "#5E564D",
    fontSize: 15,
    lineHeight: 24,
    paddingHorizontal: 10,
  },

  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 26,
    width: "100%",
  },

  featureCard: {
    width: "48%",
    backgroundColor: "rgba(255,253,248,0.92)",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    minHeight: 150,
    shadowColor: "#B89B63",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFF1DA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  featureTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1F1F1F",
  },

  featureSub: {
    fontSize: 12,
    color: "#72685C",
    lineHeight: 18,
    marginTop: 8,
  },

  communityCard: {
    width: "100%",
    backgroundColor: "rgba(255,253,248,0.96)",
    borderRadius: 22,
    padding: 18,
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#B89B63",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  communityLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 12,
  },

  communityIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFF1DA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  communityTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1F1F1F",
  },

  communitySub: {
    fontSize: 11,
    color: "#72685C",
    marginTop: 6,
    lineHeight: 16,
  },

  communityRight: {
    width: 110,
    alignItems: "center",
    borderLeftWidth: 1,
    borderLeftColor: "#E9D7B9",
    paddingLeft: 12,
  },

  avatarRow: {
    width: 70,
    height: 34,
    position: "relative",
    marginBottom: 10,
  },

  avatarBubble: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#F0D9B3",
    alignItems: "center",
    justifyContent: "center",
  },

  communityCount: {
    fontSize: 13,
    fontWeight: "800",
    color: "#C88A2C",
  },

  communityJoined: {
    fontSize: 10,
    color: "#72685C",
    marginTop: 4,
  },

  shadowBtn: {
    width: "100%",
    marginTop: 28,
    borderRadius: 999,
    overflow: "hidden",
    shadowColor: "#C88A2C",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.24,
    shadowRadius: 14,
    elevation: 5,
  },

  btnGrad: {
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 20,
  },

  footerText: {
    marginLeft: 8,
    color: "#72685C",
    fontSize: 12,
    fontWeight: "500",
  },
});