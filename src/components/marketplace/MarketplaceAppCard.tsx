import { Badge, Button } from "@relume_io/relume-ui";
import { Link } from "react-router-dom";
import { categoryIcons, marketplaceIcons } from "../../icons/iconMap";
import type { MarketplaceApp } from "../../types/prototype";
import {
  countCompatibleNodes,
  getEffectiveAppStatus,
} from "../../utils/marketplaceBrowse";
import type { CompatibilityResult } from "../../types/prototype";
import type { PrototypeOverrides } from "../../types/prototype";

type MarketplaceAppCardProps = {
  app: MarketplaceApp;
  compatibilityResults: CompatibilityResult[];
  overrides: PrototypeOverrides;
};

function statusBadge(status: MarketplaceApp["status"]) {
  switch (status) {
    case "deprecated":
      return <Badge variant="secondary">Deprecated</Badge>;
    case "suspended":
      return <Badge variant="secondary">Suspended</Badge>;
    case "removed":
      return <Badge variant="secondary">Removed</Badge>;
    case "published-limited":
      return <Badge variant="outline">Limited visibility</Badge>;
    default:
      return null;
  }
}

export function MarketplaceAppCard({
  app,
  compatibilityResults,
  overrides,
}: MarketplaceAppCardProps) {
  const Icon = categoryIcons[app.category];
  const VerifiedIcon = marketplaceIcons.verified;
  const status = getEffectiveAppStatus(app, overrides);
  const summary = countCompatibleNodes(compatibilityResults);
  const rewardLabel = !app.rewards.available
    ? "No financial rewards"
    : app.rewards.estimateUnavailable || overrides.rewardsUnavailable
      ? "Reward estimate unavailable"
      : (app.rewards.estimateLabel ?? "Rewards available");
  const installHidden =
    status === "suspended" ||
    status === "deprecated" ||
    status === "removed";

  return (
    <article className="flex h-full flex-col border border-border-primary bg-background-primary p-4">
      <div className="flex items-start gap-3">
        <div
          className="flex size-12 shrink-0 items-center justify-center border border-border-primary bg-background-secondary"
          aria-hidden="true"
        >
          <Icon pack="basic" size="sm" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-text-primary">{app.name}</h3>
            {statusBadge(status)}
            {app.featured ? <Badge variant="outline">Featured</Badge> : null}
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-text-secondary">
            <span>{app.developerName}</span>
            {app.developerStatus === "verified" ? (
              <span className="inline-flex items-center gap-1 text-text-primary">
                <VerifiedIcon pack="basic" size="xs" aria-hidden="true" />
                Verified
              </span>
            ) : (
              <span>Developer {app.developerStatus}</span>
            )}
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm text-text-primary">{app.shortDescription}</p>

      <dl className="mt-4 grid gap-2 text-sm text-text-primary">
        <div className="flex justify-between gap-3 border-t border-border-primary pt-2">
          <dt className="text-text-secondary">Primary benefit</dt>
          <dd className="text-right">{app.primaryBenefit}</dd>
        </div>
        <div className="flex justify-between gap-3 border-t border-border-primary pt-2">
          <dt className="text-text-secondary">Rewards</dt>
          <dd className="text-right">{rewardLabel}</dd>
        </div>
        <div className="flex justify-between gap-3 border-t border-border-primary pt-2">
          <dt className="text-text-secondary">Resources</dt>
          <dd className="text-right capitalize">{app.resourceIntensity} use</dd>
        </div>
        <div className="flex justify-between gap-3 border-t border-border-primary pt-2">
          <dt className="text-text-secondary">Compatibility</dt>
          <dd className="text-right">
            {summary.total === 0
              ? "No nodes"
              : `Compatible with ${summary.installable} of ${summary.total} nodes`}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild variant="primary" size="sm">
          <Link to={`/marketplace/apps/${app.id}`}>View app</Link>
        </Button>
        {installHidden ? null : (
          <Button asChild variant="secondary" size="sm">
            <Link to={`/marketplace/apps/${app.id}/install`}>
              Install on nodes
            </Link>
          </Button>
        )}
      </div>
    </article>
  );
}
