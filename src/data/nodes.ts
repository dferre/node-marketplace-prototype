import type { Node, NodeFleet } from "../types/prototype";

function cloneNode(node: Node, overrides: Partial<Node> = {}): Node {
  return {
    ...node,
    installedAppIds: [...(overrides.installedAppIds ?? node.installedAppIds)],
    ...overrides,
  };
}

export const denverNode01: Node = {
  id: "node_denver_01",
  name: "Denver Node 01",
  type: "pro",
  online: true,
  softwareVersion: "2.6",
  cpuCoresAvailable: 12,
  memoryGbAvailable: 32,
  storageGbAvailable: 2000,
  storageType: "ssd",
  bandwidthMbps: 1000,
  meteredConnection: false,
  hasGpu: true,
  gpuSupported: true,
  publicIp: true,
  region: "United States",
  regionRestricted: false,
  rewardWalletConnected: true,
  architecture: "x86_64",
  health: "healthy",
  dataStale: false,
  lastSeenAt: "2026-08-04T18:00:00.000Z",
  installedAppIds: [],
};

export const homeNode: Node = {
  id: "node_home",
  name: "Home Node",
  type: "standard",
  online: true,
  softwareVersion: "2.4",
  cpuCoresAvailable: 4,
  memoryGbAvailable: 8,
  storageGbAvailable: 300,
  storageType: "ssd",
  bandwidthMbps: 250,
  meteredConnection: false,
  hasGpu: false,
  gpuSupported: false,
  publicIp: false,
  region: "United States",
  regionRestricted: false,
  rewardWalletConnected: true,
  architecture: "x86_64",
  health: "healthy",
  dataStale: false,
  lastSeenAt: "2026-08-04T18:00:00.000Z",
  installedAppIds: [],
};

export const cloudNode04: Node = {
  id: "node_cloud_04",
  name: "Cloud Node 04",
  type: "cloud",
  online: true,
  softwareVersion: "2.5",
  cpuCoresAvailable: 8,
  memoryGbAvailable: 16,
  storageGbAvailable: 600,
  storageType: "ssd",
  bandwidthMbps: 1000,
  meteredConnection: false,
  hasGpu: false,
  gpuSupported: false,
  publicIp: true,
  region: "Canada",
  regionRestricted: false,
  rewardWalletConnected: true,
  architecture: "x86_64",
  health: "healthy",
  dataStale: false,
  lastSeenAt: "2026-08-04T18:00:00.000Z",
  installedAppIds: [],
};

export const archiveNode: Node = {
  id: "node_archive",
  name: "Archive Node",
  type: "enterprise",
  online: true,
  softwareVersion: "2.4",
  cpuCoresAvailable: 8,
  memoryGbAvailable: 32,
  storageGbAvailable: 4000,
  storageType: "hdd",
  bandwidthMbps: 500,
  meteredConnection: false,
  hasGpu: false,
  gpuSupported: false,
  publicIp: true,
  region: "Germany",
  regionRestricted: false,
  rewardWalletConnected: true,
  architecture: "x86_64",
  health: "healthy",
  dataStale: false,
  lastSeenAt: "2026-08-04T18:00:00.000Z",
  installedAppIds: [],
};

export const offlineNode07: Node = {
  id: "node_offline_07",
  name: "Offline Node 07",
  type: "pro",
  online: false,
  offlineSinceHours: 8,
  softwareVersion: "2.5",
  cpuCoresAvailable: 8,
  memoryGbAvailable: 16,
  storageGbAvailable: 1000,
  storageType: "ssd",
  bandwidthMbps: 500,
  meteredConnection: false,
  hasGpu: false,
  gpuSupported: false,
  publicIp: true,
  region: "United States",
  regionRestricted: false,
  rewardWalletConnected: true,
  architecture: "x86_64",
  health: "degraded",
  dataStale: true,
  lastSeenAt: "2026-08-04T10:00:00.000Z",
  installedAppIds: [],
};

export const legacyNode: Node = {
  id: "node_legacy",
  name: "Legacy Node",
  type: "standard",
  online: true,
  softwareVersion: "2.1",
  cpuCoresAvailable: 2,
  memoryGbAvailable: 4,
  storageGbAvailable: 100,
  storageType: "unknown",
  bandwidthMbps: 100,
  meteredConnection: false,
  hasGpu: false,
  gpuSupported: false,
  publicIp: false,
  region: "United States",
  regionRestricted: false,
  rewardWalletConnected: false,
  architecture: "x86_64",
  health: "degraded",
  dataStale: false,
  lastSeenAt: "2026-08-04T18:00:00.000Z",
  installedAppIds: [],
};

