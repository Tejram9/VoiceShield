import { VerificationScreen } from "@/components/verification";
import { AuthGuard } from "@/components/auth";

export const metadata = {
  title: "Identity Verification Challenges | VoiceShield",
  description: "Dynamic out-of-band verification challenges, pre-shared safe words, and cellular callbacks.",
};

export default function VerificationPage() {
  return (
    <AuthGuard>
      <VerificationScreen />
    </AuthGuard>
  );
}
