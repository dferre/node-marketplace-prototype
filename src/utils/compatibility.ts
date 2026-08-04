import type {
  CompatibilityIssue,
  CompatibilityResult,
  MarketplaceApp,
  Node,
  PrototypeOverrides,
} from "../types/prototype";
import { compareVersions } from "./version";

function pushBlocking(
  issues: CompatibilityIssue[],
  code: string,
  message: string,
  requirement?: string,
  nodeValue?: string,
  recommendedAction?: string,
) {
  issues.push({
    code,
    severity: "blocking",
    message,
    requirement,
    nodeValue,
    recommendedAction,
  });
}

function pushWarning(
  issues: CompatibilityIssue[],
  code: string,
  message: string,
  requirement?: string,
  nodeValue?: string,
  recommendedAction?: string,
) {
  issues.push({
    code,
    severity: "warning",
    message,
    requirement,
    nodeValue,
    recommendedAction,
  });
}

export function evaluateCompatibility(
  app: MarketplaceApp,
  node: Node,
  overrides: PrototypeOverrides,
): CompatibilityResult {
  const issues: CompatibilityIssue[] = [];
  const rewardNotes: string[] = [];

  if (overrides.compatibilityUnavailable || overrides.networkOffline) {
    return {
      nodeId: node.id,
      appId: app.id,
      status: "unable-to-check",
      issues: [
        {
          code: "service-unavailable",
          severity: "blocking",
          message: "Unable to check compatibility right now.",
          recommendedAction: "Retry when the compatibility service is available.",
        },
      ],
      rewardEligible: false,
      rewardNotes: ["Compatibility service unavailable"],
    };
  }

  if (app.status === "deprecated") {
    pushBlocking(
      issues,
      "deprecated",
      "This app is no longer available for new installations.",
      "Published and installable",
      app.status,
      "View the recommended replacement app.",
    );
  }

  if (app.status === "suspended" || overrides.appSuspended) {
    pushBlocking(
      issues,
      "suspended",
      "This app has been temporarily suspended.",
      "Active marketplace listing",
      "Suspended",
      "Wait for the security review to complete.",
    );
  }

  if (node.installedAppIds.includes(app.id)) {
    return {
      nodeId: node.id,
      appId: app.id,
      status: "already-installed",
      issues: [
        {
          code: "already-installed",
          severity: "info",
          message: "This app is already installed on this node.",
        },
      ],
      rewardEligible: node.rewardWalletConnected && !node.regionRestricted,
      rewardNotes: [],
    };
  }

  if (!app.requirements.allowedNodeTypes.includes(node.type)) {
    pushBlocking(
      issues,
      "node-type",
      "This node type is not supported for this app.",
      `Node type: ${app.requirements.allowedNodeTypes.join(", ")}`,
      node.type,
      "Install on a supported node type.",
    );
  }

  if (
    compareVersions(node.softwareVersion, app.requirements.minSoftwareVersion) <
    0
  ) {
    pushBlocking(
      issues,
      "software-version",
      "Node software version is too old.",
      `Node software ${app.requirements.minSoftwareVersion}+`,
      node.softwareVersion,
      "Update node software, then retry.",
    );
  }

  if (node.cpuCoresAvailable < app.requirements.minCpuCores) {
    pushBlocking(
      issues,
      "cpu",
      "Insufficient CPU cores available.",
      `${app.requirements.minCpuCores} CPU cores`,
      `${node.cpuCoresAvailable} cores`,
      "Free CPU capacity or choose another node.",
    );
  }

  if (node.memoryGbAvailable < app.requirements.minMemoryGb) {
    pushBlocking(
      issues,
      "memory",
      "Insufficient memory available.",
      `${app.requirements.minMemoryGb} GB memory`,
      `${node.memoryGbAvailable} GB`,
      "Free memory or choose another node.",
    );
  }

  if (node.storageGbAvailable < app.requirements.minStorageGb) {
    pushBlocking(
      issues,
      "storage",
      "Insufficient storage available.",
      `${app.requirements.minStorageGb} GB storage`,
      `${node.storageGbAvailable} GB`,
      "Free storage or choose another node.",
    );
  }

  if (
    app.requirements.requiredStorageType &&
    node.storageType !== app.requirements.requiredStorageType
  ) {
    pushBlocking(
      issues,
      "storage-type",
      "Required storage type is not available.",
      `${app.requirements.requiredStorageType.toUpperCase()} storage`,
      node.storageType.toUpperCase(),
      "Use a node with the required storage type.",
    );
  }

  if (app.requirements.requiresGpu && !node.gpuSupported) {
    pushBlocking(
      issues,
      "gpu",
      "A supported GPU is required.",
      "Supported GPU",
      node.hasGpu ? "Unsupported GPU" : "No GPU",
      "Choose a node with a supported GPU.",
    );
  }

  if (app.requirements.requiresPublicIp && !node.publicIp) {
    pushBlocking(
      issues,
      "public-ip",
      "A public IP address is required.",
      "Public IP",
      "No public IP",
      "Enable public IP or choose another node.",
    );
  }

  if (
    app.requirements.restrictedRegions?.includes(node.region) ||
    (app.requirements.restrictedRegions?.length && node.regionRestricted)
  ) {
    pushBlocking(
      issues,
      "region",
      "This app is not available in the node region.",
      "Supported region",
      node.region,
      "Choose a node in a supported region.",
    );
  }

  const conflicting = app.requirements.conflictingAppIds?.filter((id) =>
    node.installedAppIds.includes(id),
  );
  if (conflicting && conflicting.length > 0) {
    pushBlocking(
      issues,
      "conflict",
      "A conflicting app is already installed.",
      "No conflicting apps",
      conflicting.join(", "),
      "Uninstall the conflicting app or choose another node.",
    );
  }

  if (!app.requirements.architectures.includes(node.architecture)) {
    pushBlocking(
      issues,
      "architecture",
      "Hardware architecture is not supported.",
      app.requirements.architectures.join(", "),
      node.architecture,
    );
  }

  if (node.bandwidthMbps < app.requirements.minBandwidthMbps) {
    if (node.bandwidthMbps >= app.requirements.minBandwidthMbps * 0.4) {
      pushWarning(
        issues,
        "bandwidth-low",
        "Available bandwidth is below the recommended level.",
        `${app.requirements.minBandwidthMbps} Mbps recommended`,
        `${node.bandwidthMbps} Mbps`,
        "Continue with caution or choose a higher-bandwidth node.",
      );
    } else {
      pushBlocking(
        issues,
        "bandwidth",
        "Insufficient bandwidth for this app.",
        `${app.requirements.minBandwidthMbps} Mbps`,
        `${node.bandwidthMbps} Mbps`,
        "Upgrade connection or choose another node.",
      );
    }
  }

  if (node.meteredConnection) {
    pushWarning(
      issues,
      "metered",
      "This node uses a metered internet connection.",
      "Unlimited or high-cap data plan recommended",
      "Metered",
      "Review bandwidth caps before installing.",
    );
  }

  if (!node.publicIp && !app.requirements.requiresPublicIp) {
    if (app.id === "app_relay_network" || app.id === "app_stream_cache") {
      pushWarning(
        issues,
        "public-ip-preferred",
        "Public IP is preferred for best performance.",
        "Public IP preferred",
        "No public IP",
      );
    }
  }

  if (!app.requirements.requiresGpu && app.id === "app_forge_compute" && !node.hasGpu) {
    pushWarning(
      issues,
      "gpu-recommended",
      "No GPU detected. Reward potential may be reduced.",
      "GPU recommended",
      "No GPU",
    );
  }

  if (
    app.requirements.minStorageGb > 0 &&
    node.storageGbAvailable - app.requirements.minStorageGb < 100 &&
    node.storageGbAvailable >= app.requirements.minStorageGb
  ) {
    pushWarning(
      issues,
      "low-remaining-storage",
      "Less than 100 GB would remain after allocation.",
      "Comfortable remaining storage",
      `${node.storageGbAvailable} GB available`,
    );
  }

  if (node.dataStale || overrides.staleNodeData) {
    pushWarning(
      issues,
      "stale-data",
      "Compatibility is based on stale node data.",
      "Fresh node telemetry",
      "Stale",
      "Requirements will be rechecked when the node reconnects.",
    );
  }

  if (!node.rewardWalletConnected && app.rewards.available) {
    rewardNotes.push("Reward wallet is not connected.");
  }

  if (node.regionRestricted && app.rewards.available) {
    rewardNotes.push("Rewards are unavailable in this region.");
  }

  if (overrides.rewardsUnavailable) {
    rewardNotes.push("Reward estimates are currently unavailable.");
  }

  const hasBlocking = issues.some((issue) => issue.severity === "blocking");
  const hasWarning = issues.some((issue) => issue.severity === "warning");

  let status: CompatibilityResult["status"] = "compatible";
  if (hasBlocking) {
    status = "incompatible";
  } else if (!node.online) {
    status = "offline-queued";
  } else if (hasWarning) {
    status = "compatible-with-warnings";
  }

  const rewardEligible =
    app.rewards.available &&
    !node.regionRestricted &&
    node.rewardWalletConnected &&
    !overrides.rewardsUnavailable &&
    status !== "incompatible";

  return {
    nodeId: node.id,
    appId: app.id,
    status,
    issues,
    rewardEligible,
    rewardNotes,
  };
}

export function summarizeCompatibility(
  results: CompatibilityResult[],
): Record<CompatibilityResult["status"], number> {
  return results.reduce(
    (summary, result) => {
      summary[result.status] += 1;
      return summary;
    },
    {
      compatible: 0,
      "compatible-with-warnings": 0,
      "offline-queued": 0,
      incompatible: 0,
      "unable-to-check": 0,
      "already-installed": 0,
    } satisfies Record<CompatibilityResult["status"], number>,
  );
}
