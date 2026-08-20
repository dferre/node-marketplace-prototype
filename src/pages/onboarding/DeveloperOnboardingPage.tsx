import { Badge } from "@relume_io/relume-ui";
import { Button } from "../../components/ui/Button";
import { Link } from "react-router-dom";
import { developerOnboardingOutline } from "../../data/onboardingFlows";
import { usePrototypeStore } from "../../store/prototypeStore";

export function DeveloperOnboardingPage() {
  const completeOnboardingFlow = usePrototypeStore(
    (state) => state.completeOnboardingFlow,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
          Developer onboarding
        </h1>
        <Badge variant="secondary">Later</Badge>
      </div>
      <p className="max-w-3xl text-base text-text-secondary">
        Full developer registration, verification, packaging, and review are out
        of scope for this operator marketplace prototype. This stub captures the
        intended sequence for a later surface.
      </p>

      <section className="border border-border-primary bg-background-primary p-4">
        <h2 className="text-base font-semibold text-text-primary">
          Planned sequence
        </h2>
        <ol className="mt-3 flex flex-col gap-2">
          {developerOnboardingOutline.map((item, index) => (
            <li
              key={item}
              className="flex items-start gap-3 border border-border-primary px-3 py-2"
            >
              <span className="text-sm font-semibold text-text-primary">
                {index + 1}.
              </span>
              <span className="text-sm text-text-primary">{item}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="flex flex-wrap gap-2">
        <Button asChild size="sm" variant="secondary">
          <Link to="/onboarding">Back to onboarding hub</Link>
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => completeOnboardingFlow("developer")}
        >
          Mark stub reviewed
        </Button>
      </div>
    </div>
  );
}
