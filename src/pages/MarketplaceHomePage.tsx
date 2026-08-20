import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  DEFAULT_DISCOVER_FILTERS,
  DiscoverTabs,
  type DiscoverFiltersState,
} from "../components/marketplace/DiscoverControls";
import { DiscoverAppList } from "../components/marketplace/DiscoverAppList";
import { FeaturedAppsSlider } from "../components/marketplace/FeaturedAppsSlider";
import { LoadingSkeleton } from "../components/shared/LoadingSkeleton";
import { StatePanel } from "../components/shared/StatePanel";
import { SystemStatusBanners } from "../components/shared/SystemStatusBanners";
import { getAppSocialProof } from "../data/appSocialProof";
import { usePrototypeStore } from "../store/prototypeStore";
import {
  filterAndSortApps,
  getAppCompatibilityResults,
  isBrowsableApp,
} from "../utils/marketplaceBrowse";

export function MarketplaceHomePage() {
  const [filters, setFilters] = useState<DiscoverFiltersState>(
    DEFAULT_DISCOVER_FILTERS,
  );

  const { apps, nodes, overrides } = usePrototypeStore(
    useShallow((state) => ({
      apps: state.apps,
      nodes: state.nodes,
      overrides: state.overrides,
    })),
  );

  const rewardTokens = useMemo(() => {
    const tokens = new Set<string>();
    for (const app of apps) {
      if (app.rewards.available && app.rewards.token) {
        tokens.add(app.rewards.token);
      }
    }
    return [...tokens].sort();
  }, [apps]);

  const featuredApps = useMemo(
    () =>
      apps.filter((app) => app.featured && isBrowsableApp(app, overrides)),
    [apps, overrides],
  );

  const visibleApps = useMemo(() => {
    let list = filterAndSortApps({
      apps,
      nodes,
      overrides,
      browse: {
        q: "",
        category: filters.category,
        intensity: "all",
        rewards: "all",
        verifiedOnly: false,
        sort: "featured",
      },
    });

    if (filters.rewardTokens.length > 0) {
      list = list.filter(
        (app) =>
          app.rewards.available &&
          app.rewards.token &&
          filters.rewardTokens.includes(app.rewards.token),
      );
    }

    if (filters.minRating !== 0) {
      list = list.filter(
        (app) =>
          getAppSocialProof(app.id, app.name).averageRating >= filters.minRating,
      );
    }

    return list;
  }, [apps, filters, nodes, overrides]);

  const catalogApps = useMemo(
    () => visibleApps.filter((app) => !app.featured),
    [visibleApps],
  );

  if (overrides.catalogLoading) {
    return <LoadingSkeleton title="Discover" rows={6} />;
  }

  if (overrides.marketplaceUnavailable) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-display-md-bold text-text-primary">Discover</h1>
        <StatePanel
          tone="error"
          title="Marketplace unavailable"
          description="The marketplace cannot be loaded right now. Use the Prototype debugger to clear the marketplace unavailable override."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-display-md-bold text-text-primary">Discover</h1>
        <p className="max-w-3xl text-text-md-regular text-text-tertiary">
          Discover apps that use your nodes for storage, compute, networking,
          security, and more.
        </p>
      </div>

      <SystemStatusBanners overrides={overrides} context="marketplace" />

      <div className="flex flex-col gap-4">
        <DiscoverTabs
          value={filters}
          rewardTokens={rewardTokens}
          onChange={setFilters}
        />

        <FeaturedAppsSlider
          apps={featuredApps}
          overrides={overrides}
          getCompatibility={(app) =>
            getAppCompatibilityResults(app, nodes, overrides)
          }
        />

        {catalogApps.length === 0 ? (
          <StatePanel
            tone="empty"
            title="No apps match"
            description="Try a different category or rating. Filters stay local to Discover."
            actionLabel="Clear filters"
            onAction={() => setFilters(DEFAULT_DISCOVER_FILTERS)}
          />
        ) : (
          <DiscoverAppList apps={catalogApps} />
        )}
      </div>
    </div>
  );
}
