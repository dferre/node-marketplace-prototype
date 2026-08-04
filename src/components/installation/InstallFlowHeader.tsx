import { Button } from "@relume_io/relume-ui";
import { Link } from "react-router-dom";
import type { MarketplaceApp } from "../../types/prototype";

type InstallFlowHeaderProps = {
  app: MarketplaceApp;
  step: "select" | "review" | "progress" | "results";
  selectedCount: number;
};

const STEPS = [
  { id: "select", label: "Select nodes" },
  { id: "review", label: "Review" },
  { id: "progress", label: "Progress" },
  { id: "results", label: "Results" },
] as const;

export function InstallFlowHeader({
  app,
  step,
  selectedCount,
}: InstallFlowHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border border-border-primary bg-background-primary p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-text-secondary">Install on nodes</p>
          <h1 className="text-2xl font-bold text-text-primary">{app.name}</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Scope must stay explicit. Current selection: {selectedCount} node
            {selectedCount === 1 ? "" : "s"}.
          </p>
        </div>
        <Button asChild variant="secondary" size="sm">
          <Link to={`/marketplace/apps/${app.id}`}>Back to app</Link>
        </Button>
      </div>

      <ol className="grid gap-2 md:grid-cols-4">
        {STEPS.map((item, index) => {
          const activeIndex = STEPS.findIndex((stepItem) => stepItem.id === step);
          const state =
            index < activeIndex
              ? "complete"
              : index === activeIndex
                ? "current"
                : "upcoming";
          return (
            <li
              key={item.id}
              className={`border border-border-primary px-3 py-2 text-sm ${
                state === "current" ? "bg-background-secondary font-semibold" : ""
              }`}
            >
              <span className="text-text-secondary">{index + 1}. </span>
              <span className="text-text-primary">{item.label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
