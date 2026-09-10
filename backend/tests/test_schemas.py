import pytest
from pydantic import ValidationError
from app.schemas.analysis import AnalysisSession, VerificationState
from app.schemas.audio import AudioFormat, AudioSegment
from app.schemas.events import EventType, SecurityEvent
from app.schemas.risk import RecommendedAction, RiskAssessment, RiskLevel


def test_audio_segment_schema():
    segment = AudioSegment(
        segment_id="seg-123",
        session_id="VS-2026-0001",
        sample_rate=16000,
        channels=1,
        duration_ms=1000.0,
        format=AudioFormat.PCM_S16LE
    )
    assert segment.segment_id == "seg-123"
    assert segment.sample_rate == 16000


def test_security_event_schema():
    event = SecurityEvent(
        event_id="evt-100",
        session_id="VS-2026-0001",
        timestamp="10:00:00 UTC",
        event_type=EventType.VOICE_INTEGRITY,
        source="SpoofDetector",
        severity=RiskLevel.HIGH,
        message="Synthetic speech artifacts detected",
        confidence=0.84
    )
    assert event.event_type == EventType.VOICE_INTEGRITY
    assert event.confidence == 0.84


def test_risk_assessment_validation():
    assessment = RiskAssessment(
        risk_score=87,
        risk_level=RiskLevel.HIGH,
        explanation="Test explanation",
        recommended_action=RecommendedAction.INDEPENDENT_VERIFICATION
    )
    assert assessment.risk_score == 87

    with pytest.raises(ValidationError):
        # Invalid risk_score > 100
        RiskAssessment(
            risk_score=150,
            risk_level=RiskLevel.HIGH,
            explanation="Invalid"
        )
