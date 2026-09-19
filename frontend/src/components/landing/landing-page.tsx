"use client";

import React from "react";
import { LandingNavbar } from "./landing-navbar";
import { LandingHero } from "./landing-hero";
import { LandingHowItWorks } from "./landing-how-it-works";
import { LandingLivePreview } from "./landing-live-preview";
import { LandingWhyVoiceTrustFails } from "./landing-why-voice-trust-fails";
import { LandingVerificationLayer } from "./landing-verification-layer";
import { LandingPrivacyDesign } from "./landing-privacy-design";
import { LandingUseCases } from "./landing-use-cases";
import { LandingSihContext } from "./landing-sih-context";
import { LandingCta } from "./landing-cta";
import { LandingFooter } from "./landing-footer";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Navbar */}
      <LandingNavbar />

      {/* Main Content Sections */}
      <main className="flex-1 flex flex-col">
        {/* 2. Hero */}
        <LandingHero />

        {/* 3. How VoiceShield Works */}
        <LandingHowItWorks />

        {/* 4. Live Protection Preview */}
        <LandingLivePreview />

        {/* 5. Why Existing Voice Trust Fails */}
        <LandingWhyVoiceTrustFails />

        {/* 6. Verification Layer */}
        <LandingVerificationLayer />

        {/* 7. Privacy by Design */}
        <LandingPrivacyDesign />

        {/* 8. Use Cases */}
        <LandingUseCases />

        {/* 9. SIH / Problem Context */}
        <LandingSihContext />

        {/* 10. CTA */}
        <LandingCta />
      </main>

      {/* 11. Footer */}
      <LandingFooter />
    </div>
  );
}
