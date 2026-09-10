from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from app.schemas.events import SecurityEvent
from app.schemas.risk import RiskAssessment, RiskLevel, RiskSignal


class VerificationState(str, Enum):
    VERIFIED = "VERIFIED"
    NOT_VERIFIED = "NOT VERIFIED"
    PENDING = "PENDING"


class SessionStatus(str, Enum):
    ACTIVE = "LIVE ANALYSIS"
    ENDED = "ENDED"
    ON_HOLD = "ON_HOLD"


class ASRResult(BaseModel):
    text: str = Field("", description="Transcribed speech text")
    language: str = Field("en", description="Detected spoken language")
    confidence: float = Field(0.0, ge=0, le=1.0, description="Transcription confidence (0.0 - 1.0)")
    duration_ms: float = Field(0.0, description="Audio duration processed in ms")
    word_timestamps: List[Dict[str, Any]] = Field(default_factory=list, description="Word-level timestamp list")
    status: str = Field("AVAILABLE", description="Model provider status")


class SpeakerVerificationResult(BaseModel):
    similarity_score: float = Field(..., ge=0.0, le=1.0, description="Cosine similarity score (0.0 = total mismatch, 1.0 = exact match)")
    verification_state: VerificationState = Field(VerificationState.NOT_VERIFIED, description="Identity match conclusion")
    confidence: float = Field(0.0, ge=0.0, le=1.0, description="Embedding confidence")
    status: str = Field("AVAILABLE", description="Model provider status")
    model_name: str = Field("ECAPA-TDNN-Placeholder", description="Model architecture identifier")


class SpoofDetectionResult(BaseModel):
    spoof_probability: float = Field(..., ge=0.0, le=1.0, description="Probability that audio is synthetic/clone (0.0 = real, 1.0 = synthetic)")
    authenticity_confidence: float = Field(0.0, ge=0.0, le=1.0, description="Authenticity confidence score")
    status: str = Field("AVAILABLE", description="Model provider status")
    model_name: str = Field("AASIST-Placeholder", description="Deepfake detector identifier")
    indicators: List[str] = Field(default_factory=list, description="Extracted spectral or vocoder indicators")


class SecurityFinding(BaseModel):
    finding_id: str = Field(..., description="Unique finding ID")
    title: str = Field(..., description="Concise finding headline")
    category: str = Field(..., description="Category code (e.g. FINANCIAL_REQUEST, AUTHORITY_CLAIM)")
    severity: RiskLevel = Field(..., description="Finding severity level")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Detection confidence")
    timestamp: str = Field(..., description="Finding timestamp")
    details: str = Field(..., description="Detailed explanation of detected evidence")


class SocialEngineeringResult(BaseModel):
    findings: List[SecurityFinding] = Field(default_factory=list, description="Extracted security indicators")
    urgency_score: float = Field(0.0, ge=0.0, le=100.0, description="Coercive urgency score")
    coercion_detected: bool = Field(False, description="Whether explicit coercion is present")
    financial_request_detected: bool = Field(False, description="Whether urgent wire transfer/financial request is present")
    credential_request_detected: bool = Field(False, description="Whether credential harvesting is present")
    status: str = Field("AVAILABLE", description="Model provider status")


class ContextRiskResult(BaseModel):
    origin_risk_score: float = Field(0.0, ge=0.0, le=100.0, description="Unrecognized line/routing risk score")
    timeframe_risk_score: float = Field(0.0, ge=0.0, le=100.0, description="Off-hours/unexpected timeframe risk score")
    overall_context_score: float = Field(0.0, ge=0.0, le=100.0, description="Aggregated context anomaly score")
    status: str = Field("AVAILABLE", description="Context engine provider status")


class AnalysisSession(BaseModel):
    """
    Representation of an active or historic VoiceShield security call session.
    """
    session_id: str = Field(..., description="Unique session ID (e.g. VS-2026-000241)")
    caller_name: str = Field(..., description="Caller identity name")
    caller_role: str = Field(..., description="Caller organization role")
    caller_number: str = Field(..., description="Inbound caller phone number")
    duration_seconds: int = Field(0, description="Active session duration in seconds")
    verification_state: VerificationState = Field(VerificationState.NOT_VERIFIED, description="Current verification state")
    status: SessionStatus = Field(SessionStatus.ACTIVE, description="Session status")
    current_risk_score: int = Field(0, ge=0, le=100, description="Current fused risk score")
    current_risk_level: RiskLevel = Field(RiskLevel.LOW, description="Current risk level")
    latest_assessment: Optional[RiskAssessment] = Field(None, description="Latest risk fusion assessment")
    events: List[SecurityEvent] = Field(default_factory=list, description="Chronological security events feed")
    signals: List[RiskSignal] = Field(default_factory=list, description="Evaluated signal breakdown")
    start_time: str = Field(..., description="Session start timestamp")
