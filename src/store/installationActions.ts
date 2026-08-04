import { createDeployment } from "../data/deployments";
import type {
  MarketplaceApp,
  Node,
  NodeInstallationStatus,
  OverallInstallationStatus,
  PrototypeOverrides,
  PrototypeState,
} from "../types/prototype";
import { evaluateCompatibility } from "../utils/compatibility";
import { isSelectableCompatibility } from "../utils/compatibilityLabels";
import {
  advanceStage,
  isTerminalStage,
} from "../utils/installationStages";

export function deriveOverallStatus(
  nodeStatuses: PrototypeState["installation"]["nodeStatuses"],
): OverallInstallationStatus {
  const stages = Object.values(nodeStatuses).map((status) => status.stage);
  if (stages.length === 0) return "not-started";

  const allRunning = stages.every((stage) => stage === "running");
  if (allRunning) return "success";

  const allFailed = stages.every(
    (stage) => stage === "failed" || stage === "canceled",
  );
  if (allFailed) return "failure";

  const allQueued = stages.every(
    (stage) => stage === "queued" || stage === "waiting-for-node",
  );
  if (allQueued) return "queued";

  const anyActive = stages.some(
    (stage) =>
      !isTerminalStage(stage) &&
      stage !== "queued" &&
      stage !== "waiting-for-node",
  );
  if (anyActive) return "in-progress";

  const anySuccess = stages.some((stage) => stage === "running");
  const anyProblem = stages.some(
    (stage) =>
      stage === "failed" ||
      stage === "needs-attention" ||
      stage === "queued" ||
      stage === "waiting-for-node",
  );
  if (anySuccess && anyProblem) return "partial-success";

  return "in-progress";
}

function stamp(
  stage: NodeInstallationStatus["stage"],
  message?: string,
): NodeInstallationStatus {
  return {
    stage,
    message,
    updatedAt: new Date().toISOString(),
  };
}

export function buildConfirmedInstallation(args: {
  app: MarketplaceApp;
  nodes: Node[];
  selectedNodeIds: string[];
  overrides: PrototypeOverrides;
  forcedRecheckFailNodeIds: string[];
}): {
  nodeStatuses: Record<string, NodeInstallationStatus>;
  overallStatus: OverallInstallationStatus;
} {
  const nodeById = new Map(args.nodes.map((node) => [node.id, node]));
  const nodeStatuses: Record<string, NodeInstallationStatus> = {};

  for (const nodeId of args.selectedNodeIds) {
    const node = nodeById.get(nodeId);
    if (!node) {
      nodeStatuses[nodeId] = stamp("failed", "Node not found in fleet.");
      continue;
    }

    if (args.forcedRecheckFailNodeIds.includes(nodeId)) {
      nodeStatuses[nodeId] = stamp(
        "failed",
        "Became incompatible during final compatibility recheck.",
      );
      continue;
    }

    const result = evaluateCompatibility(args.app, node, args.overrides);

    if (
      result.status === "incompatible" ||
      result.status === "unable-to-check"
    ) {
      nodeStatuses[nodeId] = stamp(
        "failed",
        result.issues[0]?.message ??
          "Failed final compatibility recheck.",
      );
      continue;
    }

    if (result.status === "already-installed") {
      nodeStatuses[nodeId] = stamp(
        "failed",
        "This app is already installed on this node.",
      );
      continue;
    }

    if (!node.online || result.status === "offline-queued") {
      nodeStatuses[nodeId] = stamp(
        "queued",
        "Node is offline. Installation will begin when it reconnects and requirements are rechecked.",
      );
      continue;
    }

    nodeStatuses[nodeId] = stamp(
      "preparing",
      result.status === "compatible-with-warnings"
        ? "Starting with acknowledged warnings."
        : "Preparing installation.",
    );
  }

  return {
    nodeStatuses,
    overallStatus: deriveOverallStatus(nodeStatuses),
  };
}

export function advanceInstallationStatuses(args: {
  nodes: Node[];
  selectedNodeIds: string[];
  nodeStatuses: Record<string, NodeInstallationStatus>;
}): Record<string, NodeInstallationStatus> {
  const nodeById = new Map(args.nodes.map((node) => [node.id, node]));
  const nextStatuses = { ...args.nodeStatuses };

  for (const nodeId of args.selectedNodeIds) {
    const current = nextStatuses[nodeId]?.stage ?? "queued";
    const node = nodeById.get(nodeId);

    if (
      current === "failed" ||
      current === "canceled" ||
      current === "running" ||
      current === "needs-attention"
    ) {
      continue;
    }

    if (
      (current === "queued" || current === "waiting-for-node") &&
      node &&
      !node.online
    ) {
      nextStatuses[nodeId] = stamp(
        "waiting-for-node",
        "Waiting for the node to reconnect.",
      );
      continue;
    }

    if (current === "queued" && node?.online) {
      nextStatuses[nodeId] = stamp("preparing", "Node is online. Preparing.");
      continue;
    }

    const nextStage = advanceStage(current);
    nextStatuses[nodeId] = stamp(nextStage);
  }

  return nextStatuses;
}

export function applyRunningInstallations(args: {
  app: MarketplaceApp;
  nodes: Node[];
  deployments: PrototypeState["deployments"];
  nodeStatuses: Record<string, NodeInstallationStatus>;
}): {
  nodes: Node[];
  deployments: PrototypeState["deployments"];
} {
  const runningNodeIds = Object.entries(args.nodeStatuses)
    .filter(([, status]) => status.stage === "running")
    .map(([nodeId]) => nodeId);

  const nodes = args.nodes.map((node) => {
    if (!runningNodeIds.includes(node.id)) return node;
    if (node.installedAppIds.includes(args.app.id)) return node;
    return {
      ...node,
      installedAppIds: [...node.installedAppIds, args.app.id],
    };
  });

  const existing = args.deployments.find(
    (deployment) => deployment.appId === args.app.id,
  );
  const mergedNodeIds = Array.from(
    new Set([...(existing?.nodeIds ?? []), ...runningNodeIds]),
  );

  if (mergedNodeIds.length === 0) {
    return { nodes, deployments: args.deployments };
  }

  const deployment = createDeployment({
    id: existing?.id ?? `dep_${args.app.id}`,
    appId: args.app.id,
    nodeIds: mergedNodeIds,
    version: args.app.version,
  });

  const deployments = existing
    ? args.deployments.map((item) =>
        item.id === existing.id ? deployment : item,
      )
    : [...args.deployments, deployment];

  return { nodes, deployments };
}

export function isNodeSelectableForInstall(
  app: MarketplaceApp,
  node: Node,
  overrides: PrototypeOverrides,
): boolean {
  const result = evaluateCompatibility(app, node, overrides);
  return isSelectableCompatibility(result.status);
}
