import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@relume_io/relume-ui";
import { Button } from "../components/ui/Button";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { NodeListRow } from "../components/nodes/NodeListRow";
import { ListPagination } from "../components/shared/ListPagination";
import { StatePanel } from "../components/shared/StatePanel";
import { SystemStatusBanners } from "../components/shared/SystemStatusBanners";
import { marketplaceIcons } from "../icons/iconMap";
import { usePrototypeStore } from "../store/prototypeStore";
import { paginateItems } from "../utils/pagination";

type NodeFilter = "all" | "online" | "offline" | "attention" | "with-apps";

export function NodesPage() {
  const SearchIcon = marketplaceIcons.search;
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<NodeFilter>("all");
  const [page, setPage] = useState(1);

  const { nodes, overrides, nodeFleetId } = usePrototypeStore(
    useShallow((state) => ({
      nodes: state.nodes,
      overrides: state.overrides,
      nodeFleetId: state.nodeFleetId,
    })),
  );

  const counts = useMemo(() => {
    const next = {
      total: nodes.length,
      online: 0,
      offline: 0,
      attention: 0,
      withApps: 0,
    };
    for (const node of nodes) {
      if (node.online) next.online += 1;
      else next.offline += 1;
      if (
        !node.online ||
        node.health !== "healthy" ||
        node.dataStale ||
        overrides.staleNodeData
      ) {
        next.attention += 1;
      }
      if (node.installedAppIds.length > 0) next.withApps += 1;
    }
    return next;
  }, [nodes, overrides.staleNodeData]);

  const filteredNodes = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return nodes
      .filter((node) => {
        if (normalized) {
          const haystack =
            `${node.name} ${node.type} ${node.region} ${node.architecture}`.toLowerCase();
          if (!haystack.includes(normalized)) return false;
        }
        switch (filter) {
          case "online":
            return node.online;
          case "offline":
            return !node.online;
          case "attention":
            return (
              !node.online ||
              node.health !== "healthy" ||
              node.dataStale ||
              overrides.staleNodeData
            );
          case "with-apps":
            return node.installedAppIds.length > 0;
          default:
            return true;
        }
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [nodes, query, filter, overrides.staleNodeData]);

  const pagination = useMemo(
    () => paginateItems(filteredNodes, page),
    [filteredNodes, page],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
          My Nodes
        </h1>
        <p className="max-w-3xl text-base text-text-secondary">
          View fleet health, resources, and installed apps for each node.
        </p>
      </div>

      <SystemStatusBanners overrides={overrides} context="management" />

      {nodes.length === 0 ? (
        <StatePanel
          tone="empty"
          title="No nodes in this fleet"
          description="This account does not own any nodes yet. Swap to another fleet in the Prototype debugger, or browse the marketplace once you have nodes."
          actionLabel="Browse marketplace"
          actionTo="/marketplace"
        />
      ) : (
        <>
          <section className="border border-border-primary bg-background-secondary p-4">
            <p className="text-sm text-text-primary">
              Fleet: {nodeFleetId.replace(/-/g, " ")} · {counts.total} node
              {counts.total === 1 ? "" : "s"} · {counts.online} online ·{" "}
              {counts.offline} offline · {counts.withApps} with apps
            </p>
            <div
              className="mt-3 flex flex-wrap gap-2"
              role="radiogroup"
              aria-label="Filter nodes"
            >
              {(
                [
                  ["all", `All (${counts.total})`],
                  ["online", `Online (${counts.online})`],
                  ["offline", `Offline (${counts.offline})`],
                  ["attention", `Needs attention (${counts.attention})`],
                  ["with-apps", `With apps (${counts.withApps})`],
                ] as const
              ).map(([value, label]) => (
                <Button
                  key={value}
                  type="button"
                  size="sm"
                  className="touch-target"
                  variant={filter === value ? "primary" : "secondary"}
                  role="radio"
                  aria-checked={filter === value}
                  onClick={() => {
                    setFilter(value);
                    setPage(1);
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>
          </section>

          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_12rem]">
            <div>
              <Label htmlFor="nodes-search">Search nodes</Label>
              <Input
                id="nodes-search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Search by name, type, or region"
                icon={<SearchIcon pack="basic" size="sm" aria-hidden="true" />}
              />
            </div>
            <div>
              <Label htmlFor="nodes-sort-label">Showing</Label>
              <Select
                value={filter}
                onValueChange={(value) => {
                  setFilter(value as NodeFilter);
                  setPage(1);
                }}
              >
                <SelectTrigger id="nodes-sort-label">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All nodes</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="attention">Needs attention</SelectItem>
                  <SelectItem value="with-apps">With apps</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {pagination.total === 0 ? (
            <StatePanel
              tone="empty"
              title="No nodes match"
              description="Try clearing search or choosing a different filter."
              actionLabel="Clear filters"
              onAction={() => {
                setQuery("");
                setFilter("all");
                setPage(1);
              }}
            />
          ) : (
            <div className="flex flex-col gap-3">
              {pagination.pageItems.map((node) => (
                <NodeListRow
                  key={node.id}
                  node={node}
                  installedAppCount={node.installedAppIds.length}
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
          )}

          <Button asChild variant="secondary" size="sm" className="touch-target self-start">
            <Link to="/marketplace">Open marketplace</Link>
          </Button>
        </>
      )}
    </div>
  );
}
