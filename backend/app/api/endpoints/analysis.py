import datetime
import uuid
import base64
from typing import Any, Dict, Optional
from fastapi import APIRouter, HTTPException, Path, status
from pydantic import BaseModel, Field
from app.schemas.analysis import AnalysisSession, SessionStatus, VerificationState
from app.schemas.audio import AudioFormat, AudioSegment
from app.schemas.risk import RiskAssessment
from app.services.analysis_orchestrator import orchestrator
from app.services.session_manager import session_manager

router = APIRouter()


class CreateSessionRequest(BaseModel):
    session_id: Optional[str] = Field(None, description="Optional custom session ID. Generated if omitted.")
    caller_name: str = Field("Alex Turner", description="Caller identity name")
    caller_role: str = Field("Executive Director", description="Caller organization role")
    caller_number: str = Field("+1 (555) 234-8901", description="Inbound caller phone number")
    verification_state: VerificationState = Field(VerificationState.NOT_VERIFIED, description="Initial verification state")


class CreateSessionResponse(BaseModel):
    session_id: str
    status: SessionStatus
    message: str


class AnalyzeSegmentRequest(BaseModel):
    sample_rate: int = Field(16000, description="Audio sample rate in Hz")
    duration_ms: float = Field(4000.0, description="Audio duration in ms (default 4.0s analysis window)")
    format: AudioFormat = Field(AudioFormat.PCM_S16LE, description="Audio encoding format")
    audio_base64: Optional[str] = Field(None, description="Optional base64 encoded PCM or WAV audio bytes payload")
    context_metadata: Optional[Dict[str, Any]] = Field(None, description="Optional contextual line/timeframe/reference metadata")


@router.post(
    "/sessions",
    response_model=CreateSessionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Security Analysis Session"
)
async def create_session(request: CreateSessionRequest) -> CreateSessionResponse:
    """
    Initialize a new VoiceShield security call session for real-time risk monitoring.
    """
    now_year = datetime.datetime.now(datetime.timezone.utc).year
    session_id = request.session_id or f"VS-{now_year}-00{uuid.uuid4().hex[:4].upper()}"
    session = session_manager.create_session(
        session_id=session_id,
        caller_name=request.caller_name,
        caller_role=request.caller_role,
        caller_number=request.caller_number,
        verification_state=request.verification_state
    )
    return CreateSessionResponse(
        session_id=session.session_id,
        status=session.status,
        message="VoiceShield security session initialized successfully."
    )


@router.get(
    "/sessions/{session_id}",
    response_model=AnalysisSession,
    summary="Get Analysis Session State"
)
async def get_session(
    session_id: str = Path(..., description="Target security call session ID")
) -> AnalysisSession:
    """
    Retrieve current security analysis session state, including latest risk assessment and events feed.
    """
    session = session_manager.get_session(session_id)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Security session {session_id} not found."
        )
    return session


@router.post(
    "/sessions/{session_id}/analyze",
    response_model=RiskAssessment,
    summary="Trigger Audio Segment Analysis Cycle"
)
async def analyze_segment(
    request: AnalyzeSegmentRequest,
    session_id: str = Path(..., description="Target security call session ID")
) -> RiskAssessment:
    """
    Trigger an AI pipeline analysis cycle on an ingested audio segment.
    Executes real inference across faster-whisper, ECAPA-TDNN speaker verification, Wav2Vec2 spoof detection, and social engineering NLP.
    """
    session = session_manager.get_session(session_id)
    if not session:
        session = session_manager.create_session(session_id=session_id)

    raw_bytes = None
    if request.audio_base64:
        try:
            raw_bytes = base64.b64decode(request.audio_base64)
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid base64 audio encoding: {exc}"
            )

    segment = AudioSegment(
        segment_id=f"seg-{uuid.uuid4().hex[:8]}",
        session_id=session_id,
        sample_rate=request.sample_rate,
        channels=1,
        duration_ms=request.duration_ms,
        format=request.format,
        audio_bytes=raw_bytes,
        audio_base64=request.audio_base64
    )

    assessment = await orchestrator.analyze_audio_segment(
        session_id=session_id,
        audio_segment=segment,
        context_metadata=request.context_metadata
    )
    return assessment
