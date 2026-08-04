import type {
  Deployment,
  DeploymentInstance,
  MarketplaceApp,
  Node,
  PrototypeOverrides,
} from "../types/prototype";

export type InstalledAppView = {
  app: MarketplaceApp;
  deployment: Deployment;
  nodes: Node[];
  runningCount: number;
  stoppedCount: number;
  unhealthyCount: number;
  setupRequiredCount: number;
  updateAvailable: boolean;
};

export function formatInstanceStatus(
  status: DeploymentInstance["status"],
): string {
  switch (status) {
    case "running":
      return "Running";
    case "stopped":
      return "Stopped";
    case "unhealthy":
      return "Needs attention";
    case "updating":
      return "Updating";
    case "setup-required":
      return "Setup required";
  }
}

export function deriveAggregateHealth(
  instances: DeploymentInstance[],
): Deployment["aggregateHealth"] {
  if (instances.length === 0) return "healthy";
  const statuses = new Set(instances.map((instance) => instance.status));
  if (statuses.size > 1) return "mixed";
  if (statuses.has("unhealthy") || statuses.has("setup-required")) {
    return "unhealthy";
  }
  if (statuses.has("stopped") || statuses.has("updating")) return "degraded";
  return "healthy";
}

export function getInstalledAppViews(args: {
  apps: MarketplaceApp[];
  nodes: Node[];
  deployments: Deployment[];
  overrides: PrototypeOverrides;
}): InstalledAppView[] {
  const appById = new Map(args.apps.map((app) => [app.id, app]));
  const nodeById = new Map(args.nodes.map((node) => [node.id, node]));

  return args.deployments
    .map((deployment) => {
      const app = appById.get(deployment.appId);
      if (!app) return null;
      const nodes = deployment.nodeIds
        .map((nodeId) => nodeById.get(nodeId))
        .filter((node): node is Node => Boolean(node));

      const runningCount = deployment.instances.filter(
        (instance) => instance.status === "running",
      ).length;
      const stoppedCount = deployment.instances.filter(
        (instance) => instance.status === "stopped",
      ).length;
      const unhealthyCount = deployment.instances.filter(
        (instance) => instance.status === "unhealthy",
      ).length;
      const setupRequiredCount = deployment.instances.filter(
        (instance) => instance.status === "setup-required",
      ).length;

      return {
        app,
        deployment,
        nodes,
        runningCount,
        stoppedCount,
        unhealthyCount,
        setupRequiredCount,
        updateAvailable:
          args.overrides.updateRequired ||
          deployment.instances.some(
            (instance) => instance.version !== app.version,
          ) ||
          deployment.version !== app.version,
      } satisfies InstalledAppView;
    })
    .filter((item): item is InstalledAppView => Boolean(item))
    .sort((a, b) => a.app.name.localeCompare(b.app.name));
}

export function getInstanceResourceSummary(
  instance: DeploymentInstance,
  node: Node,
): {
  cpu: string;
  memory: string;
  storage: string;
  bandwidth: string;
} {
  if (instance.status === "stopped") {
    return {
      cpu: "0%",
      memory: "0 GB",
      storage: "Allocated, idle",
      bandwidth: "0 Mbps",
    };
  }

  if (instance.status === "unhealthy") {
    return {
      cpu: "High / unstable",
      memory: `${Math.max(1, Math.round(node.memoryGbAvailable * 0.35))} GB`,
      storage: "Check allocation",
      bandwidth: "Degraded",
    };
  }

  return {
    cpu: `${8 + (node.cpuCoresAvailable % 7) * 3}%`,
    memory: `${Math.max(1, Math.round(node.memoryGbAvailable * 0.2))} GB`,
    storage: `${Math.min(node.storageGbAvailable, 500)} GB allocated`,
    bandwidth: `${Math.min(node.bandwidthMbps, 120)} Mbps peak`,
  };
}

export function getInstanceRewardSummary(args: {
  app: MarketplaceApp;
  node: Node;
  instance: DeploymentInstance;
  overrides: PrototypeOverrides;
}): string {
  if (!args.app.rewards.available) return "No financial rewards";
  if (args.overrides.rewardsUnavailable) return "Reward estimate unavailable";
  if (!args.node.rewardWalletConnected || args.node.regionRestricted) {
    return "Not earning — wallet or region ineligible";
  }
  if (args.instance.status === "stopped") return "Paused while stopped";
  if (args.instance.status === "unhealthy") return "Rewards paused — unhealthy";
  if (args.instance.status === "setup-required") {
    return "Rewards unavailable until setup is complete";
  }
  return args.app.rewards.estimateLabel ?? "Earning (estimate)";
}
