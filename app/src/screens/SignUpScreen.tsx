import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";

export default function SignUpScreen({ navigation }: any) {
  const { colors } = useApp();
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [agreed, setAgreed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { signUp, signIn } = useAuth();

  async function handleSignUp() {
    if (!fullName || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    if (!agreed) {
      Alert.alert(
        "Error",
        "You must agree to the Terms of Service and Privacy Policy"
      );
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, fullName);
      // Navigation will be handled by AuthContext state change
    } catch (error: any) {
      setLoading(false);
      Alert.alert("Sign Up Failed", error.message);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* 🌿 Logo with white rounded rectangle background */}
          <View style={styles.logoContainer}>
            <View style={[styles.logoBackground, { backgroundColor: colors.surface }]}>
              <Image
                source={require("../../assets/crop-logo.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>

          <Text style={[styles.title, { color: colors.text }]}>Welcome</Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>आपका स्वागत है</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Create your account to start farming smart
          </Text>

          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <View style={styles.inputContainer}>
              <FontAwesome
                name="user-o"
                size={20}
                color={colors.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Full Name"
                placeholderTextColor={colors.textSecondary}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome
                name="envelope-o"
                size={20}
                color={colors.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Email Address"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome
                name="lock"
                size={20}
                color={colors.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Password"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <FontAwesome
                  name={isPasswordVisible ? "eye-slash" : "eye"}
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.checkboxRow}>
              <TouchableOpacity onPress={() => setAgreed(!agreed)}>
                <FontAwesome
                  name={agreed ? "check-square" : "square-o"}
                  size={24}
                  color={agreed ? colors.primary : colors.textSecondary}
                />
              </TouchableOpacity>
              <Text style={[styles.checkboxText, { color: colors.textSecondary }]}>
                I agree to the <Text style={[styles.link, { color: colors.primary }]}>Terms of Service</Text>{" "}
                and <Text style={[styles.link, { color: colors.primary }]}>Privacy Policy</Text>
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.createAccountButton, { backgroundColor: colors.primary }]}
              onPress={handleSignUp}
              disabled={loading}
            >
              <Text style={styles.createAccountButtonText}>
                {loading ? "Creating..." : "Create Account"}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.loginText, { color: colors.textSecondary }]}>
            Already have an account?{" "}
            <Text
              style={[styles.loginLink, { color: colors.primary }]}
              onPress={() => navigation.navigate("SignIn")}
            >
              Login
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoBackground: {
    borderRadius: 50,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  logoImage: {
    width: 85,
    height: 85,
    borderRadius: 20,
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 20, textAlign: "center" },
  card: {
    borderRadius: 25,
    padding: 25,
    width: "100%",
    elevation: 8,
    shadowColor: "#a3d9a5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 50, fontSize: 16 },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 5,
  },
  checkboxText: { marginLeft: 10, fontSize: 13, flexShrink: 1 },
  link: { fontWeight: "bold" },
  createAccountButton: {
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: "center",
  },
  createAccountButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginText: {
    marginTop: 20,
    fontSize: 14,
    textAlign: "center",
  },
  loginLink: {
    fontWeight: "bold",
  },
});
