export type InstallationScope = "one" | "selected" | "all-compatible";

export type OverallInstallationStatus =
  | "not-started"
  | "in-progress"
  | "success"
  | "partial-success"
  | "failure"
  | "queued"
  | "canceled";

export type NodeInstallationStage =
  | "queued"
  | "waiting-for-node"
  | "preparing"
  | "downloading"
  | "verifying"
  | "installing"
  | "configuring"
  | "starting"
  | "running"
  | "needs-attention"
  | "failed"
  | "canceled";

export type NodeInstallationStatus = {
  stage: NodeInstallationStage;
  message?: string;
  updatedAt?: string;
};

export type DebuggerTab =
  | "scenario"
  | "data"
  | "installation"
  | "system"
  | "debug"
  | "onboarding"
  | "style";

export type OnboardingFlowId =
  | "account"
  | "new-node"
  | "import-node"
  | "developer";

export type OnboardingTipId =
  | "marketplace-basics"
  | "first-install-coach";

export type OnboardingState = {
  completedFlows: OnboardingFlowId[];
  dismissedTips: OnboardingTipId[];
  /** flowId -> fieldId -> string value ("true" for checkboxes) */
  answers: Record<string, Record<string, string>>;
};

export type DeveloperVerificationStatus =
  | "verified"
  | "unverified"
  | "pending"
  | "expired"
  | "suspended";

export type AppStatus =
  | "published"
  | "published-limited"
  | "suspended"
  | "deprecated"
  | "removed";

export type AppCategory =
  | "compute"
  | "storage"
  | "networking"
  | "ai"
  | "data"
  | "infrastructure"
  | "security"
  | "media"
  | "utility";

export type ResourceIntensity = "low" | "medium" | "high";

export type NodeType = "standard" | "pro" | "cloud" | "enterprise";

export type StorageType = "ssd" | "hdd" | "mixed" | "unknown";

export type Architecture = "x86_64" | "arm64";

export type CompatibilityStatus =
  | "compatible"
  | "compatible-with-warnings"
  | "offline-queued"
  | "incompatible"
  | "unable-to-check"
  | "already-installed";

export type PrototypeUser = {
  id: string;
  name: string;
  role: string;
  canInstallApps: boolean;
  canManageNodes: boolean;
};

export type AppRequirements = {
  allowedNodeTypes: NodeType[];
  architectures: Architecture[];
  minCpuCores: number;
  minMemoryGb: number;
  minStorageGb: number;
  requiredStorageType?: StorageType;
  minBandwidthMbps: number;
  minSoftwareVersion: string;
  requiresGpu: boolean;
  requiresPublicIp: boolean;
  restrictedRegions?: string[];
  conflictingAppIds?: string[];
  continuousOperationRecommended?: boolean;
};

export type AppRewards = {
  available: boolean;
  token?: string;
  type?: string;
  estimateLabel?: string;
  estimateUnavailable?: boolean;
  paymentFrequency?: string;
  guaranteed: boolean;
  eligibilityNotes?: string[];
  assumptions?: string[];
};

export type AppPermission = {
  id: string;
  label: string;
  description?: string;
};

export type MarketplaceApp = {
  id: string;
  name: string;
  slug: string;
  developerId: string;
  developerName: string;
  developerStatus: DeveloperVerificationStatus;
  category: AppCategory;
  tags: string[];
  status: AppStatus;
  version: string;
  resourceIntensity: ResourceIntensity;
  shortDescription: string;
  fullDescription: string;
  primaryBenefit: string;
  rewards: AppRewards;
  requirements: AppRequirements;
  permissions: AppPermission[];
  setupRequired: boolean;
  setupNotes?: string[];
  securityReviewStatus: "reviewed" | "pending" | "failed" | "not-reviewed";
  documentationUrl?: string;
  supportUrl?: string;
  releaseNotes?: string;
  suspensionReason?: string;
  replacementAppId?: string;
  featured?: boolean;
};

