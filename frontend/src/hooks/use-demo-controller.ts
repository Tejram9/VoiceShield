"use client";

import { useState, useCallback, useMemo } from "react";
import {
  DemoStage,
  DemoStageData,
  DEMO_STAGES,
  getDemoStageData,
  getNextStage,
  getPreviousStage,
} from "@/lib/demo/demo-controller";

export interface UseDemoControllerOptions {
  initialStage?: DemoStage;
  onStageChange?: (stage: DemoStage, data: DemoStageData) => void;
}

export function useDemoController(options: UseDemoControllerOptions = {}) {
  const [currentStage, setCurrentStage] = useState<DemoStage>(
    options.initialStage ?? "STAGE_4_SYNTHETIC_CLONE"
  );

  const stageData = useMemo(() => getDemoStageData(currentStage), [currentStage]);

  const setStage = useCallback(
    (stage: DemoStage) => {
      setCurrentStage(stage);
      const data = getDemoStageData(stage);
      options.onStageChange?.(stage, data);
    },
    [options]
  );

  const nextStage = useCallback(() => {
    const next = getNextStage(currentStage);
    setStage(next);
  }, [currentStage, setStage]);

  const prevStage = useCallback(() => {
    const prev = getPreviousStage(currentStage);
    setStage(prev);
  }, [currentStage, setStage]);

  const resetDemo = useCallback(() => {
    setStage("STAGE_1_NORMAL");
  }, [setStage]);

  const containThreat = useCallback(() => {
    setStage("STAGE_5_CONTAINED");
  }, [setStage]);

  return {
    currentStage,
    stageData,
    stages: DEMO_STAGES,
    isContained: currentStage === "STAGE_5_CONTAINED",
    isCritical: stageData.riskLevel === "CRITICAL",
    setStage,
    nextStage,
    prevStage,
    resetDemo,
    containThreat,
  };
}
