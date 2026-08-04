import { Button } from "@relume_io/relume-ui";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { CompatibilityResult, Node } from "../../types/prototype";
import { countCompatibleNodes } from "../../utils/marketplaceBrowse";
import { paginateItems } from "../../utils/pagination";
import { ListPagination } from "../shared/ListPagination";
import { StatePanel } from "../shared/StatePanel";
import { NodeCompatibilityRow } from "./NodeCompatibilityRow";

type CompatibilitySummaryProps = {
  appId: string;
  nodes: Node[];
  results: CompatibilityResult[];
  showNodeRows?: boolean;
  showInstallAction?: boolean;
  checkUnavailable?: boolean;
};

export function CompatibilitySummary({
  appId,
  nodes,
  results,
  showNodeRows = true,
  showInstallAction = true,
  checkUnavailable = false,
}: CompatibilitySummaryProps) {
  const [page, setPage] = useState(1);
  const summary = countCompatibleNodes(results);
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const pagination = useMemo(
    () => paginateItems(results, page),
    [results, page],
  );

  if (summary.total === 0) {
    return (
      <section className="border border-border-primary bg-background-primary p-4">
        <h2 className="text-lg font-semibold text-text-primary">Compatibility</h2>
        <p className="mt-2 text-sm text-text-secondary">
          You do not own any nodes yet. Add a node before installing marketplace
          apps.
        </p>
      </section>
    );
  }

  if (checkUnavailable || summary.unableToCheck === summary.total) {
    return (
      <section className="flex flex-col gap-3">
        <StatePanel
          tone="error"
          title="Compatibility unavailable"
          description="Compatibility could not be checked for your nodes. Retry later or clear the offline / compatibility unavailable override in the Prototype debugger."
        />
        {showInstallAction ? (
          <Button asChild variant="secondary" size="sm">
            <Link to={`/marketplace/apps/${appId}`}>Refresh app details</Link>
          </Button>
        ) : null}
      </section>
    );
  }

  return (
    <section className="border border-border-primary bg-background-primary p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Compatibility
          </h2>
          <p className="mt-2 text-sm text-text-primary">
            Compatible with {summary.installable} of your {summary.total} nodes.
          </p>
          <ul className="mt-2 list-inside list-disc text-sm text-text-secondary">
            <li>{summary.ready} ready</li>
            <li>{summary.warnings} compatible with warnings</li>
            <li>{summary.offline} offline and eligible to queue</li>
            <li>{summary.incompatible} incompatible</li>
            {summary.unableToCheck > 0 ? (
              <li>{summary.unableToCheck} unable to check</li>
            ) : null}
            {summary.alreadyInstalled > 0 ? (
              <li>{summary.alreadyInstalled} already installed</li>
            ) : null}
          </ul>
        </div>
        {showInstallAction ? (
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="primary" size="sm">
              <Link to={`/marketplace/apps/${appId}/install`}>
                Install on nodes
              </Link>
            </Button>
          </div>
        ) : null}
      </div>

      {showNodeRows ? (
        <div className="mt-4 flex flex-col gap-2">
          {pagination.pageItems.map((result) => {
            const node = nodeById.get(result.nodeId);
            if (!node) return null;
            return (
              <NodeCompatibilityRow
                key={result.nodeId}
                node={node}
                result={result}
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
        </div>
      ) : null}
    </section>
  );
}
