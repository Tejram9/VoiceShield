import { ProtectionOverviewScreen } from "@/components/protection-overview";
import { AuthGuard } from "@/components/auth";

export const metadata = {
  title: "Protection Overview | VoiceShield",
  description:
    "Executive security posture, active threat containment status, real-time telephony defense metrics, and voice impersonation incident telemetry.",
};

export default function OverviewPage() {
  return (
    <AuthGuard>
      <ProtectionOverviewScreen />
    </AuthGuard>
  );
}
