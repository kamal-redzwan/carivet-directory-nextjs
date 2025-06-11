'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '@/lib/auth';
import { AuthContextType, UserWithRole } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    AuthService.getCurrentUserWithRole().then((userWithRole) => {
      setUser(userWithRole);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = AuthService.onAuthStateChange((userWithRole) => {
      setUser(userWithRole);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await AuthService.signIn(email, password);
      if (!result.error) {
        const userWithRole = await AuthService.getCurrentUserWithRole();
        setUser(userWithRole);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await AuthService.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (resource: string, action: string) => {
    if (!user) return false;
    return AuthService.hasPermission(user.permissions, resource, action);
  };

  const isRole = (role: string) => {
    if (!user) return false;
    return AuthService.isRole(user.role.name, role as any);
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signOut,
    hasPermission,
    isRole,
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
