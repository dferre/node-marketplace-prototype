import { Badge } from "@relume_io/relume-ui";
import { Button } from "../components/ui/Button";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { BulkActionBar } from "../components/management/BulkActionBar";
import { InstalledInstanceRow } from "../components/management/InstalledInstanceRow";
import { UninstallConfirmDialog } from "../components/management/UninstallConfirmDialog";
import { UpdatePermissionsDialog } from "../components/management/UpdatePermissionsDialog";
import { ListPagination } from "../components/shared/ListPagination";
import { StatePanel } from "../components/shared/StatePanel";
import { SystemStatusBanners } from "../components/shared/SystemStatusBanners";
import { categoryIcons } from "../icons/iconMap";
import { usePrototypeStore } from "../store/prototypeStore";
import { getInstalledAppViews } from "../utils/installedApps";
import { getEffectiveAppStatus } from "../utils/marketplaceBrowse";
import { paginateItems } from "../utils/pagination";
import { canManageApps } from "../utils/prototypePermissions";

export function InstalledAppDetailPage() {
  const { appId = "" } = useParams();
  const navigate = useNavigate();
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const [uninstallOpen, setUninstallOpen] = useState(false);
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [page, setPage] = useState(1);

  const {
    apps,
    nodes,
    deployments,
    overrides,
    user,
    setActiveAppId,
    stopAppInstances,
    restartAppInstances,
    updateAppInstances,
    completeAppSetup,
    uninstallApp,
  } = usePrototypeStore(
    useShallow((state) => ({
      apps: state.apps,
      nodes: state.nodes,
      deployments: state.deployments,
      overrides: state.overrides,
      user: state.users.find((item) => item.id === state.activeUserId),
      setActiveAppId: state.setActiveAppId,
      stopAppInstances: state.stopAppInstances,
      restartAppInstances: state.restartAppInstances,
      updateAppInstances: state.updateAppInstances,
      completeAppSetup: state.completeAppSetup,
      uninstallApp: state.uninstallApp,
    })),
  );

  useEffect(() => {
    if (appId) setActiveAppId(appId);
  }, [appId, setActiveAppId]);

  const view = useMemo(
    () =>
      getInstalledAppViews({ apps, nodes, deployments, overrides }).find(
        (item) => item.app.id === appId,
      ),
    [apps, nodes, deployments, overrides, appId],
  );

  useEffect(() => {
    if (!view) return;
    const valid = new Set(view.deployment.nodeIds);
    setSelectedNodeIds((current) => current.filter((id) => valid.has(id)));
  }, [view]);

  const pagination = useMemo(
    () => paginateItems(view?.nodes ?? [], page),
    [view?.nodes, page],
  );

  if (!view) {
    const app = apps.find((item) => item.id === appId);
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-text-primary">
          {app ? `${app.name} is not installed` : "Installed app not found"}
        </h1>
        <StatePanel
          tone="empty"
          title="No installation found"
          description="Install this app from the marketplace, or return to your installed apps."
          actionLabel={app ? "Install" : "Back to installed apps"}
          actionTo={app ? `/marketplace/apps/${app.id}/install` : "/installed"}
        />
      </div>
    );
  }

  const { app, deployment } = view;
  const Icon = categoryIcons[app.category];
  const canManage = canManageApps(user, overrides);
  const effectiveStatus = getEffectiveAppStatus(app, overrides);
  const instanceByNodeId = new Map(
    deployment.instances.map((instance) => [instance.nodeId, instance]),
  );
  const updatingCount = deployment.instances.filter(
    (instance) => instance.status === "updating",
  ).length;

  const toggleNode = (nodeId: string) => {
    setSelectedNodeIds((current) =>
      current.includes(nodeId)
        ? current.filter((id) => id !== nodeId)
        : [...current, nodeId],
    );
  };

  const requestUpdate = () => {
    if (overrides.newPermissionsRequired) {
      setPermissionsOpen(true);
      return;
    }
    updateAppInstances(app.id, selectedNodeIds);
  };

  const handleUninstall = () => {
    const ok = uninstallApp(app.id, selectedNodeIds);
    if (ok && selectedNodeIds.length >= deployment.nodeIds.length) {
      navigate("/installed");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className="flex size-12 shrink-0 items-center justify-center border border-border-primary bg-background-secondary"
            aria-hidden="true"
          >
            <Icon pack="basic" size="sm" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-text-primary">{app.name}</h1>
              <Badge variant="outline">{deployment.aggregateHealth}</Badge>
              {view.updateAvailable ? (
                <Badge variant="secondary">Update available</Badge>
              ) : null}
              {effectiveStatus === "suspended" ? (
                <Badge variant="secondary">Suspended</Badge>
              ) : null}
            </div>
            <p className="mt-1 text-sm text-text-secondary">
              v{deployment.version} · {deployment.nodeIds.length} node
              {deployment.nodeIds.length === 1 ? "" : "s"} · {view.runningCount}{" "}
              running
              {updatingCount > 0 ? ` · ${updatingCount} updating` : ""}
            </p>
          </div>
        </div>
        <Button asChild variant="secondary" size="sm">
          <Link to="/installed">Back to installed apps</Link>
        </Button>
      </div>

      <SystemStatusBanners overrides={overrides} context="management" />

      {effectiveStatus === "suspended" ? (
        <StatePanel
          tone="warning"
          title="App suspended"
          description={
            app.suspensionReason ??
            "This app is suspended. Existing installations remain visible, but new installs and updates may be limited."
          }
        />
      ) : null}

      {effectiveStatus === "removed" ? (
        <StatePanel
          tone="warning"
          title="App removed from marketplace"
          description="This app is no longer listed in the marketplace. You can still manage or uninstall existing installations."
        />
      ) : null}

      <BulkActionBar
        appId={app.id}
        selectedCount={selectedNodeIds.length}
        totalCount={deployment.nodeIds.length}
        updateAvailable={view.updateAvailable}
        hasSetupRequired={view.setupRequiredCount > 0}
        canManage={canManage}
        onSelectAll={() => setSelectedNodeIds([...deployment.nodeIds])}
        onClearSelection={() => setSelectedNodeIds([])}
        onStop={() => stopAppInstances(app.id, selectedNodeIds)}
        onRestart={() => restartAppInstances(app.id, selectedNodeIds)}
        onUpdate={requestUpdate}
        onCompleteSetup={() => completeAppSetup(app.id, selectedNodeIds)}
        onUninstall={() => setUninstallOpen(true)}
      />

      <section className="flex flex-col gap-2">
        <h2 className="text-base font-semibold text-text-primary">
          Installations by node
        </h2>
        {pagination.pageItems.map((node) => {
          const instance = instanceByNodeId.get(node.id);
          if (!instance) return null;
          return (
            <InstalledInstanceRow
              key={node.id}
              appId={app.id}
              node={node}
              instance={instance}
              selected={selectedNodeIds.includes(node.id)}
              onToggle={toggleNode}
            />
          );
        })}
        <ListPagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          start={pagination.start}
          end={pagination.end}
          total={pagination.total}
          onPageChange={setPage}
          label="nodes"
        />
      </section>

      <UninstallConfirmDialog
        open={uninstallOpen}
        onOpenChange={setUninstallOpen}
        appName={app.name}
        affectedCount={selectedNodeIds.length}
        onConfirm={handleUninstall}
      />

      <UpdatePermissionsDialog
        open={permissionsOpen}
        onOpenChange={setPermissionsOpen}
        app={app}
        affectedCount={selectedNodeIds.length}
        onConfirm={() =>
          updateAppInstances(app.id, selectedNodeIds, {
            acceptNewPermissions: true,
          })
        }
      />
    </div>
  );
}
