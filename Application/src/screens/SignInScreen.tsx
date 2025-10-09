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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { signIn } from '../services/authService';
import { FontAwesome, AntDesign } from '@expo/vector-icons';

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
        colors={['#f5f7ff', '#eef2ff']}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <View style={styles.iconContainer}>
            <View style={styles.iconInner}>
              <Text style={{ fontSize: 28, color: 'white' }}>⚡</Text>
            </View>
          </View>

          {/* Headings */}
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>स्वागत है</Text>
          <Text style={styles.subtext}>Sign in to continue to your account</Text>

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
              colors={['#7b5cff', '#5f3efc']}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Loading...' : 'Login'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <Text style={styles.signupText}>
            Don't have an account?{' '}
            <Text
              style={styles.signupLink}
              onPress={() => navigation.navigate('SignUp')}
            >
              Sign Up
            </Text>
          </Text>

          {/* Or Continue */}
          <Text style={styles.orText}>Or continue with</Text>

          {/* Social Buttons */}
          <View style={styles.socialContainer}>
            {/* Google */}
            <TouchableOpacity style={styles.socialButton}>
              <AntDesign name="google" size={28} color="#DB4437" />
            </TouchableOpacity>

            {/* Apple */}
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="apple" size={28} color="#000" />
            </TouchableOpacity>

            {/* Facebook */}
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome name="facebook" size={28} color="#3b5998" />
            </TouchableOpacity>
          </View>
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
    marginBottom: 16,
  },
  iconInner: {
    backgroundColor: '#7b5cff',
    borderRadius: 16,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111',
    textAlign: 'center',
    marginTop: 2,
  },
  subtext: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  forgot: {
    fontSize: 13,
    color: '#5f3efc',
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
    color: '#666',
    fontSize: 14,
  },
  signupLink: {
    color: '#5f3efc',
    fontWeight: '600',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 16,
    color: '#999',
    fontSize: 13,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    padding: 14,
    backgroundColor: 'white',
    elevation: 2,
  },
});
