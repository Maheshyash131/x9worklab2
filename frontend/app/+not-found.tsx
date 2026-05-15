import React from "react";
import { View, ActivityIndicator, Text } from "react-native";
import XNineBackground from "../components/DashboardBackground";

export default function NotFound() {
  return (
    <View style={{ flex: 1 }}>
      <XNineBackground />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.92)",
            paddingHorizontal: 28,
            paddingVertical: 22,
            borderRadius: 24,
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#D88D07" />
          <Text
            style={{
              marginTop: 14,
              fontSize: 16,
              fontWeight: "700",
              color: "#B57B10",
            }}
          >
            Loading...
          </Text>
        </View>
      </View>
    </View>
  );
}