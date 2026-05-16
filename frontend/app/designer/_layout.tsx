import React from "react";
import { Tabs } from "expo-router";
import {
  House,
  Briefcase,
  ClipboardText,
  User,
} from "phosphor-react-native";

export default function DesignerLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#D88D07",
        tabBarInactiveTintColor: "#9E8E76",
       tabBarStyle: {
  position: "absolute",
  left: 16,
  right: 16,
  bottom: 0,
  height: 72,
  paddingBottom: 8,
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
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <House size={size} color={color} weight="fill" />
          ),
        }}
      />

      <Tabs.Screen
        name="opportunities"
        options={{
          title: "Opportunities",
          tabBarIcon: ({ color, size }) => (
            <ClipboardText size={size} color={color} weight="fill" />
          ),
        }}
      />

      <Tabs.Screen
        name="projects"
        options={{
          title: "Projects",
          tabBarIcon: ({ color, size }) => (
            <Briefcase size={size} color={color} weight="fill" />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} weight="fill" />
          ),
        }}
      />

      <Tabs.Screen
        name="project-workspace"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}