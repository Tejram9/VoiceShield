import pytest
from app.schemas.analysis import SessionStatus, VerificationState
from app.schemas.events import EventType, SecurityEvent
from app.schemas.risk import RecommendedAction, RiskAssessment, RiskLevel
from app.services.session_manager import SessionManager


def test_session_manager_lifecycle():
    sm = SessionManager()

    # Create session
    session = sm.create_session(
        session_id="VS-2026-TEST1",
        caller_name="Alex Turner",
        caller_role="Executive Director",
        caller_number="+1 555-234-8901",
        verification_state=VerificationState.NOT_VERIFIED
    )

    assert session.session_id == "VS-2026-TEST1"
    assert session.caller_name == "Alex Turner"
    assert session.status == SessionStatus.ACTIVE
    assert session.current_risk_level == RiskLevel.LOW

    # Get session
    retrieved = sm.get_session("VS-2026-TEST1")
    assert retrieved is not None
    assert retrieved.session_id == "VS-2026-TEST1"

    # Update assessment
    assessment = RiskAssessment(
        risk_score=87,
        risk_level=RiskLevel.HIGH,
        contributing_signals=[],
        explanation="Test high risk explanation",
        recommended_action=RecommendedAction.INDEPENDENT_VERIFICATION
    )
    updated = sm.update_assessment("VS-2026-TEST1", assessment)
    assert updated is not None
    assert updated.current_risk_score == 87
    assert updated.current_risk_level == RiskLevel.HIGH

    # Add security event
    event = SecurityEvent(
        event_id="evt-001",
        session_id="VS-2026-TEST1",
        timestamp="12:00:00 UTC",
        event_type=EventType.SECURITY_ALERT,
        source="TestEngine",
        severity=RiskLevel.HIGH,
        message="High risk detected"
    )
    with_event = sm.add_event("VS-2026-TEST1", event)
    assert with_event is not None
    assert len(with_event.events) == 1
    assert with_event.events[0].event_id == "evt-001"
