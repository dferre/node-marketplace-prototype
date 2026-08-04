import { create } from "zustand";
import { apps as catalogApps } from "../data/apps";
import { cloneFleetNodes } from "../data/nodes";
import {
  getDefaultScenario,
  getScenarioById,
  mergeOverrides,
  scenarios,
} from "../data/scenarios";
import { users as catalogUsers } from "../data/users";
import type {
  DebuggerTab,
  InstallationScope,
  NodeInstallationStage,
  OnboardingFlowId,
  OnboardingTipId,
  OverallInstallationStatus,
  PrototypeOverrides,
  PrototypeScenario,
  PrototypeState,
} from "../types/prototype";
import { defaultOnboardingState } from "../types/prototype";
import {
  advanceInstallationStatuses,
  applyRunningInstallations,
  buildConfirmedInstallation,
  deriveOverallStatus,
  isNodeSelectableForInstall,
} from "./installationActions";
import {
  bumpDeploymentVersion,
  setInstanceStatuses,
  uninstallFromDeployment,
} from "./managementActions";
import { getSelectableNodeIds } from "../utils/installationSelection";

function applyScenarioToState(
  scenario: PrototypeScenario,
  preserveDebugger = false,
  debuggerState?: PrototypeState["debugger"],
): PrototypeState {
  const nodes = cloneFleetNodes(
    scenario.nodeFleetId,
    scenario.installedAppIdsByNode,
  );

  return {
    scenarioId: scenario.id,
    activeUserId: scenario.userId,
    activeAppId: scenario.appId,
    nodeFleetId: scenario.nodeFleetId,
    users: catalogUsers,
    apps: catalogApps.map((app) => {
      if (
        app.id === scenario.appId &&
        (scenario.overrides?.appSuspended || scenario.id === "suspended-app")
      ) {
        return {
          ...app,
          status: "suspended",
          suspensionReason: "Security issue under investigation",
        };
      }
      if (app.id === scenario.appId && scenario.overrides?.appRemoved) {
        return { ...app, status: "removed" };
      }
      return app;
    }),
    nodes,
    deployments: scenario.deployments ? [...scenario.deployments] : [],
    installation: {
      scope: scenario.installationScope ?? "selected",
      selectedNodeIds: scenario.selectedNodeIds
        ? [...scenario.selectedNodeIds]
        : [],
      overallStatus: scenario.overallStatus ?? "not-started",
      nodeStatuses: scenario.nodeStatuses
        ? structuredClone(scenario.nodeStatuses)
        : {},
      isPlaying: false,
      focusedNodeId: scenario.selectedNodeIds?.[0] ?? null,
      forcedRecheckFailNodeIds: scenario.forcedRecheckFailNodeIds
        ? [...scenario.forcedRecheckFailNodeIds]
        : [],
      warningsAcknowledged: false,
    },
    overrides: mergeOverrides(scenario.overrides),
    debugger: preserveDebugger
      ? (debuggerState ?? { isOpen: false, activeTab: "scenario" })
      : { isOpen: false, activeTab: "scenario" },
    toast: null,
    onboarding: defaultOnboardingState(),
  };
}

const defaultScenario = getDefaultScenario();

export const createInitialPrototypeState = (): PrototypeState =>
  applyScenarioToState(defaultScenario);

