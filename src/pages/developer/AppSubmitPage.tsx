import { Badge, Button, Checkbox } from "@relume_io/relume-ui";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { EDITOR_STEPS } from "../../types/developer";
import { StatePanel } from "../../components/shared/StatePanel";
import { usePrototypeStore } from "../../store/prototypeStore";
import { createAtlasDeveloperApp } from "../../data/developerApps";

export function AppSubmitPage() {
  const { appId = "" } = useParams();
  const app = usePrototypeStore((state) =>
    state.developerPortal.apps.find((item) => item.id === appId),
  );
  const developer = usePrototypeStore((state) =>
    state.developerPortal.developers.find(
      (item) => item.id === state.developerPortal.activeDeveloperId,
    ),
  );
  const updateDeveloperApp = usePrototypeStore(
    (state) => state.updateDeveloperApp,
  );
  const showToast = usePrototypeStore((state) => state.showToast);
  const [accepted, setAccepted] = useState(false);

  if (!app) {
    return (
      <StatePanel
        tone="empty"
        title="App not found"
        description="Create or open an app first."
        actionLabel="My Apps"
        actionTo="/developer/apps"
      />
    );
  }

  const blocking = EDITOR_STEPS.filter(
    (step) => app.completionByStep[step.id] === "blocking",
  );
  const warnings = EDITOR_STEPS.filter(
    (step) => app.completionByStep[step.id] === "warning",
  );
  const canSubmit =
    blocking.length === 0 &&
    accepted &&
    !!developer?.canSubmitApps &&
    developer.verificationStatus === "approved";

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
          Submission readiness
        </h1>
        <p className="mt-2 text-base text-text-secondary">
          Submit remains disabled while blocking issues exist or verification is
          incomplete.
        </p>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="border border-border-primary bg-background-primary p-4">
          <p className="text-sm text-text-secondary">Complete</p>
          <p className="text-2xl font-bold text-text-primary">
            {
              EDITOR_STEPS.filter(
                (step) => app.completionByStep[step.id] === "complete",
              ).length
            }
          </p>
        </div>
        <div className="border border-border-primary bg-background-primary p-4">
          <p className="text-sm text-text-secondary">Warnings</p>
          <p className="text-2xl font-bold text-text-primary">{warnings.length}</p>
        </div>
        <div className="border border-border-primary bg-background-primary p-4">
          <p className="text-sm text-text-secondary">Blocking</p>
          <p className="text-2xl font-bold text-text-primary">{blocking.length}</p>
        </div>
      </section>

      <section className="border border-border-primary bg-background-primary p-4">
        <h2 className="text-base font-semibold text-text-primary">Checklist</h2>
        <ul className="mt-3 flex flex-col gap-2">
          {EDITOR_STEPS.map((step) => (
            <li
              key={step.id}
              className="flex flex-wrap items-center justify-between gap-2 border border-border-primary px-3 py-2"
            >
              <span className="text-sm text-text-primary">{step.label}</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{app.completionByStep[step.id]}</Badge>
                <Button asChild size="sm" variant="secondary">
                  <Link
                    to={`/developer/apps/${app.id}/${
                      step.id === "basics"
                        ? "edit"
                        : step.id === "support"
                          ? "settings"
                          : step.id === "submit"
                            ? "submit"
                            : step.id
                    }`}
                  >
                    Fix
                  </Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="border border-border-primary bg-background-secondary p-4">
        <label className="flex items-start gap-3 text-sm text-text-primary">
          <Checkbox
            checked={accepted}
            onCheckedChange={(value) => setAccepted(value === true)}
          />
          <span>
            I confirm marketplace policies for version {app.build.version} and
            understand changes create a new draft after publication.
          </span>
        </label>
        {!developer?.canSubmitApps ? (
          <p className="mt-3 text-sm text-text-secondary">
            Current persona cannot submit. Complete verification or switch
            persona in the debugger.
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant="primary"
            disabled={!canSubmit}
            onClick={() => {
              // Move into changes-requested vertical slice for demo continuity
              const next = createAtlasDeveloperApp("changes-requested");
              updateDeveloperApp(app.id, {
                ...next,
                id: app.id,
                organizationId: app.organizationId,
              });
              showToast("Submitted for review (prototype → changes requested)");
            }}
          >
            Submit version {app.build.version} for review
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link to={`/developer/apps/${app.id}/preview`}>Preview first</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
