import type {
  AppCategory,
  AppPermission,
  AppRequirements,
  AppRewards,
  Architecture,
  ResourceIntensity,
} from "./prototype";

export type WorkspaceMode = "operator" | "developer";

export type PortalVerificationStatus =
  | "not-started"
  | "draft"
  | "submitted"
  | "in-review"
  | "changes-requested"
  | "approved"
  | "rejected"
  | "expired"
  | "suspended";

export type DeveloperOrgRole =
  | "owner"
  | "administrator"
  | "developer"
  | "content-manager"
  | "analyst"
  | "viewer";

export type AppSubmissionStatus =
  | "draft"
  | "ready"
  | "submitted"
  | "automated-review"
  | "manual-review"
  | "changes-requested"
  | "resubmitted"
  | "approved"
  | "scheduled"
  | "published"
  | "rejected"
  | "withdrawn"
  | "suspended"
  | "deprecated";

export type ReviewFindingStatus =
  | "open"
  | "in-progress"
  | "resolved"
  | "accepted"
  | "reopened";

export type ReviewFindingSeverity =
  | "informational"
  | "warning"
  | "blocking"
  | "critical";

export type ReleaseStatus =
  | "draft"
  | "testing"
  | "in-review"
  | "approved"
  | "scheduled"
  | "rolling-out"
  | "paused"
  | "published"
  | "failed"
  | "rolled-back"
  | "deprecated"
  | "revoked";

export type MediaAssetStatus =
  | "uploading"
  | "processing"
  | "ready"
  | "failed"
  | "rejected";

export type BuildStatus =
  | "none"
  | "uploading"
  | "processing"
  | "validating"
  | "passed"
  | "warning"
  | "failed"
  | "security-pending"
  | "security-passed"
  | "security-failed";

export type TestRunStatus =
  | "not-started"
  | "queued"
  | "running"
  | "passed"
  | "passed-with-warnings"
  | "failed"
  | "blocked"
  | "expired";

export type EditorStepId =
  | "basics"
  | "listing"
  | "media"
  | "build"
  | "compatibility"
  | "permissions"
  | "rewards"
  | "support"
  | "testing"
  | "preview"
  | "submit";

export type ChecklistItemStatus =
  | "complete"
  | "warning"
  | "blocking"
  | "not-applicable";

export type DeveloperAccount = {
  id: string;
  email: string;
  displayName: string;
  legalNamePlaceholder: string;
  personaLabel: string;
  organizationId: string;
  role: DeveloperOrgRole;
  verificationStatus: PortalVerificationStatus;
  canCreateApps: boolean;
  canSubmitApps: boolean;
  canPublishReleases: boolean;
  restricted: boolean;
  suspended: boolean;
};

export type DeveloperOrganization = {
  id: string;
  legalName: string;
  publicName: string;
  type: "individual" | "company";
  verificationStatus: PortalVerificationStatus;
  website?: string;
  memberIds: string[];
  verificationNotes?: string[];
  reviewerComments?: string[];
};

export type MediaAsset = {
  id: string;
  kind:
    | "icon"
    | "banner"
    | "screenshot"
    | "diagram"
    | "video"
    | "document-image";
  title: string;
  caption: string;
  altText: string;
  status: MediaAssetStatus;
  sortOrder: number;
  isCover?: boolean;
  failureReason?: string;
};

export type AppBuild = {
  id: string;
  version: string;
  status: BuildStatus;
  runtimeType: string;
  architectures: Architecture[];
  packageSizeMb: number;
  checksumPlaceholder: string;
  signaturePresent: boolean;
  entryPoint: string;
  findings: string[];
  uploadedAt?: string;
};

export type AppReviewFinding = {
  id: string;
  category:
    | "listing"
    | "build"
    | "compatibility"
    | "permissions"
    | "privacy"
    | "security"
    | "rewards"
    | "legal"
    | "support"
    | "media";
  title: string;
  description: string;
  severity: ReviewFindingSeverity;
  status: ReviewFindingStatus;
  reviewerComment?: string;
  developerResponse?: string;
  affectedSection?: EditorStepId;
};

export type SubmissionEvent = {
  id: string;
  status: AppSubmissionStatus;
  at: string;
  actor: string;
  summary: string;
  buildVersion?: string;
};

export type AppSubmission = {
  id: string;
  appId: string;
  version: string;
  status: AppSubmissionStatus;
  submittedAt?: string;
  round: number;
  findings: AppReviewFinding[];
  timeline: SubmissionEvent[];
  policiesAccepted: boolean;
};

