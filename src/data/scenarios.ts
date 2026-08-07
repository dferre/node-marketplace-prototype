import type {
  NodeInstallationStatus,
  PrototypeOverrides,
  PrototypeScenario,
} from "../types/prototype";
import { createDeployment } from "./deployments";

const defaultOverrides: PrototypeOverrides = {
  marketplaceUnavailable: false,
  compatibilityUnavailable: false,
  rewardsUnavailable: false,
  staleNodeData: false,
  slowInstallation: false,
  appSuspended: false,
  appRemoved: false,
  updateRequired: false,
  newPermissionsRequired: false,
  userPermissionChanged: false,
  networkOffline: false,
  catalogLoading: false,
};

function statuses(
  entries: Record<string, NodeInstallationStatus["stage"]>,
): Record<string, NodeInstallationStatus> {
  return Object.fromEntries(
    Object.entries(entries).map(([nodeId, stage]) => [
      nodeId,
      {
        stage,
        updatedAt: "2026-08-04T18:00:00.000Z",
      } satisfies NodeInstallationStatus,
    ]),
  );
}

/** Realistic installed-app seed for the default eight-node fleet (browse/manage). */
const defaultFleetInstalledAppIdsByNode: Record<string, string[]> = {
  node_denver_01: [
    "app_atlas_storage",
    "app_sentinel_monitor",
    "app_forge_compute",
  ],
  node_home: ["app_sentinel_monitor", "app_backup_vault"],
  node_cloud_04: [
    "app_atlas_storage",
    "app_sentinel_monitor",
    "app_relay_network",
  ],
  node_archive: ["app_sentinel_monitor", "app_backup_vault"],
  node_offline_07: ["app_atlas_storage", "app_sentinel_monitor"],
  node_legacy: [],
  node_limited_bandwidth: ["app_sentinel_monitor", "app_stream_cache"],
  node_restricted_region: ["app_sentinel_monitor"],
};

const defaultFleetDeployments = [
  createDeployment({
    id: "dep_atlas_default",
    appId: "app_atlas_storage",
    nodeIds: ["node_denver_01", "node_cloud_04", "node_offline_07"],
    version: "2.4.1",
  }),
  createDeployment({
    id: "dep_sentinel_default",
    appId: "app_sentinel_monitor",
    nodeIds: [
      "node_denver_01",
      "node_home",
      "node_cloud_04",
      "node_archive",
      "node_offline_07",
      "node_limited_bandwidth",
      "node_restricted_region",
    ],
    version: "4.0.3",
  }),
  createDeployment({
    id: "dep_forge_default",
    appId: "app_forge_compute",
    nodeIds: ["node_denver_01"],
    version: "1.8.0",
  }),
  createDeployment({
    id: "dep_relay_default",
    appId: "app_relay_network",
    nodeIds: ["node_cloud_04"],
    version: "3.1.2",
  }),
  createDeployment({
    id: "dep_backup_default",
    appId: "app_backup_vault",
    nodeIds: ["node_home", "node_archive"],
    version: "5.2.0",
  }),
  createDeployment({
    id: "dep_stream_default",
    appId: "app_stream_cache",
    nodeIds: ["node_limited_bandwidth"],
    version: "2.0.0",
  }),
];

