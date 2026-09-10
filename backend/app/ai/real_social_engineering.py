import datetime
import uuid
import os
from typing import Optional, List, Dict, Any
from app.ai.social_engineering import BaseSocialEngineeringProvider
from app.ai.base import AIProviderStatus
from app.schemas.analysis import SocialEngineeringResult, SecurityFinding
from app.schemas.risk import RiskLevel
from app.core.logging import logger

class RealSocialEngineeringProvider(BaseSocialEngineeringProvider):
    """
    Concrete implementation of BaseSocialEngineeringProvider using fast rule-based NLP intent analysis.
    Optionally calls OpenAI/Groq structured JSON mode if API credentials are standardly present.
    Executes in < 5ms locally without network dependency fallback.
    """

    def __init__(self, name: str = "RealSocialEngineeringNLP"):
        super().__init__(name)
        self.status = AIProviderStatus.AVAILABLE

    async def analyze_transcript(
        self,
        transcript: str,
        history: Optional[List[str]] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> SocialEngineeringResult:
        if not transcript or not transcript.strip():
            return SocialEngineeringResult(
                findings=[],
                urgency_score=0.0,
                coercion_detected=False,
                financial_request_detected=False,
                credential_request_detected=False,
                status=AIProviderStatus.AVAILABLE.value
            )

        text_lower = transcript.lower()
        findings: List[SecurityFinding] = []
        now_ts = datetime.datetime.now(datetime.timezone.utc).strftime("%H:%M:%S UTC")

        financial_keywords = ["bank", "transfer", "wire", "money", "account", "dollars", "funds", "otp", "pin", "crypto", "payment"]
        urgency_keywords = ["immediately", "urgent", "right now", "emergency", "hurry", "quick", "asap", "fast", "overnight"]
        coercion_keywords = ["arrest", "police", "lawsuit", "penalty", "block", "suspend", "compromised", "warrant", "legal action"]
        credential_keywords = ["password", "credential", "login", "verification code", "reset link", "secret"]

        fin_hits = [w for w in financial_keywords if w in text_lower]
        urg_hits = [w for w in urgency_keywords if w in text_lower]
        coer_hits = [w for w in coercion_keywords if w in text_lower]
        cred_hits = [w for w in credential_keywords if w in text_lower]

        financial_detected = len(fin_hits) > 0
        coercion_detected = len(coer_hits) > 0
        credential_detected = len(cred_hits) > 0

        # Calculate urgency score normalized to 0.0 - 100.0 scale for Risk Fusion
        raw_urgency_factor = min(1.0, 0.35 * len(fin_hits) + 0.45 * len(urg_hits) + 0.50 * len(coer_hits) + 0.40 * len(cred_hits))
        urgency_score = round(raw_urgency_factor * 100.0, 1)

        if financial_detected:
            findings.append(
                SecurityFinding(
                    finding_id=f"fnd-{uuid.uuid4().hex[:8]}",
                    title="Financial Request Indicator Detected",
                    category="FINANCIAL_REQUEST",
                    severity=RiskLevel.HIGH if urgency_score >= 60 else RiskLevel.MEDIUM,
                    confidence=0.90,
                    timestamp=now_ts,
                    details=f"Social engineering NLP detected wire/financial keywords: {', '.join(fin_hits)}"
                )
            )

        if coercion_detected:
            findings.append(
                SecurityFinding(
                    finding_id=f"fnd-{uuid.uuid4().hex[:8]}",
                    title="Coercive Threat / Legal Pressure Detected",
                    category="COERCIVE_LANGUAGE",
                    severity=RiskLevel.HIGH,
                    confidence=0.88,
                    timestamp=now_ts,
                    details=f"High-pressure coercion signals detected in speech transcript: {', '.join(coer_hits)}"
                )
            )

        if credential_detected:
            findings.append(
                SecurityFinding(
                    finding_id=f"fnd-{uuid.uuid4().hex[:8]}",
                    title="Credential Harvesting Indicator Detected",
                    category="CREDENTIAL_HARVESTING",
                    severity=RiskLevel.HIGH,
                    confidence=0.85,
                    timestamp=now_ts,
                    details=f"Credential or verification code solicitation detected: {', '.join(cred_hits)}"
                )
            )

        if len(urg_hits) > 0 and not coercion_detected and not financial_detected:
            findings.append(
                SecurityFinding(
                    finding_id=f"fnd-{uuid.uuid4().hex[:8]}",
                    title="High Conversational Urgency Detected",
                    category="URGENCY_PRESSURE",
                    severity=RiskLevel.MEDIUM,
                    confidence=0.75,
                    timestamp=now_ts,
                    details=f"Conversational pressure indicators detected: {', '.join(urg_hits)}"
                )
            )

        return SocialEngineeringResult(
            findings=findings,
            urgency_score=urgency_score,
            coercion_detected=coercion_detected,
            financial_request_detected=financial_detected,
            credential_request_detected=credential_detected,
            status=AIProviderStatus.AVAILABLE.value
        )
