import { Button } from "../components/ui/Button";
import { useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { InstallationScopeSelector } from "../components/installation/InstallationScopeSelector";
import { InstallFlowHeader } from "../components/installation/InstallFlowHeader";
import { NodeSelectionTable } from "../components/installation/NodeSelectionTable";
import { SelectionSummaryBar } from "../components/installation/SelectionSummaryBar";
import { FirstInstallCoach } from "../components/onboarding/FirstInstallCoach";
import { StatePanel } from "../components/shared/StatePanel";
import { SystemStatusBanners } from "../components/shared/SystemStatusBanners";
import { usePrototypeStore } from "../store/prototypeStore";
import {
  countCompatibleNodes,
  getEffectiveAppStatus,
} from "../utils/marketplaceBrowse";
import type { CompatibilityResult } from "../types/prototype";
import {
  getInstallCompatibility,
  getSelectableNodeIds,
  summarizeSelection,
} from "../utils/installationSelection";
import { canInstallApps } from "../utils/prototypePermissions";

export function InstallScopePage() {
  const { appId = "" } = useParams();
  const navigate = useNavigate();

  const {
    apps,
    nodes,
    overrides,
    user,
    installation,
    setActiveAppId,
    setInstallationScope,
    toggleNodeSelection,
    selectAllCompatibleNodes,
    setSelectedNodeIds,
    clearNodeSelection,
  } = usePrototypeStore(
    useShallow((state) => ({
      apps: state.apps,
      nodes: state.nodes,
      overrides: state.overrides,
      user: state.users.find((item) => item.id === state.activeUserId),
      installation: state.installation,
      setActiveAppId: state.setActiveAppId,
      setInstallationScope: state.setInstallationScope,
      toggleNodeSelection: state.toggleNodeSelection,
      selectAllCompatibleNodes: state.selectAllCompatibleNodes,
      setSelectedNodeIds: state.setSelectedNodeIds,
      clearNodeSelection: state.clearNodeSelection,
    })),
  );

  const app = apps.find((item) => item.id === appId);

  useEffect(() => {
    if (appId) setActiveAppId(appId);
  }, [appId, setActiveAppId]);

  const resultsByNodeId = useMemo(() => {
    const map = new Map<string, CompatibilityResult>();
    if (!app) return map;
    for (const node of nodes) {
      map.set(node.id, getInstallCompatibility(app, node, overrides));
    }
    return map;
  }, [app, nodes, overrides]);

  const compatibleCount = app
    ? getSelectableNodeIds(app, nodes, overrides).length
    : 0;

  const compatibilitySummary = useMemo(
    () => countCompatibleNodes([...resultsByNodeId.values()]),
    [resultsByNodeId],
  );

  const summary = summarizeSelection(
    installation.selectedNodeIds,
    resultsByNodeId,
  );

  useEffect(() => {
    if (!app) return;
    if (compatibleCount === 1 && installation.selectedNodeIds.length === 0) {
      const onlyId = getSelectableNodeIds(app, nodes, overrides)[0];
      if (onlyId) {
        setInstallationScope("one");
        setSelectedNodeIds([onlyId]);
      }
    }
  }, [
    app,
    compatibleCount,
    installation.selectedNodeIds.length,
    nodes,
    overrides,
    setInstallationScope,
    setSelectedNodeIds,
  ]);

  if (!app) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-text-primary">App not found</h1>
        <Button asChild variant="secondary" size="sm">
          <Link to="/marketplace">Back to marketplace</Link>
        </Button>
      </div>
    );
  }

  const status = getEffectiveAppStatus(app, overrides);
  const blocked =
    status === "suspended" ||
    status === "deprecated" ||
    status === "removed" ||
    !canInstallApps(user, overrides);

  if (overrides.marketplaceUnavailable) {
    return (
      <div className="flex flex-col gap-4">
        <InstallFlowHeader
          app={app}
          step="select"
          selectedCount={installation.selectedNodeIds.length}
        />
        <StatePanel
          tone="error"
          title="Marketplace unavailable"
          description="Installation cannot continue while the marketplace is unavailable."
          actionLabel="Back to marketplace"
          actionTo="/marketplace"
        />
      </div>
    );
  }

  if (blocked) {
    return (
      <div className="flex flex-col gap-4">
        <InstallFlowHeader
          app={app}
          step="select"
          selectedCount={installation.selectedNodeIds.length}
        />
        <StatePanel
          tone="error"
          title="Installation unavailable"
          description={
            !canInstallApps(user, overrides)
              ? "You do not have permission to install apps."
              : "This app cannot be installed in the current marketplace state."
          }
        />
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <InstallFlowHeader app={app} step="select" selectedCount={0} />
        <StatePanel
          tone="empty"
          title="No nodes available"
          description="Add or claim a node before installing marketplace apps."
        />
      </div>
    );
  }

  const checksUnavailable =
    overrides.compatibilityUnavailable ||
    overrides.networkOffline ||
    compatibilitySummary.unableToCheck === compatibilitySummary.total;

  if (checksUnavailable) {
    return (
      <div className="flex flex-col gap-4">
        <InstallFlowHeader app={app} step="select" selectedCount={0} />
        <SystemStatusBanners overrides={overrides} context="install" />
        <StatePanel
          tone="error"
          title="Compatibility cannot be verified"
          description="Installation is blocked until compatibility checks succeed. Clear the offline or compatibility unavailable override to continue."
          actionLabel="Review app details"
          actionTo={`/marketplace/apps/${app.id}`}
        />
      </div>
    );
  }

  if (compatibleCount === 0) {
    return (
      <div className="flex flex-col gap-4">
        <InstallFlowHeader app={app} step="select" selectedCount={0} />
        <SystemStatusBanners overrides={overrides} context="install" />
        <StatePanel
          tone="empty"
          title="No compatible nodes"
          description="None of your nodes currently meet the blocking requirements for this app. Review compatibility details on the app page."
          actionLabel="Review compatibility"
          actionTo={`/marketplace/apps/${app.id}`}
        />
        <NodeSelectionTable
          nodes={nodes}
          resultsByNodeId={resultsByNodeId}
          selectedNodeIds={[]}
          scope={installation.scope}
          onToggle={toggleNodeSelection}
          onSelectAllCompatible={() => selectAllCompatibleNodes(app.id)}
          onSelectAllVisible={setSelectedNodeIds}
          onClear={clearNodeSelection}
        />
      </div>
    );
  }

  const canContinue =
    installation.selectedNodeIds.length > 0 && !overrides.networkOffline;

  return (
    <div className="flex flex-col gap-4 pb-24">
      <InstallFlowHeader
        app={app}
        step="select"
        selectedCount={installation.selectedNodeIds.length}
      />

      <SystemStatusBanners overrides={overrides} context="install" />
      <FirstInstallCoach stage="scope" />

      {compatibleCount > 1 ? (
        <InstallationScopeSelector
          value={installation.scope}
          compatibleCount={compatibleCount}
          onChange={setInstallationScope}
        />
      ) : (
        <div className="border border-border-primary bg-background-secondary p-4 text-sm text-text-primary">
          Only one compatible node is available, so it is preselected.
        </div>
      )}

      <NodeSelectionTable
        nodes={nodes}
        resultsByNodeId={resultsByNodeId}
        selectedNodeIds={installation.selectedNodeIds}
        scope={installation.scope}
        onToggle={toggleNodeSelection}
        onSelectAllCompatible={() => selectAllCompatibleNodes(app.id)}
        onSelectAllVisible={(nodeIds) => {
          if (installation.scope === "one") {
            setSelectedNodeIds(nodeIds[0] ? [nodeIds[0]] : []);
            return;
          }
          setSelectedNodeIds(nodeIds);
        }}
        onClear={clearNodeSelection}
      />

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="primary"
          disabled={!canContinue}
          onClick={() => navigate(`/marketplace/apps/${app.id}/install/review`)}
        >
          Continue to review
        </Button>
        <Button asChild variant="secondary">
          <Link to={`/marketplace/apps/${app.id}`}>Cancel</Link>
        </Button>
      </div>

      <SelectionSummaryBar summary={summary} />
    </div>
  );
}
