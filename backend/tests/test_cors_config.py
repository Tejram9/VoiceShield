import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import Settings

client = TestClient(app)


def test_cors_allowed_origin_header():
    """Test that allowed origin (http://localhost:3000) receives Access-Control-Allow-Origin header."""
    response = client.get(
        "/health",
        headers={"Origin": "http://localhost:3000"}
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"
    assert response.headers.get("access-control-allow-credentials") == "true"


def test_cors_disallowed_origin_rejected():
    """Test that disallowed origin (http://untrusted-domain.com) does NOT receive Access-Control-Allow-Origin header."""
    response = client.get(
        "/health",
        headers={"Origin": "http://untrusted-domain.com"}
    )
    assert response.status_code == 200
    # Starlette CORSMiddleware does not emit allow-origin header for disallowed origins
    assert "access-control-allow-origin" not in response.headers


def test_cors_options_preflight_allowed():
    """Test preflight OPTIONS request from allowed origin."""
    response = client.options(
        "/api/v1/analysis/sessions",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type"
        }
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"


def test_cors_options_preflight_disallowed():
    """Test preflight OPTIONS request from disallowed origin is rejected without allow header."""
    response = client.options(
        "/api/v1/analysis/sessions",
        headers={
            "Origin": "http://malicious-attacker.com",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type"
        }
    )
    assert response.headers.get("access-control-allow-origin") != "http://malicious-attacker.com"


def test_settings_cors_parsing_and_production_wildcard_rejection():
    """Test that production environment rejects wildcard '*' and parses comma-separated origins."""
    # 1. Comma separated parsing in development
    s_dev = Settings(ENVIRONMENT="development", CORS_ALLOWED_ORIGINS="https://app.voiceshield.com, https://preview.voiceshield.com")
    assert s_dev.ALLOWED_ORIGINS == ["https://app.voiceshield.com", "https://preview.voiceshield.com"]

    # 2. Production with valid explicit origins
    s_prod = Settings(ENVIRONMENT="production", CORS_ALLOWED_ORIGINS="https://voiceshield.vercel.app")
    assert s_prod.ALLOWED_ORIGINS == ["https://voiceshield.vercel.app"]

    # 3. Production wildcard rejection
    with pytest.raises(ValueError, match="cannot be empty or '\\*' in production"):
        Settings(ENVIRONMENT="production", CORS_ALLOWED_ORIGINS="*")
