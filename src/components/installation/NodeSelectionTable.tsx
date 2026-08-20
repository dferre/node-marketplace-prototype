import {
  Badge,
  Checkbox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@relume_io/relume-ui";
import { Button } from "../ui/Button";
import { useMemo, useState } from "react";
import { ListPagination } from "../shared/ListPagination";
import { marketplaceIcons } from "../../icons/iconMap";
import type {
  CompatibilityResult,
  InstallationScope,
  Node,
} from "../../types/prototype";
import { formatCompatibilityStatus } from "../../utils/compatibilityLabels";
import { isSelectableCompatibility } from "../../utils/compatibilityLabels";
import { paginateItems } from "../../utils/pagination";

type NodeSelectionTableProps = {
  nodes: Node[];
  resultsByNodeId: Map<string, CompatibilityResult>;
  selectedNodeIds: string[];
  scope: InstallationScope;
  onToggle: (nodeId: string) => void;
  onSelectAllCompatible: () => void;
  onSelectAllVisible: (nodeIds: string[]) => void;
  onClear: () => void;
};

type FilterMode = "all" | "selectable" | "warnings" | "offline" | "blocked";

export function NodeSelectionTable({
  nodes,
  resultsByNodeId,
  selectedNodeIds,
  scope,
  onToggle,
  onSelectAllCompatible,
  onSelectAllVisible,
  onClear,
}: NodeSelectionTableProps) {
  const SearchIcon = marketplaceIcons.search;
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [sort, setSort] = useState<"name" | "compatibility" | "resources">(
    "compatibility",
  );
  const [page, setPage] = useState(1);

  const visibleNodes = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const filtered = nodes.filter((node) => {
      const result = resultsByNodeId.get(node.id);
      if (!result) return false;

      if (normalized) {
        const haystack = `${node.name} ${node.type} ${node.region}`.toLowerCase();
        if (!haystack.includes(normalized)) return false;
      }

      switch (filter) {
        case "selectable":
          return isSelectableCompatibility(result.status);
        case "warnings":
          return result.status === "compatible-with-warnings";
        case "offline":
          return result.status === "offline-queued";
        case "blocked":
          return (
            result.status === "incompatible" ||
            result.status === "already-installed" ||
            result.status === "unable-to-check"
          );
        default:
          return true;
      }
    });

    const rank: Record<string, number> = {
      compatible: 0,
      "compatible-with-warnings": 1,
      "offline-queued": 2,
      "already-installed": 3,
      incompatible: 4,
      "unable-to-check": 5,
    };

    return [...filtered].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "resources") {
        return b.cpuCoresAvailable - a.cpuCoresAvailable;
      }
      const aRank = rank[resultsByNodeId.get(a.id)?.status ?? ""] ?? 99;
      const bRank = rank[resultsByNodeId.get(b.id)?.status ?? ""] ?? 99;
      if (aRank !== bRank) return aRank - bRank;
      return a.name.localeCompare(b.name);
    });
  }, [nodes, resultsByNodeId, query, filter, sort]);

  const pagination = useMemo(
    () => paginateItems(visibleNodes, page),
    [visibleNodes, page],
  );
  const pageNodes = pagination.pageItems;

  const visibleSelectableIds = visibleNodes
    .filter((node) => {
      const result = resultsByNodeId.get(node.id);
      return result ? isSelectableCompatibility(result.status) : false;
    })
    .map((node) => node.id);

  return (
    <section className="border border-border-primary bg-background-primary p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Choose nodes
          </h2>
          <p className="text-sm text-text-secondary">
            Incompatible and already-installed nodes stay visible with reasons.
            {nodes.length > 10
              ? ` Large fleets are paginated (${nodes.length} nodes).`
              : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={onSelectAllCompatible}
          >
            Select all compatible
          </Button>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => onSelectAllVisible(visibleSelectableIds)}
          >
            Select all visible
          </Button>
          <Button type="button" size="sm" variant="secondary" onClick={onClear}>
            Clear selection
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="md:col-span-1">
          <Label htmlFor="node-search">Search nodes</Label>
          <Input
            id="node-search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search by name or type"
            icon={<SearchIcon pack="basic" size="sm" aria-hidden="true" />}
          />
        </div>
        <div>
          <Label htmlFor="node-filter">Filter</Label>
          <Select
            value={filter}
            onValueChange={(value) => {
              setFilter(value as FilterMode);
              setPage(1);
            }}
          >
            <SelectTrigger id="node-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All nodes</SelectItem>
              <SelectItem value="selectable">Selectable</SelectItem>
              <SelectItem value="warnings">Warnings</SelectItem>
              <SelectItem value="offline">Offline / queued</SelectItem>
              <SelectItem value="blocked">Blocked / installed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="node-sort">Sort</Label>
          <Select
            value={sort}
            onValueChange={(value) =>
              setSort(value as "name" | "compatibility" | "resources")
            }
          >
            <SelectTrigger id="node-sort">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compatibility">Compatibility</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="resources">Available resources</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14">Select</TableHead>
              <TableHead>Node</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Compatibility</TableHead>
              <TableHead>Resources</TableHead>
              <TableHead>Rewards</TableHead>
              <TableHead>Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageNodes.map((node) => {
              const result = resultsByNodeId.get(node.id)!;
              const selectable = isSelectableCompatibility(result.status);
              const checked = selectedNodeIds.includes(node.id);
              const reason =
                result.issues[0]?.message ??
                (result.rewardNotes[0] ?? "Ready for installation");

              return (
                <TableRow key={node.id}>
                  <TableCell>
                    <Checkbox
                      checked={checked}
                      disabled={!selectable}
                      onCheckedChange={() => onToggle(node.id)}
                      aria-label={`Select ${node.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold text-text-primary">{node.name}</p>
                    <p className="text-sm text-text-secondary">{node.type}</p>
                  </TableCell>
                  <TableCell>
                    {node.online ? "Online" : `Offline · ${node.offlineSinceHours ?? "?"}h`}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {formatCompatibilityStatus(result.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {node.cpuCoresAvailable} CPU · {node.memoryGbAvailable} GB ·{" "}
                    {node.storageGbAvailable} GB {node.storageType.toUpperCase()}
                  </TableCell>
                  <TableCell className="text-sm">
                    {result.rewardEligible ? "Eligible" : "Not eligible"}
                  </TableCell>
                  <TableCell className="text-sm text-text-secondary">
                    {reason}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex flex-col gap-2 md:hidden">
        {pageNodes.map((node) => {
          const result = resultsByNodeId.get(node.id)!;
          const selectable = isSelectableCompatibility(result.status);
          const checked = selectedNodeIds.includes(node.id);
          return (
            <label
              key={node.id}
              className="flex items-start gap-3 border border-border-primary p-3"
            >
              <Checkbox
                checked={checked}
                disabled={!selectable}
                onCheckedChange={() => onToggle(node.id)}
                aria-label={`Select ${node.name}`}
                className="mt-1"
              />
              <span className="min-w-0">
                <span className="block font-semibold text-text-primary">
                  {node.name}
                </span>
                <span className="mt-1 block text-sm text-text-secondary">
                  {node.type} · {node.online ? "Online" : "Offline"} ·{" "}
                  {formatCompatibilityStatus(result.status)}
                </span>
                <span className="mt-1 block text-sm text-text-secondary">
                  {result.issues[0]?.message ?? "Ready for installation"}
                </span>
                {scope === "one" && checked ? (
                  <span className="mt-1 block text-xs text-text-primary">
                    Selected as the one node
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>

      {visibleNodes.length === 0 ? (
        <p className="mt-4 text-sm text-text-secondary">
          No nodes match the current search or filter.
        </p>
      ) : (
        <ListPagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          start={pagination.start}
          end={pagination.end}
          total={pagination.total}
          onPageChange={setPage}
          label="nodes"
        />
      )}
    </section>
  );
}