export type Node = {
  id: string;
  name: string;
  type: NodeType;
  online: boolean;
  offlineSinceHours?: number;
  softwareVersion: string;
  cpuCoresAvailable: number;
  memoryGbAvailable: number;
  storageGbAvailable: number;
  storageType: StorageType;
  bandwidthMbps: number;
  meteredConnection: boolean;
  hasGpu: boolean;
  gpuSupported: boolean;
  publicIp: boolean;
  region: string;
  regionRestricted: boolean;
  rewardWalletConnected: boolean;
  architecture: Architecture;
  health: "healthy" | "degraded" | "unhealthy";
  dataStale: boolean;
  lastSeenAt?: string;
  installedAppIds: string[];
};

export type DeploymentInstance = {
  nodeId: string;
  status: "running" | "stopped" | "unhealthy" | "updating" | "setup-required";
  version: string;
  healthLabel?: string;
};

export type Deployment = {
  id: string;
  appId: string;
  nodeIds: string[];
  version: string;
  instances: DeploymentInstance[];
  aggregateHealth: "healthy" | "degraded" | "unhealthy" | "mixed";
};

export type PrototypeOverrides = {
  marketplaceUnavailable: boolean;
  compatibilityUnavailable: boolean;
  rewardsUnavailable: boolean;
  staleNodeData: boolean;
  slowInstallation: boolean;
  appSuspended: boolean;
  appRemoved: boolean;
  updateRequired: boolean;
  newPermissionsRequired: boolean;
  userPermissionChanged: boolean;
  networkOffline: boolean;
  /** Simulated catalog/page loading shell for marketplace and installed lists. */
  catalogLoading: boolean;
};

export type InstallationState = {
  scope: InstallationScope;
  selectedNodeIds: string[];
  overallStatus: OverallInstallationStatus;
  nodeStatuses: Record<string, NodeInstallationStatus>;
  isPlaying: boolean;
  focusedNodeId: string | null;
  /** Nodes that should fail during final compatibility recheck. */
  forcedRecheckFailNodeIds: string[];
  warningsAcknowledged: boolean;
};

export type DebuggerState = {
  isOpen: boolean;
  activeTab: DebuggerTab;
};

export type ToastState = {
  id: number;
  message: string;
} | null;

export type PrototypeScenario = {
  id: string;
  name: string;
  description: string;
  userId: string;
  appId: string;
  nodeFleetId: string;
  startingRoute: string;
  selectedNodeIds?: string[];
  installationScope?: InstallationScope;
  overallStatus?: OverallInstallationStatus;
  nodeStatuses?: Record<string, NodeInstallationStatus>;
  deployments?: Deployment[];
  overrides?: Partial<PrototypeOverrides>;
  installedAppIdsByNode?: Record<string, string[]>;
  forcedRecheckFailNodeIds?: string[];
};

export type NodeFleet = {
  id: string;
  name: string;
  description: string;
  nodes: Node[];
};

export type CompatibilityIssue = {
  code: string;
  severity: "blocking" | "warning" | "info";
  message: string;
  requirement?: string;
  nodeValue?: string;
  recommendedAction?: string;
};

export type CompatibilityResult = {
  nodeId: string;
  appId: string;
  status: CompatibilityStatus;
  issues: CompatibilityIssue[];
  rewardEligible: boolean;
  rewardNotes: string[];
};

export type PrototypeState = {
  scenarioId: string;
  activeUserId: string;
  activeAppId: string;
  nodeFleetId: string;

  users: PrototypeUser[];
  apps: MarketplaceApp[];
  nodes: Node[];
  deployments: Deployment[];

  installation: InstallationState;
  overrides: PrototypeOverrides;
  debugger: DebuggerState;
  toast: ToastState;
  onboarding: OnboardingState;
};

export const defaultOnboardingState = (): OnboardingState => ({
  completedFlows: [],
  dismissedTips: [],
  answers: {},
});
