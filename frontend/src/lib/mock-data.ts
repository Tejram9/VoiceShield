import {
  LiveCall,
  RiskSignal,
  AIFinding,
  Incident,
  SecurityRecommendationData,
} from "@/types/dashboard";

export const MOCK_LIVE_CALL: LiveCall = {
  id: "call-live-8921",
  sessionId: "VS-2026-000241",
  callerName: "Alex Turner",
  callerRole: "Executive Director",
  callerNumber: "+1 (555) 234-8901",
  duration: "03:42",
  status: "LIVE ANALYSIS",
  verificationState: "NOT VERIFIED",
  overallRiskScore: 87,
  riskLevel: "HIGH",
  startTime: "23:24:10 UTC",
};

export const MOCK_RISK_SIGNALS: RiskSignal[] = [
  {
    id: "sig-voice-integrity",
    label: "Voice Integrity",
    score: 84,
    riskLevel: "HIGH",
    description: "Synthetic Audio Detection",
    textInterpretation: "Strong synthetic-speech indicators detected.",
    explanation: "Higher score = stronger evidence of synthetic speech or AI voice cloning.",
  },
  {
    id: "sig-speaker-consistency",
    label: "Speaker Match",
    score: 38,
    riskLevel: "HIGH",
    confidenceLabel: "LOW CONFIDENCE",
    description: "Biometric Reference Comparison",
    textInterpretation: "Low similarity to trusted reference profile.",
    explanation: "Higher score = stronger confidence caller matches reference profile. 38/100 indicates high identity mismatch.",
  },
  {
    id: "sig-social-engineering",
    label: "Social Engineering",
    score: 88,
    riskLevel: "HIGH",
    description: "Intent & Coercion Analysis",
    textInterpretation: "Urgent financial transfer and coercion signals detected.",
    explanation: "Higher score = stronger evidence of coercion or urgent transfer demands.",
  },
  {
    id: "sig-context-risk",
    label: "Context Risk",
    score: 64,
    riskLevel: "MEDIUM",
    description: "Environmental Metadata",
    textInterpretation: "Unexpected communication context detected.",
    explanation: "Higher score = greater contextual anomaly in line origin or timing.",
  },
];

export const MOCK_DETECTION_EVENTS: AIFinding[] = [
  {
    id: "find-1",
    title: "Synthetic speech indicators detected",
    signalSource: "VOICE INTEGRITY",
    severity: "HIGH",
    timestamp: "03:41:18",
    details: "High-frequency vocoder phase discrepancies & unnatural acoustic boundaries observed.",
  },
  {
    id: "find-2",
    title: "Low similarity with trusted reference",
    signalSource: "SPEAKER VERIFICATION",
    severity: "HIGH",
    timestamp: "03:41:26",
    details: "Voice embedding similarity index scored 0.38 against enrolled baseline profile for Alex Turner.",
  },
  {
    id: "find-3",
    title: "Urgent financial request detected",
    signalSource: "CONVERSATION ANALYSIS",
    severity: "HIGH",
    timestamp: "03:41:31",
    details: "Real-time transcript contains explicit demand for immediate $45,000 wire transfer authorization.",
  },
  {
    id: "find-4",
    title: "Unexpected transaction context",
    signalSource: "CONTEXT ENGINE",
    severity: "MEDIUM",
    timestamp: "03:41:37",
    details: "Caller asserted executive escalation authority to bypass standard approval channels.",
  },
];

export const MOCK_RECOMMENDATION: SecurityRecommendationData = {
  title: "Independent verification required",
  description:
    "Multiple independent risk signals were detected during the active call. Verify the caller through a trusted channel before approving sensitive actions.",
  triggeringSignals: "Voice Integrity (84) + Speaker Mismatch (38)",
  urgency: "HIGH",
  suggestedActions: ["VERIFY CALLER", "START CALLBACK"],
};

export const MOCK_RECENT_INCIDENTS: Incident[] = [
  {
    id: "INC-2026-000241",
    timestamp: "10m ago",
    caller: "Alex Turner (+1 555-234-8901)",
    riskLevel: "HIGH",
    riskScore: 87,
    primaryFinding: "Synthetic Voice & Wire Transfer Request",
    status: "OPEN",
  },
  {
    id: "INC-2026-000239",
    timestamp: "1h ago",
    caller: "Finance Dept Lead (+1 555-908-1122)",
    riskLevel: "HIGH",
    riskScore: 92,
    primaryFinding: "Voice Clone & Credential Harvesting",
    status: "UNDER_REVIEW",
  },
  {
    id: "INC-2026-000224",
    timestamp: "4h ago",
    caller: "IT Helpdesk Spoof (+1 555-334-0099)",
    riskLevel: "MEDIUM",
    riskScore: 68,
    primaryFinding: "Unregistered Line & MFA Bypass Demand",
    status: "RESOLVED",
  },
  {
    id: "INC-2026-000210",
    timestamp: "Yesterday",
    caller: "Vendor Representative (+1 555-776-4433)",
    riskLevel: "LOW",
    riskScore: 18,
    primaryFinding: "Routine Supplier Call - Normal Parameters",
    status: "DISMISSED",
  },
];
