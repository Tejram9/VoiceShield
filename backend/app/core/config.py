import os
from typing import Any, List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "VoiceShield Backend"
    VERSION: str = "0.1.0"
    ENVIRONMENT: str = "development"
    API_V1_STR: str = "/api/v1"
    
    BACKEND_HOST: str = "0.0.0.0"
    BACKEND_PORT: int = 8000
    
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]
    CORS_ALLOWED_ORIGINS: Union[str, List[str], None] = None

    # Risk Fusion Engine Thresholds (Configurable)
    # 0 to LOW_THRESHOLD: LOW
    # LOW_THRESHOLD+1 to MEDIUM_THRESHOLD: MEDIUM
    # MEDIUM_THRESHOLD+1 to 100: HIGH
    RISK_THRESHOLD_LOW: int = 39
    RISK_THRESHOLD_MEDIUM: int = 69

    # WebSocket Configuration
    WS_HEARTBEAT_INTERVAL_SEC: int = 30

    @field_validator("ALLOWED_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        return v

    def model_post_init(self, __context: Any = None) -> None:
        if self.CORS_ALLOWED_ORIGINS:
            if isinstance(self.CORS_ALLOWED_ORIGINS, str):
                origins = [i.strip() for i in self.CORS_ALLOWED_ORIGINS.split(",") if i.strip()]
            else:
                origins = list(self.CORS_ALLOWED_ORIGINS)
            self.ALLOWED_ORIGINS = origins

        # Hardening: Reject wildcard '*' in production
        if self.ENVIRONMENT.lower() == "production":
            self.ALLOWED_ORIGINS = [orig for orig in self.ALLOWED_ORIGINS if orig != "*"]
            if not self.ALLOWED_ORIGINS:
                raise ValueError("CORS_ALLOWED_ORIGINS / ALLOWED_ORIGINS cannot be empty or '*' in production.")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
