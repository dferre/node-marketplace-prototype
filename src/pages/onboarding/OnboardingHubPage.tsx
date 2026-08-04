import { Badge, Button } from "@relume_io/relume-ui";
import { Link } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import {
  developerOnboardingOutline,
  onboardingFlows,
} from "../../data/onboardingFlows";
import { usePrototypeStore } from "../../store/prototypeStore";

export function OnboardingHubPage() {
  const {
    completedFlows,
    dismissedTips,
    resetOnboarding,
    restoreOnboardingTip,
  } = usePrototypeStore(
    useShallow((state) => ({
      completedFlows: state.onboarding.completedFlows,
      dismissedTips: state.onboarding.dismissedTips,
      resetOnboarding: state.resetOnboarding,
      restoreOnboardingTip: state.restoreOnboardingTip,
    })),
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-3xl">
          <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
            Onboarding
          </h1>
          <p className="mt-2 text-base text-text-secondary">
            Skippable operator paths for this prototype. Get to a connected node
            and a clear first install — not a long mandatory tour.
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => resetOnboarding()}
        >
          Reset onboarding progress
        </Button>
      </div>

      <section className="grid gap-3 lg:grid-cols-3">
        {onboardingFlows.map((flow) => {
          const done = completedFlows.includes(flow.id);
          return (
            <article
              key={flow.id}
              className="flex flex-col border border-border-primary bg-background-primary p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-text-primary">
                  {flow.title}
                </h2>
                {done ? <Badge variant="outline">Completed</Badge> : null}
              </div>
              <p className="mt-2 flex-1 text-sm text-text-secondary">
                {flow.description}
              </p>
              <p className="mt-3 text-sm text-text-primary">
                ~{flow.estimatedMinutes} min · {flow.steps.length} steps
              </p>
              <p className="mt-1 text-sm text-text-secondary">Aha: {flow.aha}</p>
              <Button
                asChild
                size="sm"
                variant="primary"
                className="mt-4 self-start"
              >
                <Link to={`/onboarding/${flow.id}`}>
                  {done ? "Replay" : "Start"}
                </Link>
              </Button>
            </article>
          );
        })}
      </section>

      <section className="grid gap-3 lg:grid-cols-2">
        <article className="border border-border-primary bg-background-primary p-4">
          <h2 className="text-lg font-semibold text-text-primary">
            Marketplace education
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Lightweight and contextual on Marketplace — not a forced carousel.
            {dismissedTips.includes("marketplace-basics")
              ? " Currently dismissed."
              : " Visible until dismissed."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="secondary">
              <Link to="/marketplace">Open marketplace</Link>
            </Button>
            {dismissedTips.includes("marketplace-basics") ? (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => restoreOnboardingTip("marketplace-basics")}
              >
                Restore tip
              </Button>
            ) : null}
          </div>
        </article>

        <article className="border border-border-primary bg-background-primary p-4">
          <h2 className="text-lg font-semibold text-text-primary">
            First app installation
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Inline coach on install scope and review covers compatibility,
            resources, permissions, scope, offline queueing, rewards caveats,
            and post-install setup.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="secondary">
              <Link to="/marketplace/apps/app_atlas_storage/install">
                Open sample install
              </Link>
            </Button>
            {dismissedTips.includes("first-install-coach") ? (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => restoreOnboardingTip("first-install-coach")}
              >
                Restore coach
              </Button>
            ) : null}
          </div>
        </article>
      </section>

      <section className="border border-border-primary bg-background-secondary p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              Developer onboarding
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-text-secondary">
              Later scope. Outline is available so stakeholders can review the
              intended path without a full wizard yet.
            </p>
          </div>
          <Badge variant="secondary">Later</Badge>
        </div>
        <ol className="mt-3 list-inside list-decimal text-sm text-text-primary">
          {developerOnboardingOutline.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
        <Button asChild size="sm" variant="secondary" className="mt-4">
          <Link to="/onboarding/developer">View developer stub</Link>
        </Button>
      </section>
    </div>
  );
}
