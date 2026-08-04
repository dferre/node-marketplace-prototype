import type { NodeInstallationStage } from "../types/prototype";

export const INSTALLATION_STAGES: NodeInstallationStage[] = [
  "queued",
  "waiting-for-node",
  "preparing",
  "downloading",
  "verifying",
  "installing",
  "configuring",
  "starting",
  "running",
  "needs-attention",
  "failed",
  "canceled",
];

export const PROGRESS_STAGES: NodeInstallationStage[] = [
  "queued",
  "waiting-for-node",
  "preparing",
  "downloading",
  "verifying",
  "installing",
  "configuring",
  "starting",
  "running",
];

export function advanceStage(
  stage: NodeInstallationStage,
): NodeInstallationStage {
  const index = PROGRESS_STAGES.indexOf(stage);
  if (index === -1) return stage;
  if (index >= PROGRESS_STAGES.length - 1) return "running";
  return PROGRESS_STAGES[index + 1] ?? stage;
}

export function isTerminalStage(stage: NodeInstallationStage): boolean {
  return (
    stage === "running" ||
    stage === "failed" ||
    stage === "canceled" ||
    stage === "needs-attention"
  );
}
