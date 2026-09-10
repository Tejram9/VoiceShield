import asyncio
import base64
import datetime
import json
import uuid
from typing import Dict, List
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, status
from pydantic import ValidationError
from app.core.config import settings
from app.core.logging import logger
from app.schemas.audio import AudioChunkMessage, AudioSegment, AudioFormat
from app.schemas.events import EventType, SecurityEvent
from app.schemas.risk import RiskLevel
from app.services.session_manager import session_manager

router = APIRouter()


class ConnectionManager:
    """
    WebSocket Connection Manager for VoiceShield.
    Maintains active connections subscribed to specific call session IDs.
    Provides architecture for pushing real-time security events to Next.js dashboards.
    """

    def __init__(self):
        # Maps session_id -> List[WebSocket]
        self._active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, session_id: str):
        await websocket.accept()
        if session_id not in self._active_connections:
            self._active_connections[session_id] = []
        self._active_connections[session_id].append(websocket)
        logger.info(f"WebSocket client connected to session {session_id}", extra={"session_id": session_id})

    def disconnect(self, websocket: WebSocket, session_id: str):
        if session_id in self._active_connections:
            if websocket in self._active_connections[session_id]:
                self._active_connections[session_id].remove(websocket)
            if not self._active_connections[session_id]:
                del self._active_connections[session_id]
        logger.info(f"WebSocket client disconnected from session {session_id}", extra={"session_id": session_id})

    async def broadcast_event(self, session_id: str, event: SecurityEvent):
        if session_id not in self._active_connections:
            return

        payload = event.model_dump()
        dead_connections: List[WebSocket] = []

        for connection in self._active_connections[session_id]:
            try:
                await connection.send_json(payload)
            except Exception as exc:
                logger.error(f"Error pushing event to WebSocket: {exc}", extra={"session_id": session_id})
                dead_connections.append(connection)

        for dead in dead_connections:
            self.disconnect(dead, session_id)


# Global WebSocket connection manager instance
ws_manager = ConnectionManager()


