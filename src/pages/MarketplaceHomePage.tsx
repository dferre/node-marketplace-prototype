import { Button, Input, Label } from "@relume_io/relume-ui";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { MarketplaceAppCard } from "../components/marketplace/MarketplaceAppCard";
import { ContextualTip } from "../components/onboarding/ContextualTip";
import { LoadingSkeleton } from "../components/shared/LoadingSkeleton";
import { StatePanel } from "../components/shared/StatePanel";
import { SystemStatusBanners } from "../components/shared/SystemStatusBanners";
import { marketplaceEducationPoints } from "../data/onboardingFlows";
import { marketplaceIcons } from "../icons/iconMap";
import { usePrototypeStore } from "../store/prototypeStore";
import {
  filterAndSortApps,
  getAppCompatibilityResults,
} from "../utils/marketplaceBrowse";

export function MarketplaceHomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const SearchIcon = marketplaceIcons.search;

  const { apps, nodes, overrides } = usePrototypeStore(
    useShallow((state) => ({
      apps: state.apps,
      nodes: state.nodes,
      overrides: state.overrides,
    })),
  );

  const featuredApps = useMemo(
    () =>
      filterAndSortApps({
        apps,
        nodes,
        overrides,
        browse: {
          q: "",
          category: "all",
          intensity: "all",
          rewards: "all",
          verifiedOnly: false,
          sort: "featured",
        },
      }).filter((app) => app.featured || app.status === "published"),
    [apps, nodes, overrides],
  );

  const visibleFeatured = featuredApps.slice(0, 6);
  const recommended = featuredApps.slice(0, 3);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    navigate(`/marketplace/search?${params.toString()}`);
  };

  if (overrides.catalogLoading) {
    return <LoadingSkeleton title="Marketplace" rows={6} />;
  }

  if (overrides.marketplaceUnavailable) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
          Marketplace
        </h1>
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
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
          Marketplace
        </h1>
        <p className="max-w-3xl text-base text-text-secondary">
          Discover apps that use your nodes for storage, compute, networking,
          security, and more. Review benefits and compatibility before you
          install.
        </p>
      </div>

      <SystemStatusBanners overrides={overrides} context="marketplace" />

      <ContextualTip tipId="marketplace-basics" title="Marketplace basics">
        <ul className="grid gap-2 md:grid-cols-2">
          {marketplaceEducationPoints.map((point) => (
            <li
              key={point.id}
              className="border border-border-primary bg-background-primary px-3 py-2"
            >
              <p className="font-semibold text-text-primary">{point.title}</p>
              <p className="mt-1 text-text-secondary">{point.body}</p>
            </li>
          ))}
        </ul>
      </ContextualTip>

      <form
        onSubmit={handleSearch}
        className="flex flex-col gap-3 border border-border-primary bg-background-primary p-4 md:flex-row md:items-end"
      >
        <div className="flex-1">
          <Label htmlFor="home-marketplace-search">Search marketplace</Label>
          <Input
            id="home-marketplace-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search apps"
            icon={<SearchIcon pack="basic" size="sm" aria-hidden="true" />}
            disabled={overrides.networkOffline}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={overrides.networkOffline}
          >
            Search
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link to="/marketplace/search">Browse all apps</Link>
          </Button>
        </div>
      </form>

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              Featured and recommended
            </h2>
            <p className="text-sm text-text-secondary">
              Start with apps that clearly explain benefits, rewards, and node
              fit.
            </p>
          </div>
          <Button asChild variant="link" size="link">
            <Link to="/marketplace/search">View all</Link>
          </Button>
        </div>

        {visibleFeatured.length === 0 ? (
          <StatePanel
            tone="empty"
            title="No apps available"
            description="No apps are available in the current scenario."
            actionLabel="Browse all apps"
            actionTo="/marketplace/search"
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleFeatured.map((app) => (
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
      </section>

      {recommended.length > 0 ? (
        <section className="border border-border-primary bg-background-secondary p-4">
          <h2 className="text-lg font-semibold text-text-primary">
            Quick picks for your fleet
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            {recommended.map((app) => {
              const summary = getAppCompatibilityResults(app, nodes, overrides);
              const installable = summary.filter((result) =>
                [
                  "compatible",
                  "compatible-with-warnings",
                  "offline-queued",
                ].includes(result.status),
              ).length;
              return (
                <li
                  key={app.id}
                  className="flex flex-wrap items-center justify-between gap-2 border border-border-primary bg-background-primary px-3 py-2"
                >
                  <div>
                    <p className="font-semibold text-text-primary">{app.name}</p>
                    <p className="text-sm text-text-secondary">
                      {app.primaryBenefit} · Compatible with {installable} node
                      {installable === 1 ? "" : "s"}
                    </p>
                  </div>
                  <Button asChild variant="secondary" size="sm">
                    <Link to={`/marketplace/apps/${app.id}`}>Review</Link>
                  </Button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
