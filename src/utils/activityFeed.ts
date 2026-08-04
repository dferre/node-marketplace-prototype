import type {
  Deployment,
  InstallationState,
  MarketplaceApp,
  Node,
} from "../types/prototype";
import { formatStageLabel } from "./installationSelection";
import { formatInstanceStatus } from "./installedApps";

export type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  href?: string;
  tone: "info" | "success" | "warning";
};

export function buildActivityFeed(args: {
  apps: MarketplaceApp[];
  nodes: Node[];
  deployments: Deployment[];
  installation: InstallationState;
  activeAppId: string;
}): ActivityItem[] {
  const appById = new Map(args.apps.map((app) => [app.id, app]));
  const nodeById = new Map(args.nodes.map((node) => [node.id, node]));
  const items: ActivityItem[] = [];

  const activeApp = appById.get(args.activeAppId);
  for (const nodeId of args.installation.selectedNodeIds) {
    const status = args.installation.nodeStatuses[nodeId];
    const node = nodeById.get(nodeId);
    if (!status || !node || !activeApp) continue;
    const stage = status.stage;
    items.push({
      id: `install-${nodeId}-${stage}`,
      title: `${activeApp.name} · ${formatStageLabel(stage)}`,
      detail:
        status.message ??
        `${node.name} · installation ${formatStageLabel(stage).toLowerCase()}`,
      href:
        stage === "running"
          ? `/installed/${activeApp.id}/nodes/${node.id}`
          : `/marketplace/apps/${activeApp.id}/install/progress`,
      tone:
        stage === "failed" || stage === "needs-attention"
          ? "warning"
          : stage === "running"
            ? "success"
            : "info",
    });
  }

  for (const deployment of args.deployments) {
    const app = appById.get(deployment.appId);
    if (!app) continue;
    for (const instance of deployment.instances) {
      const node = nodeById.get(instance.nodeId);
      if (!node) continue;
      items.push({
        id: `deploy-${deployment.id}-${instance.nodeId}`,
        title: `${app.name} on ${node.name}`,
        detail: `${formatInstanceStatus(instance.status)} · v${instance.version}${
          instance.healthLabel ? ` · ${instance.healthLabel}` : ""
        }`,
        href: `/installed/${app.id}/nodes/${node.id}`,
        tone:
          instance.status === "unhealthy" ||
          instance.status === "setup-required"
            ? "warning"
            : instance.status === "running"
              ? "success"
              : "info",
      });
    }
  }

  if (items.length === 0) {
    items.push({
      id: "empty-activity",
      title: "No recent activity",
      detail:
        "Install or manage an app to see installation, update, and health events here.",
      href: "/marketplace",
      tone: "info",
    });
  }

  return items;
}

export type NodeActivityFilter = "all" | "installs" | "health" | "rewards";

export type NodeActivityRow = ActivityItem & {
  category: Exclude<NodeActivityFilter, "all">;
  timestampLabel: string;
};

export function buildNodeActivityFeed(args: {
  node: Node;
  apps: MarketplaceApp[];
  deployments: Deployment[];
  installation: InstallationState;
  activeAppId: string;
}): NodeActivityRow[] {
  const appById = new Map(args.apps.map((app) => [app.id, app]));
  const rows: NodeActivityRow[] = [];

  const activeApp = appById.get(args.activeAppId);
  const installStatus = args.installation.nodeStatuses[args.node.id];
  if (activeApp && installStatus && args.installation.selectedNodeIds.includes(args.node.id)) {
    rows.push({
      id: `node-install-${args.node.id}-${installStatus.stage}`,
      title: `${activeApp.name} · ${formatStageLabel(installStatus.stage)}`,
      detail:
        installStatus.message ??
        `Installation ${formatStageLabel(installStatus.stage).toLowerCase()} on this node`,
      href:
        installStatus.stage === "running"
          ? `/installed/${activeApp.id}/nodes/${args.node.id}`
          : `/marketplace/apps/${activeApp.id}/install/progress`,
      tone:
        installStatus.stage === "failed" ||
        installStatus.stage === "needs-attention"
          ? "warning"
          : installStatus.stage === "running"
            ? "success"
            : "info",
      category: "installs",
      timestampLabel: "Just now",
    });
  }

  for (const deployment of args.deployments) {
    const app = appById.get(deployment.appId);
    const instance = deployment.instances.find(
      (item) => item.nodeId === args.node.id,
    );
    if (!app || !instance) continue;
    rows.push({
      id: `node-deploy-${deployment.id}-${args.node.id}`,
      title: `${app.name} · ${formatInstanceStatus(instance.status)}`,
      detail: `v${instance.version}${
        instance.healthLabel ? ` · ${instance.healthLabel}` : ""
      }`,
      href: `/installed/${app.id}/nodes/${args.node.id}`,
      tone:
        instance.status === "unhealthy" || instance.status === "setup-required"
          ? "warning"
          : instance.status === "running"
            ? "success"
            : "info",
      category: "installs",
      timestampLabel: "Today",
    });
  }

  rows.push({
    id: `node-health-${args.node.id}`,
    title: !args.node.online
      ? "Connectivity lost"
      : args.node.dataStale
        ? "Telemetry marked stale"
        : args.node.health === "healthy"
          ? "Health check passed"
          : args.node.health === "degraded"
            ? "Degraded performance detected"
            : "Health check failed",
    detail: args.node.lastSeenAt
      ? `Last seen ${args.node.lastSeenAt}`
      : "Last seen time unavailable",
    href: `/nodes/${args.node.id}`,
    tone:
      !args.node.online || args.node.health === "unhealthy"
        ? "warning"
        : args.node.health === "degraded" || args.node.dataStale
          ? "warning"
          : "success",
    category: "health",
    timestampLabel: args.node.online ? "2h ago" : "8h ago",
  });

  rows.push({
    id: `node-reward-${args.node.id}`,
    title: args.node.rewardWalletConnected
      ? "Reward wallet connected"
      : "Reward wallet missing",
    detail: args.node.rewardWalletConnected
      ? "Earning eligibility is separate from install compatibility."
      : "Connect a reward wallet before this node can earn.",
    href: "/rewards",
    tone: args.node.rewardWalletConnected ? "info" : "warning",
    category: "rewards",
    timestampLabel: "Yesterday",
  });

  if (args.node.publicIp) {
    rows.push({
      id: `node-network-${args.node.id}`,
      title: "Public IP reachable",
      detail: `${args.node.region} · ${args.node.bandwidthMbps} Mbps`,
      tone: "info",
      category: "health",
      timestampLabel: "Yesterday",
    });
  }

  return rows;
}

export function filterNodeActivity(
  rows: NodeActivityRow[],
  filter: NodeActivityFilter,
): NodeActivityRow[] {
  if (filter === "all") return rows;
  return rows.filter((row) => row.category === filter);
}
