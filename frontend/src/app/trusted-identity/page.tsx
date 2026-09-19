import { TrustedIdentityScreen } from "@/components/trusted-identity";
import { AuthGuard } from "@/components/auth";

export const metadata = {
  title: "Trusted Identity Management | VoiceShield",
  description: "Executive voiceprint enrollment, cryptographic safe words, and identity verification settings.",
};

export default function TrustedIdentityPage() {
  return (
    <AuthGuard>
      <TrustedIdentityScreen />
    </AuthGuard>
  );
}
