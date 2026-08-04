import type { SelectionSummary } from "../../utils/installationSelection";

type SelectionSummaryBarProps = {
  summary: SelectionSummary;
};

export function SelectionSummaryBar({ summary }: SelectionSummaryBarProps) {
  return (
    <div
      className="sticky bottom-0 z-20 border border-border-primary bg-background-secondary p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] mb-20 md:mb-16"
      aria-live="polite"
    >
      <p className="text-sm font-semibold text-text-primary">
        {summary.selectedCount} node{summary.selectedCount === 1 ? "" : "s"}{" "}
        selected
      </p>
      <p className="text-sm text-text-secondary">
        {summary.ready} ready · {summary.warnings} warning · {summary.queued}{" "}
        queued
        {summary.incompatibleSelected > 0
          ? ` · ${summary.incompatibleSelected} needs attention`
          : ""}
      </p>
    </div>
  );
}
