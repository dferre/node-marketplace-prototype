import { Button } from "../components/ui/Button";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { InstallationProgressRow } from "../components/installation/InstallationProgressRow";
import { InstallFlowHeader } from "../components/installation/InstallFlowHeader";
import { ListPagination } from "../components/shared/ListPagination";
import { usePrototypeStore } from "../store/prototypeStore";
import { deriveOverallStatus } from "../store/installationActions";
import { paginateItems } from "../utils/pagination";

export function InstallProgressPage() {
  const { appId = "" } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const {
    apps,
    nodes,
    installation,
    setActiveAppId,
    playInstallation,
    pauseInstallation,
    advanceInstallation,
    cancelRemainingInstallations,
    cancelNodeInstallation,
  } = usePrototypeStore(
    useShallow((state) => ({
      apps: state.apps,
      nodes: state.nodes,
      installation: state.installation,
      setActiveAppId: state.setActiveAppId,
      playInstallation: state.playInstallation,
      pauseInstallation: state.pauseInstallation,
      advanceInstallation: state.advanceInstallation,
      cancelRemainingInstallations: state.cancelRemainingInstallations,
      cancelNodeInstallation: state.cancelNodeInstallation,
    })),
  );

  const app = apps.find((item) => item.id === appId);

  useEffect(() => {
    if (appId) setActiveAppId(appId);
  }, [appId, setActiveAppId]);

  const selectedNodes = useMemo(
    () =>
      installation.selectedNodeIds
        .map((id) => nodes.find((node) => node.id === id))
        .filter((node): node is NonNullable<typeof node> => Boolean(node)),
    [installation.selectedNodeIds, nodes],
  );

  const pagination = useMemo(
    () => paginateItems(selectedNodes, page),
    [selectedNodes, page],
  );

  const overall = deriveOverallStatus(installation.nodeStatuses);
  const settled =
    overall === "success" ||
    overall === "partial-success" ||
    overall === "failure" ||
    overall === "queued" ||
    overall === "canceled";

  useEffect(() => {
    if (!settled) return;
    if (installation.isPlaying) return;
    if (Object.keys(installation.nodeStatuses).length === 0) return;

    const timer = window.setTimeout(() => {
      navigate(`/marketplace/apps/${appId}/install/results`);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [
    settled,
    installation.isPlaying,
    installation.nodeStatuses,
    navigate,
    appId,
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

  if (installation.selectedNodeIds.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <InstallFlowHeader app={app} step="progress" selectedCount={0} />
        <div className="border border-border-primary bg-background-secondary p-4">
          <p className="font-semibold text-text-primary">
            No installation in progress
          </p>
          <Button asChild variant="primary" size="sm" className="mt-4">
            <Link to={`/marketplace/apps/${app.id}/install`}>
              Start installation
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const counts = {
    running: 0,
    queued: 0,
    failed: 0,
    active: 0,
  };
  for (const nodeId of installation.selectedNodeIds) {
    const stage = installation.nodeStatuses[nodeId]?.stage;
    if (stage === "running") counts.running += 1;
    else if (stage === "queued" || stage === "waiting-for-node")
      counts.queued += 1;
    else if (stage === "failed" || stage === "canceled") counts.failed += 1;
    else counts.active += 1;
  }

  return (
    <div className="flex flex-col gap-4">
      <InstallFlowHeader
        app={app}
        step="progress"
        selectedCount={installation.selectedNodeIds.length}
      />

      <section
        className="border border-border-primary bg-background-primary p-4"
        aria-live="polite"
      >
        <h2 className="text-lg font-semibold text-text-primary">
          Installation progress
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Tracking each node separately. Partial success is expected when some
          nodes queue or fail.
        </p>
        <p className="mt-2 text-sm text-text-primary">
          {counts.running} running · {counts.active} in progress ·{" "}
          {counts.queued} queued · {counts.failed} stopped
          {installation.isPlaying ? " · Playing" : " · Paused"}
        </p>
      </section>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={playInstallation}
          disabled={installation.isPlaying}
        >
          Play
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={pauseInstallation}
          disabled={!installation.isPlaying}
        >
          Pause
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={advanceInstallation}
        >
          Advance one stage
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={cancelRemainingInstallations}
        >
          Cancel remaining
        </Button>
        <Button asChild size="sm" variant="secondary">
          <Link to={`/marketplace/apps/${app.id}/install/results`}>
            View results now
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {pagination.pageItems.map((node) => (
          <InstallationProgressRow
            key={node.id}
            node={node}
            status={installation.nodeStatuses[node.id]}
            onCancel={cancelNodeInstallation}
          />
        ))}
        <ListPagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          start={pagination.start}
          end={pagination.end}
          total={pagination.total}
          onPageChange={setPage}
          label="nodes"
        />
      </div>
    </div>
  );
}
