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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import { signUp, signIn } from "../services/authService";

export default function SignUpScreen({ navigation }: any) {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [agreed, setAgreed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSignUp() {
    if (!fullName || !email || !password || !phoneNumber) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    if (!agreed) {
      Alert.alert("Error", "You must agree to the Terms of Service and Privacy Policy");
      return;
    }

    setLoading(true);

    // 1️⃣ Sign up
    const { error: signUpError } = await signUp(email, password, fullName);
    if (signUpError) {
      setLoading(false);
      Alert.alert("Sign Up Failed", signUpError.message);
      return;
    }

    // 2️⃣ Safe auto-login with slight delay
    await new Promise(res => setTimeout(res, 1500)); // 1.5 seconds delay

    const { error: signInError } = await signIn(email, password);
    setLoading(false);

    if (signInError) {
      Alert.alert("Login Failed", "Please try logging in manually.");
    } else {
      // Navigate directly to Home/Main App screen
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }], // Replace "Home" with your main app screen
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
          <LinearGradient colors={['#A38CFF', '#6B4EFF']} style={styles.iconCircle}>
            <FontAwesome name="rocket" size={30} color="#FFFFFF" />
          </LinearGradient>

          <Text style={styles.title}>Welcome</Text>
           <Text style={styles.subtitle}>स्वागत है</Text>
          <Text style={styles.subtitle}>Create your account to get started</Text>

          <View style={styles.card}>
            <View style={styles.inputContainer}>
              <FontAwesome name="user-o" size={20} color="#A9A9A9" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#A9A9A9"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome name="envelope-o" size={20} color="#A9A9A9" style={styles.inputIcon} />
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
              <FontAwesome name="phone" size={20} color="#A9A9A9" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#A9A9A9"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome name="lock" size={20} color="#A9A9A9" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#A9A9A9"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                <FontAwesome name={isPasswordVisible ? "eye-slash" : "eye"} size={20} color="#A9A9A9" />
              </TouchableOpacity>
            </View>

            <View style={styles.checkboxRow}>
              <TouchableOpacity onPress={() => setAgreed(!agreed)}>
                <FontAwesome
                  name={agreed ? "check-square" : "square-o"}
                  size={24}
                  color={agreed ? "#6B4EFF" : "#A9A9A9"}
                />
              </TouchableOpacity>
              <Text style={styles.checkboxText}>
                I agree to the <Text style={styles.link}>Terms of Service</Text> and <Text style={styles.link}>Privacy Policy</Text>
              </Text>
            </View>

            <TouchableOpacity style={styles.createAccountButton} onPress={handleSignUp} disabled={loading}>
              <Text style={styles.createAccountButtonText}>
                {loading ? "Creating..." : "Create Account"}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.loginLink} onPress={() => navigation.navigate("SignIn")}>
              Login
            </Text>
          </Text>

          <Text style={styles.orText}>Or continue with</Text>

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="google" size={22} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="apple" size={22} color="#000000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="facebook" size={22} color="#1877F2" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F8FF' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 20, elevation: 10, shadowColor: '#6B4EFF' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#888', marginBottom: 25 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 25, padding: 25, width: '100%', elevation: 8, shadowColor: '#B0A8F2', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F7F7F7', borderRadius: 15, borderWidth: 1, borderColor: '#E8E8E8', paddingHorizontal: 15, marginBottom: 15 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 50, fontSize: 16, color: '#333' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 5 },
  checkboxText: { marginLeft: 10, fontSize: 13, color: '#888', flexShrink: 1 },
  link: { color: '#6B4EFF', fontWeight: 'bold' },
  createAccountButton: { backgroundColor: '#6B4EFF', borderRadius: 15, paddingVertical: 15, alignItems: 'center' },
  createAccountButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  loginText: { marginTop: 25, fontSize: 14, color: '#888' },
  loginLink: { color: '#6B4EFF', fontWeight: 'bold' },
  orText: { marginVertical: 25, fontSize: 14, color: '#888' },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 20 },
  socialButton: { backgroundColor: '#FFFFFF', width: 60, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#B0A8F2', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 5 },
});
