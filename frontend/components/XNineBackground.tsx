import React from "react";
import { ImageBackground, View, StyleSheet } from "react-native";

// Local background image
const BG_IMAGE = require("../assets/images/bg.png");

export default function XNineBackground({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <ImageBackground
      source={BG_IMAGE}
      resizeMode="cover"
      style={StyleSheet.absoluteFill}
      imageStyle={{ opacity: 0.95 }}
    >
      {/* very soft cream wash so foreground text reads cleanly */}
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: "rgba(255,248,236,0.45)" },
        ]}
      />
      {children}
    </ImageBackground>
  );
}