type PrototypeActions = {
  setDebuggerOpen: (isOpen: boolean) => void;
  toggleDebugger: () => void;
  setDebuggerTab: (tab: DebuggerTab) => void;
  showToast: (message: string) => void;
  clearToast: () => void;
  loadScenario: (
    scenarioId: string,
    options?: { preserveDebugger?: boolean; silent?: boolean },
  ) => string | null;
  setOnboardingAnswer: (
    flowId: OnboardingFlowId,
    fieldId: string,
    value: string,
  ) => void;
  completeOnboardingFlow: (flowId: OnboardingFlowId) => void;
  dismissOnboardingTip: (tipId: OnboardingTipId) => void;
  restoreOnboardingTip: (tipId: OnboardingTipId) => void;
  resetOnboarding: () => void;
  setActiveUserId: (userId: string) => void;
  setActiveAppId: (appId: string) => void;
  setNodeFleetId: (fleetId: string) => void;
  setInstallationScope: (scope: InstallationScope) => void;
  setSelectedNodeIds: (nodeIds: string[]) => void;
  toggleNodeSelection: (nodeId: string) => void;
  selectAllCompatibleNodes: (appId: string) => void;
  clearNodeSelection: () => void;
  setWarningsAcknowledged: (value: boolean) => void;
  setOverallInstallationStatus: (status: OverallInstallationStatus) => void;
  setNodeInstallationStage: (
    nodeId: string,
    stage: NodeInstallationStage,
    message?: string,
  ) => void;
  setOverride: <K extends keyof PrototypeOverrides>(
    key: K,
    value: PrototypeOverrides[K],
  ) => void;
  setFocusedNodeId: (nodeId: string | null) => void;
  confirmInstallation: (appId: string) => boolean;
  cancelRemainingInstallations: () => void;
  cancelNodeInstallation: (nodeId: string) => void;
  playInstallation: () => void;
  pauseInstallation: () => void;
  advanceInstallation: () => void;
  completeAllInstallations: () => void;
  failFocusedNode: () => void;
  resetInstallation: () => void;
  uninstallApp: (appId: string, nodeIds: string[]) => boolean;
  stopAppInstances: (appId: string, nodeIds: string[]) => boolean;
  restartAppInstances: (appId: string, nodeIds: string[]) => boolean;
  updateAppInstances: (
    appId: string,
    nodeIds: string[],
    options?: { acceptNewPermissions?: boolean },
  ) => boolean;
  completeAppSetup: (appId: string, nodeIds: string[]) => boolean;
  resetPrototypeState: () => void;
  applyUrlParams: (params: {
    scenario?: string;
    user?: string;
    app?: string;
    fleet?: string;
  }) => string | null;
};

export type PrototypeStore = PrototypeState & PrototypeActions;

let updateInstancesTimer: ReturnType<typeof window.setTimeout> | undefined;

