export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface OverviewMetric {
  id: string;
  label: string;
  value: string | number;
  subtext: string;
  trend?: {
    direction: "up" | "down" | "neutral";
    value: string;
    isPositive: boolean;
  };
  status: "normal" | "active" | "warning" | "danger" | "critical";
}

export interface LiveCall {
  id: string;
  sessionId: string;
  callerName: string;
  callerNumber: string;
  callerRole: string;
  duration: string;
  status: "LIVE ANALYSIS" | "ENDED" | "ON_HOLD" | "MONITORING";
  verificationState: "NOT VERIFIED" | "VERIFIED" | "PENDING" | "UNKNOWN" | "CHALLENGED";
  overallRiskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  startTime: string;
  telephonyTrunk?: string;
}

export interface RiskSignal {
  id: string;
  label: string;
  score: number; // 0 to 100
  weight?: number; // 0 to 1
  riskLevel: RiskLevel;
  confidenceLabel?: string; // e.g. "94% CONFIDENCE"
  description: string;
  textInterpretation: string;
  explanation: string;
  technicalDetails?: string[];
}

export interface AIFinding {
  id: string;
  title: string;
  signalSource: "VOICE INTEGRITY" | "SPEAKER VERIFICATION" | "CONVERSATION ANALYSIS" | "CONTEXT ENGINE" | "RISK FUSION";
  severity: RiskLevel;
  timestamp: string;
  details: string;
  category?: "SYNTHETIC_ARTIFACT" | "BIOMETRIC_MISMATCH" | "COERCION_URGENCY" | "CARRIER_ANOMALY" | "POLICY_VIOLATION";
}

export interface IncidentDossierItem {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  severity: RiskLevel;
  source: string;
}

export interface IncidentNote {
  id: string;
  author: string;
  role: string;
  timestamp: string;
  content: string;
}

export interface Incident {
  id: string;
  timestamp: string;
  caller: string;
  callerNumber: string;
  callerRole?: string;
  riskLevel: RiskLevel;
  riskScore: number;
  primaryFinding: string;
  status: "OPEN" | "INVESTIGATING" | "CONTAINED" | "RESOLVED" | "FALSE_POSITIVE";
  assignedAnalyst?: string;
  containmentAction?: string;
  summary?: string;
  timeline?: IncidentDossierItem[];
  notes?: IncidentNote[];
  evidence?: {
    vocoderDiscrepancies: string;
    biometricScore: number;
    flaggedPhrases: string[];
    callerIpLocation: string;
    carrierName: string;
  };
}

export interface CallRecord {
  id: string;
  sessionId: string;
  callerName: string;
  callerNumber: string;
  callerRole: string;
  timestamp: string;
  duration: string;
  riskScore: number;
  riskLevel: RiskLevel;
  primaryTrigger: string;
  disposition: "CLEARED" | "CHALLENGED_VERIFIED" | "INTERCEPTED" | "ESCALATED_INCIDENT" | "BLOCKED";
  recordingUrl?: string;
  transcriptHighlights?: {
    time: string;
    speaker: "CALLER" | "AGENT";
    text: string;
    category?: "IDENTITY_CLAIM" | "URGENCY" | "FINANCIAL_REQUEST" | "AUTH_BYPASS" | "SOCIAL_ENGINEERING";
    risk: RiskLevel;
  }[];
  signalsSummary?: {
    voiceIntegrityScore: number;
    speakerMatchScore: number;
    socialEngineeringScore: number;
    contextRiskScore: number;
  };
}

export interface TrustedContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  enrolledDate: string;
  sampleDuration: string;
  voiceprintStatus: "VERIFIED" | "PENDING_ENROLLMENT" | "REQUIRES_UPDATE";
  embeddingHash: string;
  safeWordMasked: string;
  safeWordPlain: string;
  emergencyCallback: string;
  verificationPolicy: string;
}

export interface VerificationChallenge {
  id: string;
  timestamp: string;
  callerName: string;
  callerPhone: string;
  challengeType: "SAFE_WORD" | "OUT_OF_BAND_CALLBACK" | "STEP_UP_MFA" | "BIOMETRIC_CHALLENGE";
  status: "PENDING" | "PASSED" | "FAILED" | "EXPIRED";
  respondedAt?: string;
  riskLevel: RiskLevel;
  operatorNotes: string;
}

export interface SecurityRecommendationData {
  title: string;
  description: string;
  triggeringSignals: string;
  urgency: RiskLevel;
  primaryAction: {
    id: string;
    label: string;
    actionType: "VERIFY_CALLER" | "SAFE_WORD" | "CALLBACK" | "FREEZE_TX" | "TERMINATE";
  };
  secondaryActions: {
    id: string;
    label: string;
    actionType: string;
  }[];
}

export interface ThreatDistributionItem {
  category: string;
  percentage: number;
  count: number;
  trend: string;
  color: string;
}
