import { useState } from "react";
import { firstInstallCoachSections } from "../../data/onboardingFlows";
import { ContextualTip } from "./ContextualTip";

type FirstInstallCoachProps = {
  stage: "scope" | "review";
};

export function FirstInstallCoach({ stage }: FirstInstallCoachProps) {
  const [expanded, setExpanded] = useState(false);
  const highlights =
    stage === "scope"
      ? firstInstallCoachSections.filter((section) =>
          ["compatibility", "resources", "scope", "queued"].includes(
            section.id,
          ),
        )
      : firstInstallCoachSections.filter((section) =>
          ["permissions", "rewards", "post-install"].includes(section.id),
        );

  const visible = expanded ? firstInstallCoachSections : highlights;

  return (
    <ContextualTip
      tipId="first-install-coach"
      title="First installation guide"
      actionLabel={expanded ? "Show step tips only" : "Show all tips"}
      onAction={() => setExpanded((value) => !value)}
    >
      <p className="text-text-primary">
        Inline coaching for this decision — not a mandatory carousel. Dismiss
        anytime; replay from Onboarding.
      </p>
      <ul className="mt-3 flex flex-col gap-2">
        {visible.map((section) => (
          <li
            key={section.id}
            className="border border-border-primary bg-background-primary px-3 py-2"
          >
            <p className="font-semibold text-text-primary">{section.title}</p>
            <p className="mt-1 text-text-secondary">{section.body}</p>
          </li>
        ))}
      </ul>
    </ContextualTip>
  );
}