@router.websocket("/ws/sessions/{session_id}")
async def session_websocket_endpoint(websocket: WebSocket, session_id: str):
    """
    WebSocket endpoint for near-real-time VoiceShield security event streaming & audio ingestion.
    Subscribes client to live security events and processes streaming audio chunk windows.
    """
    await ws_manager.connect(websocket, session_id)

    # Ensure session exists in session store
    session = session_manager.get_session(session_id)
    if not session:
        session_manager.create_session(session_id=session_id)

    try:
        while True:
            # Handle client heartbeats or incoming audio chunk frames
            data = await asyncio.wait_for(
                websocket.receive_text(),
                timeout=float(settings.WS_HEARTBEAT_INTERVAL_SEC)
            )

            # 1. Heartbeat fast-path
            if data == "ping":
                await websocket.send_text("pong")
                continue

            now_ts = datetime.datetime.now(datetime.timezone.utc).strftime("%H:%M:%S UTC")

            # 2. Parse JSON
            try:
                msg_dict = json.loads(data)
            except Exception:
                err_event = SecurityEvent(
                    event_id=f"evt-{uuid.uuid4().hex[:8]}",
                    session_id=session_id,
                    timestamp=now_ts,
                    event_type=EventType.ANALYSIS_ERROR,
                    source="WebSocketTransport",
                    severity=RiskLevel.LOW,
                    message="Malformed JSON message received on audio stream.",
                    metadata={"error_type": "MALFORMED_JSON"}
                )
                try:
                    await websocket.send_json(err_event.model_dump())
                except Exception:
                    pass
                continue

            # 3. Check message type
            msg_type = msg_dict.get("type")
            if msg_type != "audio_chunk":
                err_event = SecurityEvent(
                    event_id=f"evt-{uuid.uuid4().hex[:8]}",
                    session_id=session_id,
                    timestamp=now_ts,
                    event_type=EventType.ANALYSIS_ERROR,
                    source="WebSocketTransport",
                    severity=RiskLevel.LOW,
                    message=f"Unsupported WebSocket message type: '{msg_type}'. Expected 'audio_chunk'.",
                    metadata={"error_type": "UNSUPPORTED_TYPE"}
                )
                try:
                    await websocket.send_json(err_event.model_dump())
                except Exception:
                    pass
                continue

            # 4. Strict Pydantic payload validation
            try:
                chunk_msg = AudioChunkMessage.model_validate(msg_dict)
            except ValidationError as val_err:
                first_err = val_err.errors()[0] if val_err.errors() else {"msg": "Validation failed", "loc": ()}
                loc_field = str(first_err.get("loc", ["unknown"])[-1])
                err_msg = first_err.get("msg", str(val_err))

                err_event = SecurityEvent(
                    event_id=f"evt-{uuid.uuid4().hex[:8]}",
                    session_id=session_id,
                    timestamp=now_ts,
                    event_type=EventType.ANALYSIS_ERROR,
                    source="WebSocketTransport",
                    severity=RiskLevel.LOW,
                    message=f"Invalid audio chunk payload on field '{loc_field}': {err_msg}",
                    metadata={"error_type": "INVALID_PAYLOAD", "field": loc_field}
                )
                try:
                    await websocket.send_json(err_event.model_dump())
                except Exception:
                    pass
                continue

            # 5. Validate session alignment
            if chunk_msg.session_id != session_id:
                err_event = SecurityEvent(
                    event_id=f"evt-{uuid.uuid4().hex[:8]}",
                    session_id=session_id,
                    timestamp=now_ts,
                    event_type=EventType.ANALYSIS_ERROR,
                    source="WebSocketTransport",
                    severity=RiskLevel.LOW,
                    message=f"Session ID mismatch: expected '{session_id}', received '{chunk_msg.session_id}'.",
                    metadata={"error_type": "SESSION_MISMATCH"}
                )
                try:
                    await websocket.send_json(err_event.model_dump())
                except Exception:
                    pass
                continue

            # 6. Base64 audio decoding & size validation
            try:
                raw_bytes = base64.b64decode(chunk_msg.audio_base64)
            except Exception as exc:
                err_event = SecurityEvent(
                    event_id=f"evt-{uuid.uuid4().hex[:8]}",
                    session_id=session_id,
                    timestamp=now_ts,
                    event_type=EventType.ANALYSIS_ERROR,
                    source="WebSocketTransport",
                    severity=RiskLevel.LOW,
                    message=f"Base64 audio decoding failed: {exc}",
                    metadata={"error_type": "INVALID_BASE64"}
                )
                try:
                    await websocket.send_json(err_event.model_dump())
                except Exception:
                    pass
                continue

            if not raw_bytes or len(raw_bytes) == 0:
                err_event = SecurityEvent(
                    event_id=f"evt-{uuid.uuid4().hex[:8]}",
                    session_id=session_id,
                    timestamp=now_ts,
                    event_type=EventType.ANALYSIS_ERROR,
                    source="WebSocketTransport",
                    severity=RiskLevel.LOW,
                    message="Audio chunk payload decoded to 0 bytes.",
                    metadata={"error_type": "EMPTY_AUDIO"}
                )
                try:
                    await websocket.send_json(err_event.model_dump())
                except Exception:
                    pass
                continue

            if len(raw_bytes) > 500000:
                err_event = SecurityEvent(
                    event_id=f"evt-{uuid.uuid4().hex[:8]}",
                    session_id=session_id,
                    timestamp=now_ts,
                    event_type=EventType.ANALYSIS_ERROR,
                    source="WebSocketTransport",
                    severity=RiskLevel.MEDIUM,
                    message=f"Oversized audio payload ({len(raw_bytes)} bytes exceeds 500KB limit).",
                    metadata={"error_type": "OVERSIZED_PAYLOAD"}
                )
                try:
                    await websocket.send_json(err_event.model_dump())
                except Exception:
                    pass
                continue

            # 7. Construct AudioSegment and execute analysis pipeline
            segment = AudioSegment(
                segment_id=f"seg-{uuid.uuid4().hex[:8]}",
                session_id=session_id,
                sample_rate=chunk_msg.sample_rate,
                channels=chunk_msg.channels,
                duration_ms=chunk_msg.duration_ms,
                format=chunk_msg.format,
                audio_bytes=raw_bytes,
                audio_base64=chunk_msg.audio_base64
            )

            try:
                from app.services.analysis_orchestrator import orchestrator
                await orchestrator.analyze_audio_segment(
                    session_id=session_id,
                    audio_segment=segment
                )
            except Exception as exc:
                logger.error(f"Error during audio analysis in session {session_id}: {exc}", extra={"session_id": session_id})
                err_event = SecurityEvent(
                    event_id=f"evt-{uuid.uuid4().hex[:8]}",
                    session_id=session_id,
                    timestamp=now_ts,
                    event_type=EventType.ANALYSIS_ERROR,
                    source="AnalysisOrchestrator",
                    severity=RiskLevel.MEDIUM,
                    message=f"Analysis pipeline execution error: {str(exc)}",
                    metadata={"error_type": "PIPELINE_ERROR", "failed_stage": "Orchestrator"}
                )
                session_manager.add_event(session_id, err_event)
                await ws_manager.broadcast_event(session_id, err_event)

    except (asyncio.TimeoutError, WebSocketDisconnect):
        ws_manager.disconnect(websocket, session_id)
    except Exception as exc:
        logger.error(f"WebSocket exception in session {session_id}: {exc}", extra={"session_id": session_id})
        ws_manager.disconnect(websocket, session_id)

