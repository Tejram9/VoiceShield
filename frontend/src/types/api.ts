/**
 * VoiceShield Frontend — API Types (canonical export)
 *
 * Re-exports all REST API types from the source-of-truth location.
 * Import from here rather than from lib/api/types.ts directly.
 */
export type {
  RiskLevel,
  VerificationState,
  SessionStatus,
  AudioFormat,
  RecommendedAction,
  CreateSessionRequest,
  CreateSessionResponse,
  AnalyzeSegmentRequest,
  RiskSignal,
  RiskAssessment,
  SecurityFinding,
  SecurityEvent,
  ASRResult,
  SpeakerVerificationResult,
  SpoofDetectionResult,
  SocialEngineeringResult,
  AnalysisSession,
} from "../lib/api/types";

export { EventType } from "../lib/api/types";
