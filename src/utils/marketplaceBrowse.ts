import type {
  AppCategory,
  CompatibilityResult,
  MarketplaceApp,
  PrototypeOverrides,
  ResourceIntensity,
} from "../types/prototype";
import { evaluateCompatibility } from "./compatibility";
import type { Node } from "../types/prototype";

export type MarketplaceSort =
  | "featured"
  | "name"
  | "compatibility"
  | "resource"
  | "rewards";

export type MarketplaceBrowseState = {
  q: string;
  category: "all" | AppCategory;
  intensity: "all" | ResourceIntensity;
  rewards: "all" | "yes" | "no";
  verifiedOnly: boolean;
  sort: MarketplaceSort;
};

export const DEFAULT_BROWSE_STATE: MarketplaceBrowseState = {
  q: "",
  category: "all",
  intensity: "all",
  rewards: "all",
  verifiedOnly: false,
  sort: "featured",
};

export const APP_CATEGORIES: AppCategory[] = [
  "storage",
  "compute",
  "networking",
  "security",
  "data",
  "media",
  "ai",
  "utility",
  "infrastructure",
];

export function parseBrowseState(
  params: URLSearchParams,
): MarketplaceBrowseState {
  const category = params.get("category") ?? "all";
  const intensity = params.get("intensity") ?? "all";
  const rewards = params.get("rewards") ?? "all";
  const sort = params.get("sort") ?? "featured";

  return {
    q: params.get("q") ?? "",
    category: (APP_CATEGORIES.includes(category as AppCategory)
      ? category
      : "all") as MarketplaceBrowseState["category"],
    intensity: (["low", "medium", "high"].includes(intensity)
      ? intensity
      : "all") as MarketplaceBrowseState["intensity"],
    rewards: (["yes", "no"].includes(rewards)
      ? rewards
      : "all") as MarketplaceBrowseState["rewards"],
    verifiedOnly: params.get("verified") === "1",
    sort: ([
      "featured",
      "name",
      "compatibility",
      "resource",
      "rewards",
    ].includes(sort)
      ? sort
      : "featured") as MarketplaceSort,
  };
}

export function browseStateToSearchParams(
  state: MarketplaceBrowseState,
): URLSearchParams {
  const params = new URLSearchParams();
  if (state.q.trim()) params.set("q", state.q.trim());
  if (state.category !== "all") params.set("category", state.category);
  if (state.intensity !== "all") params.set("intensity", state.intensity);
  if (state.rewards !== "all") params.set("rewards", state.rewards);
  if (state.verifiedOnly) params.set("verified", "1");
  if (state.sort !== "featured") params.set("sort", state.sort);
  return params;
}

export function getEffectiveAppStatus(
  app: MarketplaceApp,
  overrides: PrototypeOverrides,
): MarketplaceApp["status"] {
  if (overrides.appRemoved) return "removed";
  if (overrides.appSuspended) return "suspended";
  return app.status;
}

export function isBrowsableApp(
  app: MarketplaceApp,
  overrides: PrototypeOverrides,
): boolean {
  const status = getEffectiveAppStatus(app, overrides);
  return status !== "removed";
}

export function countCompatibleNodes(results: CompatibilityResult[]): {
  total: number;
  ready: number;
  warnings: number;
  offline: number;
  incompatible: number;
  unableToCheck: number;
  alreadyInstalled: number;
  installable: number;
} {
  const summary = {
    total: results.length,
    ready: 0,
    warnings: 0,
    offline: 0,
    incompatible: 0,
    unableToCheck: 0,
    alreadyInstalled: 0,
    installable: 0,
  };

  for (const result of results) {
    switch (result.status) {
      case "compatible":
        summary.ready += 1;
        summary.installable += 1;
        break;
      case "compatible-with-warnings":
        summary.warnings += 1;
        summary.installable += 1;
        break;
      case "offline-queued":
        summary.offline += 1;
        summary.installable += 1;
        break;
      case "incompatible":
        summary.incompatible += 1;
        break;
      case "unable-to-check":
        summary.unableToCheck += 1;
        break;
      case "already-installed":
        summary.alreadyInstalled += 1;
        break;
    }
  }

  return summary;
}

export function getAppCompatibilityResults(
  app: MarketplaceApp,
  nodes: Node[],
  overrides: PrototypeOverrides,
): CompatibilityResult[] {
  return nodes.map((node) => evaluateCompatibility(app, node, overrides));
}

const intensityRank: Record<ResourceIntensity, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

export function filterAndSortApps(args: {
  apps: MarketplaceApp[];
  nodes: Node[];
  overrides: PrototypeOverrides;
  browse: MarketplaceBrowseState;
}): MarketplaceApp[] {
  const { apps, nodes, overrides, browse } = args;
  const query = browse.q.trim().toLowerCase();

  const filtered = apps.filter((app) => {
    if (!isBrowsableApp(app, overrides)) return false;

    const status = getEffectiveAppStatus(app, overrides);
    if (status === "deprecated" && browse.q === "" && browse.category === "all") {
      // Still browsable, but not featured-only hidden — keep in results
    }

    if (browse.category !== "all" && app.category !== browse.category) {
      return false;
    }
    if (browse.intensity !== "all" && app.resourceIntensity !== browse.intensity) {
      return false;
    }
    if (browse.rewards === "yes" && !app.rewards.available) return false;
    if (browse.rewards === "no" && app.rewards.available) return false;
    if (browse.verifiedOnly && app.developerStatus !== "verified") return false;

    if (!query) return true;

    const haystack = [
      app.name,
      app.shortDescription,
      app.developerName,
      app.category,
      ...app.tags,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (browse.sort) {
      case "name":
        return a.name.localeCompare(b.name);
      case "resource":
        return (
          intensityRank[a.resourceIntensity] - intensityRank[b.resourceIntensity]
        );
      case "rewards": {
        const aReward = a.rewards.available ? 1 : 0;
        const bReward = b.rewards.available ? 1 : 0;
        if (aReward !== bReward) return bReward - aReward;
        return a.name.localeCompare(b.name);
      }
      case "compatibility": {
        const aCount = countCompatibleNodes(
          getAppCompatibilityResults(a, nodes, overrides),
        ).installable;
        const bCount = countCompatibleNodes(
          getAppCompatibilityResults(b, nodes, overrides),
        ).installable;
        if (aCount !== bCount) return bCount - aCount;
        return a.name.localeCompare(b.name);
      }
      case "featured":
      default: {
        const aFeatured = a.featured ? 1 : 0;
        const bFeatured = b.featured ? 1 : 0;
        if (aFeatured !== bFeatured) return bFeatured - aFeatured;
        return a.name.localeCompare(b.name);
      }
    }
  });

  return sorted;
}
