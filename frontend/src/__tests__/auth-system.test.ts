import { describe, it, expect, beforeEach, vi } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import {
  DEMO_ACCOUNTS,
  SESSION_STORAGE_KEY,
  saveSession,
  loadSession,
  clearSession,
  AuthSession,
  AuthProvider,
} from "../lib/auth";
import { LoginScreen } from "../components/auth/login-screen";
import { AuthGuard } from "../components/auth/auth-guard";

// Polyfill window and mock localStorage for Node.js test environment
let mockStorage: Record<string, string> = {};

const mockLocalStorage = {
  getItem: (key: string) => mockStorage[key] ?? null,
  setItem: (key: string, value: string) => {
    mockStorage[key] = String(value);
  },
  removeItem: (key: string) => {
    delete mockStorage[key];
  },
  clear: () => {
    mockStorage = {};
  },
};

if (typeof globalThis.window === "undefined") {
  Object.defineProperty(globalThis, "window", {
    value: {
      localStorage: mockLocalStorage,
      location: { href: "" },
    },
    writable: true,
    configurable: true,
  });
} else {
  Object.defineProperty(globalThis.window, "localStorage", {
    value: mockLocalStorage,
    writable: true,
    configurable: true,
  });
}

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/live",
  useSearchParams: () => ({
    get: (key: string) => (key === "from" ? "/live" : null),
  }),
}));

const h = React.createElement;

describe("VoiceShield Prototype Authentication System", () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  describe("Demo Accounts & Credentials Definition", () => {
    it("provides valid configurations for all 3 demo roles", () => {
      expect(DEMO_ACCOUNTS.SECURITY_OFFICER).toBeDefined();
      expect(DEMO_ACCOUNTS.SOC_OPERATOR).toBeDefined();
      expect(DEMO_ACCOUNTS.ADMINISTRATOR).toBeDefined();

      expect(DEMO_ACCOUNTS.SECURITY_OFFICER.email).toBe("officer@voiceshield.internal");
      expect(DEMO_ACCOUNTS.SECURITY_OFFICER.password).toBe("Shield2026!");
      expect(DEMO_ACCOUNTS.SECURITY_OFFICER.roleTitle).toBe("Security Officer");

      expect(DEMO_ACCOUNTS.SOC_OPERATOR.email).toBe("operator@voiceshield.internal");
      expect(DEMO_ACCOUNTS.SOC_OPERATOR.password).toBe("Shield2026!");
      expect(DEMO_ACCOUNTS.SOC_OPERATOR.roleTitle).toBe("SOC Operator");

      expect(DEMO_ACCOUNTS.ADMINISTRATOR.email).toBe("admin@voiceshield.internal");
      expect(DEMO_ACCOUNTS.ADMINISTRATOR.password).toBe("Shield2026!");
      expect(DEMO_ACCOUNTS.ADMINISTRATOR.roleTitle).toBe("System Administrator");
    });
  });

  describe("Session Storage Persistence", () => {
    it("saves, loads, and clears session from localStorage", () => {
      expect(loadSession()).toBeNull();

      const sampleSession: AuthSession = {
        user: {
          id: "usr_officer",
          name: "Vikram Malhotra",
          email: "officer@voiceshield.internal",
          role: "SECURITY_OFFICER",
          roleTitle: "Security Officer",
          avatarInitials: "VM",
          department: "Threat Defense",
          permissions: ["live_protection:read"],
        },
        token: "vs_proto_officer_12345",
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
      };

      saveSession(sampleSession);

      const stored = loadSession();
      expect(stored).not.toBeNull();
      expect(stored?.user.email).toBe("officer@voiceshield.internal");
      expect(stored?.user.role).toBe("SECURITY_OFFICER");
      expect(stored?.token).toBe("vs_proto_officer_12345");

      clearSession();
      expect(loadSession()).toBeNull();
      expect(window.localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull();
    });

    it("gracefully discards expired sessions", () => {
      const expiredSession: AuthSession = {
        user: {
          id: "usr_officer",
          name: "Vikram Malhotra",
          email: "officer@voiceshield.internal",
          role: "SECURITY_OFFICER",
          roleTitle: "Security Officer",
          avatarInitials: "VM",
          department: "Threat Defense",
          permissions: [],
        },
        token: "vs_proto_expired",
        createdAt: new Date(Date.now() - 100000).toISOString(),
        expiresAt: new Date(Date.now() - 50000).toISOString(), // Expired in the past
      };

      saveSession(expiredSession);
      expect(loadSession()).toBeNull();
    });
  });

  describe("LoginScreen Component Rendering", () => {
    it("renders brand, email/password inputs, and demo quick-login buttons", () => {
      const html = renderToString(h(LoginScreen));

      expect(html).toContain("Console Sign In");
      expect(html).toContain("Corporate Identity / Email");
      expect(html).toContain("Password");
      expect(html).toContain("Shield2026!");
      expect(html).toContain("Sign In to Console");
      expect(html).toContain("Quick Evaluator Profiles");
      expect(html).toContain("Vikram Malhotra");
      expect(html).toContain("Ananya Deshmukh");
      expect(html).toContain("Rajesh Kulkarni");
      expect(html).toContain("Prototype Session Layer");
    });
  });

  describe("AuthGuard Component Behavior", () => {
    it("renders loading or fallback when validating session in SSR", () => {
      const html = renderToString(
        h(
          AuthProvider,
          null,
          h(
            AuthGuard,
            null,
            h("div", { id: "protected-content" }, "Secret Dashboard Content")
          )
        )
      );

      // In SSR with AuthProvider, AuthGuard initially renders validation state
      expect(html).toContain("Validating Session");
    });
  });
});
