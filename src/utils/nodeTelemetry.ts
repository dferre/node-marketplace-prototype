import type { Node } from "../types/prototype";

export type ChartRange = "24h" | "7d" | "30d";
export type ChartMetric = "cpu" | "memory" | "bandwidth" | "storage";

export type TelemetryPoint = {
  label: string;
  value: number;
};

export type ResourceUtilization = {
  id: ChartMetric;
  label: string;
  usedLabel: string;
  capacityLabel: string;
  /** 0–100 utilization for meters/charts */
  percent: number;
};

export type NodeTelemetry = {
  uptimePercent: number;
  appsRunning: number;
  cpuPercent: number;
  memoryPercent: number;
  storagePercent: number;
  bandwidthPercent: number;
  rewardEstimateLabel: string;
  rewardEligible: boolean;
  resources: ResourceUtilization[];
  series: Record<ChartMetric, Record<ChartRange, TelemetryPoint[]>>;
};

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash || 1;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function seededUnit(seed: number, salt: number): number {
  const x = Math.sin(seed * 0.001 + salt * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function baseLoad(node: Node): number {
  if (!node.online) return 8;
  if (node.health === "unhealthy") return 82;
  if (node.health === "degraded") return 64;
  if (node.installedAppIds.length >= 3) return 58;
  if (node.installedAppIds.length >= 1) return 42;
  return 28;
}

function buildSeries(
  node: Node,
  metric: ChartMetric,
  range: ChartRange,
): TelemetryPoint[] {
  const seed = hashString(`${node.id}:${metric}:${range}`);
  const points =
    range === "24h" ? 12 : range === "7d" ? 7 : 10;
  const base = baseLoad(node);
  const metricBias =
    metric === "cpu"
      ? 0
      : metric === "memory"
        ? 6
        : metric === "bandwidth"
          ? -4
          : 10;
  const amplitude =
    node.health === "healthy" ? 14 : node.health === "degraded" ? 22 : 28;

  return Array.from({ length: points }, (_, index) => {
    const wave = Math.sin((index / points) * Math.PI * 2 + seed * 0.01);
    const noise = (seededUnit(seed, index + 1) - 0.5) * amplitude;
    const offlineDip = !node.online && index > points - 3 ? -40 : 0;
    const value = clamp(
      Math.round(base + metricBias + wave * (amplitude * 0.45) + noise + offlineDip),
      2,
      98,
    );
    const label =
      range === "24h"
        ? `${String((index * 2) % 24).padStart(2, "0")}:00`
        : range === "7d"
          ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index] ?? `D${index + 1}`
          : `W${index + 1}`;
    return { label, value };
  });
}

function utilizationFromCapacity(
  available: number,
  installedCount: number,
  health: Node["health"],
  online: boolean,
  floor = 0.25,
): number {
  if (!online) return Math.round(floor * 100);
  const pressure =
    health === "unhealthy" ? 0.85 : health === "degraded" ? 0.7 : 0.45;
  const appFactor = Math.min(0.35, installedCount * 0.12);
  const freeRatio = clamp(1 - (pressure + appFactor), 0.08, 0.92);
  // available fields are "available" capacity; invert into used% for dashboard meters
  void available;
  return Math.round((1 - freeRatio) * 100);
}

export function buildNodeTelemetry(
  node: Node,
  appsRunningOverride?: number,
): NodeTelemetry {
  const appsRunning = appsRunningOverride ?? node.installedAppIds.length;
  const cpuPercent = utilizationFromCapacity(
    node.cpuCoresAvailable,
    appsRunning,
    node.health,
    node.online,
    0.12,
  );
  const memoryPercent = utilizationFromCapacity(
    node.memoryGbAvailable,
    appsRunning,
    node.health,
    node.online,
    0.18,
  );
  const storagePercent = clamp(
    Math.round(
      (node.storageType === "hdd" ? 48 : 36) +
        appsRunning * 8 +
        (node.health === "degraded" ? 10 : 0),
    ),
    12,
    92,
  );
  const bandwidthPercent = clamp(
    Math.round(
      (node.meteredConnection ? 22 : 34) +
        appsRunning * 10 +
        (node.bandwidthMbps >= 1000 ? 8 : 0),
    ),
    8,
    90,
  );

  const cpuUsed = Math.max(
    0.5,
    Math.round((cpuPercent / 100) * node.cpuCoresAvailable * 10) / 10,
  );
  const memoryUsed = Math.max(
    0.5,
    Math.round((memoryPercent / 100) * node.memoryGbAvailable * 10) / 10,
  );
  const storageUsed = Math.round((storagePercent / 100) * node.storageGbAvailable);
  const bandwidthUsed = Math.round((bandwidthPercent / 100) * node.bandwidthMbps);

  const rewardEligible = node.online && node.rewardWalletConnected;
  const rewardEstimateLabel = !node.rewardWalletConnected
    ? "Connect wallet to estimate"
    : !node.online
      ? "Paused while offline"
      : appsRunning === 0
        ? "No earning apps yet"
        : `~$${Math.max(2, appsRunning * 4 + (node.type === "enterprise" ? 6 : 2))}/day est.`;

  const ranges: ChartRange[] = ["24h", "7d", "30d"];
  const metrics: ChartMetric[] = ["cpu", "memory", "bandwidth", "storage"];
  const series = Object.fromEntries(
    metrics.map((metric) => [
      metric,
      Object.fromEntries(
        ranges.map((range) => [range, buildSeries(node, metric, range)]),
      ),
    ]),
  ) as NodeTelemetry["series"];

  // Align current series endpoints with live utilization for coherence.
  for (const metric of metrics) {
    const live =
      metric === "cpu"
        ? cpuPercent
        : metric === "memory"
          ? memoryPercent
          : metric === "bandwidth"
            ? bandwidthPercent
            : storagePercent;
    for (const range of ranges) {
      const points = series[metric][range];
      if (points.length > 0) {
        points[points.length - 1] = {
          ...points[points.length - 1],
          value: live,
        };
      }
    }
  }

  return {
    uptimePercent: !node.online
      ? 0
      : node.health === "healthy"
        ? 99.2
        : node.health === "degraded"
          ? 97.4
          : 91.8,
    appsRunning,
    cpuPercent,
    memoryPercent,
    storagePercent,
    bandwidthPercent,
    rewardEstimateLabel,
    rewardEligible,
    resources: [
      {
        id: "cpu",
        label: "CPU",
        usedLabel: `${cpuUsed} cores in use`,
        capacityLabel: `${node.cpuCoresAvailable} cores available`,
        percent: cpuPercent,
      },
      {
        id: "memory",
        label: "Memory",
        usedLabel: `${memoryUsed} GB in use`,
        capacityLabel: `${node.memoryGbAvailable} GB available`,
        percent: memoryPercent,
      },
      {
        id: "storage",
        label: "Storage",
        usedLabel: `${storageUsed} GB used`,
        capacityLabel: `${node.storageGbAvailable} GB ${node.storageType.toUpperCase()}`,
        percent: storagePercent,
      },
      {
        id: "bandwidth",
        label: "Bandwidth",
        usedLabel: `${bandwidthUsed} Mbps peak`,
        capacityLabel: `${node.bandwidthMbps} Mbps${
          node.meteredConnection ? " · Metered" : ""
        }`,
        percent: bandwidthPercent,
      },
    ],
    series,
  };
}

export function averageSeries(points: TelemetryPoint[]): number {
  if (points.length === 0) return 0;
  return Math.round(
    points.reduce((sum, point) => sum + point.value, 0) / points.length,
  );
}
