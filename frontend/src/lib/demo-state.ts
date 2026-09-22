export type DemoStage =
  | "STAGE_1_NORMAL"
  | "STAGE_2_URGENCY"
  | "STAGE_3_SPEAKER_MISMATCH"
  | "STAGE_4_SYNTHETIC_CLONE"
  | "STAGE_5_CONTAINED";

export interface DemoStageMeta {
  id: DemoStage;
  step: number;
  title: string;
  shortTitle: string;
  risk: "LOW" | "ELEVATED" | "HIGH" | "CRITICAL" | "CONTAINED";
  description: string;
}

export const DEMO_STAGES: DemoStageMeta[] = [
  {
    id: "STAGE_1_NORMAL",
    step: 1,
    title: "1. Normal",
    shortTitle: "Normal",
    risk: "LOW",
    description: "Natural acoustic baseline; voice signatures match enrolled biometric profile.",
  },
  {
    id: "STAGE_2_URGENCY",
    step: 2,
    title: "2. Urgency Detected",
    shortTitle: "Urgency",
    risk: "ELEVATED",
    description: "Artificial urgency phrasing detected typical of executive impersonation coercion.",
  },
  {
    id: "STAGE_3_SPEAKER_MISMATCH",
    step: 3,
    title: "3. Speaker Mismatch",
    shortTitle: "Mismatch",
    risk: "HIGH",
    description: "Vocal tract acoustic embedding diverges from verified reference voiceprint.",
  },
  {
    id: "STAGE_4_SYNTHETIC_CLONE",
    step: 4,
    title: "4. Synthetic Clone",
    shortTitle: "High Risk",
    risk: "HIGH",
    description: "Neural vocoder phase anomalies confirm AI voice cloning; active executive override attempted.",
  },
  {
    id: "STAGE_5_CONTAINED",
    step: 5,
    title: "5. Contained",
    shortTitle: "Contained",
    risk: "CONTAINED",
    description: "Out-of-band verification confirmed attack; wire transfer paused and threat contained.",
  },
];

export interface SignalItemData {
  id: string;
  name: string;
  description: string;
  status: "Safe" | "Elevated" | "High" | "Concern" | "Mismatch";
  statusType: "safe" | "caution" | "threat" | "critical";
  technicalMetric: string;
}

export interface TimelineEventData {
  time: string;
  title: string;
  description: string;
  severity: "safe" | "caution" | "threat" | "critical" | "contained";
}

export interface DemoStageData {
  stage: DemoStage;
  riskLevel: "LOW" | "ELEVATED" | "HIGH" | "CRITICAL" | "CONTAINED";
  riskHeadline: string;
  riskExplanation: string;
  whyRiskyBullets: string[];
  caller: {
    name: string;
    initials: string;
    role: string;
    phone: string;
    isTrustedContact: boolean;
    isVerifiedNumber: boolean;
    hasSensitiveAction: boolean;
    sensitiveActionText: string;
  };
  liveCall: {
    duration: string;
    durationSeconds: number;
    audioQuality: "Good" | "Fair" | "Limited";
    speakerName: string;
    speakerTimestamp: string;
    transcriptText: string;
    semanticTags: Array<{ label: string; type: "urgency" | "financial" | "isolation" | "normal" }>;
  };
  signals: SignalItemData[];
  timeline: TimelineEventData[];
  recommendedAction: {
    type: "continue" | "verify" | "pause" | "contained";
    title: string;
    subtitle: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText?: string;
  };
}

