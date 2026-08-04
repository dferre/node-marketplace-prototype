import { Button } from "@relume_io/relume-ui";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { InstalledAppCard } from "../components/management/InstalledAppCard";
import { LoadingSkeleton } from "../components/shared/LoadingSkeleton";
import { StatePanel } from "../components/shared/StatePanel";
import { SystemStatusBanners } from "../components/shared/SystemStatusBanners";
import { usePrototypeStore } from "../store/prototypeStore";
import { getInstalledAppViews } from "../utils/installedApps";
import { canManageApps } from "../utils/prototypePermissions";

export function InstalledAppsPage() {
  const { apps, nodes, deployments, overrides, user } = usePrototypeStore(
    useShallow((state) => ({
      apps: state.apps,
      nodes: state.nodes,
      deployments: state.deployments,
      overrides: state.overrides,
      user: state.users.find((item) => item.id === state.activeUserId),
    })),
  );

  const views = useMemo(
    () => getInstalledAppViews({ apps, nodes, deployments, overrides }),
    [apps, nodes, deployments, overrides],
  );

  if (overrides.catalogLoading) {
    return <LoadingSkeleton title="Installed Apps" rows={4} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
          Installed Apps
        </h1>
        <p className="max-w-3xl text-base text-text-secondary">
          Manage apps installed across your nodes, including health, updates, and
          uninstall.
        </p>
      </div>

      <SystemStatusBanners overrides={overrides} context="management" />

      {!canManageApps(user, overrides) ? (
        <StatePanel
          tone="warning"
          title="View-only access"
          description="You can review installed apps, but stop, restart, update, and uninstall actions are disabled for your account."
        />
      ) : null}

      {views.length === 0 ? (
        <StatePanel
          tone="empty"
          title="No apps installed yet"
          description="Browse the marketplace to discover apps and install them on compatible nodes."
          actionLabel="Browse marketplace"
          actionTo="/marketplace"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {views.map((view) => (
            <InstalledAppCard key={view.deployment.id} view={view} />
          ))}
        </div>
      )}

      {views.length > 0 ? (
        <Button asChild variant="secondary" size="sm">
          <Link to="/marketplace">Find more apps</Link>
        </Button>
      ) : null}
    </div>
  );
}
