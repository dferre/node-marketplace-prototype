import { Link } from "react-router-dom";
import { getAppSocialProof } from "../../data/appSocialProof";
import { categoryIcons, marketplaceIcons } from "../../icons/iconMap";
import type {
  CompatibilityResult,
  MarketplaceApp,
  PrototypeOverrides,
} from "../../types/prototype";
import { getEffectiveAppStatus } from "../../utils/marketplaceBrowse";
import { Button } from "../ui/Button";

type MarketplaceAppCardProps = {
  app: MarketplaceApp;
  compatibilityResults: CompatibilityResult[];
  overrides: PrototypeOverrides;
};

export function MarketplaceAppCard({
  app,
  overrides,
}: MarketplaceAppCardProps) {
  const Icon = categoryIcons[app.category];
  const StarIcon = marketplaceIcons.star;
  const status = getEffectiveAppStatus(app, overrides);
  const proof = getAppSocialProof(app.id, app.name);
  const token = app.rewards.available ? app.rewards.token : undefined;
  const filledStars = Math.round(proof.averageRating);

  return (
    <article className="flex flex-col overflow-hidden rounded-12 border border-border-base bg-background-secondary-base">
      <div className="flex aspect-video w-full items-center justify-center bg-background-tertiary-base text-text-secondary">
        <Icon pack="basic" size="lg" />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-text-lg-semibold text-text-primary">
            {app.name}
          </h3>
          {token ? (
            <span className="shrink-0 rounded-full border border-border-elevated bg-background-tertiary-base px-2 py-1 text-text-xs-semibold text-text-secondary">
              {token}
            </span>
          ) : null}
        </div>
        <p className="line-clamp-2 text-text-xs-regular text-text-secondary">
          {app.shortDescription}
        </p>
        <div
          className="flex items-center gap-1 text-text-xs-semibold text-text-primary"
          aria-label={`${proof.averageRating.toFixed(1)} of 5 stars, ${proof.reviewCount} reviews`}
        >
          <span className="flex items-center" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <StarIcon
                key={index}
                pack={index < filledStars ? "filled" : "basic"}
                size="xs"
                className={
                  index < filledStars
                    ? "text-primitives-yellow"
                    : "text-text-quaternary"
                }
              />
            ))}
          </span>
          <span>{proof.averageRating.toFixed(1)}</span>
          <span className="text-text-xs-regular text-text-tertiary">
            ({proof.reviewCount})
          </span>
        </div>
        {status !== "published" ? (
          <p className="text-text-xs-medium text-text-tertiary">{status}</p>
        ) : null}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="text-text-xs-regular text-text-tertiary">
            v{app.version}
          </span>
          <Button asChild variant="secondary" size="sm">
            <Link to={`/marketplace/apps/${app.id}`}>View App</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
