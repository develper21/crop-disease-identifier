import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
} from "react-native";
import { LogOut, Globe, Info, Bell, SunMoon } from "lucide-react-native";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { signOut } from "../services/authService";

export default function SettingsScreen({ navigation }: any) {
  const { user } = useAuth();
  const { language, setLanguage, theme, setTheme, colors } = useApp();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  async function handleSignOut() {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  }

  function toggleLanguage() {
    setLanguage(language === "hi" ? "en" : "hi");
  }

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  function openAbout() {
    navigation.navigate("About");
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Settings</Text>
        {user?.email && <Text style={styles.userEmail}>{user.email}</Text>}
      </View>

      {/* Language */}
      <TouchableOpacity
        style={[styles.menuItem, { backgroundColor: colors.surface }]}
        onPress={toggleLanguage}
      >
        <View style={styles.menuItemLeft}>
          <Globe size={22} color={colors.primary} style={styles.icon} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>
            Language
          </Text>
        </View>
        <Text style={[styles.menuItemValue, { color: colors.textSecondary }]}>
          {language === "hi" ? "हिंदी" : "English"}
        </Text>
      </TouchableOpacity>

      {/* Theme */}
      <View style={[styles.menuItem, { backgroundColor: colors.surface }]}>
        <View style={styles.menuItemLeft}>
          <SunMoon size={22} color={colors.primary} style={styles.icon} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>Theme</Text>
        </View>
        <Switch value={theme === "dark"} onValueChange={toggleTheme} />
      </View>

      {/* Notifications */}
      <View style={[styles.menuItem, { backgroundColor: colors.surface }]}>
        <View style={styles.menuItemLeft}>
          <Bell size={22} color={colors.primary} style={styles.icon} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>
            Notifications
          </Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
      </View>

      {/* About */}
      <TouchableOpacity
        style={[styles.menuItem, { backgroundColor: colors.surface }]}
        onPress={openAbout}
      >
        <View style={styles.menuItemLeft}>
          <Info size={22} color={colors.primary} style={styles.icon} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>About</Text>
        </View>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity
        style={[
          styles.logoutButton,
          { borderColor: "#2E7D32", backgroundColor: colors.surface },
        ]}
        onPress={handleSignOut}
      >
        {/* wrapped children in a View to avoid accidental text nodes */}
        <View style={styles.logoutInner}>
          <LogOut size={22} color="#2E7D32" style={styles.icon} />
          <Text style={[styles.logoutText, { color: "#2E7D32" }]}>Logout</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: "#2E7D32",
    paddingVertical: 35,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginBottom: 25,
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
  },
  userEmail: {
    fontSize: 14,
    color: "#b0ffb0",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
  },
  menuItemValue: {
    fontSize: 15,
  },
  logoutButton: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 32,
    marginHorizontal: 16,
  },
  logoutInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
