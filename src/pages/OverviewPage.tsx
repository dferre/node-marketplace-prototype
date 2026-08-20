import { Button } from "../components/ui/Button";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { StatePanel } from "../components/shared/StatePanel";
import { SystemStatusBanners } from "../components/shared/SystemStatusBanners";
import { usePrototypeStore } from "../store/prototypeStore";
import { getInstalledAppViews } from "../utils/installedApps";

export function OverviewPage() {
  const { nodes, apps, deployments, overrides, user } = usePrototypeStore(
    useShallow((state) => ({
      nodes: state.nodes,
      apps: state.apps,
      deployments: state.deployments,
      overrides: state.overrides,
      user: state.users.find((item) => item.id === state.activeUserId),
    })),
  );

  const installedViews = useMemo(
    () => getInstalledAppViews({ apps, nodes, deployments, overrides }),
    [apps, nodes, deployments, overrides],
  );

  const onlineCount = nodes.filter((node) => node.online).length;
  const offlineCount = nodes.length - onlineCount;
  const attentionCount = nodes.filter(
    (node) =>
      !node.online ||
      node.health !== "healthy" ||
      node.dataStale ||
      overrides.staleNodeData,
  ).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
          Overview
        </h1>
        <p className="max-w-3xl text-base text-text-secondary">
          {user
            ? `Welcome, ${user.name}. Summary of your fleet, installed apps, and marketplace entry points.`
            : "Summary of your fleet, installed apps, and marketplace entry points."}
        </p>
      </div>

      <SystemStatusBanners overrides={overrides} context="management" />

      <section className="grid gap-3 md:grid-cols-3">
        <div className="border border-border-primary bg-background-primary p-4">
          <p className="text-sm text-text-secondary">Nodes</p>
          <p className="mt-1 text-2xl font-bold text-text-primary">
            {nodes.length}
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            {onlineCount} online · {offlineCount} offline
          </p>
          <Button asChild variant="secondary" size="sm" className="mt-3">
            <Link to="/nodes">View nodes</Link>
          </Button>
        </div>
        <div className="border border-border-primary bg-background-primary p-4">
          <p className="text-sm text-text-secondary">Installed apps</p>
          <p className="mt-1 text-2xl font-bold text-text-primary">
            {installedViews.length}
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            Across your current fleet
          </p>
          <Button asChild variant="secondary" size="sm" className="mt-3">
            <Link to="/installed">Manage apps</Link>
          </Button>
        </div>
        <div className="border border-border-primary bg-background-primary p-4">
          <p className="text-sm text-text-secondary">Needs attention</p>
          <p className="mt-1 text-2xl font-bold text-text-primary">
            {attentionCount}
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            Offline, degraded, or stale nodes
          </p>
          <Button asChild variant="secondary" size="sm" className="mt-3">
            <Link to="/nodes">Review fleet</Link>
          </Button>
        </div>
      </section>

      {nodes.length === 0 ? (
        <StatePanel
          tone="empty"
          title="No nodes yet"
          description="Register or import a node through onboarding before installing marketplace apps."
          actionLabel="Start node onboarding"
          actionTo="/onboarding/new-node"
        />
      ) : null}

      <section className="border border-border-primary bg-background-secondary p-4">
        <h2 className="text-lg font-semibold text-text-primary">
          Get started
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          New operators can run account or node onboarding. Experienced users can
          skip straight to the marketplace.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button asChild variant="primary" size="sm">
            <Link to="/onboarding">Open onboarding</Link>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link to="/marketplace">Open marketplace</Link>
          </Button>
          <Button asChild variant="secondary" size="sm">
            <Link to="/marketplace/search">Browse all apps</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}