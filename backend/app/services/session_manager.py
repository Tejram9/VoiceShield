import datetime
import threading
from typing import Dict, List, Optional
from app.core.logging import logger
from app.schemas.analysis import AnalysisSession, SessionStatus, VerificationState
from app.schemas.events import SecurityEvent
from app.schemas.risk import RiskAssessment, RiskLevel


class SessionManager:
    """
    Thread-safe session management service.
    Maintains active and historical VoiceShield security call sessions.
    Designed with a clean repository abstraction so PostgreSQL or Redis
    can seamlessly replace the in-memory storage provider in future database tasks.
    """

    def __init__(self):
        self._sessions: Dict[str, AnalysisSession] = {}
        self._lock = threading.Lock()

    def create_session(
        self,
        session_id: str,
        caller_name: str = "Alex Turner",
        caller_role: str = "Executive Director",
        caller_number: str = "+1 (555) 234-8901",
        verification_state: VerificationState = VerificationState.NOT_VERIFIED
    ) -> AnalysisSession:
        with self._lock:
            if session_id in self._sessions:
                logger.info(f"Session {session_id} already exists. Returning existing session.", extra={"session_id": session_id})
                return self._sessions[session_id]

            now_str = datetime.datetime.now(datetime.timezone.utc).strftime("%H:%M:%S UTC")
            session = AnalysisSession(
                session_id=session_id,
                caller_name=caller_name,
                caller_role=caller_role,
                caller_number=caller_number,
                duration_seconds=0,
                verification_state=verification_state,
                status=SessionStatus.ACTIVE,
                current_risk_score=0,
                current_risk_level=RiskLevel.LOW,
                events=[],
                signals=[],
                start_time=now_str
            )
            self._sessions[session_id] = session
            logger.info(f"Created new security session {session_id}", extra={"session_id": session_id})
            return session

    def get_session(self, session_id: str) -> Optional[AnalysisSession]:
        with self._lock:
            return self._sessions.get(session_id)

    def update_assessment(self, session_id: str, assessment: RiskAssessment) -> Optional[AnalysisSession]:
        with self._lock:
            session = self._sessions.get(session_id)
            if not session:
                logger.warning(f"Attempted to update assessment for non-existent session {session_id}", extra={"session_id": session_id})
                return None

            session.latest_assessment = assessment
            session.current_risk_score = assessment.risk_score
            session.current_risk_level = assessment.risk_level
            session.signals = assessment.contributing_signals
            logger.info(f"Updated session {session_id} risk assessment score={assessment.risk_score}", extra={"session_id": session_id})
            return session

    def add_event(self, session_id: str, event: SecurityEvent) -> Optional[AnalysisSession]:
        with self._lock:
            session = self._sessions.get(session_id)
            if not session:
                return None

            session.events.append(event)
            logger.info(f"Added security event {event.event_id} type={event.event_type} to session {session_id}", extra={"session_id": session_id})
            return session

    def get_all_sessions(self) -> List[AnalysisSession]:
        with self._lock:
            return list(self._sessions.values())


# Singleton session manager instance
session_manager = SessionManager()