export const scenarios: PrototypeScenario[] = [
  {
    id: "default-marketplace",
    name: "Default marketplace",
    description:
      "Multi-node owner with a mixed fleet already running several apps.",
    userId: "multi-node-owner",
    appId: "app_atlas_storage",
    nodeFleetId: "default-fleet",
    startingRoute: "/marketplace",
    installedAppIdsByNode: defaultFleetInstalledAppIdsByNode,
    deployments: defaultFleetDeployments,
  },
  {
    id: "no-nodes",
    name: "No nodes",
    description: "User has an account but owns no nodes.",
    userId: "no-nodes-user",
    appId: "app_atlas_storage",
    nodeFleetId: "empty-fleet",
    startingRoute: "/marketplace/apps/app_atlas_storage",
  },
  {
    id: "one-compatible-node",
    name: "One compatible node",
    description: "Only one compatible node; can be preselected.",
    userId: "single-node-owner",
    appId: "app_atlas_storage",
    nodeFleetId: "one-compatible-fleet",
    startingRoute: "/marketplace/apps/app_atlas_storage/install",
    installationScope: "one",
    selectedNodeIds: ["node_denver_01"],
  },
  {
    id: "multi-node-owner",
    name: "Multi-node owner",
    description: "Default mixed fleet ready for scoped installation.",
    userId: "multi-node-owner",
    appId: "app_atlas_storage",
    nodeFleetId: "default-fleet",
    startingRoute: "/marketplace/apps/app_atlas_storage/install",
    installationScope: "selected",
  },
  {
    id: "large-fleet",
    name: "Large fleet",
    description: "Approximately 50 nodes for selection-scale testing.",
    userId: "multi-node-owner",
    appId: "app_sentinel_monitor",
    nodeFleetId: "large-fleet",
    startingRoute: "/marketplace/apps/app_sentinel_monitor/install",
    installationScope: "selected",
  },
  {
    id: "no-compatible-nodes",
    name: "No compatible nodes",
    description: "Atlas Storage against only Legacy Node.",
    userId: "multi-node-owner",
    appId: "app_atlas_storage",
    nodeFleetId: "no-compatible-fleet",
    startingRoute: "/marketplace/apps/app_atlas_storage",
  },
  {
    id: "upgrade-self-hosted",
    name: "Upgrade self-hosted node",
    description:
      "Legacy self-hosted node lacks Atlas capacity — instruct user to upgrade host, then recheck.",
    userId: "multi-node-owner",
    appId: "app_atlas_storage",
    nodeFleetId: "no-compatible-fleet",
    startingRoute:
      "/nodes/node_legacy/upgrade?appId=app_atlas_storage",
  },
  {
    id: "upgrade-provider-billing",
    name: "Upgrade provider node (billing)",
    description:
      "Underpowered Nimbus cloud node — automated provider upgrade with provider-account charge note.",
    userId: "multi-node-owner",
    appId: "app_atlas_storage",
    nodeFleetId: "provider-underpowered-fleet",
    startingRoute:
      "/nodes/node_cloud_04/upgrade?appId=app_atlas_storage",
  },
  {
    id: "upgrade-provider-manual",
    name: "Upgrade provider node (manual)",
    description:
      "ArchiveCo lacks SSD and does not support auto-upgrade — checklist + recheck.",
    userId: "multi-node-owner",
    appId: "app_atlas_storage",
    nodeFleetId: "provider-manual-fleet",
    startingRoute: "/nodes/node_archive/upgrade?appId=app_atlas_storage",
  },
  {
    id: "mixed-compatibility",
    name: "Mixed compatibility",
    description:
      "Primary Atlas Storage test fleet: 3 ready, 1 warning, 1 offline; one fails on final recheck.",
    userId: "multi-node-owner",
    appId: "app_atlas_storage",
    nodeFleetId: "default-fleet",
    startingRoute: "/marketplace/apps/app_atlas_storage/install",
    installationScope: "selected",
    selectedNodeIds: [
      "node_denver_01",
      "node_cloud_04",
      "node_limited_bandwidth",
      "node_offline_07",
      "node_restricted_region",
    ],
    forcedRecheckFailNodeIds: ["node_restricted_region"],
  },
  {
    id: "all-compatible",
    name: "All compatible",
    description: "Sentinel Monitor on a fully compatible fleet.",
    userId: "multi-node-owner",
    appId: "app_sentinel_monitor",
    nodeFleetId: "all-compatible-fleet",
    startingRoute: "/marketplace/apps/app_sentinel_monitor/install",
    installationScope: "all-compatible",
  },
  {
    id: "already-installed-some",
    name: "Already installed on some nodes",
    description: "Atlas Storage already installed on Denver and Cloud.",
    userId: "multi-node-owner",
    appId: "app_atlas_storage",
    nodeFleetId: "default-fleet",
    startingRoute: "/marketplace/apps/app_atlas_storage/install",
    installedAppIdsByNode: {
      node_denver_01: ["app_atlas_storage"],
      node_cloud_04: ["app_atlas_storage"],
    },
    deployments: [
      createDeployment({
        id: "dep_atlas_partial",
        appId: "app_atlas_storage",
        nodeIds: ["node_denver_01", "node_cloud_04"],
        version: "2.4.1",
      }),
    ],
  },
  {
    id: "installed-all-compatible",
    name: "Installed on all compatible nodes",
    description: "Atlas Storage installed on every currently compatible node.",
    userId: "multi-node-owner",
    appId: "app_atlas_storage",
    nodeFleetId: "default-fleet",
    startingRoute: "/installed/app_atlas_storage",
    installedAppIdsByNode: {
      node_denver_01: ["app_atlas_storage"],
      node_cloud_04: ["app_atlas_storage"],
      node_offline_07: ["app_atlas_storage"],
      node_limited_bandwidth: ["app_atlas_storage"],
    },
    deployments: [
      createDeployment({
        id: "dep_atlas_all_compatible",
        appId: "app_atlas_storage",
        nodeIds: [
          "node_denver_01",
          "node_cloud_04",
          "node_offline_07",
          "node_limited_bandwidth",
        ],
        version: "2.4.1",
      }),
    ],
  },
  {
    id: "offline-nodes",
    name: "Offline nodes",
    description: "Offline-heavy fleet for queued installation testing.",
    userId: "multi-node-owner",
    appId: "app_atlas_storage",
    nodeFleetId: "offline-heavy-fleet",
    startingRoute: "/marketplace/apps/app_atlas_storage/install",
    installationScope: "selected",
    selectedNodeIds: ["node_offline_07", "node_offline_08"],
  },
  {
    id: "stale-node-data",
    name: "Stale node data",
    description: "Fleet telemetry is stale; warnings should appear.",
    userId: "multi-node-owner",
    appId: "app_atlas_storage",
    nodeFleetId: "stale-data-fleet",
    startingRoute: "/marketplace/apps/app_atlas_storage/install",
    overrides: { staleNodeData: true },
  },
  {
    id: "complete-installation-success",
    name: "Complete installation success",
    description: "All selected nodes finished successfully.",
    userId: "multi-node-owner",
    appId: "app_atlas_storage",
    nodeFleetId: "default-fleet",
    startingRoute: "/marketplace/apps/app_atlas_storage/install/results",
    installationScope: "selected",
    selectedNodeIds: ["node_denver_01", "node_cloud_04", "node_limited_bandwidth"],
    overallStatus: "success",
    nodeStatuses: statuses({
      node_denver_01: "running",
      node_cloud_04: "running",
      node_limited_bandwidth: "running",
    }),
    deployments: [
      createDeployment({
        id: "dep_atlas_success",
        appId: "app_atlas_storage",
        nodeIds: ["node_denver_01", "node_cloud_04", "node_limited_bandwidth"],
        version: "2.4.1",
      }),
    ],
    installedAppIdsByNode: {
      node_denver_01: ["app_atlas_storage"],
      node_cloud_04: ["app_atlas_storage"],
      node_limited_bandwidth: ["app_atlas_storage"],
    },
  },
  {
    id: "partial-installation",
    name: "Partial installation success",
    description:
      "Primary tested scenario: 3 success, 1 queued, 1 failed after recheck.",
    userId: "multi-node-owner",
    appId: "app_atlas_storage",
    nodeFleetId: "default-fleet",
    startingRoute: "/marketplace/apps/app_atlas_storage/install/results",
    installationScope: "selected",
    selectedNodeIds: [
      "node_denver_01",
      "node_cloud_04",
      "node_limited_bandwidth",
      "node_offline_07",
      "node_restricted_region",
    ],
    forcedRecheckFailNodeIds: ["node_restricted_region"],
    overallStatus: "partial-success",
    nodeStatuses: statuses({
      node_denver_01: "running",
      node_cloud_04: "running",
      node_limited_bandwidth: "running",
      node_offline_07: "queued",
      node_restricted_region: "failed",
    }),
    deployments: [
      createDeployment({
        id: "dep_atlas_partial_success",
        appId: "app_atlas_storage",
        nodeIds: ["node_denver_01", "node_cloud_04", "node_limited_bandwidth"],
        version: "2.4.1",
      }),
    ],
    installedAppIdsByNode: {
      node_denver_01: ["app_atlas_storage"],
      node_cloud_04: ["app_atlas_storage"],
      node_limited_bandwidth: ["app_atlas_storage"],
    },
  },
  {
    id: "complete-installation-failure",
    name: "Complete installation failure",
    description: "Every selected installation failed.",
    userId: "multi-node-owner",
    appId: "app_atlas_storage",
    nodeFleetId: "default-fleet",
    startingRoute: "/marketplace/apps/app_atlas_storage/install/results",
    installationScope: "selected",
    selectedNodeIds: ["node_home", "node_legacy", "node_archive"],
    overallStatus: "failure",
    nodeStatuses: statuses({
      node_home: "failed",
      node_legacy: "failed",
      node_archive: "failed",
    }),
  },
  {
    id: "queued-only-installation",
    name: "Queued-only installation",
    description: "All selected installations are queued for offline nodes.",
    userId: "multi-node-owner",
    appId: "app_atlas_storage",
    nodeFleetId: "offline-heavy-fleet",
    startingRoute: "/marketplace/apps/app_atlas_storage/install/results",
    installationScope: "selected",
    selectedNodeIds: ["node_offline_07", "node_offline_08"],
    overallStatus: "queued",
    nodeStatuses: statuses({
      node_offline_07: "queued",
      node_offline_08: "waiting-for-node",
    }),
  },
  {
    id: "setup-required",
    name: "Setup required",
    description: "Installed app requires post-install configuration.",
    userId: "multi-node-owner",
    appId: "app_atlas_storage",
    nodeFleetId: "default-fleet",
    startingRoute: "/installed/app_atlas_storage",
    installedAppIdsByNode: {
      node_denver_01: ["app_atlas_storage"],
    },
    deployments: [
      createDeployment({
        id: "dep_atlas_setup",
        appId: "app_atlas_storage",
        nodeIds: ["node_denver_01"],
        version: "2.4.1",
        instanceStatus: "setup-required",
        aggregateHealth: "degraded",
      }),
    ],
  },
  {
    id: "app-update-available",
    name: "App update available",
    description: "Installed app has an available update.",
    userId: "multi-node-owner",
    appId: "app_atlas_storage",
    nodeFleetId: "default-fleet",
    startingRoute: "/installed/app_atlas_storage",
    overrides: { updateRequired: true },
    installedAppIdsByNode: {
      node_denver_01: ["app_atlas_storage"],
      node_cloud_04: ["app_atlas_storage"],
    },
    deployments: [
      createDeployment({
        id: "dep_atlas_update",
        appId: "app_atlas_storage",
        nodeIds: ["node_denver_01", "node_cloud_04"],
        version: "2.3.0",
      }),
    ],
  },
  {
    id: "unhealthy-installed-app",
    name: "Unhealthy installed app",
    description: "One or more installations need attention.",
    userId: "multi-node-owner",
    appId: "app_atlas_storage",
    nodeFleetId: "default-fleet",
    startingRoute: "/installed/app_atlas_storage/nodes/node_denver_01",
    installedAppIdsByNode: {
      node_denver_01: ["app_atlas_storage"],
      node_cloud_04: ["app_atlas_storage"],
    },
    deployments: [
      createDeployment({
        id: "dep_atlas_unhealthy",
        appId: "app_atlas_storage",
        nodeIds: ["node_denver_01", "node_cloud_04"],
        version: "2.4.1",
        instanceStatus: "unhealthy",
        aggregateHealth: "unhealthy",
      }),
    ],
  },
  {
    id: "suspended-app",
    name: "Suspended app",
    description: "Atlas Storage suspended for security review.",
    userId: "multi-node-owner",
    appId: "app_atlas_storage",
    nodeFleetId: "default-fleet",
    startingRoute: "/marketplace/apps/app_atlas_storage",
    overrides: { appSuspended: true },
  },
  {
    id: "marketplace-unavailable",
    name: "Marketplace unavailable",
    description: "Marketplace browsing is unavailable.",
    userId: "multi-node-owner",
    appId: "app_atlas_storage",
    nodeFleetId: "default-fleet",
    startingRoute: "/marketplace",
    overrides: { marketplaceUnavailable: true },
  },
  {
    id: "compatibility-unavailable",
    name: "Compatibility service unavailable",
    description: "Compatibility checks cannot run.",
    userId: "multi-node-owner",
    appId: "app_atlas_storage",
    nodeFleetId: "default-fleet",
    startingRoute: "/marketplace/apps/app_atlas_storage/install",
    overrides: { compatibilityUnavailable: true },
  },
  {
    id: "insufficient-permission",
    name: "Insufficient user permission",
    description: "User cannot install apps.",
    userId: "restricted-user",
    appId: "app_atlas_storage",
    nodeFleetId: "default-fleet",
    startingRoute: "/marketplace/apps/app_atlas_storage",
    overrides: { userPermissionChanged: true },
  },
  {
    id: "network-offline",
    name: "Network offline",
    description: "Client is offline; marketplace and compatibility are limited.",
    userId: "multi-node-owner",
    appId: "app_atlas_storage",
    nodeFleetId: "default-fleet",
    startingRoute: "/marketplace",
    overrides: { networkOffline: true },
  },
  {
    id: "catalog-loading",
    name: "Catalog loading",
    description: "Marketplace and installed lists show a loading shell.",
    userId: "multi-node-owner",
    appId: "app_atlas_storage",
    nodeFleetId: "default-fleet",
    startingRoute: "/marketplace",
    overrides: { catalogLoading: true },
  },
  {
    id: "app-removed",
    name: "App removed",
    description: "Atlas Storage removed from the marketplace catalog.",
    userId: "multi-node-owner",
    appId: "app_atlas_storage",
    nodeFleetId: "default-fleet",
    startingRoute: "/marketplace/apps/app_atlas_storage",
    overrides: { appRemoved: true },
  },
  {
    id: "new-permissions-on-update",
    name: "New permissions on update",
    description: "Installed app update requires accepting new permissions.",
    userId: "multi-node-owner",
    appId: "app_atlas_storage",
    nodeFleetId: "default-fleet",
    startingRoute: "/installed/app_atlas_storage",
    overrides: { updateRequired: true, newPermissionsRequired: true },
    installedAppIdsByNode: {
      node_denver_01: ["app_atlas_storage"],
      node_cloud_04: ["app_atlas_storage"],
    },
    deployments: [
      createDeployment({
        id: "dep_atlas_permissions_update",
        appId: "app_atlas_storage",
        nodeIds: ["node_denver_01", "node_cloud_04"],
        version: "2.3.0",
      }),
    ],
  },
  {
    id: "manage-permission-denied",
    name: "Manage permission denied",
    description: "View-only user can see installed apps but cannot manage them.",
    userId: "restricted-user",
    appId: "app_atlas_storage",
    nodeFleetId: "default-fleet",
    startingRoute: "/installed/app_atlas_storage",
    overrides: { userPermissionChanged: true },
    installedAppIdsByNode: {
      node_denver_01: ["app_atlas_storage"],
      node_cloud_04: ["app_atlas_storage"],
    },
    deployments: [
      createDeployment({
        id: "dep_atlas_view_only",
        appId: "app_atlas_storage",
        nodeIds: ["node_denver_01", "node_cloud_04"],
        version: "2.4.1",
      }),
    ],
  },
  {
    id: "suspended-installed-app",
    name: "Suspended installed app",
    description: "App is suspended while still installed on nodes.",
    userId: "multi-node-owner",
    appId: "app_atlas_storage",
    nodeFleetId: "default-fleet",
    startingRoute: "/installed/app_atlas_storage",
    overrides: { appSuspended: true },
    installedAppIdsByNode: {
      node_denver_01: ["app_atlas_storage"],
      node_cloud_04: ["app_atlas_storage"],
    },
    deployments: [
      createDeployment({
        id: "dep_atlas_suspended_installed",
        appId: "app_atlas_storage",
        nodeIds: ["node_denver_01", "node_cloud_04"],
        version: "2.4.1",
      }),
    ],
  },
];

export function getScenarioById(id: string): PrototypeScenario | undefined {
  return scenarios.find((scenario) => scenario.id === id);
}

export function getDefaultScenario(): PrototypeScenario {
  return scenarios[0]!;
}

export function mergeOverrides(
  partial?: Partial<PrototypeOverrides>,
): PrototypeOverrides {
  return { ...defaultOverrides, ...partial };
}
