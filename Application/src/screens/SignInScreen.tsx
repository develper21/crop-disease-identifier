import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { signIn } from '../services/authService';

export default function SignInScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('Sign In Failed', error.message);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={['#e6f4ea', '#f2fff4']} // 🌿 Keep your existing background
        style={styles.container}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          
          {/* Custom Logo with Rounded White Background */}
          <View style={styles.iconContainer}>
            <View style={styles.logoBackground}>
              <Image
                source={require('../../assets/crop-logo.png')} // 👈 place your logo inside assets folder
                style={styles.logo}
              />
            </View>
          </View>

          {/* Headings */}
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>आपका स्वागत है</Text>
          <Text style={styles.subtext}>Login to manage your farming dashboard</Text>

          {/* Inputs */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={{ alignSelf: 'flex-end' }}>
              <Text style={styles.forgot}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity onPress={handleSignIn} activeOpacity={0.8}>
            <LinearGradient
              colors={['#2e8b57', '#3cb371']}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Loading...' : 'Login'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <Text style={styles.signupText}>
            Don’t have an account?{' '}
            <Text
              style={styles.signupLink}
              onPress={() => navigation.navigate('SignUp')}
            >
              Sign Up
            </Text>
          </Text>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBackground: {
    backgroundColor: 'white', // ✅ white background behind logo
    borderRadius: 70, // ✅ rounded rectangle shape
    padding: 8, // space inside
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4, // subtle shadow
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 2 },
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20, // ✅ slightly rounded logo
    resizeMode: 'cover',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0d3b1d',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0d3b1d',
    textAlign: 'center',
    marginTop: 2,
  },
  subtext: {
    textAlign: 'center',
    color: '#4f6f52',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    color: '#2e3d2f',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#bcd6b3',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  forgot: {
    fontSize: 13,
    color: '#2e8b57',
    marginTop: 4,
  },
  button: {
    marginTop: 12,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  signupText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#4f6f52',
    fontSize: 14,
  },
  signupLink: {
    color: '#2e8b57',
    fontWeight: '600',
  },
});
