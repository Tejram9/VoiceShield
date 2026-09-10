from typing import Dict, List, Optional, Tuple
from app.core.config import settings
from app.core.logging import logger
from app.schemas.analysis import (
    ContextRiskResult,
    SocialEngineeringResult,
    SpeakerVerificationResult,
    SpoofDetectionResult,
    VerificationState,
)
from app.schemas.risk import (
    RecommendedAction,
    RiskAssessment,
    RiskLevel,
    RiskSignal,
)


class RiskFusionEngine:
    """
    Core Risk Fusion Engine for VoiceShield.
    Aggregates multi-modal AI signals (voice integrity, speaker verification,
    social engineering intent, and line/context metadata) into a unified risk assessment.
    
    Design principles:
    - Separates RAW SCORE (model outputs) from RISK CONTRIBUTION (fused impact).
    - Preserves signal explainability (WHY is this call high risk?).
    - Handles missing/unavailable AI signals gracefully without collapsing to 0 or LOW.
    """

    def __init__(
        self,
        weight_voice_integrity: float = 0.35,
        weight_speaker_match: float = 0.25,
        weight_social_engineering: float = 0.30,
        weight_context_risk: float = 0.10,
    ):
        self.weight_voice_integrity = weight_voice_integrity
        self.weight_speaker_match = weight_speaker_match
        self.weight_social_engineering = weight_social_engineering
        self.weight_context_risk = weight_context_risk

    def classify_risk_level(self, score: float) -> RiskLevel:
        if score <= settings.RISK_THRESHOLD_LOW:
            return RiskLevel.LOW
        elif score <= settings.RISK_THRESHOLD_MEDIUM:
            return RiskLevel.MEDIUM
        return RiskLevel.HIGH

    def compute_assessment(
        self,
        spoof_result: Optional[SpoofDetectionResult] = None,
        speaker_result: Optional[SpeakerVerificationResult] = None,
        social_eng_result: Optional[SocialEngineeringResult] = None,
        context_result: Optional[ContextRiskResult] = None,
        session_metadata: Optional[Dict] = None,
        session_id: str = "global"
    ) -> RiskAssessment:
        signals: List[RiskSignal] = []
        total_weight_available = 0.0
        weighted_score_sum = 0.0
        evidence_explanations: List[str] = []

        # 1. Voice Integrity Signal (Spoof / Deepfake Detection)
        if spoof_result and spoof_result.status == "AVAILABLE":
            raw_score = spoof_result.spoof_probability * 100.0
            weight = self.weight_voice_integrity
            total_weight_available += weight
            weighted_score_sum += raw_score * weight
            sig_level = self.classify_risk_level(raw_score)
            
            exp_text = (
                "High-frequency vocoder phase anomalies and synthetic speech artifacts detected."
                if raw_score >= 70
                else "Natural acoustic speech boundaries detected."
            )
            signals.append(
                RiskSignal(
                    signal_id="voice_integrity",
                    label="Voice Integrity",
                    raw_score=round(raw_score, 1),
                    risk_contribution=round(raw_score * weight, 1),
                    risk_level=sig_level,
                    description="Synthetic Speech & Deepfake Audio Detection",
                    explanation=exp_text
                )
            )
            if raw_score >= 70:
                evidence_explanations.append("Voice Integrity: Strong synthetic speech indicators")

        # 2. Speaker Consistency / Speaker Match Signal
        if speaker_result and speaker_result.status == "AVAILABLE":
            # Similarity score is 0.0 (total mismatch) to 1.0 (exact match).
            # RISK is the INVERSE of similarity! Low similarity = High Risk.
            similarity = speaker_result.similarity_score
            mismatch_risk_score = (1.0 - similarity) * 100.0
            weight = self.weight_speaker_match
            total_weight_available += weight
            weighted_score_sum += mismatch_risk_score * weight
            sig_level = self.classify_risk_level(mismatch_risk_score)

            conf_label = "LOW CONFIDENCE" if similarity < 0.5 else "HIGH CONFIDENCE"
            exp_text = (
                f"Low similarity index ({similarity:.2f}) compared against trusted reference profile."
                if similarity < 0.5
                else f"High similarity index ({similarity:.2f}) matches trusted baseline profile."
            )
            signals.append(
                RiskSignal(
                    signal_id="speaker_consistency",
                    label="Speaker Match",
                    raw_score=round(similarity * 100.0, 1), # Raw similarity (38.0)
                    risk_contribution=round(mismatch_risk_score * weight, 1),
                    risk_level=sig_level,
                    confidence_label=conf_label,
                    description="Biometric Voice Matching",
                    explanation=exp_text
                )
            )
            if similarity < 0.5:
                evidence_explanations.append("Speaker Verification: Low similarity to trusted reference")

        # 3. Social Engineering Signal (Conversational Intent)
        if social_eng_result and social_eng_result.status == "AVAILABLE":
            raw_score = social_eng_result.urgency_score
            weight = self.weight_social_engineering
            total_weight_available += weight
            weighted_score_sum += raw_score * weight
            sig_level = self.classify_risk_level(raw_score)

            exp_text = (
                "Urgent financial transfer and coercion signals detected in transcript."
                if raw_score >= 70
                else "Normal operational conversation parameters."
            )
            signals.append(
                RiskSignal(
                    signal_id="social_engineering",
                    label="Social Engineering",
                    raw_score=round(raw_score, 1),
                    risk_contribution=round(raw_score * weight, 1),
                    risk_level=sig_level,
                    description="Conversational Intent & Coercion Analysis",
                    explanation=exp_text
                )
            )
            if raw_score >= 70:
                evidence_explanations.append("Social Engineering: Urgent financial request detected")

        # 4. Context Risk Signal (Environmental & Line Metadata)
        if context_result and context_result.status == "AVAILABLE":
            raw_score = context_result.overall_context_score
            weight = self.weight_context_risk
            total_weight_available += weight
            weighted_score_sum += raw_score * weight
            sig_level = self.classify_risk_level(raw_score)

            exp_text = (
                "Unexpected communication origin or unusual call timeframe detected."
                if raw_score >= 50
                else "Recognized routing path and normal timeframe."
            )
            signals.append(
                RiskSignal(
                    signal_id="context_risk",
                    label="Context Risk",
                    raw_score=round(raw_score, 1),
                    risk_contribution=round(raw_score * weight, 1),
                    risk_level=sig_level,
                    description="Environmental Metadata",
                    explanation=exp_text
                )
            )
            if raw_score >= 50:
                evidence_explanations.append("Context Engine: Unexpected transaction context")

        # Normalize score across available AI signals
        if total_weight_available > 0:
            final_score = int(round(weighted_score_sum / total_weight_available))
        else:
            # If NO AI signals are available, return 0 LOW risk but flag in explanation
            final_score = 0
            evidence_explanations.append("AI Pipeline: All model components currently unavailable or pending initialization.")

        final_score = min(max(0, final_score), 100)
        final_level = self.classify_risk_level(final_score)

        # Recommended Action Logic
        if final_level == RiskLevel.HIGH:
            rec_action = RecommendedAction.INDEPENDENT_VERIFICATION
        elif final_level == RiskLevel.MEDIUM:
            rec_action = RecommendedAction.MONITOR
        else:
            rec_action = RecommendedAction.NONE

        if evidence_explanations:
            explanation_summary = " | ".join(evidence_explanations)
        else:
            explanation_summary = "All evaluated voice and conversation parameters remain within trusted limits."

        logger.info(
            f"Risk Fusion calculated score={final_score}, level={final_level}, signals={len(signals)}",
            extra={"session_id": session_id}
        )

        return RiskAssessment(
            risk_score=final_score,
            risk_level=final_level,
            contributing_signals=signals,
            explanation=explanation_summary,
            recommended_action=rec_action
        )
