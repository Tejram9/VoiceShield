export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface OverviewMetric {
  id: string;
  label: string;
  value: string | number;
  subtext: string;
  status: "normal" | "active" | "warning" | "danger";
}

export interface LiveCall {
  id: string;
  sessionId: string;
  callerName: string;
  callerNumber: string;
  callerRole: string;
  duration: string;
  status: "LIVE ANALYSIS" | "ENDED" | "ON_HOLD";
  verificationState: "NOT VERIFIED" | "VERIFIED" | "PENDING" | "UNKNOWN";

  overallRiskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  startTime: string;
}

export interface RiskSignal {
  id: string;
  label: string;
  score: number; // 0 to 100
  riskLevel: RiskLevel;
  confidenceLabel?: string; // e.g. "LOW CONFIDENCE" for speaker mismatch
  description: string;
  textInterpretation: string;
  explanation: string;
}

export interface AIFinding {
  id: string;
  title: string;
  signalSource: "VOICE INTEGRITY" | "SPEAKER VERIFICATION" | "CONVERSATION ANALYSIS" | "CONTEXT ENGINE";
  severity: RiskLevel;
  timestamp: string;
  details: string;
}

export interface Incident {
  id: string;
  timestamp: string;
  caller: string;
  riskLevel: RiskLevel;
  riskScore: number;
  primaryFinding: string;
  status: "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "DISMISSED";
}

export interface SecurityRecommendationData {
  title: string;
  description: string;
  triggeringSignals: string;
  urgency: RiskLevel;
  suggestedActions: string[];
}
