import type {
  Deployment,
  MarketplaceApp,
  Node,
  PrototypeOverrides,
} from "../types/prototype";
import { getInstanceRewardSummary } from "./installedApps";

export type RewardRow = {
  app: MarketplaceApp;
  node: Node;
  statusLabel: string;
  estimateLabel: string;
  earning: boolean;
  installationPath: string;
};

export function getRewardRows(args: {
  apps: MarketplaceApp[];
  nodes: Node[];
  deployments: Deployment[];
  overrides: PrototypeOverrides;
}): RewardRow[] {
  const appById = new Map(args.apps.map((app) => [app.id, app]));
  const nodeById = new Map(args.nodes.map((node) => [node.id, node]));
  const rows: RewardRow[] = [];

  for (const deployment of args.deployments) {
    const app = appById.get(deployment.appId);
    if (!app) continue;

    for (const instance of deployment.instances) {
      const node = nodeById.get(instance.nodeId);
      if (!node) continue;

      const statusLabel = getInstanceRewardSummary({
        app,
        node,
        instance,
        overrides: args.overrides,
      });
      const earning =
        app.rewards.available &&
        !args.overrides.rewardsUnavailable &&
        node.rewardWalletConnected &&
        !node.regionRestricted &&
        instance.status === "running";

      rows.push({
        app,
        node,
        statusLabel,
        estimateLabel: app.rewards.available
          ? (app.rewards.estimateLabel ?? "Estimate unavailable")
          : "No financial rewards",
        earning,
        installationPath: `/installed/${app.id}/nodes/${node.id}`,
      });
    }
  }

  return rows.sort((a, b) => {
    if (a.earning !== b.earning) return a.earning ? -1 : 1;
    return a.app.name.localeCompare(b.app.name);
  });
}

export function summarizeRewards(rows: RewardRow[]): {
  total: number;
  earning: number;
  notEarning: number;
  noRewardsApps: number;
} {
  return {
    total: rows.length,
    earning: rows.filter((row) => row.earning).length,
    notEarning: rows.filter((row) => !row.earning).length,
    noRewardsApps: rows.filter((row) => !row.app.rewards.available).length,
  };
}
