import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.endpoints.analysis import router as analysis_router
from app.api.endpoints.health import router as health_router
from app.api.websocket.analysis_ws import router as ws_router
from app.core.config import settings
from app.core.logging import logger
from app.ai.model_registry import model_registry

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI lifespan context manager.
    Warms up AI model weights into memory at startup in a non-blocking background thread.
    """
    logger.info("Initializing VoiceShield AI Model Registry at startup...")
    # Warm load model weights in background thread to keep startup responsive
    asyncio.create_task(asyncio.to_thread(model_registry.initialize_models))
    yield
    logger.info("VoiceShield API shutting down...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="VoiceShield - Near-Real-Time Voice Impersonation Risk & Prevention System API",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Health Endpoints
app.include_router(health_router, tags=["Health"])

# Register Analysis REST API v1
app.include_router(analysis_router, prefix=settings.API_V1_STR + "/analysis", tags=["Analysis"])

# Register WebSocket Streaming Endpoint
app.include_router(ws_router, tags=["WebSocket"])


@app.get("/", tags=["Root"])
async def root():
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "running",
        "docs": "/docs",
        "api_v1": settings.API_V1_STR,
        "ai_models": model_registry.get_status_summary()
    }
