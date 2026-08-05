import { Badge, Button } from "@relume_io/relume-ui";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { usePrototypeStore } from "../../store/prototypeStore";
import { StatePanel } from "../../components/shared/StatePanel";

const filters = [
  "all",
  "draft",
  "in-review",
  "changes-requested",
  "rejected",
  "approved",
  "published",
  "suspended",
  "deprecated",
] as const;

export function DeveloperAppsPage() {
  const apps = usePrototypeStore((state) => state.developerPortal.apps);
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");

  const visible = useMemo(() => {
    return apps.filter((app) => {
      if (filter === "all") return true;
      if (filter === "in-review") {
        return [
          "submitted",
          "automated-review",
          "manual-review",
          "resubmitted",
        ].includes(app.marketplaceStatus);
      }
      if (filter === "draft") {
        return ["draft", "ready"].includes(app.marketplaceStatus);
      }
      return app.marketplaceStatus === filter;
    });
  }, [apps, filter]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
            My Apps
          </h1>
          <p className="mt-2 text-base text-text-secondary">
            Draft, review, and published marketplace apps for this organization.
          </p>
        </div>
        <Button asChild size="sm" variant="primary">
          <Link to="/developer/apps/new">Create app</Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter apps">
        {filters.map((value) => (
          <Button
            key={value}
            type="button"
            size="sm"
            variant={filter === value ? "primary" : "secondary"}
            onClick={() => setFilter(value)}
          >
            {value}
          </Button>
        ))}
      </div>

      {visible.length === 0 ? (
        <StatePanel
          tone="empty"
          title="No apps in this filter"
          description="Create a new app or load another developer scenario from the debugger."
          actionLabel="Create app"
          actionTo="/developer/apps/new"
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {visible.map((app) => (
            <li
              key={app.id}
              className="flex flex-wrap items-start justify-between gap-3 border border-border-primary bg-background-primary p-4"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-text-primary">
                    {app.basics.name || "Untitled draft"}
                  </h2>
                  <Badge variant="outline">{app.marketplaceStatus}</Badge>
                  <Badge variant="secondary">v{app.build.version}</Badge>
                </div>
                <p className="mt-1 text-sm text-text-secondary">
                  {app.analytics.activeInstallations} installations ·{" "}
                  {app.attentionItems[0] ?? "No action required"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm" variant="primary">
                  <Link to={`/developer/apps/${app.id}`}>Open</Link>
                </Button>
                <Button asChild size="sm" variant="secondary">
                  <Link to={`/developer/apps/${app.id}/edit`}>Edit</Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
