import { Badge } from "@relume_io/relume-ui";
import { Button } from "../ui/Button";
import { Link } from "react-router-dom";
import { categoryIcons, marketplaceIcons } from "../../icons/iconMap";
import type { InstalledAppView } from "../../utils/installedApps";

type InstalledAppCardProps = {
  view: InstalledAppView;
};

function healthBadge(health: InstalledAppView["deployment"]["aggregateHealth"]) {
  switch (health) {
    case "healthy":
      return <Badge variant="outline">Healthy</Badge>;
    case "degraded":
      return <Badge variant="secondary">Degraded</Badge>;
    case "unhealthy":
      return <Badge variant="secondary">Needs attention</Badge>;
    case "mixed":
      return <Badge variant="secondary">Mixed health</Badge>;
  }
}

export function InstalledAppCard({ view }: InstalledAppCardProps) {
  const { app, deployment, nodes } = view;
  const Icon = categoryIcons[app.category];
  const WarningIcon = marketplaceIcons.warning;

  return (
    <article className="flex flex-col border border-border-primary bg-background-primary p-4">
      <div className="flex items-start gap-3">
        <div
          className="flex size-12 shrink-0 items-center justify-center border border-border-primary bg-background-secondary"
          aria-hidden="true"
        >
          <Icon pack="basic" size="sm" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-text-primary">{app.name}</h2>
            {healthBadge(deployment.aggregateHealth)}
            {view.updateAvailable ? (
              <Badge variant="secondary">Update available</Badge>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-text-secondary">
            v{deployment.version} · Installed on {nodes.length} node
            {nodes.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm text-text-primary">
        {view.runningCount} running · {view.stoppedCount} stopped ·{" "}
        {view.unhealthyCount + view.setupRequiredCount} need attention
      </p>

      {view.setupRequiredCount > 0 || view.unhealthyCount > 0 ? (
        <p className="mt-2 flex items-start gap-2 text-sm text-text-secondary">
          <WarningIcon pack="basic" size="xs" aria-hidden="true" />
          <span>
            {view.setupRequiredCount > 0
              ? `${view.setupRequiredCount} node${
                  view.setupRequiredCount === 1 ? "" : "s"
                } need setup. `
              : null}
            {view.unhealthyCount > 0
              ? `${view.unhealthyCount} node${
                  view.unhealthyCount === 1 ? "" : "s"
                } unhealthy.`
              : null}
          </span>
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild variant="primary" size="sm">
          <Link to={`/installed/${app.id}`}>Manage</Link>
        </Button>
        <Button asChild variant="secondary" size="sm">
          <Link to={`/marketplace/apps/${app.id}`}>App details</Link>
        </Button>
      </div>
    </article>
  );
}
