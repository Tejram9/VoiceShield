from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    message: str


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """
    Health-check endpoint indicating backend application operational status.
    """
    return HealthResponse(
        status="ok",
        service="VoiceShield Backend",
        version="0.1.0",
        message="VoiceShield backend is running smoothly."
    )
