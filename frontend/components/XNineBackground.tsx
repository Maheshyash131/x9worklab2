import React from "react";
import { ImageBackground, View, StyleSheet } from "react-native";

// User-provided brand background (warm cream + peach blobs + faint architectural sketch)
const BG_URI =
  "https://customer-assets.emergentagent.com/job_client-connect-hub-4/artifacts/ikg5642x_image.png";

export default function XNineBackground({ children }: { children?: React.ReactNode }) {
  return (
    <ImageBackground
      source={{ uri: BG_URI }}
      resizeMode="cover"
      style={StyleSheet.absoluteFill}
      imageStyle={{ opacity: 0.95 }}
    >
      {/* very soft cream wash so foreground text reads cleanly */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(255,248,236,0.45)" }]} />
      {children}
    </ImageBackground>
  );
}
