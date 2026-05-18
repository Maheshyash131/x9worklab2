import React from "react";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import {
  House,
  Sparkle,
  UserCircle,
} from "phosphor-react-native";

const ACTIVE = "#D88D07";
const INACTIVE = "#9E8E76";

export default function SingleLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: ACTIVE,
        tabBarInactiveTintColor: INACTIVE,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: -2,
        },
       tabBarStyle: {
  position: "absolute",
  left: 16,
  right: 16,
  bottom: 2,
  height: 72,
  paddingTop: 8,
  backgroundColor: "#FFFDF8",
  borderTopWidth: 0,
  borderRadius: 24,
  elevation: 10,

  shadowColor: "#B89B63",
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.15,
  shadowRadius: 16,
},
      }}
    >
      {/* 1. Dashboard */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, focused }) => (
            <House
              size={24}
              color={color}
              weight={focused ? "fill" : "regular"}
            />
          ),
        }}
      />

      {/* 2. Consult */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Connect",
          tabBarIcon: ({ color, focused }) => (
            <Sparkle
              size={24}
              color={color}
              weight={focused ? "fill" : "regular"}
            />
          ),
        }}
      />

      {/* 3. Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <UserCircle
              size={24}
              color={color}
              weight={focused ? "fill" : "regular"}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 10,
    height: 74,
    borderRadius: 24,
    backgroundColor: "#FFFDF8",
    borderTopWidth: 0,
    paddingBottom: 10,
    paddingTop: 8,
    shadowColor: "#B89B63",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
});