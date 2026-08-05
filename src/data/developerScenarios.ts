import type { DeveloperPortalState, DeveloperScenario } from "../types/developer";
import { defaultDeveloperOverrides } from "../types/developer";
import {
  createAtlasDeveloperApp,
  createEmptyDraftApp,
} from "./developerApps";
import { developerAccounts, developerOrganizations } from "./developers";

export const developerScenarios: DeveloperScenario[] = [
  {
    id: "dev-unverified",
    name: "New unverified developer",
    description: "Individual developer who can draft but cannot submit.",
    developerId: "dev_solo_unverified",
    organizationId: "org_solo",
    appId: null,
    startingRoute: "/developer/verification",
  },
  {
    id: "dev-verification-changes",
    name: "Verification changes requested",
    description: "Organization verification needs more information.",
    developerId: "dev_relay_owner",
    organizationId: "org_pending",
    appId: null,
    startingRoute: "/developer/verification",
  },
  {
    id: "dev-verified-empty",
    name: "Verified developer, no apps",
    description: "Verified owner with an empty app list.",
    developerId: "dev_atlas_owner",
    organizationId: "org_atlas",
    appId: null,
    startingRoute: "/developer/apps",
  },
  {
    id: "dev-changes-requested",
    name: "Atlas Storage — changes requested",
    description:
      "Primary vertical slice: listing, privacy, build, rewards, and media findings.",
    developerId: "dev_atlas_owner",
    organizationId: "org_atlas",
    appId: "dapp_atlas_storage_dev",
    startingRoute: "/developer/apps/dapp_atlas_storage_dev/review",
  },
  {
    id: "dev-ready-submit",
    name: "Draft ready to submit",
    description: "Complete draft waiting for submission.",
    developerId: "dev_atlas_owner",
    organizationId: "org_atlas",
    appId: "dapp_atlas_storage_dev",
    startingRoute: "/developer/apps/dapp_atlas_storage_dev/submit",
  },
  {
    id: "dev-approved",
    name: "App approved, ready to publish",
    description: "Approved after resubmission.",
    developerId: "dev_atlas_owner",
    organizationId: "org_atlas",
    appId: "dapp_atlas_storage_dev",
    startingRoute: "/developer/apps/dapp_atlas_storage_dev",
  },
  {
    id: "dev-published",
    name: "Published Atlas Storage",
    description: "Live marketplace app with installations.",
    developerId: "dev_atlas_owner",
    organizationId: "org_atlas",
    appId: "dapp_atlas_storage_dev",
    startingRoute: "/developer/apps/dapp_atlas_storage_dev",
  },
  {
    id: "dev-suspended",
    name: "Suspended developer",
    description: "Publishing access restricted.",
    developerId: "dev_suspended",
    organizationId: "org_solo",
    appId: null,
    startingRoute: "/developer",
  },
  {
    id: "dev-resubmitted",
    name: "Revised app ready / resubmitted",
    description: "Findings addressed; waiting on second-round review.",
    developerId: "dev_atlas_owner",
    organizationId: "org_atlas",
    appId: "dapp_atlas_storage_dev",
    startingRoute: "/developer/apps/dapp_atlas_storage_dev/submission",
  },
  {
    id: "dev-upload-blocked",
    name: "Upload unavailable override",
    description: "Media and build uploads fail via system override.",
    developerId: "dev_atlas_owner",
    organizationId: "org_atlas",
    appId: "dapp_atlas_storage_dev",
    startingRoute: "/developer/apps/dapp_atlas_storage_dev/media",
    overrides: { uploadUnavailable: true },
  },
];

export function getDeveloperScenarioById(
  id: string,
): DeveloperScenario | undefined {
  return developerScenarios.find((scenario) => scenario.id === id);
}

export function buildDeveloperPortalFromScenario(
  scenarioId: string,
): DeveloperPortalState {
  const scenario =
    getDeveloperScenarioById(scenarioId) ??
    getDeveloperScenarioById("dev-changes-requested")!;

  let apps = [
    createAtlasDeveloperApp("changes-requested"),
    createEmptyDraftApp("org_atlas", "dapp_empty_draft"),
  ];

  if (scenario.id === "dev-ready-submit") {
    apps = [createAtlasDeveloperApp("draft-ready")];
  } else if (scenario.id === "dev-resubmitted") {
    apps = [createAtlasDeveloperApp("resubmitted")];
  } else if (scenario.id === "dev-approved") {
    apps = [createAtlasDeveloperApp("approved")];
  } else if (scenario.id === "dev-published") {
    apps = [createAtlasDeveloperApp("published")];
  } else if (
    scenario.id === "dev-verified-empty" ||
    scenario.id === "dev-unverified" ||
    scenario.id === "dev-verification-changes" ||
    scenario.id === "dev-suspended"
  ) {
    apps = [];
  }

  return {
    activeDeveloperId: scenario.developerId,
    activeOrganizationId: scenario.organizationId,
    activeDeveloperAppId: scenario.appId,
    developers: structuredClone(developerAccounts),
    organizations: structuredClone(developerOrganizations),
    apps,
    overrides: {
      ...defaultDeveloperOverrides(),
      ...scenario.overrides,
    },
  };
}
