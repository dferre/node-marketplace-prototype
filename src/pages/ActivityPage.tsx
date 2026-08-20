import { Badge } from "@relume_io/relume-ui";
import { Button } from "../components/ui/Button";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { StatePanel } from "../components/shared/StatePanel";
import { usePrototypeStore } from "../store/prototypeStore";
import { buildActivityFeed } from "../utils/activityFeed";

export function ActivityPage() {
  const { apps, nodes, deployments, installation, activeAppId } =
    usePrototypeStore(
      useShallow((state) => ({
        apps: state.apps,
        nodes: state.nodes,
        deployments: state.deployments,
        installation: state.installation,
        activeAppId: state.activeAppId,
      })),
    );

  const items = useMemo(
    () =>
      buildActivityFeed({
        apps,
        nodes,
        deployments,
        installation,
        activeAppId,
      }),
    [apps, nodes, deployments, installation, activeAppId],
  );

  const isEmptyFeed =
    items.length === 1 && items[0]?.id === "empty-activity";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
          Activity
        </h1>
        <p className="max-w-3xl text-base text-text-secondary">
          Review installation progress, installed-app health, and management
          states derived from the current prototype scenario.
        </p>
      </div>

      {isEmptyFeed ? (
        <StatePanel
          tone="empty"
          title="No recent activity"
          description="Install or manage an app to see installation, update, and health events here."
          actionLabel="Browse marketplace"
          actionTo="/marketplace"
        />
      ) : (
        <section className="flex flex-col gap-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="flex flex-wrap items-start justify-between gap-3 border border-border-primary bg-background-primary p-4"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-text-primary">
                    {item.title}
                  </h2>
                  <Badge
                    variant={item.tone === "warning" ? "secondary" : "outline"}
                  >
                    {item.tone === "success"
                      ? "Healthy / complete"
                      : item.tone === "warning"
                        ? "Needs attention"
                        : "In progress"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-text-secondary">{item.detail}</p>
              </div>
              {item.href ? (
                <Button asChild variant="secondary" size="sm">
                  <Link to={item.href}>Open</Link>
                </Button>
              ) : null}
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
