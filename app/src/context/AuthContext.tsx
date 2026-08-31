import React, { createContext, useState, useEffect, useContext } from 'react';
import { signIn as apiSignIn, signUp as apiSignUp, signOut as apiSignOut, getSession, User } from '../services/authService';

export interface AuthUser {
  id: number;
  email: string;
  fullName?: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: AuthSession | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signUp: async () => { },
  signIn: async () => { },
  signOut: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const sessionData = await getSession();
        if (sessionData.session) {
          setSession(sessionData.session);
          setUser(sessionData.session.user);
        }
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      setLoading(true);
      const response = await apiSignUp(email, password, fullName);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      if (response.data) {
        // Directly set the session from the response
        const newSession: AuthSession = {
          user: response.data.user,
          token: response.data.token
        };
        setSession(newSession);
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await apiSignIn(email, password);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      if (response.data) {
        // Directly set the session from the response
        const newSession: AuthSession = {
          user: response.data.user,
          token: response.data.token
        };
        setSession(newSession);
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await apiSignOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}