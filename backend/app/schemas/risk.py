from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class RecommendedAction(str, Enum):
    NONE = "NONE"
    MONITOR = "MONITOR"
    INDEPENDENT_VERIFICATION = "INDEPENDENT_VERIFICATION"
    TERMINATE_CALL = "TERMINATE_CALL"


class RiskSignal(BaseModel):
    """
    Representation of a single evaluated AI signal input to the Risk Fusion Engine.
    Distinguishes raw_score (what model computed) from risk_contribution (fused impact).
    """
    signal_id: str = Field(..., description="Signal identifier (e.g. voice_integrity, speaker_match)")
    label: str = Field(..., description="Human-readable signal label")
    raw_score: float = Field(..., ge=0, le=100, description="Raw model evaluation score (0-100)")
    risk_contribution: float = Field(..., ge=0, le=100, description="Calculated contribution to final fused risk score")
    risk_level: RiskLevel = Field(..., description="Categorical risk level for this signal")
    confidence_label: Optional[str] = Field(None, description="Explicit confidence label (e.g. LOW CONFIDENCE)")
    description: str = Field(..., description="Short signal description")
    explanation: str = Field(..., description="Clear textual explanation of signal direction and evidence")


class RiskAssessment(BaseModel):
    """
    Fused risk assessment computed by the Risk Fusion Engine.
    """
    risk_score: int = Field(..., ge=0, le=100, description="Final fused risk score (0-100)")
    risk_level: RiskLevel = Field(..., description="Categorical risk level (LOW, MEDIUM, HIGH)")
    contributing_signals: List[RiskSignal] = Field(default_factory=list, description="Evaluated signal breakdown")
    explanation: str = Field(..., description="Explainability summary describing why the score was assigned")
    recommended_action: RecommendedAction = Field(RecommendedAction.NONE, description="Recommended security response action")
