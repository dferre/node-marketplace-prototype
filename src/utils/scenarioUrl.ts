import type { PrototypeState } from "../types/prototype";

export type ScenarioUrlParams = {
  scenario?: string;
  user?: string;
  app?: string;
  fleet?: string;
};

export function parseScenarioSearchParams(
  search: string,
): ScenarioUrlParams {
  const params = new URLSearchParams(search);
  return {
    scenario: params.get("scenario") ?? undefined,
    user: params.get("user") ?? undefined,
    app: params.get("app") ?? undefined,
    fleet: params.get("fleet") ?? undefined,
  };
}

export function buildScenarioSearchParams(state: {
  scenarioId: string;
  activeUserId: string;
  activeAppId: string;
  nodeFleetId: string;
}): string {
  const params = new URLSearchParams({
    scenario: state.scenarioId,
    user: state.activeUserId,
    app: state.activeAppId,
    fleet: state.nodeFleetId,
  });
  return params.toString();
}

export function buildScenarioUrl(
  pathname: string,
  state: {
    scenarioId: string;
    activeUserId: string;
    activeAppId: string;
    nodeFleetId: string;
  },
): string {
  const query = buildScenarioSearchParams(state);
  return `${pathname}?${query}`;
}

export function pickStateSnapshot(state: PrototypeState) {
  return {
    scenarioId: state.scenarioId,
    activeUserId: state.activeUserId,
    activeAppId: state.activeAppId,
    nodeFleetId: state.nodeFleetId,
    users: state.users,
    apps: state.apps.map((app) => ({
      id: app.id,
      name: app.name,
      status: app.status,
    })),
    nodes: state.nodes.map((node) => ({
      id: node.id,
      name: node.name,
      online: node.online,
      type: node.type,
      installedAppIds: node.installedAppIds,
    })),
    deployments: state.deployments,
    installation: state.installation,
    overrides: state.overrides,
  };
}