export const limitedBandwidthNode: Node = {
  id: "node_limited_bandwidth",
  name: "Limited Bandwidth Node",
  type: "pro",
  online: true,
  softwareVersion: "2.6",
  cpuCoresAvailable: 12,
  memoryGbAvailable: 32,
  storageGbAvailable: 2000,
  storageType: "ssd",
  bandwidthMbps: 50,
  meteredConnection: true,
  hasGpu: true,
  gpuSupported: true,
  publicIp: true,
  region: "United States",
  regionRestricted: false,
  rewardWalletConnected: true,
  architecture: "x86_64",
  health: "healthy",
  dataStale: false,
  lastSeenAt: "2026-08-04T18:00:00.000Z",
  installedAppIds: [],
};

export const restrictedRegionNode: Node = {
  id: "node_restricted_region",
  name: "Restricted Region Node",
  type: "pro",
  online: true,
  softwareVersion: "2.6",
  cpuCoresAvailable: 12,
  memoryGbAvailable: 32,
  storageGbAvailable: 2000,
  storageType: "ssd",
  bandwidthMbps: 1000,
  meteredConnection: false,
  hasGpu: true,
  gpuSupported: true,
  publicIp: true,
  region: "restricted",
  regionRestricted: true,
  rewardWalletConnected: false,
  architecture: "x86_64",
  health: "healthy",
  dataStale: false,
  lastSeenAt: "2026-08-04T18:00:00.000Z",
  installedAppIds: [],
};

export const defaultFleetNodes: Node[] = [
  denverNode01,
  homeNode,
  cloudNode04,
  archiveNode,
  offlineNode07,
  legacyNode,
  limitedBandwidthNode,
  restrictedRegionNode,
].map((node) => cloneNode(node));

function buildLargeFleet(): Node[] {
  const templates = [
    denverNode01,
    homeNode,
    cloudNode04,
    archiveNode,
    limitedBandwidthNode,
  ];
  const nodes: Node[] = defaultFleetNodes.map((node) => cloneNode(node));

  for (let index = 1; index <= 42; index += 1) {
    const template = templates[index % templates.length]!;
    nodes.push(
      cloneNode(template, {
        id: `node_fleet_${String(index).padStart(2, "0")}`,
        name: `Fleet Node ${String(index).padStart(2, "0")}`,
        online: index % 9 !== 0,
        offlineSinceHours: index % 9 === 0 ? 3 : undefined,
        dataStale: index % 9 === 0,
        installedAppIds: [],
      }),
    );
  }

  return nodes;
}

export const nodeFleets: NodeFleet[] = [
  {
    id: "default-fleet",
    name: "Default fleet",
    description: "Eight-node sample fleet covering mixed compatibility.",
    nodes: defaultFleetNodes.map((node) => cloneNode(node)),
  },
  {
    id: "empty-fleet",
    name: "No nodes",
    description: "User owns no nodes.",
    nodes: [],
  },
  {
    id: "one-compatible-fleet",
    name: "One compatible node",
    description: "Only Denver Node 01.",
    nodes: [cloneNode(denverNode01)],
  },
  {
    id: "no-compatible-fleet",
    name: "No compatible nodes",
    description: "Only Legacy Node for Atlas Storage.",
    nodes: [cloneNode(legacyNode)],
  },
  {
    id: "all-compatible-fleet",
    name: "All compatible",
    description: "Nodes that are compatible with Sentinel Monitor.",
    nodes: [
      cloneNode(denverNode01),
      cloneNode(homeNode),
      cloneNode(cloudNode04),
      cloneNode(offlineNode07),
    ],
  },
  {
    id: "offline-heavy-fleet",
    name: "Offline nodes",
    description: "Fleet emphasizing offline/queued cases.",
    nodes: [
      cloneNode(denverNode01),
      cloneNode(offlineNode07),
      cloneNode(offlineNode07, {
        id: "node_offline_08",
        name: "Offline Node 08",
        offlineSinceHours: 24,
      }),
    ],
  },
  {
    id: "stale-data-fleet",
    name: "Stale node data",
    description: "Compatibility data is stale across the fleet.",
    nodes: defaultFleetNodes.map((node) =>
      cloneNode(node, { dataStale: true }),
    ),
  },
  {
    id: "large-fleet",
    name: "Large fleet",
    description: "Approximately 50 nodes for selection-scale testing.",
    nodes: buildLargeFleet(),
  },
];

export function getFleetById(id: string): NodeFleet | undefined {
  return nodeFleets.find((fleet) => fleet.id === id);
}

export function cloneFleetNodes(
  fleetId: string,
  installedAppIdsByNode?: Record<string, string[]>,
): Node[] {
  const fleet = getFleetById(fleetId);
  if (!fleet) return [];

  return fleet.nodes.map((node) =>
    cloneNode(node, {
      installedAppIds: installedAppIdsByNode?.[node.id] ?? node.installedAppIds,
    }),
  );
}
