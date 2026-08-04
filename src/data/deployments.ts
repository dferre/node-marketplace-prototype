import type { Deployment, DeploymentInstance } from "../types/prototype";

export function createDeployment(args: {
  id: string;
  appId: string;
  nodeIds: string[];
  version: string;
  instanceStatus?: DeploymentInstance["status"];
  aggregateHealth?: Deployment["aggregateHealth"];
}): Deployment {
  const instanceStatus = args.instanceStatus ?? "running";

  return {
    id: args.id,
    appId: args.appId,
    nodeIds: args.nodeIds,
    version: args.version,
    aggregateHealth: args.aggregateHealth ?? "healthy",
    instances: args.nodeIds.map((nodeId) => ({
      nodeId,
      status: instanceStatus,
      version: args.version,
      healthLabel:
        instanceStatus === "unhealthy"
          ? "Needs attention"
          : instanceStatus === "setup-required"
            ? "Setup required"
            : undefined,
    })),
  };
}
