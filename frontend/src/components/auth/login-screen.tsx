"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, DEMO_ACCOUNTS, DemoRole } from "@/lib/auth";
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  KeyRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function LoginScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/live";

  const { isAuthenticated, login, loginAsDemoRole } = useAuth();

  const [email, setEmail] = useState<string>("officer@voiceshield.internal");
  const [password, setPassword] = useState<string>("Shield2026!");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // If already authenticated, redirect to destination
  useEffect(() => {
    if (isAuthenticated) {
      router.replace(from);
    }
  }, [isAuthenticated, from, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await login({ email, password });
      if (result.success) {
        router.replace(from);
      } else {
        setError(result.error || "Authentication failed. Invalid credentials.");
      }
    } catch {
      setError("An unexpected error occurred during sign-in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (role: DemoRole) => {
    setError(null);
    setIsSubmitting(true);
    const account = DEMO_ACCOUNTS[role];
    setEmail(account.email);
    setPassword(account.password);

    try {
      const result = await loginAsDemoRole(role);
      if (result.success) {
        router.replace(from);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header / Public Link */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-lg bg-[#0B132B] flex items-center justify-center text-white shadow-xs group-hover:bg-blue-600 transition-colors">
            <Shield className="h-4.5 w-4.5 fill-white/20 stroke-white stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-slate-900 leading-none group-hover:text-blue-600 transition-colors">
              VoiceShield
            </span>
            <span className="text-3xs text-slate-400 font-mono mt-0.5">
              Telephony AI Defense
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1"
        >
          <span>Public Landing Page</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Main Authentication Card */}
      <div className="max-w-md w-full mx-auto my-8">
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-[#0B132B] mb-3">
              <Lock className="h-5 w-5 text-blue-600" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Console Sign In
            </h1>
            <p className="text-xs text-slate-500 mt-1 leading-normal">
              Enter your credentials or select an evaluator demo profile.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in-50"
            >
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="font-bold text-2xs uppercase tracking-wider text-rose-700">
                  Authentication Error
                </span>
                <span className="text-2xs leading-normal mt-0.5">{error}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="auth-email"
                className="text-2xs font-bold uppercase tracking-wider text-slate-600"
              >
                Corporate Identity / Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="auth-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@voiceshield.internal"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white text-slate-900 placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="auth-password"
                  className="text-2xs font-bold uppercase tracking-wider text-slate-600"
                >
                  Password
                </label>
                <span className="text-3xs text-slate-400">Demo: Shield2026!</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-white text-slate-900 placeholder:text-slate-400 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-[#0B132B] hover:bg-blue-600 transition-colors shadow-xs flex items-center justify-center gap-2 mt-2",
                isSubmitting && "opacity-70 cursor-wait"
              )}
            >
              <span>{isSubmitting ? "Authenticating..." : "Sign In to Console"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          {/* Quick Demo Login Switcher */}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-3xs font-bold uppercase tracking-wider text-slate-500">
                Quick Evaluator Profiles
              </span>
              <span className="text-3xs text-emerald-700 font-mono font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                1-Click Login
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {(Object.keys(DEMO_ACCOUNTS) as DemoRole[]).map((roleKey) => {
                const acc = DEMO_ACCOUNTS[roleKey];
                return (
                  <button
                    key={roleKey}
                    type="button"
                    onClick={() => handleQuickLogin(roleKey)}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-left transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-7 w-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-2xs text-slate-700 shrink-0">
                        {acc.avatarInitials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                          {acc.name}
                        </span>
                        <span className="text-3xs text-slate-500 truncate">
                          {acc.roleTitle} · {acc.department}
                        </span>
                      </div>
                    </div>
                    <span className="text-2xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                      Sign In &rarr;
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Prototype Scope Note */}
        <div className="mt-4 p-3 rounded-xl bg-slate-100/80 border border-slate-200 text-center text-3xs text-slate-500 leading-relaxed">
          <strong>Prototype Session Layer:</strong> Calibrated for Smart India Hackathon 2026 evaluation. Authenticated sessions are persisted in local browser storage. Replaceable with FastAPI + JWT token authentication.
        </div>
      </div>

      {/* Bottom Footer Stamp */}
      <div className="max-w-7xl mx-auto w-full text-center text-3xs text-slate-400">
        VoiceShield Impersonation Defense · Smart India Hackathon 2026 · Problem Statement 26104
      </div>
    </div>
  );
}
