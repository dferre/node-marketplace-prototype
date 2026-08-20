import { Badge } from "@relume_io/relume-ui";
import { Button } from "../components/ui/Button";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { InstallFlowHeader } from "../components/installation/InstallFlowHeader";
import { ListPagination } from "../components/shared/ListPagination";
import { marketplaceIcons } from "../icons/iconMap";
import { deriveOverallStatus } from "../store/installationActions";
import { usePrototypeStore } from "../store/prototypeStore";
import { formatStageLabel } from "../utils/installationSelection";
import { paginateItems } from "../utils/pagination";

export function InstallResultsPage() {
  const { appId = "" } = useParams();
  const [page, setPage] = useState(1);
  const SuccessIcon = marketplaceIcons.success;
  const WarningIcon = marketplaceIcons.warning;

  const { apps, nodes, installation, setActiveAppId } = usePrototypeStore(
    useShallow((state) => ({
      apps: state.apps,
      nodes: state.nodes,
      installation: state.installation,
      setActiveAppId: state.setActiveAppId,
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

  const overall =
    installation.overallStatus === "not-started"
      ? deriveOverallStatus(installation.nodeStatuses)
      : installation.overallStatus;

  const counts = useMemo(() => {
    const next = {
      running: 0,
      queued: 0,
      failed: 0,
      canceled: 0,
      other: 0,
    };
    for (const nodeId of installation.selectedNodeIds) {
      const stage = installation.nodeStatuses[nodeId]?.stage;
      if (stage === "running") next.running += 1;
      else if (stage === "queued" || stage === "waiting-for-node")
        next.queued += 1;
      else if (stage === "failed" || stage === "needs-attention")
        next.failed += 1;
      else if (stage === "canceled") next.canceled += 1;
      else next.other += 1;
    }
    return next;
  }, [installation.selectedNodeIds, installation.nodeStatuses]);

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

  const total = installation.selectedNodeIds.length;

  return (
    <div className="flex flex-col gap-4">
      <InstallFlowHeader
        app={app}
        step="results"
        selectedCount={total}
      />

      <section className="border border-border-primary bg-background-primary p-4">
        <div className="flex flex-wrap items-center gap-2">
          {overall === "success" ? (
            <SuccessIcon pack="basic" size="sm" aria-hidden="true" />
          ) : (
            <WarningIcon pack="basic" size="sm" aria-hidden="true" />
          )}
          <h2 className="text-lg font-semibold text-text-primary">
            Installed on {counts.running} of {total} nodes
          </h2>
        </div>
        <p className="mt-2 text-sm text-text-secondary">
          {counts.queued} queued · {counts.failed} needs attention
          {counts.canceled > 0 ? ` · ${counts.canceled} canceled` : ""}
        </p>
        <p className="mt-2 text-sm text-text-primary">
          Overall result: {overall.replace("-", " ")}
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-base font-semibold text-text-primary">
          Per-node outcomes
        </h3>
        {pagination.pageItems.map((node) => {
          const status = installation.nodeStatuses[node.id];
          const stage = status?.stage ?? "queued";
          return (
            <div
              key={node.id}
              className="flex flex-wrap items-start justify-between gap-3 border border-border-primary bg-background-primary p-3"
            >
              <div>
                <p className="font-semibold text-text-primary">{node.name}</p>
                <p className="text-sm text-text-secondary">
                  {status?.message ?? formatStageLabel(stage)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{formatStageLabel(stage)}</Badge>
                {stage === "running" ? (
                  <Button asChild size="sm" variant="secondary">
                    <Link to={`/installed/${app.id}/nodes/${node.id}`}>
                      Open node installation
                    </Link>
                  </Button>
                ) : null}
              </div>
            </div>
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

      <div className="flex flex-wrap gap-2">
        {counts.running > 0 ? (
          <Button asChild variant="primary">
            <Link to={`/installed/${app.id}`}>Open installed app</Link>
          </Button>
        ) : null}
        {counts.failed > 0 ? (
          <Button asChild variant="secondary">
            <Link to={`/marketplace/apps/${app.id}/install`}>
              Retry failed nodes
            </Link>
          </Button>
        ) : null}
        <Button asChild variant="secondary">
          <Link to="/marketplace">Back to marketplace</Link>
        </Button>
      </div>
    </div>
  );
}
