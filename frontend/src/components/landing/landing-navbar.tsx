"use client";

import React, { useState } from "react";
import { Shield, ArrowRight, Menu, X } from "lucide-react";

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Live Preview", href: "#live-preview" },
    { label: "Why Trust Fails", href: "#why-trust-fails" },
    { label: "Verification", href: "#verification" },
    { label: "Privacy", href: "#privacy" },
    { label: "Use Cases", href: "#use-cases" },
    { label: "SIH Context", href: "#sih-context" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <a href="#hero" className="flex items-center gap-3 group focus:outline-hidden">
          <div className="h-9 w-9 rounded-lg bg-[#0B132B] flex items-center justify-center text-white shadow-xs group-hover:bg-blue-600 transition-colors">
            <Shield className="h-5 w-5 fill-white/20 stroke-white stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
              VoiceShield
            </span>
            <span className="text-3xs font-medium text-slate-500 uppercase tracking-wider">
              Telephony AI Defense
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="/overview"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Security Overview
          </a>
          <a
            href="/live"
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#0B132B] hover:bg-blue-600 transition-colors shadow-xs flex items-center gap-2 group"
          >
            <span>Launch Live Console</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center sm:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 flex flex-col gap-2 shadow-lg animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-700 hover:text-blue-600 py-2 border-b border-slate-100"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <a
              href="/overview"
              className="w-full text-center py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg"
            >
              Security Overview
            </a>
            <a
              href="/live"
              className="w-full text-center py-2.5 text-xs font-semibold text-white bg-[#0B132B] rounded-lg flex items-center justify-center gap-2"
            >
              <span>Launch Live Console</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
