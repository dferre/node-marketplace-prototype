import type { TelemetryPoint } from "../../utils/nodeTelemetry";

type WireframeLineChartProps = {
  title: string;
  points: TelemetryPoint[];
  unitLabel?: string;
  averageLabel?: string;
};

export function WireframeLineChart({
  title,
  points,
  unitLabel = "%",
  averageLabel,
}: WireframeLineChartProps) {
  const width = 560;
  const height = 200;
  const padX = 36;
  const padY = 20;
  const plotW = width - padX * 2;
  const plotH = height - padY * 2;

  const maxY = 100;
  const coords = points.map((point, index) => {
    const x =
      points.length === 1
        ? padX + plotW / 2
        : padX + (index / (points.length - 1)) * plotW;
    const y = padY + (1 - point.value / maxY) * plotH;
    return { x, y, ...point };
  });

  const polyline = coords.map((c) => `${c.x},${c.y}`).join(" ");
  const area =
    coords.length > 0
      ? `${padX},${padY + plotH} ${polyline} ${padX + plotW},${padY + plotH}`
      : "";

  const yTicks = [0, 25, 50, 75, 100];
  const labelIndexes =
    points.length <= 7
      ? points.map((_, i) => i)
      : [0, Math.floor(points.length / 2), points.length - 1];

  return (
    <figure className="border border-border-primary bg-background-primary p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <figcaption className="text-base font-semibold text-text-primary">
          {title}
        </figcaption>
        {averageLabel ? (
          <p className="text-sm text-text-secondary">{averageLabel}</p>
        ) : null}
      </div>
      <div className="mt-3 overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height + 28}`}
          className="h-auto w-full min-w-[20rem] text-text-primary"
          role="img"
          aria-label={`${title} chart`}
        >
          {yTicks.map((tick) => {
            const y = padY + (1 - tick / maxY) * plotH;
            return (
              <g key={tick}>
                <line
                  x1={padX}
                  x2={padX + plotW}
                  y1={y}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity={0.15}
                />
                <text
                  x={padX - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-current"
                  fontSize="10"
                  opacity={0.7}
                >
                  {tick}
                  {unitLabel}
                </text>
              </g>
            );
          })}
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            points={polyline}
          />
          <polygon points={area} fill="currentColor" fillOpacity={0.06} />
          {coords.map((point) => (
            <circle
              key={`${point.label}-${point.value}`}
              cx={point.x}
              cy={point.y}
              r="3"
              fill="currentColor"
            />
          ))}
          {labelIndexes.map((index) => {
            const point = coords[index];
            if (!point) return null;
            return (
              <text
                key={`label-${point.label}`}
                x={point.x}
                y={height + 16}
                textAnchor="middle"
                className="fill-current"
                fontSize="10"
                opacity={0.7}
              >
                {point.label}
              </text>
            );
          })}
        </svg>
      </div>
    </figure>
  );
}
