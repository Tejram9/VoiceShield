import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "VoiceShield" in data["service"]


def test_create_session_endpoint():
    payload = {
        "session_id": "VS-2026-TEST-API",
        "caller_name": "Alex Turner",
        "caller_role": "Executive Director",
        "caller_number": "+1 (555) 234-8901",
        "verification_state": "NOT VERIFIED"
    }
    response = client.post("/api/v1/analysis/sessions", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["session_id"] == "VS-2026-TEST-API"


def test_get_session_endpoint():
    # Create first
    client.post("/api/v1/analysis/sessions", json={"session_id": "VS-2026-FETCH"})

    # Fetch
    response = client.get("/api/v1/analysis/sessions/VS-2026-FETCH")
    assert response.status_code == 200
    data = response.json()
    assert data["session_id"] == "VS-2026-FETCH"
    assert data["caller_name"] == "Alex Turner"


def test_get_session_not_found():
    response = client.get("/api/v1/analysis/sessions/NON-EXISTENT-SESSION")
    assert response.status_code == 404


def test_analyze_segment_endpoint():
    payload = {
        "sample_rate": 16000,
        "duration_ms": 1000.0,
        "format": "pcm_s16le",
        "context_metadata": {
            "origin_risk_score": 64.0,
            "timeframe_risk_score": 50.0
        }
    }
    response = client.post("/api/v1/analysis/sessions/VS-2026-ANALYZE/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "risk_score" in data
    assert "risk_level" in data
    assert "explanation" in data
