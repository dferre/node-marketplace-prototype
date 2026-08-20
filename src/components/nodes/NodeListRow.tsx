import { Badge } from "@relume_io/relume-ui";
import { Button } from "../ui/Button";
import { Link } from "react-router-dom";
import { navigationIcons } from "../../icons/iconMap";
import type { Node } from "../../types/prototype";

type NodeListRowProps = {
  node: Node;
  installedAppCount: number;
};

function healthLabel(node: Node): string {
  if (!node.online) return "Offline";
  if (node.dataStale) return "Stale data";
  switch (node.health) {
    case "healthy":
      return "Healthy";
    case "degraded":
      return "Degraded";
    case "unhealthy":
      return "Needs attention";
  }
}

export function NodeListRow({ node, installedAppCount }: NodeListRowProps) {
  const ServerIcon = navigationIcons.nodes;

  return (
    <article className="flex flex-wrap items-start justify-between gap-3 border border-border-primary bg-background-primary p-4">
      <div className="flex min-w-0 items-start gap-3">
        <div
          className="flex size-12 shrink-0 items-center justify-center border border-border-primary bg-background-secondary"
          aria-hidden="true"
        >
          <ServerIcon pack="basic" size="sm" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-text-primary">
              {node.name}
            </h2>
            <Badge variant="outline">{healthLabel(node)}</Badge>
            <Badge variant="secondary" className="capitalize">
              {node.type}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-text-secondary">
            {node.region} · {node.architecture} · software v{node.softwareVersion}
          </p>
          <p className="mt-2 text-sm text-text-primary">
            {node.cpuCoresAvailable} CPU · {node.memoryGbAvailable} GB RAM ·{" "}
            {node.storageGbAvailable} GB {node.storageType.toUpperCase()} ·{" "}
            {node.bandwidthMbps} Mbps
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            {installedAppCount} installed app
            {installedAppCount === 1 ? "" : "s"}
            {node.rewardWalletConnected ? " · Rewards wallet connected" : " · No rewards wallet"}
            {!node.online && node.offlineSinceHours != null
              ? ` · Offline ${node.offlineSinceHours}h`
              : ""}
          </p>
        </div>
      </div>
      <Button asChild variant="primary" size="sm">
        <Link to={`/nodes/${node.id}`}>Open node</Link>
      </Button>
    </article>
  );
}
