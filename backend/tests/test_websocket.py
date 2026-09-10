import json
import base64
import numpy as np
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.schemas.events import EventType

client = TestClient(app)


def generate_test_pcm_base64(duration_sec: float = 4.0, sample_rate: int = 16000) -> str:
    """Generate deterministic 440Hz sine tone PCM_S16LE base64 string."""
    num_samples = int(duration_sec * sample_rate)
    t = np.linspace(0, duration_sec, num_samples, endpoint=False)
    samples = (0.4 * np.sin(2 * np.pi * 440 * t) * 32767.0).astype(np.int16)
    pcm_bytes = samples.tobytes()
    return base64.b64encode(pcm_bytes).decode("utf-8")


def test_websocket_connection_lifecycle():
    with client.websocket_connect("/ws/sessions/VS-2026-WS-LIFECYCLE") as websocket:
        websocket.send_text("ping")
        data = websocket.receive_text()
        assert data == "pong"


def test_websocket_valid_audio_chunk_streaming():
    # 1. Create a real session
    resp = client.post("/api/v1/analysis/sessions", json={
        "caller_name": "Test Caller",
        "caller_role": "Security Analyst",
        "caller_number": "+1 555 0199"
    })
    assert resp.status_code == 201
    session_id = resp.json()["session_id"]

    # 2. Connect to WebSocket
    with client.websocket_connect(f"/ws/sessions/{session_id}") as websocket:
        b64_audio = generate_test_pcm_base64(duration_sec=4.0)

        chunk_payload = {
            "type": "audio_chunk",
            "session_id": session_id,
            "sequence": 0,
            "sample_rate": 16000,
            "channels": 1,
            "format": "pcm_s16le",
            "duration_ms": 4000.0,
            "audio_base64": b64_audio
        }

        # 3. Send audio chunk envelope
        websocket.send_text(json.dumps(chunk_payload))

        # 4. Collect broadcasted security events
        received_event_types = []
        # Expect multiple events: ANALYSIS_STARTED, ASR_UPDATED, SPEAKER_ANALYSIS_UPDATED, SPOOF_ANALYSIS_UPDATED, RISK_UPDATE, ANALYSIS_COMPLETED
        for _ in range(10):
            try:
                data = websocket.receive_json()
                if "event_type" in data:
                    received_event_types.append(data["event_type"])
                    if data["event_type"] == EventType.ANALYSIS_COMPLETED:
                        break
            except Exception:
                break

        assert EventType.ANALYSIS_STARTED in received_event_types
        assert EventType.RISK_UPDATE in received_event_types
        assert EventType.ANALYSIS_COMPLETED in received_event_types


def test_websocket_malformed_json_handling():
    with client.websocket_connect("/ws/sessions/VS-2026-WS-ERR-JSON") as websocket:
        # Send broken JSON string
        websocket.send_text("{bad json missing quotes:")

        err_data = websocket.receive_json()
        assert err_data["event_type"] == EventType.ANALYSIS_ERROR
        assert err_data["metadata"].get("error_type") == "MALFORMED_JSON"

        # Verify connection is still alive and responsive
        websocket.send_text("ping")
        assert websocket.receive_text() == "pong"


def test_websocket_unsupported_message_type():
    with client.websocket_connect("/ws/sessions/VS-2026-WS-ERR-TYPE") as websocket:
        websocket.send_text(json.dumps({"type": "chat_message", "content": "hello"}))

        err_data = websocket.receive_json()
        assert err_data["event_type"] == EventType.ANALYSIS_ERROR
        assert err_data["metadata"].get("error_type") == "UNSUPPORTED_TYPE"

        # Connection survives
        websocket.send_text("ping")
        assert websocket.receive_text() == "pong"


def test_websocket_session_id_mismatch():
    session_a = "VS-2026-WS-SESS-A"
    session_b = "VS-2026-WS-SESS-B"
    with client.websocket_connect(f"/ws/sessions/{session_a}") as websocket:
        chunk = {
            "type": "audio_chunk",
            "session_id": session_b,
            "sequence": 0,
            "sample_rate": 16000,
            "channels": 1,
            "format": "pcm_s16le",
            "duration_ms": 4000.0,
            "audio_base64": generate_test_pcm_base64()
        }
        websocket.send_text(json.dumps(chunk))

        err_data = websocket.receive_json()
        assert err_data["event_type"] == EventType.ANALYSIS_ERROR
        assert err_data["metadata"].get("error_type") == "SESSION_MISMATCH"

        websocket.send_text("ping")
        assert websocket.receive_text() == "pong"


def test_websocket_invalid_base64():
    with client.websocket_connect("/ws/sessions/VS-2026-WS-ERR-B64") as websocket:
        chunk = {
            "type": "audio_chunk",
            "session_id": "VS-2026-WS-ERR-B64",
            "sequence": 0,
            "sample_rate": 16000,
            "channels": 1,
            "format": "pcm_s16le",
            "duration_ms": 4000.0,
            "audio_base64": "!!!not_valid_base64!!!"
        }
        websocket.send_text(json.dumps(chunk))

        err_data = websocket.receive_json()
        assert err_data["event_type"] == EventType.ANALYSIS_ERROR
        assert err_data["metadata"].get("error_type") in ["INVALID_BASE64", "INVALID_PAYLOAD"]

        websocket.send_text("ping")
        assert websocket.receive_text() == "pong"


