import type {
  CompatibilityResult,
  InstallationScope,
  MarketplaceApp,
  Node,
  PrototypeOverrides,
} from "../types/prototype";
import { evaluateCompatibility } from "./compatibility";
import { isSelectableCompatibility } from "./compatibilityLabels";

export type SelectionSummary = {
  selectedCount: number;
  ready: number;
  warnings: number;
  queued: number;
  incompatibleSelected: number;
};

export function getInstallCompatibility(
  app: MarketplaceApp,
  node: Node,
  overrides: PrototypeOverrides,
): CompatibilityResult {
  return evaluateCompatibility(app, node, overrides);
}

export function getSelectableNodeIds(
  app: MarketplaceApp,
  nodes: Node[],
  overrides: PrototypeOverrides,
): string[] {
  return nodes
    .filter((node) => {
      const result = getInstallCompatibility(app, node, overrides);
      return isSelectableCompatibility(result.status);
    })
    .map((node) => node.id);
}

export function summarizeSelection(
  selectedNodeIds: string[],
  resultsByNodeId: Map<string, CompatibilityResult>,
): SelectionSummary {
  const summary: SelectionSummary = {
    selectedCount: selectedNodeIds.length,
    ready: 0,
    warnings: 0,
    queued: 0,
    incompatibleSelected: 0,
  };

  for (const nodeId of selectedNodeIds) {
    const result = resultsByNodeId.get(nodeId);
    if (!result) continue;
    switch (result.status) {
      case "compatible":
        summary.ready += 1;
        break;
      case "compatible-with-warnings":
        summary.warnings += 1;
        break;
      case "offline-queued":
        summary.queued += 1;
        break;
      default:
        summary.incompatibleSelected += 1;
    }
  }

  return summary;
}

export function resolveScopeSelection(args: {
  scope: InstallationScope;
  nodes: Node[];
  app: MarketplaceApp;
  overrides: PrototypeOverrides;
  currentSelected: string[];
  preferredSingleNodeId?: string;
}): string[] {
  const selectable = getSelectableNodeIds(args.app, args.nodes, args.overrides);

  if (args.scope === "all-compatible") {
    return selectable;
  }

  if (args.scope === "one") {
    if (
      args.preferredSingleNodeId &&
      selectable.includes(args.preferredSingleNodeId)
    ) {
      return [args.preferredSingleNodeId];
    }
    if (
      args.currentSelected.length === 1 &&
      selectable.includes(args.currentSelected[0]!)
    ) {
      return args.currentSelected;
    }
    return selectable[0] ? [selectable[0]] : [];
  }

  return args.currentSelected.filter((id) => selectable.includes(id));
}

export function formatStageLabel(stage: string): string {
  return stage
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
