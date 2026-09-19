import { ReportsScreen } from "@/components/reports";
import { AuthGuard } from "@/components/auth";

export const metadata = {
  title: "Reports & Security Insights | VoiceShield",
  description:
    "Long-term voice impersonation trends, deepfake synthesis vector patterns, secondary verification efficacy, and executive security policy hardening.",
};

export default function ReportsPage() {
  return (
    <AuthGuard>
      <ReportsScreen />
    </AuthGuard>
  );
}