export const usePrototypeStore = create<PrototypeStore>((set, get) => ({
  ...createInitialPrototypeState(),

  setDebuggerOpen: (isOpen) =>
    set((state) => ({
      debugger: { ...state.debugger, isOpen },
    })),

  toggleDebugger: () =>
    set((state) => ({
      debugger: { ...state.debugger, isOpen: !state.debugger.isOpen },
    })),

  setDebuggerTab: (activeTab) =>
    set((state) => ({
      debugger: { ...state.debugger, activeTab },
    })),

  showToast: (message) =>
    set({
      toast: { id: Date.now(), message },
    }),

  clearToast: () => set({ toast: null }),

  loadScenario: (scenarioId, options) => {
    const scenario = getScenarioById(scenarioId);
    if (!scenario) return null;

    const current = get();
    const next = applyScenarioToState(
      scenario,
      options?.preserveDebugger ?? true,
      current.debugger,
    );

    set({
      ...next,
      // Onboarding progress is session UX — keep it across scenario swaps.
      onboarding: current.onboarding,
      debugger: {
        ...next.debugger,
        isOpen: current.debugger.isOpen,
        activeTab: current.debugger.activeTab,
      },
      toast: options?.silent
        ? current.toast
        : { id: Date.now(), message: `Loaded scenario: ${scenario.name}` },
    });

    return scenario.startingRoute;
  },

  setActiveUserId: (userId) => set({ activeUserId: userId }),

  setActiveAppId: (appId) => set({ activeAppId: appId }),

  setNodeFleetId: (fleetId) => {
    const scenario = getScenarioById(get().scenarioId);
    const nodes = cloneFleetNodes(fleetId, scenario?.installedAppIdsByNode);
    set({
      nodeFleetId: fleetId,
      nodes,
      installation: {
        ...get().installation,
        selectedNodeIds: [],
        nodeStatuses: {},
        overallStatus: "not-started",
        isPlaying: false,
        warningsAcknowledged: false,
      },
    });
  },

  setInstallationScope: (scope) => {
    const state = get();
    const app = state.apps.find((item) => item.id === state.activeAppId);
    let selectedNodeIds = state.installation.selectedNodeIds;

    if (app && scope === "all-compatible") {
      selectedNodeIds = getSelectableNodeIds(app, state.nodes, state.overrides);
    }

    if (app && scope === "one") {
      const selectable = getSelectableNodeIds(
        app,
        state.nodes,
        state.overrides,
      );
      selectedNodeIds = selectedNodeIds[0]
        ? [selectedNodeIds[0]]
        : selectable[0]
          ? [selectable[0]]
          : [];
    }

    set({
      installation: {
        ...state.installation,
        scope,
        selectedNodeIds,
        focusedNodeId: selectedNodeIds[0] ?? null,
      },
    });
  },

  setSelectedNodeIds: (nodeIds) =>
    set((state) => ({
      installation: {
        ...state.installation,
        selectedNodeIds: nodeIds,
        focusedNodeId: nodeIds[0] ?? null,
      },
    })),

  toggleNodeSelection: (nodeId) =>
    set((state) => {
      const app = state.apps.find((item) => item.id === state.activeAppId);
      const node = state.nodes.find((item) => item.id === nodeId);
      if (!app || !node) return state;
      if (!isNodeSelectableForInstall(app, node, state.overrides)) return state;

      const exists = state.installation.selectedNodeIds.includes(nodeId);
      let selectedNodeIds: string[];

      if (state.installation.scope === "one") {
        selectedNodeIds = exists ? [] : [nodeId];
      } else if (exists) {
        selectedNodeIds = state.installation.selectedNodeIds.filter(
          (id) => id !== nodeId,
        );
      } else {
        selectedNodeIds = [...state.installation.selectedNodeIds, nodeId];
      }

      return {
        installation: {
          ...state.installation,
          scope:
            state.installation.scope === "all-compatible"
              ? "selected"
              : state.installation.scope,
          selectedNodeIds,
          focusedNodeId: selectedNodeIds[0] ?? null,
        },
      };
    }),

  selectAllCompatibleNodes: (appId) =>
    set((state) => {
      const app = state.apps.find((item) => item.id === appId);
      if (!app) return state;
      const selectedNodeIds = getSelectableNodeIds(
        app,
        state.nodes,
        state.overrides,
      );
      return {
        installation: {
          ...state.installation,
          scope: "selected",
          selectedNodeIds,
          focusedNodeId: selectedNodeIds[0] ?? null,
        },
      };
    }),

  clearNodeSelection: () =>
    set((state) => ({
      installation: {
        ...state.installation,
        selectedNodeIds: [],
        focusedNodeId: null,
        scope:
          state.installation.scope === "all-compatible"
            ? "selected"
            : state.installation.scope,
      },
    })),

  setWarningsAcknowledged: (value) =>
    set((state) => ({
      installation: { ...state.installation, warningsAcknowledged: value },
    })),

  setOverallInstallationStatus: (overallStatus) =>
    set((state) => ({
      installation: { ...state.installation, overallStatus },
    })),

  setNodeInstallationStage: (nodeId, stage, message) =>
    set((state) => {
      const nodeStatuses = {
        ...state.installation.nodeStatuses,
        [nodeId]: {
          stage,
          message,
          updatedAt: new Date().toISOString(),
        },
      };
      const selectedNodeIds = state.installation.selectedNodeIds.includes(nodeId)
        ? state.installation.selectedNodeIds
        : [...state.installation.selectedNodeIds, nodeId];

      const app = state.apps.find((item) => item.id === state.activeAppId);
      const applied = app
        ? applyRunningInstallations({
            app,
            nodes: state.nodes,
            deployments: state.deployments,
            nodeStatuses,
          })
        : { nodes: state.nodes, deployments: state.deployments };

      return {
        nodes: applied.nodes,
        deployments: applied.deployments,
        installation: {
          ...state.installation,
          selectedNodeIds,
          nodeStatuses,
          overallStatus: deriveOverallStatus(nodeStatuses),
        },
      };
    }),

  setOverride: (key, value) =>
    set((state) => ({
      overrides: { ...state.overrides, [key]: value },
    })),

  setFocusedNodeId: (nodeId) =>
    set((state) => ({
      installation: { ...state.installation, focusedNodeId: nodeId },
    })),

  confirmInstallation: (appId) => {
    const state = get();
    const app = state.apps.find((item) => item.id === appId);
    const user = state.users.find((item) => item.id === state.activeUserId);

    if (!app) return false;
    if (state.overrides.networkOffline) {
      get().showToast("You are offline. Installation cannot start right now.");
      return false;
    }
    if (!user?.canInstallApps || state.overrides.userPermissionChanged) {
      get().showToast("You do not have permission to install apps.");
      return false;
    }
    if (
      app.status === "suspended" ||
      app.status === "deprecated" ||
      app.status === "removed" ||
      state.overrides.appSuspended
    ) {
      get().showToast("This app cannot be installed in the current state.");
      return false;
    }
    if (state.installation.selectedNodeIds.length === 0) {
      get().showToast("Select at least one compatible node.");
      return false;
    }

    const confirmed = buildConfirmedInstallation({
      app,
      nodes: state.nodes,
      selectedNodeIds: state.installation.selectedNodeIds,
      overrides: state.overrides,
      forcedRecheckFailNodeIds: state.installation.forcedRecheckFailNodeIds,
    });

    set({
      installation: {
        ...state.installation,
        nodeStatuses: confirmed.nodeStatuses,
        overallStatus:
          confirmed.overallStatus === "not-started"
            ? "in-progress"
            : confirmed.overallStatus === "queued"
              ? "queued"
              : "in-progress",
        isPlaying: true,
        warningsAcknowledged: true,
      },
    });

    get().showToast(
      `Installation started on ${state.installation.selectedNodeIds.length} node${
        state.installation.selectedNodeIds.length === 1 ? "" : "s"
      }.`,
    );
    return true;
  },

  cancelRemainingInstallations: () =>
    set((state) => {
      const nodeStatuses = { ...state.installation.nodeStatuses };
      for (const nodeId of state.installation.selectedNodeIds) {
        const stage = nodeStatuses[nodeId]?.stage;
        if (
          !stage ||
          stage === "running" ||
          stage === "failed" ||
          stage === "canceled"
        ) {
          continue;
        }
        nodeStatuses[nodeId] = {
          stage: "canceled",
          message: "Canceled by user.",
          updatedAt: new Date().toISOString(),
        };
      }
      return {
        installation: {
          ...state.installation,
          isPlaying: false,
          nodeStatuses,
          overallStatus: deriveOverallStatus(nodeStatuses),
        },
      };
    }),

  cancelNodeInstallation: (nodeId) => {
    const stage = get().installation.nodeStatuses[nodeId]?.stage;
    if (stage === "running" || stage === "failed" || stage === "canceled") {
      return;
    }
    get().setNodeInstallationStage(nodeId, "canceled", "Canceled by user.");
  },

  playInstallation: () =>
    set((state) => ({
      installation: { ...state.installation, isPlaying: true },
    })),

  pauseInstallation: () =>
    set((state) => ({
      installation: { ...state.installation, isPlaying: false },
    })),

  advanceInstallation: () =>
    set((state) => {
      const selected = state.installation.selectedNodeIds;
      if (selected.length === 0) return state;

      const nodeStatuses = advanceInstallationStatuses({
        nodes: state.nodes,
        selectedNodeIds: selected,
        nodeStatuses: state.installation.nodeStatuses,
      });

      const app = state.apps.find((item) => item.id === state.activeAppId);
      const applied = app
        ? applyRunningInstallations({
            app,
            nodes: state.nodes,
            deployments: state.deployments,
            nodeStatuses,
          })
        : { nodes: state.nodes, deployments: state.deployments };

      return {
        nodes: applied.nodes,
        deployments: applied.deployments,
        installation: {
          ...state.installation,
          nodeStatuses,
          overallStatus: deriveOverallStatus(nodeStatuses),
        },
      };
    }),

  completeAllInstallations: () =>
    set((state) => {
      const selected = state.installation.selectedNodeIds;
      const nodeStatuses = { ...state.installation.nodeStatuses };
      for (const nodeId of selected) {
        const current = nodeStatuses[nodeId]?.stage;
        if (current === "failed" || current === "canceled") continue;
        const node = state.nodes.find((item) => item.id === nodeId);
        if (node && !node.online) {
          nodeStatuses[nodeId] = {
            stage: "queued",
            message: "Remains queued while offline.",
            updatedAt: new Date().toISOString(),
          };
          continue;
        }
        nodeStatuses[nodeId] = {
          stage: "running",
          updatedAt: new Date().toISOString(),
        };
      }

      const app = state.apps.find((item) => item.id === state.activeAppId);
      const applied = app
        ? applyRunningInstallations({
            app,
            nodes: state.nodes,
            deployments: state.deployments,
            nodeStatuses,
          })
        : { nodes: state.nodes, deployments: state.deployments };

      return {
        nodes: applied.nodes,
        deployments: applied.deployments,
        installation: {
          ...state.installation,
          isPlaying: false,
          nodeStatuses,
          overallStatus: deriveOverallStatus(nodeStatuses),
        },
      };
    }),

  failFocusedNode: () => {
    const { installation } = get();
    const nodeId =
      installation.focusedNodeId ?? installation.selectedNodeIds[0] ?? null;
    if (!nodeId) return;
    get().setNodeInstallationStage(
      nodeId,
      "failed",
      "Installation failed during final compatibility recheck.",
    );
    get().pauseInstallation();
  },

  resetInstallation: () =>
    set((state) => ({
      installation: {
        ...state.installation,
        overallStatus: "not-started",
        nodeStatuses: {},
        isPlaying: false,
        warningsAcknowledged: false,
      },
    })),

  uninstallApp: (appId, nodeIds) => {
    const state = get();
    const user = state.users.find((item) => item.id === state.activeUserId);
    if (!user?.canManageNodes || state.overrides.userPermissionChanged) {
      get().showToast("You do not have permission to manage installed apps.");
      return false;
    }
    if (nodeIds.length === 0) {
      get().showToast("Select at least one node to uninstall from.");
      return false;
    }

    const next = uninstallFromDeployment({
      deployments: state.deployments,
      nodes: state.nodes,
      appId,
      nodeIds,
    });

    set({
      deployments: next.deployments,
      nodes: next.nodes,
    });
    get().showToast(
      `Uninstalled from ${nodeIds.length} node${nodeIds.length === 1 ? "" : "s"}.`,
    );
    return true;
  },

  stopAppInstances: (appId, nodeIds) => {
    const state = get();
    const user = state.users.find((item) => item.id === state.activeUserId);
    if (!user?.canManageNodes || state.overrides.userPermissionChanged) {
      get().showToast("You do not have permission to manage installed apps.");
      return false;
    }
    if (nodeIds.length === 0) {
      get().showToast("Select at least one node.");
      return false;
    }

    set({
      deployments: setInstanceStatuses({
        deployments: state.deployments,
        appId,
        nodeIds,
        status: "stopped",
        healthLabel: "Stopped by user",
      }),
    });
    get().showToast(
      `Stopped on ${nodeIds.length} node${nodeIds.length === 1 ? "" : "s"}.`,
    );
    return true;
  },

  restartAppInstances: (appId, nodeIds) => {
    const state = get();
    const user = state.users.find((item) => item.id === state.activeUserId);
    if (!user?.canManageNodes || state.overrides.userPermissionChanged) {
      get().showToast("You do not have permission to manage installed apps.");
      return false;
    }
    if (nodeIds.length === 0) {
      get().showToast("Select at least one node.");
      return false;
    }

    set({
      deployments: setInstanceStatuses({
        deployments: state.deployments,
        appId,
        nodeIds,
        status: "running",
        healthLabel: undefined,
      }),
    });
    get().showToast(
      `Restarted on ${nodeIds.length} node${nodeIds.length === 1 ? "" : "s"}.`,
    );
    return true;
  },

  updateAppInstances: (appId, nodeIds, options) => {
    const state = get();
    const user = state.users.find((item) => item.id === state.activeUserId);
    const app = state.apps.find((item) => item.id === appId);
    if (!user?.canManageNodes || state.overrides.userPermissionChanged) {
      get().showToast("You do not have permission to manage installed apps.");
      return false;
    }
    if (state.overrides.networkOffline) {
      get().showToast("You are offline. Updates cannot start right now.");
      return false;
    }
    if (!app) return false;
    if (nodeIds.length === 0) {
      get().showToast("Select at least one node.");
      return false;
    }
    if (
      state.overrides.newPermissionsRequired &&
      !options?.acceptNewPermissions
    ) {
      get().showToast("Review and accept new permissions before updating.");
      return false;
    }

    set({
      deployments: setInstanceStatuses({
        deployments: state.deployments,
        appId,
        nodeIds,
        status: "updating",
        healthLabel: "Update in progress",
      }),
    });
    get().showToast(
      `Updating ${nodeIds.length} node${nodeIds.length === 1 ? "" : "s"}…`,
    );

    const delay = state.overrides.slowInstallation ? 2500 : 900;
    if (updateInstancesTimer !== undefined) {
      window.clearTimeout(updateInstancesTimer);
    }
    updateInstancesTimer = window.setTimeout(() => {
      updateInstancesTimer = undefined;
      const current = get();
      const currentApp = current.apps.find((item) => item.id === appId);
      if (!currentApp) return;
      set({
        deployments: bumpDeploymentVersion({
          deployments: current.deployments,
          appId,
          nodeIds,
          version: currentApp.version,
        }),
        overrides: {
          ...current.overrides,
          updateRequired: false,
          newPermissionsRequired: false,
        },
      });
      get().showToast(
        `Updated to v${currentApp.version} on ${nodeIds.length} node${
          nodeIds.length === 1 ? "" : "s"
        }.`,
      );
    }, delay);

    return true;
  },

  completeAppSetup: (appId, nodeIds) => {
    const state = get();
    const user = state.users.find((item) => item.id === state.activeUserId);
    if (!user?.canManageNodes || state.overrides.userPermissionChanged) {
      get().showToast("You do not have permission to manage installed apps.");
      return false;
    }
    if (nodeIds.length === 0) {
      get().showToast("Select at least one node.");
      return false;
    }

    set({
      deployments: setInstanceStatuses({
        deployments: state.deployments,
        appId,
        nodeIds,
        status: "running",
        healthLabel: undefined,
      }),
    });
    get().showToast(
      `Setup completed on ${nodeIds.length} node${
        nodeIds.length === 1 ? "" : "s"
      }.`,
    );
    return true;
  },

  resetPrototypeState: () => {
    get().loadScenario(defaultScenario.id, {
      preserveDebugger: true,
      silent: true,
    });
    get().resetOnboarding();
    get().showToast("Prototype state reset");
  },

  applyUrlParams: (params) => {
    const scenarioId = params.scenario ?? get().scenarioId;
    const scenario = getScenarioById(scenarioId) ?? getDefaultScenario();
    const route = get().loadScenario(scenario.id, {
      preserveDebugger: true,
      silent: true,
    });

    if (params.user) get().setActiveUserId(params.user);
    if (params.app) get().setActiveAppId(params.app);
    if (params.fleet) get().setNodeFleetId(params.fleet);

    return route;
  },

  setOnboardingAnswer: (flowId, fieldId, value) =>
    set((state) => ({
      onboarding: {
        ...state.onboarding,
        answers: {
          ...state.onboarding.answers,
          [flowId]: {
            ...(state.onboarding.answers[flowId] ?? {}),
            [fieldId]: value,
          },
        },
      },
    })),

  completeOnboardingFlow: (flowId) =>
    set((state) => ({
      onboarding: {
        ...state.onboarding,
        completedFlows: state.onboarding.completedFlows.includes(flowId)
          ? state.onboarding.completedFlows
          : [...state.onboarding.completedFlows, flowId],
      },
    })),

  dismissOnboardingTip: (tipId) =>
    set((state) => ({
      onboarding: {
        ...state.onboarding,
        dismissedTips: state.onboarding.dismissedTips.includes(tipId)
          ? state.onboarding.dismissedTips
          : [...state.onboarding.dismissedTips, tipId],
      },
    })),

  restoreOnboardingTip: (tipId) =>
    set((state) => ({
      onboarding: {
        ...state.onboarding,
        dismissedTips: state.onboarding.dismissedTips.filter(
          (tip) => tip !== tipId,
        ),
      },
    })),

  resetOnboarding: () =>
    set({
      onboarding: defaultOnboardingState(),
    }),
}));

export function listScenarios(): PrototypeScenario[] {
  return scenarios;
}
