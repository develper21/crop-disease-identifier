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
import { signUp, signIn } from "../services/authService";

export default function SignUpScreen({ navigation }: any) {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [agreed, setAgreed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

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

    const { error: signUpError } = await signUp(email, password, fullName);
    if (signUpError) {
      setLoading(false);
      Alert.alert("Sign Up Failed", signUpError.message);
      return;
    }

    await new Promise((res) => setTimeout(res, 1500));

    const { error: signInError } = await signIn(email, password);
    setLoading(false);

    if (signInError) {
      Alert.alert("Login Failed", "Please try logging in manually.");
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    }
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* 🌿 Logo with white rounded rectangle background */}
          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Image
                source={require("../../assets/crop-logo.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>

          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>आपका स्वागत है</Text>
          <Text style={styles.subtitle}>
            Create your account to start farming smart
          </Text>

          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <FontAwesome
                name="user-o"
                size={20}
                color="#6a8864"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#A9A9A9"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome
                name="envelope-o"
                size={20}
                color="#6a8864"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#A9A9A9"
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
                color="#6a8864"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#A9A9A9"
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
                  color="#6a8864"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.checkboxRow}>
              <TouchableOpacity onPress={() => setAgreed(!agreed)}>
                <FontAwesome
                  name={agreed ? "check-square" : "square-o"}
                  size={24}
                  color={agreed ? "#2e8b57" : "#A9A9A9"}
                />
              </TouchableOpacity>
              <Text style={styles.checkboxText}>
                I agree to the <Text style={styles.link}>Terms of Service</Text>{" "}
                and <Text style={styles.link}>Privacy Policy</Text>
              </Text>
            </View>

            <TouchableOpacity
              style={styles.createAccountButton}
              onPress={handleSignUp}
              disabled={loading}
            >
              <Text style={styles.createAccountButtonText}>
                {loading ? "Creating..." : "Create Account"}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Text
              style={styles.loginLink}
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
  container: { flex: 1, backgroundColor: "#f0fff4" },
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
    backgroundColor: "white",
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
  title: { fontSize: 28, fontWeight: "bold", color: "#1f4029", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#507a50", marginBottom: 20, textAlign: "center" },
  card: {
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "#f7faf7",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#cfe8cf",
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 50, fontSize: 16, color: "#1f4029" },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 5,
  },
  checkboxText: { marginLeft: 10, fontSize: 13, color: "#507a50", flexShrink: 1 },
  link: { color: "#2e8b57", fontWeight: "bold" },
  createAccountButton: {
    backgroundColor: "#2e8b57",
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: "center",
  },
  createAccountButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginText: { marginTop: 25, fontSize: 14, color: "#507a50" },
  loginLink: { color: "#2e8b57", fontWeight: "bold" },
});
