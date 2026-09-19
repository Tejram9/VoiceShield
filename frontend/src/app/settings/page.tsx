import { SecurityPrivacyScreen } from "@/components/security-privacy";
import { AuthGuard } from "@/components/auth";

export const metadata = {
  title: "Security & Privacy | VoiceShield",
  description:
    "Enterprise voice telemetry privacy guarantees, zero raw-audio storage policies, edge enclave processing, and user data rights controls.",
};

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SecurityPrivacyScreen />
    </AuthGuard>
  );
}
