import { Button } from "../components/ui/Button";
import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { MarketplaceAppCard } from "../components/marketplace/MarketplaceAppCard";
import { MarketplaceToolbar } from "../components/marketplace/MarketplaceToolbar";
import { LoadingSkeleton } from "../components/shared/LoadingSkeleton";
import { StatePanel } from "../components/shared/StatePanel";
import { SystemStatusBanners } from "../components/shared/SystemStatusBanners";
import { usePrototypeStore } from "../store/prototypeStore";
import {
  browseStateToSearchParams,
  filterAndSortApps,
  getAppCompatibilityResults,
  parseBrowseState,
} from "../utils/marketplaceBrowse";

export function MarketplaceSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const browse = useMemo(
    () => parseBrowseState(searchParams),
    [searchParams],
  );

  const { apps, nodes, overrides } = usePrototypeStore(
    useShallow((state) => ({
      apps: state.apps,
      nodes: state.nodes,
      overrides: state.overrides,
    })),
  );

  const results = useMemo(
    () =>
      filterAndSortApps({
        apps,
        nodes,
        overrides,
        browse,
      }),
    [apps, nodes, overrides, browse],
  );

  if (overrides.catalogLoading) {
    return <LoadingSkeleton title="Search and browse" rows={6} />;
  }

  if (overrides.marketplaceUnavailable) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
          Search Marketplace
        </h1>
        <StatePanel
          tone="error"
          title="Marketplace unavailable"
          description="Browsing and search are disabled while the marketplace unavailable override is active."
          actionLabel="Back to marketplace"
          actionTo="/marketplace"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
          Search and browse
        </h1>
        <p className="max-w-3xl text-base text-text-secondary">
          Filter by category, resource use, rewards, and developer verification.
          Compatibility is calculated from your current node fleet.
        </p>
      </div>

      <SystemStatusBanners overrides={overrides} context="marketplace" />

      <MarketplaceToolbar
        value={browse}
        resultCount={results.length}
        onChange={(next) => {
          setSearchParams(browseStateToSearchParams(next), { replace: true });
        }}
      />

      {results.length === 0 ? (
        <StatePanel
          tone="empty"
          title="No apps match"
          description="Try clearing filters or searching a different term."
          actionLabel="Clear filters"
          onAction={() =>
            setSearchParams(new URLSearchParams(), { replace: true })
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {results.map((app) => (
            <MarketplaceAppCard
              key={app.id}
              app={app}
              overrides={overrides}
              compatibilityResults={getAppCompatibilityResults(
                app,
                nodes,
                overrides,
              )}
            />
          ))}
        </div>
      )}

      {overrides.networkOffline ? (
        <Button asChild variant="link" size="link">
          <Link to="/installed">Go to installed apps</Link>
        </Button>
      ) : null}
    </div>
  );
}
