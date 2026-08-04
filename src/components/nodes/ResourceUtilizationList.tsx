import type { ChartMetric, ResourceUtilization } from "../../utils/nodeTelemetry";

type ResourceUtilizationListProps = {
  resources: ResourceUtilization[];
  selectedMetric: ChartMetric;
  onSelectMetric: (metric: ChartMetric) => void;
};

export function ResourceUtilizationList({
  resources,
  selectedMetric,
  onSelectMetric,
}: ResourceUtilizationListProps) {
  return (
    <ul className="flex flex-col gap-3">
      {resources.map((resource) => {
        const selected = resource.id === selectedMetric;
        return (
          <li key={resource.id}>
            <button
              type="button"
              onClick={() => onSelectMetric(resource.id)}
              aria-pressed={selected}
              className={`w-full border border-border-primary p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary focus-visible:ring-offset-2 ${
                selected
                  ? "bg-background-secondary"
                  : "bg-background-primary hover:bg-background-secondary"
              }`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm font-semibold text-text-primary">
                  {resource.label}
                </span>
                <span className="text-sm text-text-primary">
                  {resource.percent}%
                </span>
              </div>
              <div
                className="mt-2 h-3 border border-border-primary bg-background-primary"
                role="meter"
                aria-label={`${resource.label} utilization`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={resource.percent}
              >
                <div
                  className="h-full bg-background-alternative"
                  style={{ width: `${resource.percent}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-text-secondary">
                {resource.usedLabel} · {resource.capacityLabel}
              </p>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
