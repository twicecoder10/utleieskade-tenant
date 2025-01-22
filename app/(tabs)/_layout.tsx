import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuth } from "@/hooks/useAuth";
import { StatusBar } from "expo-status-bar";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#2387D4",
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: "absolute",
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Ionicons name="home-outline" size={28} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="report"
          options={{
            title: "Report & Track",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="radar" size={28} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="messages"
          options={{
            title: "Messages",
            tabBarIcon: ({ color }) => (
              <FontAwesome name="envelope-o" size={28} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color }) => (
              <Ionicons name="settings-outline" size={28} color={color} />
            ),
          }}
        />
      </Tabs>

      <StatusBar style="light" />
    </>
  );
}

