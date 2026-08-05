import type {
  AppSubmissionStatus,
  ChecklistItemStatus,
  DeveloperApp,
  EditorStepId,
} from "../types/developer";

const allComplete = (): Record<EditorStepId, ChecklistItemStatus> => ({
  basics: "complete",
  listing: "complete",
  media: "complete",
  build: "complete",
  compatibility: "complete",
  permissions: "complete",
  rewards: "complete",
  support: "complete",
  testing: "complete",
  preview: "complete",
  submit: "complete",
});

export function createEmptyDraftApp(
  organizationId: string,
  id: string,
): DeveloperApp {
  return {
    id,
    organizationId,
    basics: {
      name: "",
      slug: "",
      internalId: id,
      category: "utility",
      secondaryCategories: [],
      tags: [],
      shortDescription: "",
      fullDescription: "",
      primaryBenefit: "",
      targetOperator: "Single-node and fleet operators",
      setupComplexity: "medium",
      language: "en",
      supportStatus: "Community",
      openSource: false,
      repositoryUrl: "",
      resourceIntensity: "medium",
    },
    listing: {
      publicName: "",
      developerDisplayName: "Atlas Network",
      tagline: "",
      shortDescription: "",
      fullDescription: "",
      whatItDoes: "",
      whyInstall: "",
      howItWorks: "",
      keyBenefits: [],
      setupExpectations: "",
      resourceUseExplanation: "",
      rewardSummary: "",
      faqs: [],
      documentationUrl: "",
      supportUrl: "",
      privacyPolicyUrl: "",
      termsUrl: "",
    },
    media: [],
    build: {
      id: `${id}_build`,
      version: "0.0.0",
      status: "none",
      runtimeType: "oci",
      architectures: ["x86_64"],
      packageSizeMb: 0,
      checksumPlaceholder: "",
      signaturePresent: false,
      entryPoint: "",
      findings: [],
    },
    requirements: {
      allowedNodeTypes: ["pro", "cloud", "enterprise"],
      architectures: ["x86_64"],
      minCpuCores: 2,
      minMemoryGb: 4,
      minStorageGb: 100,
      requiredStorageType: "ssd",
      minBandwidthMbps: 50,
      minSoftwareVersion: "2.4",
      requiresGpu: false,
      requiresPublicIp: false,
    },
    permissions: [],
    permissionNotes: {},
    privacySummary: "",
    rewards: {
      available: false,
      guaranteed: false,
    },
    support: {
      supportEmail: "",
      supportWebsite: "",
      documentationUrl: "",
      statusPageUrl: "",
      privacyPolicyUrl: "",
      termsUrl: "",
      securityContact: "",
      vulnerabilityProcess: "",
    },
    tests: [],
    submission: null,
    releases: [],
    marketplaceStatus: "draft",
    completionByStep: {
      basics: "blocking",
      listing: "blocking",
      media: "blocking",
      build: "blocking",
      compatibility: "warning",
      permissions: "blocking",
      rewards: "warning",
      support: "blocking",
      testing: "blocking",
      preview: "warning",
      submit: "blocking",
    },
    lastSavedAt: "2026-08-04T18:00:00.000Z",
    attentionItems: ["Complete app basics to continue drafting"],
    analytics: {
      detailViews: 0,
      installActions: 0,
      activeInstallations: 0,
      healthyInstallations: 0,
      failedInstallations: 0,
      rewardsDistributedLabel: "—",
    },
  };
}

