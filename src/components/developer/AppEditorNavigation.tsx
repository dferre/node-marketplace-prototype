import { Badge, Button } from "@relume_io/relume-ui";
import { Link, useLocation } from "react-router-dom";
import { EDITOR_STEPS, type ChecklistItemStatus } from "../../types/developer";

type AppEditorNavigationProps = {
  appId: string;
  completionByStep: Record<string, ChecklistItemStatus>;
};

function statusLabel(status: ChecklistItemStatus): string {
  if (status === "complete") return "Complete";
  if (status === "warning") return "Warning";
  if (status === "blocking") return "Blocking";
  return "N/A";
}

export function AppEditorNavigation({
  appId,
  completionByStep,
}: AppEditorNavigationProps) {
  const { pathname } = useLocation();
  const base = `/developer/apps/${appId}`;

  const hrefForStep = (stepId: string) => {
    if (stepId === "basics") return `${base}/edit`;
    if (stepId === "listing") return `${base}/listing`;
    if (stepId === "media") return `${base}/media`;
    if (stepId === "build") return `${base}/build`;
    if (stepId === "compatibility") return `${base}/compatibility`;
    if (stepId === "permissions") return `${base}/permissions`;
    if (stepId === "rewards") return `${base}/rewards`;
    if (stepId === "support") return `${base}/settings`;
    if (stepId === "testing") return `${base}/testing`;
    if (stepId === "preview") return `${base}/preview`;
    return `${base}/submit`;
  };

  const completeCount = EDITOR_STEPS.filter(
    (step) => completionByStep[step.id] === "complete",
  ).length;
  const percent = Math.round((completeCount / EDITOR_STEPS.length) * 100);

  return (
    <aside className="border border-border-primary bg-background-primary p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-base font-semibold text-text-primary">
          App editor
        </h2>
        <p className="text-sm text-text-secondary">{percent}% complete</p>
      </div>
      <div
        className="mt-3 h-2 border border-border-primary bg-background-secondary"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-background-alternative"
          style={{ width: `${percent}%` }}
        />
      </div>
      <ul className="mt-4 flex flex-col gap-2">
        {EDITOR_STEPS.map((step) => {
          const href = hrefForStep(step.id);
          const active = pathname === href;
          const status = completionByStep[step.id] ?? "warning";
          return (
            <li key={step.id}>
              <Button
                asChild
                size="sm"
                variant={active ? "primary" : "secondary"}
                className="h-auto w-full justify-between gap-2 px-3 py-2"
              >
                <Link to={href}>
                  <span>{step.label}</span>
                  <Badge
                    variant={
                      status === "blocking" ? "secondary" : "outline"
                    }
                  >
                    {statusLabel(status)}
                  </Badge>
                </Link>
              </Button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
