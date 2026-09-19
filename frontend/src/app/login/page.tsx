import React, { Suspense } from "react";
import { LoginScreen } from "@/components/auth";

export const metadata = {
  title: "Console Sign In | VoiceShield",
  description: "Sign in to the VoiceShield Real-Time Voice Impersonation Defense Operations Console.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <LoginScreen />
    </Suspense>
  );
}
