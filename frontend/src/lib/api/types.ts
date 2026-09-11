export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
export type VerificationState = "VERIFIED" | "NOT VERIFIED" | "PENDING" | "UNKNOWN";
export type SessionStatus = "LIVE ANALYSIS" | "ENDED" | "ON_HOLD";
export type AudioFormat = "pcm_s16le" | "wav" | "mp3" | "ogg";

export enum EventType {
  VOICE_INTEGRITY = "VOICE_INTEGRITY",
  SPEAKER_VERIFICATION = "SPEAKER_VERIFICATION",
  ASR = "ASR",
  CONVERSATION_ANALYSIS = "CONVERSATION_ANALYSIS",
  CONTEXT_ENGINE = "CONTEXT_ENGINE",
  RISK_UPDATE = "RISK_UPDATE",
  SECURITY_ALERT = "SECURITY_ALERT",
  ANALYSIS_STARTED = "ANALYSIS_STARTED",
  ASR_UPDATED = "ASR_UPDATED",
  SPEAKER_ANALYSIS_UPDATED = "SPEAKER_ANALYSIS_UPDATED",
  SPOOF_ANALYSIS_UPDATED = "SPOOF_ANALYSIS_UPDATED",
  SOCIAL_ENGINEERING_UPDATED = "SOCIAL_ENGINEERING_UPDATED",
  SECURITY_FINDING = "SECURITY_FINDING",
  RECOMMENDATION_UPDATED = "RECOMMENDATION_UPDATED",
  ANALYSIS_COMPLETED = "ANALYSIS_COMPLETED",
  ANALYSIS_ERROR = "ANALYSIS_ERROR",
}

export type RecommendedAction = 
  | "INDEPENDENT_VERIFICATION"
  | "MONITOR"
  | "TERMINATE_CALL"
  | "NONE";

export interface CreateSessionRequest {
  session_id?: string;
  caller_name?: string;
  caller_role?: string;
  caller_number?: string;
  verification_state?: VerificationState;
}

export interface CreateSessionResponse {
  session_id: string;
  status: SessionStatus;
  message: string;
}

export interface AnalyzeSegmentRequest {
  sample_rate?: number;
  duration_ms?: number;
  format?: AudioFormat;
  audio_base64?: string;
  context_metadata?: Record<string, unknown>;

}

export interface RiskSignal {
  signal_id: string;
  label: string;
  raw_score: number;
  risk_contribution: number;
  risk_level: RiskLevel;
  confidence_label?: string;
  description: string;
  explanation: string;
}

export interface RiskAssessment {
  risk_score: number;
  risk_level: RiskLevel;
  contributing_signals: RiskSignal[];
  explanation: string;
  recommended_action: RecommendedAction;
}

export interface SecurityFinding {
  finding_id: string;
  title: string;
  category: string;
  severity: RiskLevel;
  confidence: number;
  timestamp: string;
  details: string;
}

export interface SecurityEvent {
  event_id: string;
  session_id: string;
  timestamp: string;
  event_type: EventType;
  source: string;
  severity: RiskLevel;
  message: string;
  confidence?: number;
  metadata?: Record<string, unknown>;
}

export interface ASRResult {
  text: string;
  language: string;
  confidence: number;
  duration_ms: number;
  word_timestamps?: Record<string, unknown>[];

  status: string;
}

export interface SpeakerVerificationResult {
  similarity_score: number;
  verification_state: VerificationState;
  confidence: number;
  status: string;
  model_name: string;
}

export interface SpoofDetectionResult {
  spoof_probability: number;
  authenticity_confidence: number;
  status: string;
  model_name: string;
  indicators: string[];
}

export interface SocialEngineeringResult {
  findings: SecurityFinding[];
  urgency_score: number;
  coercion_detected: boolean;
  financial_request_detected: boolean;
  credential_request_detected: boolean;
  status: string;
}


export interface AnalysisSession {
  session_id: string;
  caller_name: string;
  caller_role: string;
  caller_number: string;
  duration_seconds: number;
  verification_state: VerificationState;
  status: SessionStatus;
  current_risk_score: number;
  current_risk_level: RiskLevel;
  latest_assessment?: RiskAssessment;
  events: SecurityEvent[];
  signals: RiskSignal[];
  start_time: string;
}
