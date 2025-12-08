"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

interface AuthUser {
  username: string;
  email?: string;
  userId: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  checkUser: () => Promise<void>;
  signUpUser: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string; needsConfirmation?: boolean }>;
  confirmSignUpUser: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  signInUser: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOutUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);

  const checkUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/user', {
        method: 'GET',
        credentials: 'include', // Include cookies
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        // 401 is expected when user is not authenticated - don't log it
        setUser(null);
      }
    } catch (error) {
      // Only log unexpected network errors
      console.error('Check user error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const signUpUser = async (email: string, password: string, name?: string) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          needsConfirmation: data.needsConfirmation,
        };
      }

      return {
        success: false,
        error: data.error || 'Failed to sign up',
      };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.',
      };
    }
  };

  const confirmSignUpUser = async (email: string, code: string) => {
    try {
      const response = await fetch('/api/auth/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (data.success) {
        return { success: true };
      }

      return {
        success: false,
        error: data.error || 'Failed to confirm sign up',
      };
    } catch (error: any) {
      console.error('Confirmation error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.',
      };
    }
  };

  const signInUser = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: Include cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.user) {
        setUser(data.user);
        return { success: true };
      }

      return {
        success: false,
        error: data.error || 'Failed to sign in',
      };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.',
      };
    }
  };

  const signOutUser = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Include cookies
      });
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      // Clear user state anyway
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    checkUser,
    signUpUser,
    confirmSignUpUser,
    signInUser,
    signOutUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
