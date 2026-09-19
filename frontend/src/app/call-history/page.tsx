import { CallHistoryScreen } from "@/components/call-history";
import { AuthGuard } from "@/components/auth";

export const metadata = {
  title: "Call History & Forensics | VoiceShield",
  description: "Historical telephony call logs, acoustic forensic analysis, and deepfake attempt investigations.",
};

export default function CallHistoryPage() {
  return (
    <AuthGuard>
      <CallHistoryScreen />
    </AuthGuard>
  );
}
