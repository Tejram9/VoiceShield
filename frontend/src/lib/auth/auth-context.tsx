"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  AuthUser,
  AuthSession,
  DemoRole,
  LoginCredentials,
  DEMO_ACCOUNTS,
} from "./types";
import {
  loadSession,
  saveSession,
  clearSession,
} from "./session-storage";

export interface AuthContextValue {
  user: AuthUser | null;
  role: DemoRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  loginAsDemoRole: (role: DemoRole) => Promise<{ success: boolean }>;
  logout: () => void;
  switchRole: (role: DemoRole) => void;
}

export const defaultAuthContext: AuthContextValue = {
  user: null,
  role: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => ({ success: false, error: "AuthProvider not mounted" }),
  loginAsDemoRole: async () => ({ success: false }),
  logout: () => {},
  switchRole: () => {},
};

export const AuthContext = createContext<AuthContextValue>(defaultAuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Hydrate session from localStorage on initial mount
  useEffect(() => {
    const existing = loadSession();
    if (existing?.user) {
      setUser(existing.user);
    }
    setIsLoading(false);
  }, []);

  const createSessionForUser = (authUser: AuthUser): AuthSession => {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
    return {
      user: authUser,
      token: `vs_proto_${authUser.role.toLowerCase()}_${Date.now()}`,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };
  };

  const login = useCallback(
    async ({ email, password }: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
      // Find matching demo account
      const trimmedEmail = email.trim().toLowerCase();
      const matched = Object.values(DEMO_ACCOUNTS).find(
        (acc) => acc.email.toLowerCase() === trimmedEmail && acc.password === password
      );

      if (!matched) {
        return {
          success: false,
          error: "Invalid email or password. Please use valid demonstration credentials.",
        };
      }

      const authUser: AuthUser = {
        id: `usr_${matched.role.toLowerCase()}`,
        name: matched.name,
        email: matched.email,
        role: matched.role,
        roleTitle: matched.roleTitle,
        avatarInitials: matched.avatarInitials,
        department: matched.department,
        permissions: matched.permissions,
      };

      const session = createSessionForUser(authUser);
      saveSession(session);
      setUser(authUser);

      return { success: true };
    },
    []
  );

  const loginAsDemoRole = useCallback(
    async (role: DemoRole): Promise<{ success: boolean }> => {
      const account = DEMO_ACCOUNTS[role];
      if (!account) return { success: false };

      const authUser: AuthUser = {
        id: `usr_${account.role.toLowerCase()}`,
        name: account.name,
        email: account.email,
        role: account.role,
        roleTitle: account.roleTitle,
        avatarInitials: account.avatarInitials,
        department: account.department,
        permissions: account.permissions,
      };

      const session = createSessionForUser(authUser);
      saveSession(session);
      setUser(authUser);

      return { success: true };
    },
    []
  );

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const switchRole = useCallback((role: DemoRole) => {
    const account = DEMO_ACCOUNTS[role];
    if (!account) return;

    const authUser: AuthUser = {
      id: `usr_${account.role.toLowerCase()}`,
      name: account.name,
      email: account.email,
      role: account.role,
      roleTitle: account.roleTitle,
      avatarInitials: account.avatarInitials,
      department: account.department,
      permissions: account.permissions,
    };

    const session = createSessionForUser(authUser);
    saveSession(session);
    setUser(authUser);
  }, []);

  const value = useMemo(
    () => ({
      user,
      role: user?.role ?? null,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      loginAsDemoRole,
      logout,
      switchRole,
    }),
    [user, isLoading, login, loginAsDemoRole, logout, switchRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  return context || defaultAuthContext;
}
