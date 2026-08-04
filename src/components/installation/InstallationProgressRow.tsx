import { Badge, Button } from "@relume_io/relume-ui";
import { marketplaceIcons } from "../../icons/iconMap";
import type { Node, NodeInstallationStatus } from "../../types/prototype";
import { formatStageLabel } from "../../utils/installationSelection";
import { isTerminalStage } from "../../utils/installationStages";

type InstallationProgressRowProps = {
  node: Node;
  status?: NodeInstallationStatus;
  onCancel?: (nodeId: string) => void;
};

export function InstallationProgressRow({
  node,
  status,
  onCancel,
}: InstallationProgressRowProps) {
  const WarningIcon = marketplaceIcons.warning;
  const SuccessIcon = marketplaceIcons.success;
  const stage = status?.stage ?? "queued";
  const canCancel = !isTerminalStage(stage) || stage === "queued";

  return (
    <div
      className="border border-border-primary bg-background-primary p-3"
      aria-live="polite"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-text-primary">{node.name}</p>
          <p className="text-sm text-text-secondary">
            {node.online ? "Online" : "Offline"} · {node.type}
          </p>
        </div>
        <Badge variant="outline">
          <span className="inline-flex items-center gap-1">
            {stage === "running" ? (
              <SuccessIcon pack="basic" size="xs" aria-hidden="true" />
            ) : stage === "failed" || stage === "needs-attention" ? (
              <WarningIcon pack="basic" size="xs" aria-hidden="true" />
            ) : null}
            {formatStageLabel(stage)}
          </span>
        </Badge>
      </div>

      {status?.message ? (
        <p className="mt-2 text-sm text-text-secondary">{status.message}</p>
      ) : null}

      <div className="mt-3 h-2 w-full border border-border-primary bg-background-secondary">
        <div
          className="h-full bg-background-alternative"
          style={{ width: `${stageProgress(stage)}%` }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={stageProgress(stage)}
          aria-label={`${node.name} installation progress`}
        />
      </div>

      {onCancel && canCancel && stage !== "canceled" ? (
        <div className="mt-3">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => onCancel(node.id)}
          >
            Cancel this installation
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function stageProgress(stage: string): number {
  const order = [
    "queued",
    "waiting-for-node",
    "preparing",
    "downloading",
    "verifying",
    "installing",
    "configuring",
    "starting",
    "running",
  ];
  if (stage === "failed" || stage === "canceled" || stage === "needs-attention") {
    return 100;
  }
  const index = order.indexOf(stage);
  if (index < 0) return 0;
  return Math.round((index / (order.length - 1)) * 100);
}
