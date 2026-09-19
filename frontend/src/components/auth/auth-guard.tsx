"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth, DemoRole } from "@/lib/auth";
import { Shield, Lock } from "lucide-react";

export interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: DemoRole[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { user, isAuthenticated, isLoading, switchRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirectUrl = pathname ? `/login?from=${encodeURIComponent(pathname)}` : "/login";
      router.replace(redirectUrl);
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  // Initial hydration loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-[#0B132B] flex items-center justify-center text-white shadow-md animate-pulse">
            <Shield className="h-6 w-6 fill-white/20 stroke-white stroke-[2.2]" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold text-slate-800">
              Validating Session
            </span>
            <span className="text-3xs text-slate-400 font-mono mt-0.5">
              VoiceShield Telephony Defense
            </span>
          </div>
        </div>
      </div>
    );
  }

  // If unauthenticated, render redirecting placeholder
  if (!isAuthenticated) {
    return null;
  }

  // Optional role restrictions check
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-center flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-3xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Prototype RBAC Advisory
            </span>
            <h2 className="text-base font-bold text-slate-900 mt-2">
              Restricted Demo Area
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Your active demo role (<strong>{user.roleTitle}</strong>) does not have authorization to access this area in this evaluation scenario.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 w-full flex flex-col gap-2">
            <span className="text-3xs text-slate-400">
              Switch role to continue evaluation:
            </span>
            <div className="flex items-center justify-center gap-2">
              {allowedRoles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => switchRole(role)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Switch to {role.replace("_", " ")}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => router.push("/live")}
              className="mt-2 text-xs text-blue-600 hover:underline font-medium"
            >
              Return to Live Console
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
