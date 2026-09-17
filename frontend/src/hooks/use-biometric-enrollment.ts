"use client";

import { useState, useCallback } from "react";
import {
  EnrollmentPhase,
  EnrollmentPayload,
  createEnrolledContact,
  verifySafeWordMatch,
} from "@/lib/biometrics/biometric-enrollment";
import type { TrustedContact } from "@/types/dashboard";

export interface UseBiometricEnrollmentOptions {
  initialContacts?: TrustedContact[];
  onContactEnrolled?: (contact: TrustedContact) => void;
}

export function useBiometricEnrollment(options: UseBiometricEnrollmentOptions = {}) {
  const [contacts, setContacts] = useState<TrustedContact[]>(options.initialContacts || []);
  const [phase, setPhase] = useState<EnrollmentPhase>("IDLE");
  const [calibrationProgress, setCalibrationProgress] = useState(0);

  const startCalibration = useCallback(() => {
    setPhase("RECORDING");
    setCalibrationProgress(0);
  }, []);

  const completeCalibration = useCallback(() => {
    setPhase("CALIBRATING");
    setCalibrationProgress(100);
    setPhase("COMPLETED");
  }, []);

  const enrollContact = useCallback(
    (payload: EnrollmentPayload) => {
      const contact = createEnrolledContact(payload);
      setContacts((prev) => [contact, ...prev]);
      options.onContactEnrolled?.(contact);
      setPhase("IDLE");
      setCalibrationProgress(0);
      return contact;
    },
    [options]
  );

  const checkSafeWord = useCallback((input: string, reference: string) => {
    return verifySafeWordMatch(input, reference);
  }, []);

  return {
    contacts,
    phase,
    calibrationProgress,
    startCalibration,
    completeCalibration,
    enrollContact,
    checkSafeWord,
  };
}
