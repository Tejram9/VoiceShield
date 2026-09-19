import { LiveProtectionPage } from "@/components/live-protection";
import { AuthGuard } from "@/components/auth";

export const metadata = {
  title: "Live Protection Console | VoiceShield",
  description:
    "Real-time telephony session defense, acoustic feature analysis, speaker verification, and deterministic Policy 4.1 threat containment.",
};

export default function LiveProtectionRoute() {
  return (
    <AuthGuard>
      <LiveProtectionPage />
    </AuthGuard>
  );
}
