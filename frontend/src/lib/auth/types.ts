export type DemoRole = "SECURITY_OFFICER" | "SOC_OPERATOR" | "ADMINISTRATOR";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: DemoRole;
  roleTitle: string;
  avatarInitials: string;
  department: string;
  permissions: string[];
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  createdAt: string;
  expiresAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface DemoAccount {
  role: DemoRole;
  roleTitle: string;
  name: string;
  email: string;
  password: string;
  avatarInitials: string;
  department: string;
  description: string;
  permissions: string[];
}

export const DEMO_ACCOUNTS: Record<DemoRole, DemoAccount> = {
  SECURITY_OFFICER: {
    role: "SECURITY_OFFICER",
    roleTitle: "Security Officer",
    name: "Vikram Malhotra",
    email: "officer@voiceshield.internal",
    password: "Shield2026!",
    avatarInitials: "VM",
    department: "Threat Defense & Identity Operations",
    description: "Evaluates in-call telephony threats, authorizes Policy 4.1 holds, and enforces Safe Word challenges.",
    permissions: [
      "live_protection:read",
      "live_protection:contain",
      "verification:execute",
      "incident:view",
      "reports:read",
    ],
  },
  SOC_OPERATOR: {
    role: "SOC_OPERATOR",
    roleTitle: "SOC Operator",
    name: "Ananya Deshmukh",
    email: "operator@voiceshield.internal",
    password: "Shield2026!",
    avatarInitials: "AD",
    department: "Security Operations Center",
    description: "Monitors active streams, reviews call telemetry, and triages escalated impersonation incidents.",
    permissions: [
      "live_protection:read",
      "call_history:read",
      "incident:view",
      "overview:read",
    ],
  },
  ADMINISTRATOR: {
    role: "ADMINISTRATOR",
    roleTitle: "System Administrator",
    name: "Rajesh Kulkarni",
    email: "admin@voiceshield.internal",
    password: "Shield2026!",
    avatarInitials: "RK",
    department: "Enterprise Telephony & Infrastructure",
    description: "Manages trusted executive voiceprints, PBX gateway configurations, and privacy retention rules.",
    permissions: [
      "live_protection:admin",
      "trusted_identity:write",
      "security_privacy:admin",
      "audit:read",
      "system:manage",
    ],
  },
};
