import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_websocket_connection_lifecycle():
    with client.websocket_connect("/ws/sessions/VS-2026-WS-TEST") as websocket:
        # Send ping heartbeat
        websocket.send_text("ping")
        data = websocket.receive_text()
        assert data == "pong"
