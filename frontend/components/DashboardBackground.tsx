import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// Light dashboard background — soft cream with subtle peach blob top-right.
// Used for ALL signed-in screens (Associate / Designer / Client tabs).
export default function DashboardBackground({ children }: { children?: React.ReactNode }) {
  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={["#FFFBF2", "#FFF6E5", "#FFFBF2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.blobTop} />
      <View style={styles.blobBot} />
      {children}
    </View>
  );
}
const styles = StyleSheet.create({
  blobTop: {
    position: "absolute",
    top: -110,
    right: -90,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#F4DDB4",
    opacity: 0.55,
  },
  blobBot: {
    position: "absolute",
    bottom: -130,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#F6E3B8",
    opacity: 0.45,
  },
});
