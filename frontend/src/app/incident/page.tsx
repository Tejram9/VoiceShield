import { IncidentDossier } from "@/components/incident";
import { AuthGuard } from "@/components/auth";

export const metadata = {
  title: "Incident Dossier & Case Forensics | VoiceShield",
  description: "Comprehensive case dossier for deepfake voice impersonation threats and forensic timeline.",
};

export default function IncidentPage() {
  return (
    <AuthGuard>
      <IncidentDossier />
    </AuthGuard>
  );
}
