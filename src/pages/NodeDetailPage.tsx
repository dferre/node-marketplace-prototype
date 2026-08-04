import {
  Badge,
  Button,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@relume_io/relume-ui";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { usePageChrome } from "../app/pageChrome";
import { ResourceUtilizationList } from "../components/nodes/ResourceUtilizationList";
import { WireframeLineChart } from "../components/nodes/WireframeLineChart";
import { StatePanel } from "../components/shared/StatePanel";
import { SystemStatusBanners } from "../components/shared/SystemStatusBanners";
import { navigationIcons } from "../icons/iconMap";
import { usePrototypeStore } from "../store/prototypeStore";
import {
  buildNodeActivityFeed,
  filterNodeActivity,
  type NodeActivityFilter,
} from "../utils/activityFeed";
import { formatInstanceStatus } from "../utils/installedApps";
import {
  averageSeries,
  buildNodeTelemetry,
  type ChartMetric,
  type ChartRange,
} from "../utils/nodeTelemetry";

const rangeLabels: Record<ChartRange, string> = {
  "24h": "24 hours",
  "7d": "7 days",
  "30d": "30 days",
};

const metricLabels: Record<ChartMetric, string> = {
  cpu: "CPU utilization",
  memory: "Memory utilization",
  bandwidth: "Bandwidth utilization",
  storage: "Storage utilization",
};

export function NodeDetailPage() {
  const { nodeId = "" } = useParams();
  const ServerIcon = navigationIcons.nodes;
  const [range, setRange] = useState<ChartRange>("24h");
  const [metric, setMetric] = useState<ChartMetric>("cpu");
  const [activityFilter, setActivityFilter] =
    useState<NodeActivityFilter>("all");
  const [activeTab, setActiveTab] = useState("overview");

  const { nodes, apps, deployments, installation, activeAppId, overrides, showToast } =
    usePrototypeStore(
      useShallow((state) => ({
        nodes: state.nodes,
        apps: state.apps,
        deployments: state.deployments,
        installation: state.installation,
        activeAppId: state.activeAppId,
        overrides: state.overrides,
        showToast: state.showToast,
      })),
    );

  const node = nodes.find((item) => item.id === nodeId);

  const installed = useMemo(() => {
    if (!node) return [];
    return node.installedAppIds.map((appId) => {
      const app = apps.find((item) => item.id === appId);
      const deployment = deployments.find((item) => item.appId === appId);
      const instance = deployment?.instances.find(
        (item) => item.nodeId === node.id,
      );
      return { app, deployment, instance };
    });
  }, [node, apps, deployments]);

  const runningCount = useMemo(
    () =>
      installed.filter(({ instance }) => instance?.status === "running").length ||
      installed.length,
    [installed],
  );

  const telemetry = useMemo(
    () => (node ? buildNodeTelemetry(node, runningCount) : null),
    [node, runningCount],
  );

  const activityRows = useMemo(() => {
    if (!node) return [];
    return filterNodeActivity(
      buildNodeActivityFeed({
        node,
        apps,
        deployments,
        installation,
        activeAppId,
      }),
      activityFilter,
    );
  }, [node, apps, deployments, installation, activeAppId, activityFilter]);

  usePageChrome(
    node
      ? {
          backTo: "/nodes",
          backLabel: "Back to My Nodes",
          actions: [
            {
              id: "install",
              label: "Install app",
              to: "/marketplace",
              variant: "primary",
            },
            {
              id: "recheck",
              label: "Recheck health",
              variant: "secondary",
              disabled: !node.online,
              onClick: () =>
                showToast(
                  node.online
                    ? `Recheck queued for ${node.name} (prototype).`
                    : `${node.name} is offline — recheck unavailable.`,
                ),
            },
          ],
        }
      : {
          backTo: "/nodes",
          backLabel: "Back to My Nodes",
          actions: [],
        },
    [node?.id, node?.name, node?.online, showToast],
  );

  if (!node || !telemetry) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-text-primary">Node not found</h1>
        <StatePanel
          tone="empty"
          title="No matching node"
          description="This node is not in the current fleet. Swap fleets in the Prototype debugger or return to My Nodes."
          actionLabel="Back to My Nodes"
          actionTo="/nodes"
        />
      </div>
    );
  }

  const healthBadge = !node.online
    ? "Offline"
    : node.dataStale || overrides.staleNodeData
      ? "Stale data"
      : node.health === "healthy"
        ? "Healthy"
        : node.health === "degraded"
          ? "Degraded"
          : "Needs attention";

  const chartPoints = telemetry.series[metric][range];
  const chartAverage = averageSeries(chartPoints);
  const stale = node.dataStale || overrides.staleNodeData;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className="flex size-12 shrink-0 items-center justify-center border border-border-primary bg-background-secondary"
            aria-hidden="true"
          >
            <ServerIcon pack="basic" size="sm" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
                {node.name}
              </h1>
              <Badge variant="outline">{healthBadge}</Badge>
              <Badge variant="secondary" className="capitalize">
                {node.type}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-text-secondary">
              {node.region} · {node.architecture} · software v
              {node.softwareVersion}
              {node.lastSeenAt ? ` · Last seen ${node.lastSeenAt}` : ""}
            </p>
          </div>
        </div>
      </div>

      <SystemStatusBanners overrides={overrides} context="management" />

      {!node.online ? (
        <StatePanel
          tone="warning"
          title="Node offline"
          description={`This node is offline${
            node.offlineSinceHours != null
              ? ` for about ${node.offlineSinceHours} hours`
              : ""
          }. Charts freeze on last known samples; installations can be queued and rechecked when it reconnects.`}
        />
      ) : null}

      {stale ? (
        <StatePanel
          tone="info"
          title="Telemetry may be stale"
          description="Resource charts and meters are simulated for the prototype and marked stale by the current scenario override or node flag."
        />
      ) : null}

      <section
        aria-label="Node summary stats"
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        <div className="border border-border-primary bg-background-primary p-4">
          <p className="text-sm text-text-secondary">Uptime</p>
          <p className="mt-1 text-2xl font-bold text-text-primary">
            {telemetry.uptimePercent}%
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            {node.online ? "Online now" : "Currently offline"}
          </p>
        </div>
        <div className="border border-border-primary bg-background-primary p-4">
          <p className="text-sm text-text-secondary">Apps on node</p>
          <p className="mt-1 text-2xl font-bold text-text-primary">
            {installed.length}
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            {runningCount} running / tracked
          </p>
        </div>
        <button
          type="button"
          className="border border-border-primary bg-background-primary p-4 text-left transition-colors hover:bg-background-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary focus-visible:ring-offset-2"
          onClick={() => {
            setMetric("cpu");
            setActiveTab("resources");
          }}
        >
          <p className="text-sm text-text-secondary">CPU load</p>
          <p className="mt-1 text-2xl font-bold text-text-primary">
            {telemetry.cpuPercent}%
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            Open resources · {node.cpuCoresAvailable} cores available
          </p>
        </button>
        <button
          type="button"
          className="border border-border-primary bg-background-primary p-4 text-left transition-colors hover:bg-background-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary focus-visible:ring-offset-2"
          onClick={() => setActiveTab("overview")}
        >
          <p className="text-sm text-text-secondary">Rewards estimate</p>
          <p className="mt-1 text-lg font-bold text-text-primary">
            {telemetry.rewardEstimateLabel}
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            {telemetry.rewardEligible
              ? "Eligibility only — not a guarantee"
              : "Wallet or connectivity blocks earning"}
          </p>
        </button>
      </section>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col gap-4"
      >
        <TabsList className="flex h-auto flex-wrap justify-start gap-2 border border-border-primary bg-background-secondary p-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="apps">
            Apps ({installed.length})
          </TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Chart range">
              {(Object.keys(rangeLabels) as ChartRange[]).map((value) => (
                <Button
                  key={value}
                  type="button"
                  size="sm"
                  variant={range === value ? "primary" : "secondary"}
                  onClick={() => setRange(value)}
                >
                  {rangeLabels[value]}
                </Button>
              ))}
            </div>
            <div className="w-full max-w-xs">
              <Select
                value={metric}
                onValueChange={(value) => setMetric(value as ChartMetric)}
              >
                <SelectTrigger aria-label="Chart metric">
                  <SelectValue placeholder="Metric" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(metricLabels) as ChartMetric[]).map((value) => (
                    <SelectItem key={value} value={value}>
                      {metricLabels[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.8fr)]">
            <WireframeLineChart
              title={`${metricLabels[metric]} · ${rangeLabels[range]}`}
              points={chartPoints}
              averageLabel={`Avg ${chartAverage}% · live ${
                telemetry.resources.find((item) => item.id === metric)?.percent ??
                0
              }%`}
            />
            <section className="border border-border-primary bg-background-primary p-4">
              <h2 className="text-base font-semibold text-text-primary">
                Quick facts
              </h2>
              <dl className="mt-3 grid gap-3">
                <div>
                  <dt className="text-sm text-text-secondary">GPU</dt>
                  <dd className="text-sm text-text-primary">
                    {node.hasGpu
                      ? node.gpuSupported
                        ? "Available"
                        : "Present, unsupported"
                      : "None"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-text-secondary">Network</dt>
                  <dd className="text-sm text-text-primary">
                    {node.publicIp ? "Public IP" : "No public IP"}
                    {node.regionRestricted ? " · Region restricted" : ""}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-text-secondary">Storage class</dt>
                  <dd className="text-sm text-text-primary">
                    {node.storageGbAvailable} GB {node.storageType.toUpperCase()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-text-secondary">Reward wallet</dt>
                  <dd className="text-sm text-text-primary">
                    {node.rewardWalletConnected ? "Connected" : "Not connected"}
                  </dd>
                </div>
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button asChild size="sm" variant="secondary">
                  <Link to="/rewards">View rewards</Link>
                </Button>
                <Button asChild size="sm" variant="secondary">
                  <Link to="/activity">Fleet activity</Link>
                </Button>
              </div>
            </section>
          </div>

          <section className="border border-border-primary bg-background-primary p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-text-primary">
                Recent activity
              </h2>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => setActiveTab("activity")}
              >
                Open activity table
              </Button>
            </div>
            <ul className="mt-3 flex flex-col gap-2">
              {activityRows.slice(0, 3).map((row) => (
                <li
                  key={row.id}
                  className="flex flex-wrap items-start justify-between gap-2 border border-border-primary px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {row.title}
                    </p>
                    <p className="text-sm text-text-secondary">{row.detail}</p>
                  </div>
                  <span className="text-sm text-text-secondary">
                    {row.timestampLabel}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </TabsContent>

        <TabsContent value="resources" className="mt-0 flex flex-col gap-4">
          <p className="text-sm text-text-secondary">
            Select a resource to focus the chart. Values are prototype
            simulations derived from this node’s capacity, health, and installed
            apps—not live agent metrics.
          </p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Chart range">
            {(Object.keys(rangeLabels) as ChartRange[]).map((value) => (
              <Button
                key={value}
                type="button"
                size="sm"
                variant={range === value ? "primary" : "secondary"}
                onClick={() => setRange(value)}
              >
                {rangeLabels[value]}
              </Button>
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-[minmax(16rem,0.9fr)_minmax(0,1.3fr)]">
            <ResourceUtilizationList
              resources={telemetry.resources}
              selectedMetric={metric}
              onSelectMetric={setMetric}
            />
            <WireframeLineChart
              title={`${metricLabels[metric]} · ${rangeLabels[range]}`}
              points={chartPoints}
              averageLabel={`Avg ${chartAverage}%`}
            />
          </div>
        </TabsContent>

        <TabsContent value="apps" className="mt-0 flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-semibold text-text-primary">
              Installed apps
            </h2>
            <Button asChild variant="secondary" size="sm">
              <Link to="/marketplace">Install from marketplace</Link>
            </Button>
          </div>

          {installed.length === 0 ? (
            <StatePanel
              tone="empty"
              title="No apps installed on this node"
              description="Browse the marketplace to find compatible apps for this node."
              actionLabel="Browse marketplace"
              actionTo="/marketplace"
            />
          ) : (
            <div className="overflow-x-auto border border-border-primary">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>App</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {installed.map(({ app, instance }) => {
                    if (!app) return null;
                    return (
                      <TableRow key={app.id}>
                        <TableCell className="font-semibold">
                          {app.name}
                        </TableCell>
                        <TableCell>
                          {instance ? `v${instance.version}` : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              instance?.status === "unhealthy" ||
                              instance?.status === "setup-required"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {instance
                              ? formatInstanceStatus(instance.status)
                              : "Installed"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-wrap justify-end gap-2">
                            <Button asChild size="sm" variant="secondary">
                              <Link to={`/installed/${app.id}/nodes/${node.id}`}>
                                Node install
                              </Link>
                            </Button>
                            <Button asChild size="sm" variant="secondary">
                              <Link to={`/installed/${app.id}`}>Manage</Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="activity" className="mt-0 flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-text-primary">
              Node activity
            </h2>
            <div className="w-full max-w-xs">
              <Select
                value={activityFilter}
                onValueChange={(value) =>
                  setActivityFilter(value as NodeActivityFilter)
                }
              >
                <SelectTrigger aria-label="Filter activity">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All events</SelectItem>
                  <SelectItem value="installs">Installs & apps</SelectItem>
                  <SelectItem value="health">Health & network</SelectItem>
                  <SelectItem value="rewards">Rewards</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {activityRows.length === 0 ? (
            <StatePanel
              tone="empty"
              title="No events for this filter"
              description="Try another filter or install an app to generate install events on this node."
              actionLabel="Clear filter"
              onAction={() => setActivityFilter("all")}
            />
          ) : (
            <div className="overflow-x-auto border border-border-primary">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>When</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Detail</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Open</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="whitespace-nowrap text-text-secondary">
                        {row.timestampLabel}
                      </TableCell>
                      <TableCell className="font-semibold">{row.title}</TableCell>
                      <TableCell className="text-text-secondary">
                        {row.detail}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            row.tone === "warning" ? "secondary" : "outline"
                          }
                        >
                          {row.tone === "success"
                            ? "OK"
                            : row.tone === "warning"
                              ? "Attention"
                              : "Info"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {row.href ? (
                          <Button asChild size="sm" variant="secondary">
                            <Link to={row.href}>Open</Link>
                          </Button>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