def test_websocket_empty_audio_payload():
    with client.websocket_connect("/ws/sessions/VS-2026-WS-EMPTY") as websocket:
        chunk = {
            "type": "audio_chunk",
            "session_id": "VS-2026-WS-EMPTY",
            "sequence": 0,
            "sample_rate": 16000,
            "channels": 1,
            "format": "pcm_s16le",
            "duration_ms": 4000.0,
            "audio_base64": ""
        }
        websocket.send_text(json.dumps(chunk))

        err_data = websocket.receive_json()
        assert err_data["event_type"] == EventType.ANALYSIS_ERROR

        websocket.send_text("ping")
        assert websocket.receive_text() == "pong"


def test_websocket_unsupported_sample_rate():
    with client.websocket_connect("/ws/sessions/VS-2026-WS-SR") as websocket:
        chunk = {
            "type": "audio_chunk",
            "session_id": "VS-2026-WS-SR",
            "sequence": 0,
            "sample_rate": 44100,  # Invalid (must be 16000)
            "channels": 1,
            "format": "pcm_s16le",
            "duration_ms": 4000.0,
            "audio_base64": generate_test_pcm_base64()
        }
        websocket.send_text(json.dumps(chunk))

        err_data = websocket.receive_json()
        assert err_data["event_type"] == EventType.ANALYSIS_ERROR
        assert err_data["metadata"].get("error_type") == "INVALID_PAYLOAD"


def test_websocket_unsupported_channels():
    with client.websocket_connect("/ws/sessions/VS-2026-WS-CH") as websocket:
        chunk = {
            "type": "audio_chunk",
            "session_id": "VS-2026-WS-CH",
            "sequence": 0,
            "sample_rate": 16000,
            "channels": 2,  # Invalid (must be 1 mono)
            "format": "pcm_s16le",
            "duration_ms": 4000.0,
            "audio_base64": generate_test_pcm_base64()
        }
        websocket.send_text(json.dumps(chunk))

        err_data = websocket.receive_json()
        assert err_data["event_type"] == EventType.ANALYSIS_ERROR
        assert err_data["metadata"].get("error_type") == "INVALID_PAYLOAD"


def test_websocket_invalid_negative_sequence():
    with client.websocket_connect("/ws/sessions/VS-2026-WS-SEQ") as websocket:
        chunk = {
            "type": "audio_chunk",
            "session_id": "VS-2026-WS-SEQ",
            "sequence": -5,  # Invalid
            "sample_rate": 16000,
            "channels": 1,
            "format": "pcm_s16le",
            "duration_ms": 4000.0,
            "audio_base64": generate_test_pcm_base64()
        }
        websocket.send_text(json.dumps(chunk))

        err_data = websocket.receive_json()
        assert err_data["event_type"] == EventType.ANALYSIS_ERROR
        assert err_data["metadata"].get("error_type") == "INVALID_PAYLOAD"


def test_websocket_oversized_payload():
    with client.websocket_connect("/ws/sessions/VS-2026-WS-OVERSIZED") as websocket:
        # Create 600,000 byte raw payload (>500KB limit)
        huge_bytes = b"\x00" * 600000
        b64_huge = base64.b64encode(huge_bytes).decode("utf-8")
        chunk = {
            "type": "audio_chunk",
            "session_id": "VS-2026-WS-OVERSIZED",
            "sequence": 0,
            "sample_rate": 16000,
            "channels": 1,
            "format": "pcm_s16le",
            "duration_ms": 4000.0,
            "audio_base64": b64_huge
        }
        websocket.send_text(json.dumps(chunk))

        err_data = websocket.receive_json()
        assert err_data["event_type"] == EventType.ANALYSIS_ERROR
        assert err_data["metadata"].get("error_type") == "OVERSIZED_PAYLOAD"


def test_websocket_survives_errors_then_succeeds():
    session_id = "VS-2026-WS-RECOVER"
    with client.websocket_connect(f"/ws/sessions/{session_id}") as websocket:
        # Error 1: Bad JSON
        websocket.send_text("not json")
        e1 = websocket.receive_json()
        assert e1["event_type"] == EventType.ANALYSIS_ERROR

        # Error 2: Invalid base64
        websocket.send_text(json.dumps({
            "type": "audio_chunk",
            "session_id": session_id,
            "sequence": 0,
            "sample_rate": 16000,
            "channels": 1,
            "format": "pcm_s16le",
            "duration_ms": 4000.0,
            "audio_base64": "invalid"
        }))
        e2 = websocket.receive_json()
        assert e2["event_type"] == EventType.ANALYSIS_ERROR

        # Success: Valid chunk
        websocket.send_text(json.dumps({
            "type": "audio_chunk",
            "session_id": session_id,
            "sequence": 1,
            "sample_rate": 16000,
            "channels": 1,
            "format": "pcm_s16le",
            "duration_ms": 4000.0,
            "audio_base64": generate_test_pcm_base64()
        }))

        received_types = []
        for _ in range(10):
            try:
                data = websocket.receive_json()
                if "event_type" in data:
                    received_types.append(data["event_type"])
                    if data["event_type"] == EventType.ANALYSIS_COMPLETED:
                        break
            except Exception:
                break

        assert EventType.ANALYSIS_STARTED in received_types
        assert EventType.ANALYSIS_COMPLETED in received_types
