"use client";

import { useState, useCallback } from "react";
import {
  createVerificationChallenge,
  evaluateSafeWordChallenge,
  evaluateCallbackChallenge,
  ChallengeDispatchParams,
} from "@/lib/verification/verification-workflow";
import type { VerificationChallenge } from "@/types/dashboard";

export interface UseVerificationOptions {
  initialChallenges?: VerificationChallenge[];
  onChallengeUpdated?: (challenge: VerificationChallenge) => void;
}

export function useVerification(options: UseVerificationOptions = {}) {
  const [challenges, setChallenges] = useState<VerificationChallenge[]>(
    options.initialChallenges || []
  );

  const dispatchChallenge = useCallback(
    (params: ChallengeDispatchParams) => {
      const challenge = createVerificationChallenge(params);
      setChallenges((prev) => [challenge, ...prev]);
      options.onChallengeUpdated?.(challenge);
      return challenge;
    },
    [options]
  );

  const resolveSafeWord = useCallback(
    (challengeId: string, userInput: string, expectedSafeWord: string) => {
      setChallenges((prev) =>
        prev.map((c) => {
          if (c.id === challengeId) {
            const updated = evaluateSafeWordChallenge(c, userInput, expectedSafeWord);
            options.onChallengeUpdated?.(updated);
            return updated;
          }
          return c;
        })
      );
    },
    [options]
  );

  const resolveCallback = useCallback(
    (
      challengeId: string,
      outcome: "legitimate_confirmed" | "impersonation_confirmed" | "unreachable"
    ) => {
      setChallenges((prev) =>
        prev.map((c) => {
          if (c.id === challengeId) {
            const updated = evaluateCallbackChallenge(c, outcome);
            options.onChallengeUpdated?.(updated);
            return updated;
          }
          return c;
        })
      );
    },
    [options]
  );

  return {
    challenges,
    dispatchChallenge,
    resolveSafeWord,
    resolveCallback,
  };
}
