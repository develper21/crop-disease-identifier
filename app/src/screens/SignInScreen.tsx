import { useState } from 'react';
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
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export default function SignInScreen({ navigation }: any) {
  const { colors } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  async function handleSignIn() {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
    } catch (error: any) {
      Alert.alert('Sign In Failed', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={[colors.background, colors.surface]}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          
          {/* Custom Logo with Rounded White Background */}
          <View style={styles.iconContainer}>
            <View style={[styles.logoBackground, { backgroundColor: colors.surface }]}>
              <Image
                source={require('../../assets/crop-logo.png')}
                style={styles.logo}
              />
            </View>
          </View>

          {/* Headings */}
          <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: colors.text }]}>आपका स्वागत है</Text>
          <Text style={[styles.subtext, { color: colors.textSecondary }]}>Login to manage your farming dashboard</Text>

          {/* Inputs */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
              placeholder="Enter your email"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Password</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.border }]}
              placeholder="Enter your password"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={{ alignSelf: 'flex-end' }}>
              <Text style={[styles.forgot, { color: colors.primary }]}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity onPress={handleSignIn} activeOpacity={0.8}>
            <LinearGradient
              colors={[colors.primary, colors.primaryLight]}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Loading...' : 'Login'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <Text style={[styles.signupText, { color: colors.textSecondary }]}>
            Don't have an account?{' '}
            <Text
              style={[styles.signupLink, { color: colors.primary }]}
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
