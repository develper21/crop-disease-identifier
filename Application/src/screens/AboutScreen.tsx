import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { useApp } from "../context/AppContext";
import { FileText, Shield, Cpu, Zap, Stethoscope, WifiOff } from "lucide-react-native";

export default function AboutScreen() {
  const app = useApp();
  const colors = app?.colors ? {
    background: "#fff",
    text: "#000",
    textSecondary: "#444",
    primary: "#1e90ff",
    surface: "#f4f4f4",
  } : {
    background: "#fff",
    text: "#000",
    textSecondary: "#444",
    primary: "#1e90ff",
    surface: "#f4f4f4",
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Logo + Title */}
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Cpu size={32} color={colors.primary} />
        </View>
        <Text style={[styles.appName, { color: colors.text }]}>CropGuard</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Identify crop diseases instantly
        </Text>
      </View>

      {/* Version / Credits / Contact */}
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.rowBetween}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Version</Text>
          <Text style={[styles.cardValue, { color: colors.textSecondary }]}>v1.0.0</Text>
        </View>

        <Text style={[styles.smallText, { color: colors.textSecondary, marginTop: 12 }]}>
          Developer Credits{"\n"}Made for Hackathon by Mark 85
        </Text>

        <TouchableOpacity
          onPress={() => Linking.openURL("mailto:support@cropguard.com")}
          style={{ marginTop: 12 }}
        >
          <Text style={[styles.linkText, { color: colors.primary }]}>
            support@cropguard.com
          </Text>
        </TouchableOpacity>
      </View>

      {/* Privacy + Terms */}
      <TouchableOpacity style={[styles.listItem, { backgroundColor: colors.surface }]}>
        <FileText size={20} color={colors.primary} />
        <Text style={[styles.listText, { color: colors.text }]}>Privacy Policy</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.listItem, { backgroundColor: colors.surface }]}>
        <Shield size={20} color={colors.primary} />
        <Text style={[styles.listText, { color: colors.text }]}>Terms & Conditions</Text>
      </TouchableOpacity>

      {/* Features */}
      <View style={[styles.featuresCard, { backgroundColor: colors.surface + "55" }]}>
        <Text style={[styles.featureHeader, { color: colors.text }]}>Key Features</Text>

        <View style={styles.featureItem}>
          <Cpu size={18} color={colors.primary} />
          <Text style={[styles.featureText, { color: colors.text }]}>
            AI-Powered Disease Detection
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Zap size={18} color={colors.primary} />
          <Text style={[styles.featureText, { color: colors.text }]}>
            Instant Results
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Stethoscope size={18} color={colors.primary} />
          <Text style={[styles.featureText, { color: colors.text }]}>
            Treatment Recommendations
          </Text>
        </View>

        <View style={styles.featureItem}>
          <WifiOff size={18} color={colors.primary} />
          <Text style={[styles.featureText, { color: colors.text }]}>
            Offline Capability
          </Text>
        </View>
      </View>

      {/* Footer */}
      <Text style={[styles.footer, { color: colors.textSecondary }]}>
        © 2025 CropGuard. All rights reserved.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40, // 👈 Yaha se neeche shift ho jayega
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#E6F7EE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  appName: {
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardValue: {
    fontSize: 15,
  },
  smallText: {
    fontSize: 14,
    lineHeight: 20,
  },
  linkText: {
    fontSize: 15,
    fontWeight: "500",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  listText: {
    fontSize: 15,
  },
  featuresCard: {
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  featureHeader: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  featureText: {
    fontSize: 14,
  },
  footer: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 20,
  },
});
