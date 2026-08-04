import { useEffect } from "react";
import { usePrototypeStore } from "../../store/prototypeStore";

function isSettledStage(stage: string | undefined): boolean {
  return (
    stage === "running" ||
    stage === "failed" ||
    stage === "canceled" ||
    stage === "needs-attention" ||
    stage === "queued" ||
    stage === "waiting-for-node"
  );
}

/** Optional timer-driven playback; every transition remains manually controllable. */
export function InstallationPlayback() {
  const isPlaying = usePrototypeStore((state) => state.installation.isPlaying);
  const slowInstallation = usePrototypeStore(
    (state) => state.overrides.slowInstallation,
  );
  const advanceInstallation = usePrototypeStore(
    (state) => state.advanceInstallation,
  );
  const pauseInstallation = usePrototypeStore((state) => state.pauseInstallation);
  const nodeStatuses = usePrototypeStore(
    (state) => state.installation.nodeStatuses,
  );
  const selectedNodeIds = usePrototypeStore(
    (state) => state.installation.selectedNodeIds,
  );

  useEffect(() => {
    if (!isPlaying) return;

    const allSettled =
      selectedNodeIds.length > 0 &&
      selectedNodeIds.every((nodeId) =>
        isSettledStage(nodeStatuses[nodeId]?.stage),
      );

    const anyActive = selectedNodeIds.some((nodeId) => {
      const stage = nodeStatuses[nodeId]?.stage;
      return (
        stage === "preparing" ||
        stage === "downloading" ||
        stage === "verifying" ||
        stage === "installing" ||
        stage === "configuring" ||
        stage === "starting"
      );
    });

    if (allSettled && !anyActive) {
      pauseInstallation();
      return;
    }

    const delay = slowInstallation ? 1600 : 700;
    const timer = window.setTimeout(() => advanceInstallation(), delay);
    return () => window.clearTimeout(timer);
  }, [
    isPlaying,
    slowInstallation,
    advanceInstallation,
    pauseInstallation,
    nodeStatuses,
    selectedNodeIds,
  ]);

  return null;
}
