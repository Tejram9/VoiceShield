import pytest
from app.schemas.analysis import (
    ContextRiskResult,
    SocialEngineeringResult,
    SpeakerVerificationResult,
    SpoofDetectionResult,
    VerificationState,
)
from app.schemas.risk import RecommendedAction, RiskLevel
from app.services.risk_fusion import RiskFusionEngine


def test_risk_level_classification():
    fusion = RiskFusionEngine()
    assert fusion.classify_risk_level(0) == RiskLevel.LOW
    assert fusion.classify_risk_level(39) == RiskLevel.LOW
    assert fusion.classify_risk_level(40) == RiskLevel.MEDIUM
    assert fusion.classify_risk_level(69) == RiskLevel.MEDIUM
    assert fusion.classify_risk_level(70) == RiskLevel.HIGH
    assert fusion.classify_risk_level(100) == RiskLevel.HIGH


def test_risk_fusion_high_risk_scenario():
    fusion = RiskFusionEngine()

    spoof = SpoofDetectionResult(spoof_probability=0.84, authenticity_confidence=0.9, status="AVAILABLE")
    speaker = SpeakerVerificationResult(similarity_score=0.38, verification_state=VerificationState.NOT_VERIFIED, confidence=0.85, status="AVAILABLE")
    social = SocialEngineeringResult(urgency_score=88.0, coercion_detected=True, financial_request_detected=True, status="AVAILABLE")
    context = ContextRiskResult(origin_risk_score=64.0, timeframe_risk_score=64.0, overall_context_score=64.0, status="AVAILABLE")

    assessment = fusion.compute_assessment(
        spoof_result=spoof,
        speaker_result=speaker,
        social_eng_result=social,
        context_result=context,
        session_id="test-session-1"
    )

    assert assessment.risk_level == RiskLevel.HIGH
    assert assessment.risk_score >= 70
    assert assessment.recommended_action == RecommendedAction.INDEPENDENT_VERIFICATION
    assert len(assessment.contributing_signals) == 4
    assert "Voice Integrity" in assessment.explanation


def test_risk_fusion_low_risk_scenario():
    fusion = RiskFusionEngine()

    spoof = SpoofDetectionResult(spoof_probability=0.05, authenticity_confidence=0.95, status="AVAILABLE")
    speaker = SpeakerVerificationResult(similarity_score=0.92, verification_state=VerificationState.VERIFIED, confidence=0.9, status="AVAILABLE")
    social = SocialEngineeringResult(urgency_score=10.0, coercion_detected=False, financial_request_detected=False, status="AVAILABLE")

    assessment = fusion.compute_assessment(
        spoof_result=spoof,
        speaker_result=speaker,
        social_eng_result=social,
        session_id="test-session-low"
    )

    assert assessment.risk_level == RiskLevel.LOW
    assert assessment.risk_score <= 39
    assert assessment.recommended_action == RecommendedAction.NONE


def test_partial_ai_failure_graceful_degradation():
    fusion = RiskFusionEngine()

    # Spoof detector is unavailable (status="UNAVAILABLE")
    spoof = SpoofDetectionResult(spoof_probability=0.0, authenticity_confidence=0.0, status="UNAVAILABLE")
    social = SocialEngineeringResult(urgency_score=90.0, coercion_detected=True, financial_request_detected=True, status="AVAILABLE")

    assessment = fusion.compute_assessment(
        spoof_result=spoof,
        social_eng_result=social,
        session_id="test-partial"
    )

    # Only available signal (Social Engineering) should be evaluated without crashing
    assert len(assessment.contributing_signals) == 1
    assert assessment.contributing_signals[0].signal_id == "social_engineering"
    assert assessment.risk_level == RiskLevel.HIGH
