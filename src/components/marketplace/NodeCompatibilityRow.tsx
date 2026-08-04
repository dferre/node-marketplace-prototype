import { Badge } from "@relume_io/relume-ui";
import { marketplaceIcons } from "../../icons/iconMap";
import type { CompatibilityResult, Node } from "../../types/prototype";
import { formatCompatibilityStatus } from "../../utils/compatibilityLabels";

type NodeCompatibilityRowProps = {
  node: Node;
  result: CompatibilityResult;
};

export function NodeCompatibilityRow({
  node,
  result,
}: NodeCompatibilityRowProps) {
  const WarningIcon = marketplaceIcons.warning;
  const SuccessIcon = marketplaceIcons.success;
  const InfoIcon = marketplaceIcons.info;
  const primaryIssue = result.issues[0];

  return (
    <div className="border border-border-primary bg-background-primary p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-text-primary">{node.name}</p>
          <p className="text-sm text-text-secondary">
            {node.type} · {node.online ? "Online" : "Offline"} ·{" "}
            {node.cpuCoresAvailable} CPU · {node.memoryGbAvailable} GB ·{" "}
            {node.storageGbAvailable} GB {node.storageType.toUpperCase()}
          </p>
        </div>
        <Badge
          variant={
            result.status === "compatible"
              ? "success"
              : result.status === "incompatible" ||
                  result.status === "unable-to-check"
                ? "secondary"
                : "outline"
          }
        >
          <span className="inline-flex items-center gap-1">
            {result.status === "compatible" ? (
              <SuccessIcon pack="basic" size="xs" aria-hidden="true" />
            ) : result.status === "compatible-with-warnings" ||
              result.status === "offline-queued" ? (
              <WarningIcon pack="basic" size="xs" aria-hidden="true" />
            ) : (
              <InfoIcon pack="basic" size="xs" aria-hidden="true" />
            )}
            {formatCompatibilityStatus(result.status)}
          </span>
        </Badge>
      </div>

      {primaryIssue ? (
        <div className="mt-3 border-t border-border-primary pt-3 text-sm">
          <p className="text-text-primary">{primaryIssue.message}</p>
          {primaryIssue.requirement ? (
            <p className="mt-1 text-text-secondary">
              Required: {primaryIssue.requirement}
              {primaryIssue.nodeValue ? ` · Node: ${primaryIssue.nodeValue}` : ""}
            </p>
          ) : null}
          {primaryIssue.recommendedAction ? (
            <p className="mt-1 text-text-primary">
              Next: {primaryIssue.recommendedAction}
            </p>
          ) : null}
        </div>
      ) : null}

      {result.rewardNotes.length > 0 ? (
        <p className="mt-2 text-sm text-text-secondary">
          Rewards: {result.rewardNotes.join(" ")}
        </p>
      ) : (
        <p className="mt-2 text-sm text-text-secondary">
          Reward eligibility:{" "}
          {result.rewardEligible ? "Eligible" : "Not eligible or unavailable"}
        </p>
      )}
    </div>
  );
}
