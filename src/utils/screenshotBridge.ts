import { usePrototypeStore } from "../store/prototypeStore";

export type ScreenshotBridge = {
  loadScenario: (scenarioId: string) => string | null;
  loadDeveloperScenario: (scenarioId: string) => string | null;
  setDebuggerOpen: (open: boolean) => void;
  setDebuggerTab: (
    tab:
      | "scenario"
      | "data"
      | "installation"
      | "system"
      | "onboarding"
      | "developer"
      | "debug",
  ) => void;
  clearToast: () => void;
  pauseInstallation: () => void;
  playInstallation: () => void;
  advanceInstallation: () => void;
};

declare global {
  interface Window {
    __NM_SCREENSHOT__?: ScreenshotBridge;
  }
}

/** Exposes store controls for the Playwright screenshot harness. */
export function installScreenshotBridge() {
  if (typeof window === "undefined") return;

  window.__NM_SCREENSHOT__ = {
    loadScenario: (scenarioId) =>
      usePrototypeStore.getState().loadScenario(scenarioId, {
        silent: true,
        preserveDebugger: true,
      }),
    loadDeveloperScenario: (scenarioId) =>
      usePrototypeStore.getState().loadDeveloperScenario(scenarioId),
    setDebuggerOpen: (open) =>
      usePrototypeStore.getState().setDebuggerOpen(open),
    setDebuggerTab: (tab) => usePrototypeStore.getState().setDebuggerTab(tab),
    clearToast: () => usePrototypeStore.getState().clearToast(),
    pauseInstallation: () =>
      usePrototypeStore.getState().pauseInstallation(),
    playInstallation: () => usePrototypeStore.getState().playInstallation(),
    advanceInstallation: () =>
      usePrototypeStore.getState().advanceInstallation(),
  };
}
