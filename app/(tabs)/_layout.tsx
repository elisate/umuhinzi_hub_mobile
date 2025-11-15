import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { getThemeColors } from "../../constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // <-- 1. Import hook

export default function TabLayout() {
  const { currentTheme } = useTheme();
  const { bottom } = useSafeAreaInsets(); // <-- 2. Get bottom inset

  // 🧩 Ensure we always have a valid theme
  const safeTheme = currentTheme === "light" || currentTheme === "dark" ? currentTheme : "dark";
  const colors = getThemeColors(safeTheme);

  if (!colors) return null; // prevent rendering until ready

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          // --- 3. Apply inset to height and padding ---
          height: 60 + bottom, 
          paddingBottom: 5 + bottom,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="crops"
        options={{
          title: "My Crops",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="leaf-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}