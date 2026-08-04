import { Badge, Button, Checkbox } from "@relume_io/relume-ui";
import { Link } from "react-router-dom";
import type { DeploymentInstance, Node } from "../../types/prototype";
import { formatInstanceStatus } from "../../utils/installedApps";

type InstalledInstanceRowProps = {
  appId: string;
  node: Node;
  instance: DeploymentInstance;
  selected: boolean;
  onToggle: (nodeId: string) => void;
};

export function InstalledInstanceRow({
  appId,
  node,
  instance,
  selected,
  onToggle,
}: InstalledInstanceRowProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border border-border-primary bg-background-primary p-3">
      <div className="flex min-w-0 items-start gap-3">
        <Checkbox
          checked={selected}
          onCheckedChange={() => onToggle(node.id)}
          aria-label={`Select ${node.name}`}
        />
        <div>
          <p className="font-semibold text-text-primary">{node.name}</p>
          <p className="text-sm text-text-secondary">
            {node.type} · {node.region} · {node.online ? "Online" : "Offline"}
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            v{instance.version}
            {instance.healthLabel ? ` · ${instance.healthLabel}` : ""}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">{formatInstanceStatus(instance.status)}</Badge>
        <Button asChild size="sm" variant="secondary">
          <Link to={`/installed/${appId}/nodes/${node.id}`}>Open</Link>
        </Button>
      </div>
    </div>
  );
}
