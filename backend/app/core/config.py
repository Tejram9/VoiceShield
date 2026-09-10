import os
from typing import List, Union
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
            return [i.strip() for i in v.split(",")]
        return v

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