export function createAtlasDeveloperApp(
  phase:
    | "draft-ready"
    | "changes-requested"
    | "resubmitted"
    | "approved"
    | "published",
): DeveloperApp {
  const base = createEmptyDraftApp("org_atlas", "dapp_atlas_storage_dev");
  const completion = allComplete();

  if (phase === "draft-ready") {
    completion.submit = "complete";
  }
  if (phase === "changes-requested") {
    completion.listing = "blocking";
    completion.media = "blocking";
    completion.build = "blocking";
    completion.permissions = "blocking";
    completion.rewards = "blocking";
    completion.submit = "blocking";
  }

  const statusMap: Record<typeof phase, AppSubmissionStatus> = {
    "draft-ready": "ready",
    "changes-requested": "changes-requested",
    resubmitted: "resubmitted",
    approved: "approved",
    published: "published",
  };

  return {
    ...base,
    marketplaceAppId:
      phase === "published" ? "app_atlas_storage" : undefined,
    basics: {
      ...base.basics,
      name: "Atlas Storage Developer Edition",
      slug: "atlas-storage-dev",
      category: "storage",
      tags: ["Passive rewards", "storage", "continuous operation"],
      shortDescription:
        "Contribute unused storage capacity to a decentralized storage network and earn rewards.",
      fullDescription:
        "Atlas Storage allows node operators to allocate unused storage space to a decentralized network. The app stores encrypted data fragments and helps make files available across the network.",
      primaryBenefit: "Earn rewards by providing secure storage capacity.",
      resourceIntensity: "high",
      openSource: true,
      repositoryUrl: "https://example.com/atlas-storage",
    },
    listing: {
      publicName: "Atlas Storage",
      developerDisplayName: "Atlas Network",
      tagline: "Turn spare SSD into network storage capacity",
      shortDescription:
        "Contribute unused storage capacity to a decentralized storage network and earn rewards.",
      fullDescription:
        "Atlas Storage allows node operators to allocate unused storage space to a decentralized network. Users choose how much storage they want to contribute.",
      whatItDoes:
        "Stores encrypted data fragments and serves retrieval requests from the Atlas network.",
      whyInstall:
        "Earn capacity-based rewards while keeping storage allocation under your control.",
      howItWorks:
        "Allocate SSD space, connect a payout wallet, and keep the node online for eligibility.",
      keyBenefits: [
        "Capacity-based reward estimates",
        "Operator-controlled allocation",
        "Encrypted fragment storage",
      ],
      setupExpectations: "Requires storage allocation and wallet setup after install.",
      resourceUseExplanation:
        "High storage use with continuous bandwidth for retrieval traffic.",
      rewardSummary:
        phase === "changes-requested"
          ? "Earn up to 100 OPT weekly guaranteed"
          : "15–30 OPT monthly per 500 GB (estimate, not guaranteed)",
      faqs: [
        {
          question: "Do I need a public IP?",
          answer: "No. Public IP is not required for Atlas Storage.",
        },
      ],
      documentationUrl: "https://example.com/docs/atlas",
      supportUrl: "https://example.com/support/atlas",
      privacyPolicyUrl:
        phase === "changes-requested" ? "" : "https://example.com/privacy/atlas",
      termsUrl: "https://example.com/terms/atlas",
    },
    media: [
      {
        id: "media_icon",
        kind: "icon",
        title: "App icon",
        caption: "Atlas Storage icon",
        altText: "Atlas Storage app icon",
        status: "ready",
        sortOrder: 0,
        isCover: true,
      },
      {
        id: "media_shot_1",
        kind: "screenshot",
        title: "Capacity allocation",
        caption: "Allocate SSD capacity",
        altText: "Capacity allocation screen",
        status: "ready",
        sortOrder: 1,
      },
      {
        id: "media_shot_2",
        kind: "screenshot",
        title: "Rewards panel",
        caption:
          phase === "changes-requested"
            ? "Guaranteed weekly payouts"
            : "Estimate vs eligibility",
        altText: "Rewards panel screenshot",
        status: phase === "changes-requested" ? "rejected" : "ready",
        sortOrder: 2,
        failureReason:
          phase === "changes-requested"
            ? "Screenshot implies guaranteed payouts"
            : undefined,
      },
      {
        id: "media_shot_3",
        kind: "screenshot",
        title: "Network contribution",
        caption: "Fragment storage overview",
        altText: "Network contribution diagram",
        status: "ready",
        sortOrder: 3,
      },
    ],
    build: {
      id: "build_atlas_100",
      version: phase === "resubmitted" || phase === "approved" || phase === "published"
        ? "1.0.1"
        : "1.0.0",
      status:
        phase === "changes-requested"
          ? "failed"
          : phase === "draft-ready"
            ? "warning"
            : "security-passed",
      runtimeType: "oci",
      architectures: ["x86_64", "arm64"],
      packageSizeMb: 420,
      checksumPlaceholder: "sha256:atlas-dev-build",
      signaturePresent: phase !== "changes-requested",
      entryPoint: "atlas-storage/start",
      findings:
        phase === "changes-requested"
          ? [
              "Missing package signature",
              "Uninstall test left residual files",
              "Health check missing on cold start",
            ]
          : ["Non-blocking: package size above median"],
      uploadedAt: "2026-08-04T16:00:00.000Z",
    },
    requirements: {
      allowedNodeTypes: ["pro", "cloud", "enterprise"],
      architectures: ["x86_64", "arm64"],
      minCpuCores: 4,
      minMemoryGb: 8,
      minStorageGb: 500,
      requiredStorageType: "ssd",
      minBandwidthMbps: 100,
      minSoftwareVersion: "2.4",
      requiresGpu: false,
      requiresPublicIp: false,
      continuousOperationRecommended: true,
    },
    permissions: [
      { id: "storage", label: "Use allocated storage" },
      { id: "bandwidth", label: "Use network bandwidth" },
      { id: "external", label: "Connect to external services" },
      { id: "continuous", label: "Run continuously" },
      { id: "health", label: "Access node health information" },
      { id: "wallet", label: "Access public payout wallet address" },
      { id: "autostart", label: "Start after node restart" },
    ],
    permissionNotes: {
      storage: "Only the operator-selected allocation is used.",
      wallet: "Public address only — never private keys.",
    },
    privacySummary:
      phase === "changes-requested"
        ? "Collects node health and wallet address."
        : "Collects node health metrics and public payout wallet address. Encrypted fragments stay on the node until served. Retention: 90 days for health metrics. No private keys.",
    rewards: {
      available: true,
      token: "OPT",
      type: "Capacity, uptime, and demand based",
      estimateLabel:
        phase === "changes-requested"
          ? "Up to 100 OPT weekly guaranteed"
          : "15–30 OPT monthly per 500 GB",
      paymentFrequency: "Weekly",
      guaranteed: phase === "changes-requested",
      eligibilityNotes: [
        "At least 500 GB allocated",
        "95% monthly uptime",
        "Payout wallet connected",
        "Supported region",
      ],
      assumptions: [
        "Estimate assumes 500 GB allocated capacity",
        "Assumes 95%+ monthly uptime",
        "Actual rewards vary with network demand",
      ],
    },
    support: {
      supportEmail: "support@atlas.example",
      supportWebsite: "https://example.com/support/atlas",
      documentationUrl: "https://example.com/docs/atlas",
      statusPageUrl: "https://example.com/status/atlas",
      privacyPolicyUrl:
        phase === "changes-requested" ? "" : "https://example.com/privacy/atlas",
      termsUrl: "https://example.com/terms/atlas",
      securityContact: "security@atlas.example",
      vulnerabilityProcess: "Email security@atlas.example with reproduction steps.",
    },
    tests: [
      {
        id: "test_signature",
        name: "Package signature",
        status: phase === "changes-requested" ? "failed" : "passed",
        severity: "blocking",
        finding:
          phase === "changes-requested"
            ? "Signature missing from package"
            : undefined,
        recommendation: "Re-upload a signed build",
        buildVersion: "1.0.0",
        ranAt: "2026-08-04T16:30:00.000Z",
      },
      {
        id: "test_uninstall",
        name: "Uninstall cleanup",
        status: phase === "changes-requested" ? "failed" : "passed",
        severity: "blocking",
        finding:
          phase === "changes-requested"
            ? "Residual files remain after uninstall"
            : undefined,
        recommendation: "Fix cleanup hooks and rerun tests",
        buildVersion: "1.0.0",
        ranAt: "2026-08-04T16:30:00.000Z",
      },
      {
        id: "test_health",
        name: "Startup health check",
        status: phase === "changes-requested" ? "failed" : "passed",
        buildVersion: "1.0.0",
        ranAt: "2026-08-04T16:30:00.000Z",
      },
      {
        id: "test_compat",
        name: "Compatibility validation",
        status: "passed-with-warnings",
        finding: "SSD requirement excludes HDD archive nodes",
        buildVersion: "1.0.0",
        ranAt: "2026-08-04T16:30:00.000Z",
      },
    ],
    submission: {
      id: "sub_atlas_1",
      appId: "dapp_atlas_storage_dev",
      version:
        phase === "resubmitted" || phase === "approved" || phase === "published"
          ? "1.0.1"
          : "1.0.0",
      status: statusMap[phase],
      submittedAt: "2026-08-03T12:00:00.000Z",
      round: phase === "changes-requested" ? 1 : 2,
      policiesAccepted: true,
      findings:
        phase === "changes-requested" || phase === "resubmitted"
          ? [
              {
                id: "find_listing",
                category: "listing",
                title: "Clarify primary user benefit",
                description:
                  "Listing leads with infrastructure jargon. Lead with operator benefit.",
                severity: "blocking",
                status:
                  phase === "changes-requested" ? "open" : "resolved",
                reviewerComment: "Rewrite the hero benefit for operators.",
                affectedSection: "listing",
                developerResponse:
                  phase === "changes-requested"
                    ? undefined
                    : "Updated primary benefit and why-install copy.",
              },
              {
                id: "find_privacy",
                category: "privacy",
                title: "Add data-retention details",
                description: "Privacy summary omits retention period.",
                severity: "blocking",
                status:
                  phase === "changes-requested" ? "open" : "resolved",
                affectedSection: "permissions",
                developerResponse:
                  phase === "changes-requested"
                    ? undefined
                    : "Added 90-day retention and no-private-key language.",
              },
              {
                id: "find_build",
                category: "build",
                title: "Failed uninstall / signature tests",
                description: "Automated tests blocked submission.",
                severity: "blocking",
                status:
                  phase === "changes-requested" ? "open" : "resolved",
                affectedSection: "build",
                developerResponse:
                  phase === "changes-requested"
                    ? undefined
                    : "Uploaded signed 1.0.1 build with cleanup fix.",
              },
              {
                id: "find_rewards",
                category: "rewards",
                title: "Misleading guaranteed reward language",
                description:
                  "Reward summary claims guaranteed weekly OPT.",
                severity: "blocking",
                status:
                  phase === "changes-requested" ? "open" : "resolved",
                affectedSection: "rewards",
                developerResponse:
                  phase === "changes-requested"
                    ? undefined
                    : "Removed guarantee; restored estimate + assumptions.",
              },
              {
                id: "find_media",
                category: "media",
                title: "Replace rewards screenshot",
                description: "Screenshot implies guaranteed payouts.",
                severity: "blocking",
                status:
                  phase === "changes-requested" ? "open" : "resolved",
                affectedSection: "media",
                developerResponse:
                  phase === "changes-requested"
                    ? undefined
                    : "Replaced screenshot with estimate vs eligibility frame.",
              },
            ]
          : [],
      timeline: [
        {
          id: "evt_1",
          status: "submitted",
          at: "2026-08-03T12:00:00.000Z",
          actor: "Sam Rivera",
          summary: "Submitted version 1.0.0 for review",
          buildVersion: "1.0.0",
        },
        {
          id: "evt_2",
          status: "automated-review",
          at: "2026-08-03T12:10:00.000Z",
          actor: "System",
          summary: "Automated review completed with blocking findings",
          buildVersion: "1.0.0",
        },
        {
          id: "evt_3",
          status: "manual-review",
          at: "2026-08-03T15:00:00.000Z",
          actor: "Marketplace Review",
          summary: "Manual review started",
          buildVersion: "1.0.0",
        },
        {
          id: "evt_4",
          status: "changes-requested",
          at: "2026-08-04T09:00:00.000Z",
          actor: "Marketplace Review",
          summary: "Changes requested across listing, privacy, build, rewards, media",
          buildVersion: "1.0.0",
        },
        ...(phase === "resubmitted" ||
        phase === "approved" ||
        phase === "published"
          ? [
              {
                id: "evt_5",
                status: "resubmitted" as const,
                at: "2026-08-04T17:00:00.000Z",
                actor: "Sam Rivera",
                summary: "Resubmitted version 1.0.1 with responses",
                buildVersion: "1.0.1",
              },
            ]
          : []),
        ...(phase === "approved" || phase === "published"
          ? [
              {
                id: "evt_6",
                status: "approved" as const,
                at: "2026-08-04T18:30:00.000Z",
                actor: "Marketplace Review",
                summary: "Approved for publication",
                buildVersion: "1.0.1",
              },
            ]
          : []),
        ...(phase === "published"
          ? [
              {
                id: "evt_7",
                status: "published" as const,
                at: "2026-08-04T19:00:00.000Z",
                actor: "Sam Rivera",
                summary: "Published to marketplace",
                buildVersion: "1.0.1",
              },
            ]
          : []),
      ],
    },
    releases:
      phase === "published"
        ? [
            {
              id: "rel_atlas_101",
              appId: "dapp_atlas_storage_dev",
              version: "1.0.1",
              status: "published",
              notes: "Initial marketplace release after review revisions.",
              updateType: "optional",
              rolloutPercent: 100,
              createdAt: "2026-08-04T19:00:00.000Z",
            },
          ]
        : [],
    marketplaceStatus: statusMap[phase],
    completionByStep: completion,
    lastSavedAt: "2026-08-04T18:00:00.000Z",
    attentionItems:
      phase === "changes-requested"
        ? [
            "Respond to requested listing changes",
            "Add privacy retention details",
            "Upload a signed replacement build",
            "Remove guaranteed reward language",
            "Replace rejected rewards screenshot",
          ]
        : phase === "approved"
          ? ["Publish approved version 1.0.1"]
          : phase === "published"
            ? []
            : ["Submit when checklist is complete"],
    analytics: {
      detailViews: phase === "published" ? 1280 : 42,
      installActions: phase === "published" ? 310 : 0,
      activeInstallations: phase === "published" ? 186 : 0,
      healthyInstallations: phase === "published" ? 172 : 0,
      failedInstallations: phase === "published" ? 8 : 0,
      rewardsDistributedLabel:
        phase === "published" ? "4,820 OPT est." : "—",
    },
  };
}
