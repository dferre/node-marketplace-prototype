import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import chevronRightIcon from "../../assets/wallet/chevron-right.svg";
import { categoryIcons } from "../../icons/iconMap";
import type { MarketplaceApp } from "../../types/prototype";
import { appIconBackgroundClass } from "../../utils/appIcon";

function ChevronGlyph() {
  return (
    <span
      className="app-wallet-glyph size-3 shrink-0 text-text-tertiary"
      style={
        {
          "--app-wallet-glyph": `url("${chevronRightIcon}")`,
        } as CSSProperties
      }
      aria-hidden="true"
    />
  );
}

function DiscoverAppRow({ app }: { app: MarketplaceApp }) {
  const Icon = categoryIcons[app.category];

  return (
    <Link
      to={`/marketplace/apps/${app.id}`}
      className="flex min-w-0 items-center gap-3 py-2 no-underline hover:no-underline"
    >
      <span
        className={`flex size-10 shrink-0 items-center justify-center rounded-08 text-text-white ${appIconBackgroundClass(app.id)}`}
      >
        <Icon pack="basic" size="sm" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-text-md-semibold text-text-primary">
          {app.name}
        </span>
        <span className="block truncate text-text-sm-regular text-text-secondary">
          {app.shortDescription}
        </span>
      </span>
      <ChevronGlyph />
    </Link>
  );
}

export function DiscoverAppList({ apps }: { apps: MarketplaceApp[] }) {
  return (
    <ul className="grid min-w-0 list-none gap-x-8 gap-y-2 p-0 md:grid-cols-2">
      {apps.map((app) => (
        <li key={app.id} className="min-w-0">
          <DiscoverAppRow app={app} />
        </li>
      ))}
    </ul>
  );
}
