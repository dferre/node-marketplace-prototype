import { Badge, Button } from "@relume_io/relume-ui";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { UninstallConfirmDialog } from "../components/management/UninstallConfirmDialog";
import { UpdatePermissionsDialog } from "../components/management/UpdatePermissionsDialog";
import { StatePanel } from "../components/shared/StatePanel";
import { SystemStatusBanners } from "../components/shared/SystemStatusBanners";
import { usePrototypeStore } from "../store/prototypeStore";
import {
  formatInstanceStatus,
  getInstanceResourceSummary,
  getInstanceRewardSummary,
} from "../utils/installedApps";
import { getEffectiveAppStatus } from "../utils/marketplaceBrowse";
import { canManageApps } from "../utils/prototypePermissions";

export function NodeAppInstallationPage() {
  const { appId = "", nodeId = "" } = useParams();
  const navigate = useNavigate();
  const [uninstallOpen, setUninstallOpen] = useState(false);
  const [permissionsOpen, setPermissionsOpen] = useState(false);

  const {
    apps,
    nodes,
    deployments,
    overrides,
    user,
    setActiveAppId,
    setFocusedNodeId,
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
      setFocusedNodeId: state.setFocusedNodeId,
      stopAppInstances: state.stopAppInstances,
      restartAppInstances: state.restartAppInstances,
      updateAppInstances: state.updateAppInstances,
      completeAppSetup: state.completeAppSetup,
      uninstallApp: state.uninstallApp,
    })),
  );

  useEffect(() => {
    if (appId) setActiveAppId(appId);
    if (nodeId) setFocusedNodeId(nodeId);
  }, [appId, nodeId, setActiveAppId, setFocusedNodeId]);

  const app = apps.find((item) => item.id === appId);
  const node = nodes.find((item) => item.id === nodeId);
  const deployment = deployments.find((item) => item.appId === appId);
  const instance = deployment?.instances.find((item) => item.nodeId === nodeId);
  const canManage = canManageApps(user, overrides);

  const resources = useMemo(() => {
    if (!instance || !node) return null;
    return getInstanceResourceSummary(instance, node);
  }, [instance, node]);

  const rewardSummary = useMemo(() => {
    if (!app || !node || !instance) return null;
    return getInstanceRewardSummary({ app, node, instance, overrides });
  }, [app, node, instance, overrides]);

  if (!app || !node || !deployment || !instance || !resources || !rewardSummary) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-text-primary">
          Installation not found
        </h1>
        <StatePanel
          tone="empty"
          title="No installation on this node"
          description="This app is not installed on the selected node."
          actionLabel="Back to installed app"
          actionTo={appId ? `/installed/${appId}` : "/installed"}
        />
      </div>
    );
  }

  const effectiveStatus = getEffectiveAppStatus(app, overrides);
  const updateAvailable =
    overrides.updateRequired ||
    instance.version !== app.version ||
    deployment.version !== app.version;

  const requestUpdate = () => {
    if (overrides.newPermissionsRequired) {
      setPermissionsOpen(true);
      return;
    }
    updateAppInstances(app.id, [node.id]);
  };

  const handleUninstall = () => {
    const ok = uninstallApp(app.id, [node.id]);
    if (ok) navigate(`/installed/${app.id}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-text-secondary">{app.name}</p>
          <h1 className="text-2xl font-bold text-text-primary">{node.name}</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {node.type} · {node.region} · {node.online ? "Online" : "Offline"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{formatInstanceStatus(instance.status)}</Badge>
          <Button asChild variant="secondary" size="sm">
            <Link to={`/installed/${app.id}`}>All nodes</Link>
          </Button>
        </div>
      </div>

      <SystemStatusBanners overrides={overrides} context="management" />

      {!canManage ? (
        <StatePanel
          tone="warning"
          title="View-only access"
          description="You can review this installation, but management actions are disabled."
        />
      ) : null}

      {effectiveStatus === "suspended" ? (
        <StatePanel
          tone="warning"
          title="App suspended"
          description={
            app.suspensionReason ??
            "This app is suspended. Review security guidance before making changes."
          }
        />
      ) : null}

      {!node.online ? (
        <StatePanel
          tone="warning"
          title="Node offline"
          description="This node is offline. Health and resource values reflect the last known snapshot."
        />
      ) : null}

      <section className="border border-border-primary bg-background-primary p-4">
        <h2 className="text-base font-semibold text-text-primary">Health</h2>
        <p className="mt-2 text-sm text-text-primary">
          Status: {formatInstanceStatus(instance.status)}
        </p>
        <p className="mt-1 text-sm text-text-secondary">
          {instance.healthLabel ??
            (instance.status === "running"
              ? "Operating normally"
              : "Review status and take action if needed.")}
        </p>
        <p className="mt-1 text-sm text-text-secondary">
          Installed version: v{instance.version}
          {updateAvailable ? ` · App catalog version: v${app.version}` : ""}
        </p>
      </section>

      <section className="border border-border-primary bg-background-primary p-4">
        <h2 className="text-base font-semibold text-text-primary">
          Resource usage
        </h2>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-text-secondary">CPU</dt>
            <dd className="text-sm text-text-primary">{resources.cpu}</dd>
          </div>
          <div>
            <dt className="text-sm text-text-secondary">Memory</dt>
            <dd className="text-sm text-text-primary">{resources.memory}</dd>
          </div>
          <div>
            <dt className="text-sm text-text-secondary">Storage</dt>
            <dd className="text-sm text-text-primary">{resources.storage}</dd>
          </div>
          <div>
            <dt className="text-sm text-text-secondary">Bandwidth</dt>
            <dd className="text-sm text-text-primary">{resources.bandwidth}</dd>
          </div>
        </dl>
      </section>

      <section className="border border-border-primary bg-background-primary p-4">
        <h2 className="text-base font-semibold text-text-primary">
          Configuration
        </h2>
        {instance.status === "setup-required" ? (
          <>
            <p className="mt-2 text-sm text-text-secondary">
              Post-install setup is still required
              {app.setupNotes?.[0] ? `: ${app.setupNotes[0]}` : "."}
            </p>
            <Button
              type="button"
              variant="primary"
              size="sm"
              className="mt-3"
              disabled={!canManage}
              onClick={() => completeAppSetup(app.id, [node.id])}
            >
              Complete setup
            </Button>
          </>
        ) : (
          <p className="mt-2 text-sm text-text-secondary">
            Configuration is applied for this node. Advanced settings are
            simulated in this prototype.
          </p>
        )}
      </section>

      <section className="border border-border-primary bg-background-primary p-4">
        <h2 className="text-base font-semibold text-text-primary">Rewards</h2>
        <p className="mt-2 text-sm text-text-primary">{rewardSummary}</p>
        {app.rewards.available && app.rewards.eligibilityNotes?.length ? (
          <ul className="mt-2 list-disc pl-5 text-sm text-text-secondary">
            {app.rewards.eligibilityNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="flex flex-wrap gap-2 border border-border-primary bg-background-secondary p-4">
        {instance.status === "stopped" ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={!canManage}
            onClick={() => restartAppInstances(app.id, [node.id])}
          >
            Start
          </Button>
        ) : (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={!canManage || instance.status === "updating"}
            onClick={() => stopAppInstances(app.id, [node.id])}
          >
            Stop
          </Button>
        )}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={!canManage || instance.status === "updating"}
          onClick={() => restartAppInstances(app.id, [node.id])}
        >
          Restart
        </Button>
        {updateAvailable ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={!canManage || instance.status === "updating"}
            onClick={requestUpdate}
          >
            {instance.status === "updating"
              ? "Updating…"
              : `Update to v${app.version}`}
          </Button>
        ) : null}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={!canManage}
          onClick={() => setUninstallOpen(true)}
        >
          Uninstall from this node
        </Button>
      </section>

      <UninstallConfirmDialog
        open={uninstallOpen}
        onOpenChange={setUninstallOpen}
        appName={app.name}
        affectedCount={1}
        onConfirm={handleUninstall}
      />

      <UpdatePermissionsDialog
        open={permissionsOpen}
        onOpenChange={setPermissionsOpen}
        app={app}
        affectedCount={1}
        onConfirm={() =>
          updateAppInstances(app.id, [node.id], {
            acceptNewPermissions: true,
          })
        }
      />
    </div>
  );
}
