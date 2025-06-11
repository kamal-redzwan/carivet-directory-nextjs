'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { AuthService } from '@/lib/auth';
import { AuthContextType, UserWithRole, AdminRole } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthError {
  error?: string;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const handleAuthError = useCallback(
    (error: unknown, context: string): void => {
      const errorMessage =
        error instanceof Error ? error.message : `Unknown error in ${context}`;
      console.error(`Error in ${context}:`, errorMessage);
    },
    []
  );

  useEffect(() => {
    // Get initial session
    const initializeAuth = async (): Promise<void> => {
      try {
        const userWithRole = await AuthService.getCurrentUserWithRole();
        setUser(userWithRole);
      } catch (error: unknown) {
        handleAuthError(error, 'auth initialization');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = AuthService.onAuthStateChange(
      (userWithRole: UserWithRole | null): void => {
        setUser(userWithRole);
        setLoading(false);
      }
    );

    return (): void => {
      subscription.unsubscribe();
    };
  }, [handleAuthError]);

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthError> => {
      setLoading(true);
      try {
        const result = await AuthService.signIn(email, password);
        if (!result.error) {
          const userWithRole = await AuthService.getCurrentUserWithRole();
          setUser(userWithRole);
        }
        return result;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Sign in failed';
        return { error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const signOut = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      await AuthService.signOut();
      setUser(null);
    } catch (error: unknown) {
      handleAuthError(error, 'sign out');
      // Still clear user state even if signOut fails
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [handleAuthError]);

  const hasPermission = useCallback(
    (resource: string, action: string): boolean => {
      if (!user) return false;
      return AuthService.hasPermission(user.permissions, resource, action);
    },
    [user]
  );

  const isRole = useCallback(
    (role: AdminRole['name']): boolean => {
      if (!user) return false;
      return AuthService.isRole(user.role.name, role);
    },
    [user]
  );

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

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Additional type-safe hook for checking permissions
export function usePermission(resource: string, action: string): boolean {
  const { hasPermission } = useAuth();
  return hasPermission(resource, action);
}

// Additional type-safe hook for checking roles
export function useRole(role: AdminRole['name']): boolean {
  const { isRole } = useAuth();
  return isRole(role);
}
