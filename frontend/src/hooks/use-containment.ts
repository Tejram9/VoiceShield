"use client";

import { useState, useCallback } from "react";
import {
  ContainmentDirective,
  ContainmentExecutionResult,
  executeWireFreeze,
  executeKillSwitch,
} from "@/lib/containment/containment-workflow";
import type { Incident } from "@/types/dashboard";

export interface UseContainmentOptions {
  onIncidentCreated?: (incident: Incident) => void;
  onContainmentComplete?: (result: ContainmentExecutionResult) => void;
}

export function useContainment(options: UseContainmentOptions = {}) {
  const [activeDirectives, setActiveDirectives] = useState<ContainmentDirective[]>([]);
  const [isFrozen, setIsFrozen] = useState(false);
  const [lastResult, setLastResult] = useState<ContainmentExecutionResult | null>(null);

  const freezeWire = useCallback(
    (callId: string, callerName: string, amount?: string) => {
      const result = executeWireFreeze(callId, callerName, amount);
      setIsFrozen(true);
      setLastResult(result);
      if (result.incidentCreated) {
        options.onIncidentCreated?.(result.incidentCreated);
      }
      options.onContainmentComplete?.(result);
      return result;
    },
    [options]
  );

  const triggerKillSwitch = useCallback(
    (actionType: "DROP_SIP_TRUNK" | "LOCK_VAULT_PROFILE" | "FREEZE_ACTION", targetId: string) => {
      const result = executeKillSwitch(actionType, targetId);
      if (actionType === "FREEZE_ACTION") {
        setIsFrozen(true);
      }
      setLastResult(result);
      options.onContainmentComplete?.(result);
      return result;
    },
    [options]
  );

  const resetContainment = useCallback(() => {
    setIsFrozen(false);
    setLastResult(null);
    setActiveDirectives([]);
  }, []);

  return {
    isFrozen,
    activeDirectives,
    lastResult,
    freezeWire,
    triggerKillSwitch,
    resetContainment,
  };
}
