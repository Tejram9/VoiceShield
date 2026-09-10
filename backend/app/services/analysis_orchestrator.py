import asyncio
import datetime
import time
import uuid
from typing import Any, Dict, Optional, List
from app.ai.asr import BaseASRProvider
from app.ai.real_asr import RealWhisperASRProvider
from app.ai.speaker_verification import BaseSpeakerVerificationProvider
from app.ai.real_speaker_verification import RealECAPASpeakerProvider
from app.ai.spoof_detection import BaseSpoofDetectionProvider
from app.ai.real_spoof_detection import RealWav2Vec2SpoofProvider
from app.ai.social_engineering import BaseSocialEngineeringProvider
from app.ai.real_social_engineering import RealSocialEngineeringProvider
from app.core.logging import logger
from app.schemas.analysis import AnalysisSession, ContextRiskResult, ASRResult, SpeakerVerificationResult, SpoofDetectionResult, SocialEngineeringResult
from app.schemas.audio import AudioSegment
from app.schemas.events import EventType, SecurityEvent
from app.schemas.risk import RiskAssessment, RiskLevel
from app.services.risk_fusion import RiskFusionEngine
from app.services.session_manager import SessionManager, session_manager
from app.api.websocket.analysis_ws import ws_manager


class AnalysisOrchestrator:
    """
    Orchestration service coordinating the VoiceShield AI pipeline:
    Audio Segment -> Parallel (ASR + Speaker Verification + Spoof Detection) -> Social Engineering -> Context Risk -> Risk Fusion.
    
    Executes heavy AI model inferences in parallel on background worker threads without blocking the FastAPI event loop.
    Emits granular real-time security events over WebSockets.
    """

    def __init__(
        self,
        asr_provider: Optional[BaseASRProvider] = None,
        speaker_provider: Optional[BaseSpeakerVerificationProvider] = None,
        spoof_provider: Optional[BaseSpoofDetectionProvider] = None,
        social_eng_provider: Optional[BaseSocialEngineeringProvider] = None,
        risk_fusion_engine: Optional[RiskFusionEngine] = None,
        session_store: Optional[SessionManager] = None
    ):
        self.asr_provider = asr_provider or RealWhisperASRProvider()
        self.speaker_provider = speaker_provider or RealECAPASpeakerProvider()
        self.spoof_provider = spoof_provider or RealWav2Vec2SpoofProvider()
        self.social_eng_provider = social_eng_provider or RealSocialEngineeringProvider()
        self.risk_fusion = risk_fusion_engine or RiskFusionEngine()
        self.session_store = session_store or session_manager

    async def analyze_audio_segment(
        self,
        session_id: str,
        audio_segment: AudioSegment,
        context_metadata: Optional[Dict[str, Any]] = None
    ) -> RiskAssessment:
        logger.info(f"Orchestrating real AI analysis pipeline for session {session_id}", extra={"session_id": session_id})
        start_time_total = time.perf_counter()
        now_ts = datetime.datetime.now(datetime.timezone.utc).strftime("%H:%M:%S UTC")

        session = self.session_store.get_session(session_id)
        if not session:
            session = self.session_store.create_session(session_id=session_id)

        # Broadcast WebSocket Event: ANALYSIS_STARTED
        start_event = SecurityEvent(
            event_id=f"evt-{uuid.uuid4().hex[:8]}",
            session_id=session_id,
            timestamp=now_ts,
            event_type=EventType.ANALYSIS_STARTED,
            source="AnalysisOrchestrator",
            severity=RiskLevel.LOW,
            message="Audio segment ingested. Executing concurrent AI analysis pipeline.",
            metadata={"segment_id": audio_segment.segment_id, "duration_ms": audio_segment.duration_ms}
        )
        self.session_store.add_event(session_id, start_event)
        await ws_manager.broadcast_event(session_id, start_event)

        # Reference profile extraction if present
        ref_profile = None
        if context_metadata and "reference_profile" in context_metadata:
            ref_profile = context_metadata["reference_profile"]

        # Helper wrapper for timing & safe execution
        async def run_asr_timed():
            t0 = time.perf_counter()
            res = await self.asr_provider.safe_process(audio_segment, session_id=session_id)
            return res, (time.perf_counter() - t0) * 1000.0

        async def run_speaker_timed():
            t0 = time.perf_counter()
            if hasattr(self.speaker_provider, 'process_with_reference'):
                res = await self.speaker_provider.process_with_reference(audio_segment, ref_profile)
            else:
                res = await self.speaker_provider.safe_process(audio_segment, session_id=session_id)
            return res, (time.perf_counter() - t0) * 1000.0

        async def run_spoof_timed():
            t0 = time.perf_counter()
            res = await self.spoof_provider.safe_process(audio_segment, session_id=session_id)
            return res, (time.perf_counter() - t0) * 1000.0

        # 1. Execute ASR, Speaker Verification, and Voice Spoof Detection concurrently
        (asr_res, asr_ms), (speaker_res, speaker_ms), (spoof_res, spoof_ms) = await asyncio.gather(
            run_asr_timed(),
            run_speaker_timed(),
            run_spoof_timed()
        )

        asr_result: Optional[ASRResult] = asr_res
        speaker_result: Optional[SpeakerVerificationResult] = speaker_res
        spoof_result: Optional[SpoofDetectionResult] = spoof_res

        # Broadcast individual stage update events over WebSocket
        if asr_result:
            asr_event = SecurityEvent(
                event_id=f"evt-{uuid.uuid4().hex[:8]}",
                session_id=session_id,
                timestamp=now_ts,
                event_type=EventType.ASR_UPDATED,
                source="RealWhisperASR",
                severity=RiskLevel.LOW,
                message=f"ASR transcription completed ({asr_ms:.1f}ms): \"{asr_result.text}\"",
                metadata={"text": asr_result.text, "language": asr_result.language, "latency_ms": round(asr_ms, 2)}
            )
            self.session_store.add_event(session_id, asr_event)
            await ws_manager.broadcast_event(session_id, asr_event)

        if speaker_result:
            spk_severity = RiskLevel.HIGH if speaker_result.similarity_score < 0.50 and speaker_result.status == "AVAILABLE" else RiskLevel.LOW
            spk_event = SecurityEvent(
                event_id=f"evt-{uuid.uuid4().hex[:8]}",
                session_id=session_id,
                timestamp=now_ts,
                event_type=EventType.SPEAKER_ANALYSIS_UPDATED,
                source="RealECAPASpeaker",
                severity=spk_severity,
                message=f"Speaker verification status: {speaker_result.status} (Similarity: {speaker_result.similarity_score:.2f})",
                metadata={"similarity_score": speaker_result.similarity_score, "status": speaker_result.status, "latency_ms": round(speaker_ms, 2)}
            )
            self.session_store.add_event(session_id, spk_event)
            await ws_manager.broadcast_event(session_id, spk_event)

        if spoof_result:
            spf_severity = RiskLevel.HIGH if spoof_result.spoof_probability >= 0.70 else (RiskLevel.MEDIUM if spoof_result.spoof_probability >= 0.40 else RiskLevel.LOW)
            spf_event = SecurityEvent(
                event_id=f"evt-{uuid.uuid4().hex[:8]}",
                session_id=session_id,
                timestamp=now_ts,
                event_type=EventType.SPOOF_ANALYSIS_UPDATED,
                source="RealWav2Vec2Spoof",
                severity=spf_severity,
                message=f"Voice spoof probability evaluated at {spoof_result.spoof_probability:.4f}",
                metadata={"spoof_probability": spoof_result.spoof_probability, "indicators": spoof_result.indicators, "latency_ms": round(spoof_ms, 2)}
            )
            self.session_store.add_event(session_id, spf_event)
            await ws_manager.broadcast_event(session_id, spf_event)

        # 2. Execute Social Engineering Analysis if transcript is available
        social_eng_result: Optional[SocialEngineeringResult] = None
        social_eng_ms = 0.0
        if asr_result and asr_result.text:
            t0 = time.perf_counter()
            social_eng_result = await self.social_eng_provider.safe_process(asr_result.text, session_id=session_id)
            social_eng_ms = (time.perf_counter() - t0) * 1000.0

            if social_eng_result:
                se_severity = RiskLevel.HIGH if social_eng_result.urgency_score >= 60 else RiskLevel.LOW
                se_event = SecurityEvent(
                    event_id=f"evt-{uuid.uuid4().hex[:8]}",
                    session_id=session_id,
                    timestamp=now_ts,
                    event_type=EventType.SOCIAL_ENGINEERING_UPDATED,
                    source="RealSocialEngineeringNLP",
                    severity=se_severity,
                    message=f"Social engineering urgency score: {social_eng_result.urgency_score}/100",
                    metadata={"urgency_score": social_eng_result.urgency_score, "findings_count": len(social_eng_result.findings), "latency_ms": round(social_eng_ms, 2)}
                )
                self.session_store.add_event(session_id, se_event)
                await ws_manager.broadcast_event(session_id, se_event)

                # Broadcast specific security findings if present
                for finding in social_eng_result.findings:
                    fnd_event = SecurityEvent(
                        event_id=f"evt-{uuid.uuid4().hex[:8]}",
                        session_id=session_id,
                        timestamp=now_ts,
                        event_type=EventType.SECURITY_FINDING,
                        source="SocialEngineeringNLP",
                        severity=finding.severity,
                        message=f"{finding.title}: {finding.details}",
                        metadata={"category": finding.category, "confidence": finding.confidence}
                    )
                    self.session_store.add_event(session_id, fnd_event)
                    await ws_manager.broadcast_event(session_id, fnd_event)

        # 3. Evaluate Context Risk Metadata
        context_result: Optional[ContextRiskResult] = None
        if context_metadata:
            origin_score = float(context_metadata.get("origin_risk_score", 0.0))
            timeframe_score = float(context_metadata.get("timeframe_risk_score", 0.0))
            overall_context = max(origin_score, timeframe_score)
            context_result = ContextRiskResult(
                origin_risk_score=origin_score,
                timeframe_risk_score=timeframe_score,
                overall_context_score=overall_context,
                status="AVAILABLE"
            )

        # 4. Perform Fused Risk Assessment
        t0 = time.perf_counter()
        assessment = self.risk_fusion.compute_assessment(
            spoof_result=spoof_result,
            speaker_result=speaker_result,
            social_eng_result=social_eng_result,
            context_result=context_result,
            session_metadata=context_metadata,
            session_id=session_id
        )
        risk_fusion_ms = (time.perf_counter() - t0) * 1000.0
        total_pipeline_ms = (time.perf_counter() - start_time_total) * 1000.0

        # Update Session State
        self.session_store.update_assessment(session_id, assessment)

        # Broadcast Risk Update Event
        risk_event = SecurityEvent(
            event_id=f"evt-{uuid.uuid4().hex[:8]}",
            session_id=session_id,
            timestamp=now_ts,
            event_type=EventType.RISK_UPDATE,
            source="RiskFusionEngine",
            severity=assessment.risk_level,
            message=f"Fused risk score evaluated at {assessment.risk_score}/100 ({assessment.risk_level})",
            confidence=1.0,
            metadata={
                "risk_score": assessment.risk_score,
                "explanation": assessment.explanation,
                "pipeline_latency_ms": round(total_pipeline_ms, 2)
            }
        )
        self.session_store.add_event(session_id, risk_event)
        await ws_manager.broadcast_event(session_id, risk_event)

        # Broadcast ANALYSIS_COMPLETED Event
        completed_event = SecurityEvent(
            event_id=f"evt-{uuid.uuid4().hex[:8]}",
            session_id=session_id,
            timestamp=now_ts,
            event_type=EventType.ANALYSIS_COMPLETED,
            source="AnalysisOrchestrator",
            severity=assessment.risk_level,
            message=f"Pipeline execution completed in {total_pipeline_ms:.2f}ms.",
            metadata={
                "asr_latency_ms": round(asr_ms, 2),
                "speaker_latency_ms": round(speaker_ms, 2),
                "spoof_latency_ms": round(spoof_ms, 2),
                "social_eng_latency_ms": round(social_eng_ms, 2),
                "total_pipeline_ms": round(total_pipeline_ms, 2)
            }
        )
        self.session_store.add_event(session_id, completed_event)
        await ws_manager.broadcast_event(session_id, completed_event)

        return assessment


# Global default orchestrator instance
orchestrator = AnalysisOrchestrator()