export function getDemoStageData(stage: DemoStage): DemoStageData {
  switch (stage) {
    case "STAGE_1_NORMAL":
      return {
        stage,
        riskLevel: "LOW",
        riskHeadline: "Voice Authenticity Verified",
        riskExplanation: "The current call matches enrolled acoustic baselines with no coercion patterns.",
        whyRiskyBullets: [
          "Acoustic phase coherence matches human vocal tract parameters",
          "Biometric embedding cosine similarity is 0.94 (well above 0.75 cutoff)",
          "Conversation content consists of standard operational inquiry",
        ],
        caller: {
          name: "Rahul Sharma",
          initials: "RS",
          role: "Chief Financial Officer",
          phone: "+91 98765 43210",
          isTrustedContact: true,
          isVerifiedNumber: true,
          hasSensitiveAction: false,
          sensitiveActionText: "Routine administrative inquiry",
        },
        liveCall: {
          duration: "00:28",
          durationSeconds: 28,
          audioQuality: "Good",
          speakerName: "CALLER",
          speakerTimestamp: "00:24",
          transcriptText: "Hi Rachel, checking in regarding the standard quarterly vendor reconciliation schedule.",
          semanticTags: [],
        },
        signals: [
          {
            id: "voice-authenticity",
            name: "Voice Authenticity",
            description: "Acoustic envelope shows natural human harmonics.",
            status: "Safe",
            statusType: "safe",
            technicalMetric: "Phase Coherence: 0.96 (Nominal)",
          },
          {
            id: "speaker-consistency",
            name: "Speaker Consistency",
            description: "Matches enrolled biometric profile.",
            status: "Safe",
            statusType: "safe",
            technicalMetric: "ECAPA-TDNN Cosine: 0.94",
          },
          {
            id: "conversation-analysis",
            name: "Conversation Analysis",
            description: "No coercive language or financial pressure detected.",
            status: "Safe",
            statusType: "safe",
            technicalMetric: "Urgency Score: 4/100",
          },
          {
            id: "context-analysis",
            name: "Context Analysis",
            description: "Standard business hours inbound trunk.",
            status: "Safe",
            statusType: "safe",
            technicalMetric: "STIR/SHAKEN: Attestation Level A",
          },
        ],
        timeline: [
          {
            time: "00:20",
            title: "Caller identified",
            description: "Known contact with verified number.",
            severity: "safe",
          },
        ],
        recommendedAction: {
          type: "continue",
          title: "RECOMMENDED ACTION",
          subtitle: "CONTINUE MONITORING",
          description: "No threats detected. Voice signatures and biometric resonances match enrolled baseline.",
          primaryButtonText: "Continue Call",
          secondaryButtonText: "View Profile",
        },
      };

    case "STAGE_2_URGENCY":
      return {
        stage,
        riskLevel: "ELEVATED",
        riskHeadline: "Artificial Urgency Detected",
        riskExplanation: "The caller introduced high-pressure emergency phrasing to bypass review windows.",
        whyRiskyBullets: [
          "Caller explicitly demanded twenty-minute deadline execution",
          "Psychological urgency pattern correlates with social engineering coercion",
          "Acoustic characteristics are still undergoing multi-frame evaluation",
        ],
        caller: {
          name: "Rahul Sharma",
          initials: "RS",
          role: "Chief Financial Officer",
          phone: "+91 98765 43210",
          isTrustedContact: true,
          isVerifiedNumber: true,
          hasSensitiveAction: true,
          sensitiveActionText: "Urgent 20-minute wire transfer deadline claimed",
        },
        liveCall: {
          duration: "00:58",
          durationSeconds: 58,
          audioQuality: "Good",
          speakerName: "CALLER",
          speakerTimestamp: "00:55",
          transcriptText: "Rachel, we need this emergency payment authorized right now before my Zurich flight boards.",
          semanticTags: [{ label: "URGENCY", type: "urgency" }],
        },
        signals: [
          {
            id: "voice-authenticity",
            name: "Voice Authenticity",
            description: "Evaluating high-frequency spectral phase.",
            status: "Safe",
            statusType: "safe",
            technicalMetric: "Phase Coherence: 0.88",
          },
          {
            id: "speaker-consistency",
            name: "Speaker Consistency",
            description: "Biometric voiceprint matches baseline.",
            status: "Safe",
            statusType: "safe",
            technicalMetric: "ECAPA-TDNN Cosine: 0.82",
          },
          {
            id: "conversation-analysis",
            name: "Conversation Analysis",
            description: "Artificial urgency phrasing detected.",
            status: "Elevated",
            statusType: "caution",
            technicalMetric: "Urgency Score: 58/100",
          },
          {
            id: "context-analysis",
            name: "Context Analysis",
            description: "Sensitive transaction window requested.",
            status: "Elevated",
            statusType: "caution",
            technicalMetric: "STIR/SHAKEN: Attestation Level B",
          },
        ],
        timeline: [
          {
            time: "00:55",
            title: "Urgency language detected",
            description: "Unusual urgency in conversation.",
            severity: "caution",
          },
          {
            time: "00:20",
            title: "Caller identified",
            description: "Known contact with verified number.",
            severity: "safe",
          },
        ],
        recommendedAction: {
          type: "verify",
          title: "RECOMMENDED ACTION",
          subtitle: "VERIFICATION RECOMMENDED",
          description: "Challenge the caller with pre-shared safe word before authorizing emergency disbursement.",
          primaryButtonText: "Verify Caller",
          secondaryButtonText: "Pause Action",
        },
      };

    case "STAGE_3_SPEAKER_MISMATCH":
    case "STAGE_4_SYNTHETIC_CLONE":
      // Matches the exact visual state in the reference image!
      return {
        stage,
        riskLevel: "HIGH",
        riskHeadline: "Potential impersonation detected.",
        riskExplanation: "The current call shows speaker inconsistency and a sensitive financial request.",
        whyRiskyBullets: [
          "Voice authenticity concern: Neural vocoder phase discontinuities at 1.24kHz",
          "Speaker consistency mismatch: ECAPA-TDNN embedding diverges from Rahul Sharma (Cosine 0.54 vs >=0.75)",
          "Coercive social engineering: Demanded complete confidentiality and isolation from colleagues",
          "Context anomaly: Caller requested $45,000 off-ledger disbursement to unverified escrow",
        ],
        caller: {
          name: "Rahul Sharma",
          initials: "RS",
          role: "Chief Financial Officer",
          phone: "+91 98765 43210",
          isTrustedContact: true,
          isVerifiedNumber: true,
          hasSensitiveAction: true,
          sensitiveActionText: "Financial request",
        },
        liveCall: {
          duration: "02:17",
          durationSeconds: 137,
          audioQuality: "Good",
          speakerName: "CALLER",
          speakerTimestamp: "01:08",
          transcriptText: "“We need to complete the payment immediately. Please don’t involve anyone else.”",
          semanticTags: [
            { label: "URGENCY", type: "urgency" },
            { label: "FINANCIAL REQUEST", type: "financial" },
            { label: "ISOLATION", type: "isolation" },
          ],
        },
        signals: [
          {
            id: "voice-authenticity",
            name: "Voice Authenticity",
            description: "Possible synthetic/manipulated audio signals.",
            status: "Concern",
            statusType: "threat",
            technicalMetric: "Phase Jitter @ 1.24kHz (Neural Vocoder Artifact)",
          },
          {
            id: "speaker-consistency",
            name: "Speaker Consistency",
            description: "Current voice differs from trusted profile.",
            status: "Mismatch",
            statusType: "critical",
            technicalMetric: "Cosine Distance: 0.54 (Threshold >= 0.75)",
          },
          {
            id: "conversation-analysis",
            name: "Conversation Analysis",
            description: "Urgency + financial request detected.",
            status: "High",
            statusType: "threat",
            technicalMetric: "Coercion Index: 86/100 · Isolation Pattern",
          },
          {
            id: "context-analysis",
            name: "Context Analysis",
            description: "Sensitive workflow / financial action.",
            status: "Elevated",
            statusType: "caution",
            technicalMetric: "Carrier Attestation: Level B (Partial)",
          },
        ],
        timeline: [
          {
            time: "01:44",
            title: "Risk increased to HIGH",
            description: "Multiple signals now indicate elevated risk.",
            severity: "critical",
          },
          {
            time: "01:31",
            title: "Speaker Inconsistency detected",
            description: "Current voice differs from trusted profile.",
            severity: "threat",
          },
          {
            time: "01:17",
            title: "Financial request detected",
            description: "Sensitive action requested.",
            severity: "caution",
          },
          {
            time: "00:55",
            title: "Urgency language detected",
            description: "Unusual urgency in conversation.",
            severity: "caution",
          },
          {
            time: "00:20",
            title: "Caller identified",
            description: "Known contact with verified number.",
            severity: "safe",
          },
        ],
        recommendedAction: {
          type: "pause",
          title: "RECOMMENDED ACTION",
          subtitle: "PROTECTIVE ACTION RECOMMENDED",
          description: "Verify the caller independently before continuing the sensitive action.",
          primaryButtonText: "Verify Caller",
          secondaryButtonText: "Pause Action",
        },
      };

    case "STAGE_5_CONTAINED":
      return {
        stage,
        riskLevel: "CONTAINED",
        riskHeadline: "Threat Contained — Incident Logged",
        riskExplanation: "Independent cellular callback verified legitimate CFO was not on this call. $45,000 wire frozen.",
        whyRiskyBullets: [
          "Out-of-band cellular contact reached genuine CFO who confirmed impersonation attack",
          "Sensitive wire release locked per Corporate Fraud Policy 4.1",
          "Zero financial loss incurred; evidentiary SHA-256 audio hash generated",
        ],
        caller: {
          name: "Rahul Sharma (Impersonated)",
          initials: "RS",
          role: "Chief Financial Officer",
          phone: "+91 98765 43210",
          isTrustedContact: true,
          isVerifiedNumber: true,
          hasSensitiveAction: true,
          sensitiveActionText: "Wire transfer frozen — Incident INC-2026-0042",
        },
        liveCall: {
          duration: "02:45",
          durationSeconds: 165,
          audioQuality: "Good",
          speakerName: "OPERATOR",
          speakerTimestamp: "02:30",
          transcriptText: "Action paused per Fraud Policy 4.1. Legitimate CFO verified via cellular line; confirmed impersonation attempt.",
          semanticTags: [{ label: "CONTAINED", type: "isolation" }],
        },
        signals: [
          {
            id: "voice-authenticity",
            name: "Voice Authenticity",
            description: "Confirmed synthetic voice conversion model.",
            status: "Concern",
            statusType: "threat",
            technicalMetric: "Diffusion Vocoder Fingerprint Confirmed",
          },
          {
            id: "speaker-consistency",
            name: "Speaker Consistency",
            description: "Biometric mismatch verified out-of-band.",
            status: "Mismatch",
            statusType: "critical",
            technicalMetric: "Biometric Divergence Logged",
          },
          {
            id: "conversation-analysis",
            name: "Conversation Analysis",
            description: "Wire fraud social engineering confirmed.",
            status: "High",
            statusType: "threat",
            technicalMetric: "Incident INC-2026-0042",
          },
          {
            id: "context-analysis",
            name: "Context Analysis",
            description: "Trunk flagged and isolated.",
            status: "Elevated",
            statusType: "caution",
            technicalMetric: "SIP Gateway Blacklisted",
          },
        ],
        timeline: [
          {
            time: "02:30",
            title: "Threat neutralized & wire frozen",
            description: "Out-of-band callback confirmed attack; Policy 4.1 enforced.",
            severity: "contained",
          },
          {
            time: "01:44",
            title: "Risk increased to HIGH",
            description: "Multiple signals now indicate elevated risk.",
            severity: "critical",
          },
          {
            time: "01:31",
            title: "Speaker Inconsistency detected",
            description: "Current voice differs from trusted profile.",
            severity: "threat",
          },
          {
            time: "01:17",
            title: "Financial request detected",
            description: "Sensitive action requested.",
            severity: "caution",
          },
          {
            time: "00:55",
            title: "Urgency language detected",
            description: "Unusual urgency in conversation.",
            severity: "caution",
          },
          {
            time: "00:20",
            title: "Caller identified",
            description: "Known contact with verified number.",
            severity: "safe",
          },
        ],
        recommendedAction: {
          type: "contained",
          title: "PROTECTIVE ACTION ENFORCED",
          subtitle: "WIRE TRANSFER FROZEN",
          description: "Incident INC-2026-0042 logged. Evidence package exported to SOC triage queue.",
          primaryButtonText: "View Incident Dossier",
          secondaryButtonText: "Reset Scenario",
        },
      };
  }
}
