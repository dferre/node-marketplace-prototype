import type {
  Deployment,
  DeploymentInstance,
  Node,
  PrototypeState,
} from "../types/prototype";
import { deriveAggregateHealth } from "../utils/installedApps";

function updateDeploymentInstances(
  deployment: Deployment,
  nodeIds: string[],
  updater: (instance: DeploymentInstance) => DeploymentInstance,
): Deployment {
  const target = new Set(nodeIds);
  const instances = deployment.instances.map((instance) =>
    target.has(instance.nodeId) ? updater(instance) : instance,
  );
  return {
    ...deployment,
    instances,
    aggregateHealth: deriveAggregateHealth(instances),
  };
}

export function uninstallFromDeployment(args: {
  deployments: Deployment[];
  nodes: Node[];
  appId: string;
  nodeIds: string[];
}): Pick<PrototypeState, "deployments" | "nodes"> {
  const removeSet = new Set(args.nodeIds);

  const deployments = args.deployments
    .map((deployment) => {
      if (deployment.appId !== args.appId) return deployment;
      const nodeIds = deployment.nodeIds.filter((id) => !removeSet.has(id));
      const instances = deployment.instances.filter(
        (instance) => !removeSet.has(instance.nodeId),
      );
      if (nodeIds.length === 0) return null;
      return {
        ...deployment,
        nodeIds,
        instances,
        aggregateHealth: deriveAggregateHealth(instances),
      };
    })
    .filter((deployment): deployment is Deployment => Boolean(deployment));

  const nodes = args.nodes.map((node) => {
    if (!removeSet.has(node.id)) return node;
    return {
      ...node,
      installedAppIds: node.installedAppIds.filter((id) => id !== args.appId),
    };
  });

  return { deployments, nodes };
}

export function setInstanceStatuses(args: {
  deployments: Deployment[];
  appId: string;
  nodeIds: string[];
  status: DeploymentInstance["status"];
  healthLabel?: string;
  version?: string;
}): Deployment[] {
  return args.deployments.map((deployment) => {
    if (deployment.appId !== args.appId) return deployment;
    return updateDeploymentInstances(deployment, args.nodeIds, (instance) => ({
      ...instance,
      status: args.status,
      healthLabel: args.healthLabel,
      version: args.version ?? instance.version,
    }));
  });
}

export function bumpDeploymentVersion(args: {
  deployments: Deployment[];
  appId: string;
  nodeIds: string[];
  version: string;
}): Deployment[] {
  return args.deployments.map((deployment) => {
    if (deployment.appId !== args.appId) return deployment;
    const target = new Set(args.nodeIds);
    const instances = deployment.instances.map((instance) =>
      target.has(instance.nodeId)
        ? {
            ...instance,
            status: "running" as const,
            version: args.version,
            healthLabel: undefined,
          }
        : instance,
    );
    return {
      ...deployment,
      version: args.version,
      instances,
      aggregateHealth: deriveAggregateHealth(instances),
    };
  });
}