export type AppRelease = {
  id: string;
  appId: string;
  version: string;
  status: ReleaseStatus;
  notes: string;
  updateType: "optional" | "recommended" | "required" | "security" | "compatibility";
  rolloutPercent: number;
  createdAt: string;
};

export type AutomatedTestResult = {
  id: string;
  name: string;
  status: TestRunStatus;
  severity?: ReviewFindingSeverity;
  finding?: string;
  recommendation?: string;
  buildVersion: string;
  ranAt?: string;
};

export type DeveloperAppListing = {
  publicName: string;
  developerDisplayName: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  whatItDoes: string;
  whyInstall: string;
  howItWorks: string;
  keyBenefits: string[];
  setupExpectations: string;
  resourceUseExplanation: string;
  rewardSummary: string;
  faqs: { question: string; answer: string }[];
  documentationUrl: string;
  supportUrl: string;
  privacyPolicyUrl: string;
  termsUrl: string;
};

export type DeveloperAppBasics = {
  name: string;
  slug: string;
  internalId: string;
  category: AppCategory;
  secondaryCategories: AppCategory[];
  tags: string[];
  shortDescription: string;
  fullDescription: string;
  primaryBenefit: string;
  targetOperator: string;
  setupComplexity: "low" | "medium" | "high";
  language: string;
  supportStatus: string;
  openSource: boolean;
  repositoryUrl: string;
  resourceIntensity: ResourceIntensity;
};

export type DeveloperAppSupport = {
  supportEmail: string;
  supportWebsite: string;
  documentationUrl: string;
  statusPageUrl: string;
  privacyPolicyUrl: string;
  termsUrl: string;
  securityContact: string;
  vulnerabilityProcess: string;
};

export type DeveloperApp = {
  id: string;
  organizationId: string;
  marketplaceAppId?: string;
  basics: DeveloperAppBasics;
  listing: DeveloperAppListing;
  media: MediaAsset[];
  build: AppBuild;
  requirements: AppRequirements;
  permissions: AppPermission[];
  permissionNotes: Record<string, string>;
  privacySummary: string;
  rewards: AppRewards;
  support: DeveloperAppSupport;
  tests: AutomatedTestResult[];
  submission: AppSubmission | null;
  releases: AppRelease[];
  marketplaceStatus: AppSubmissionStatus;
  completionByStep: Record<EditorStepId, ChecklistItemStatus>;
  lastSavedAt: string;
  attentionItems: string[];
  analytics: {
    detailViews: number;
    installActions: number;
    activeInstallations: number;
    healthyInstallations: number;
    failedInstallations: number;
    rewardsDistributedLabel: string;
  };
};

export type DeveloperOverrides = {
  uploadUnavailable: boolean;
  reviewUnavailable: boolean;
  analyticsUnavailable: boolean;
  rewardsUnavailable: boolean;
  securityScanUnavailable: boolean;
  publicationFailure: boolean;
};

export type DeveloperPortalState = {
  activeDeveloperId: string;
  activeOrganizationId: string;
  activeDeveloperAppId: string | null;
  developers: DeveloperAccount[];
  organizations: DeveloperOrganization[];
  apps: DeveloperApp[];
  overrides: DeveloperOverrides;
};

export type DeveloperScenario = {
  id: string;
  name: string;
  description: string;
  developerId: string;
  organizationId: string;
  appId: string | null;
  startingRoute: string;
  overrides?: Partial<DeveloperOverrides>;
};

export const EDITOR_STEPS: { id: EditorStepId; label: string }[] = [
  { id: "basics", label: "App basics" },
  { id: "listing", label: "Marketplace listing" },
  { id: "media", label: "Media" },
  { id: "build", label: "Build and runtime" },
  { id: "compatibility", label: "Compatibility" },
  { id: "permissions", label: "Permissions and privacy" },
  { id: "rewards", label: "Benefits and rewards" },
  { id: "support", label: "Support and legal" },
  { id: "testing", label: "Testing" },
  { id: "preview", label: "Preview" },
  { id: "submit", label: "Submit" },
];

export const defaultDeveloperOverrides = (): DeveloperOverrides => ({
  uploadUnavailable: false,
  reviewUnavailable: false,
  analyticsUnavailable: false,
  rewardsUnavailable: false,
  securityScanUnavailable: false,
  publicationFailure: false,
});
