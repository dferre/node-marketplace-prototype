import { getAppById } from "../data/apps";
import { getUserById } from "../data/users";
import { evaluateCompatibility, summarizeCompatibility } from "../utils/compatibility";
import type { PrototypeStore } from "./prototypeStore";

export const selectDebuggerOpen = (state: PrototypeStore) =>
  state.debugger.isOpen;

export const selectDebuggerTab = (state: PrototypeStore) =>
  state.debugger.activeTab;

export const selectScenarioId = (state: PrototypeStore) => state.scenarioId;

export const selectActiveAppId = (state: PrototypeStore) => state.activeAppId;

export const selectActiveUserId = (state: PrototypeStore) => state.activeUserId;

export const selectNodeFleetId = (state: PrototypeStore) => state.nodeFleetId;

export const selectInstallation = (state: PrototypeStore) => state.installation;

export const selectOverrides = (state: PrototypeStore) => state.overrides;

export const selectToast = (state: PrototypeStore) => state.toast;

export const selectActiveUser = (state: PrototypeStore) =>
  state.users.find((user) => user.id === state.activeUserId) ??
  getUserById(state.activeUserId);

export const selectActiveApp = (state: PrototypeStore) =>
  state.apps.find((app) => app.id === state.activeAppId) ??
  getAppById(state.activeAppId);

export const selectCompatibilityResults = (state: PrototypeStore) => {
  const app = selectActiveApp(state);
  if (!app) return [];
  return state.nodes.map((node) =>
    evaluateCompatibility(app, node, state.overrides),
  );
};

export const selectCompatibilitySummary = (state: PrototypeStore) =>
  summarizeCompatibility(selectCompatibilityResults(state));

export const selectFixtureSummary = (state: PrototypeStore) => ({
  scenarioId: state.scenarioId,
  userCount: state.users.length,
  appCount: state.apps.length,
  nodeCount: state.nodes.length,
  deploymentCount: state.deployments.length,
  selectedCount: state.installation.selectedNodeIds.length,
  overallStatus: state.installation.overallStatus,
  overridesEnabled: Object.values(state.overrides).filter(Boolean).length,
});
