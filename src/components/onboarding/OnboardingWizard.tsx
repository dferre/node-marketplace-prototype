import {
  Checkbox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@relume_io/relume-ui";
import { Button } from "../ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import type {
  OnboardingFlowDefinition,
  OnboardingStep,
} from "../../data/onboardingFlows";
import { usePrototypeStore } from "../../store/prototypeStore";
import type { OnboardingFlowId } from "../../types/prototype";

type OnboardingWizardProps = {
  flow: OnboardingFlowDefinition;
  stepIndex: number;
  onStepChange: (index: number) => void;
};

/** Stable fallback — `?? {}` in a Zustand selector recreates every snapshot and loops. */
const EMPTY_ANSWERS: Record<string, string> = {};

function isStepComplete(
  step: OnboardingStep,
  answers: Record<string, string>,
): boolean {
  if (!step.fields?.length) return true;
  return step.fields.every((field) => {
    if (!field.required) return true;
    const value = answers[field.id] ?? "";
    if (field.type === "checkbox") return value === "true";
    return value.trim().length > 0;
  });
}

export function OnboardingWizard({
  flow,
  stepIndex,
  onStepChange,
}: OnboardingWizardProps) {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const answers = usePrototypeStore(
    (state) => state.onboarding.answers[flow.id] ?? EMPTY_ANSWERS,
  );
  const setOnboardingAnswer = usePrototypeStore(
    (state) => state.setOnboardingAnswer,
  );
  const completeOnboardingFlow = usePrototypeStore(
    (state) => state.completeOnboardingFlow,
  );
  const showToast = usePrototypeStore((state) => state.showToast);

  const step = flow.steps[stepIndex];
  const isLast = stepIndex >= flow.steps.length - 1;
  const progressLabel = `Step ${stepIndex + 1} of ${flow.steps.length}`;

  const canContinue = useMemo(
    () => (step ? isStepComplete(step, answers) : false),
    [step, answers],
  );

  if (!step) {
    return (
      <p className="text-sm text-text-secondary">This onboarding step is missing.</p>
    );
  }

  const goNext = () => {
    if (!canContinue) {
      setError("Complete the required fields to continue.");
      return;
    }
    setError(null);
    if (isLast) {
      completeOnboardingFlow(flow.id as OnboardingFlowId);
      showToast(`${flow.title} onboarding complete`);
      if (!step.nextActions?.length) {
        navigate("/onboarding");
      }
      return;
    }
    onStepChange(stepIndex + 1);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3 border border-border-primary bg-background-secondary p-4">
        <div>
          <p className="text-sm text-text-secondary">{progressLabel}</p>
          <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
            {step.title}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-text-secondary">
            {step.summary}
          </p>
        </div>
        <Button asChild variant="secondary" size="sm">
          <Link to="/onboarding">Exit to hub</Link>
        </Button>
      </div>

      <div
        className="h-2 border border-border-primary bg-background-primary"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={flow.steps.length}
        aria-valuenow={stepIndex + 1}
        aria-label={progressLabel}
      >
        <div
          className="h-full bg-background-alternative"
          style={{
            width: `${((stepIndex + 1) / flow.steps.length) * 100}%`,
          }}
        />
      </div>

      <section className="border border-border-primary bg-background-primary p-4">
        {step.body?.length ? (
          <ul className="flex flex-col gap-2 text-sm text-text-primary">
            {step.body.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        ) : null}

        {step.fields?.length ? (
          <div className={`flex flex-col gap-4 ${step.body?.length ? "mt-4" : ""}`}>
            {step.fields.map((field) => {
              const value = answers[field.id] ?? "";
              if (field.type === "checkbox") {
                return (
                  <label
                    key={field.id}
                    className="flex items-start gap-3 text-sm text-text-primary"
                  >
                    <Checkbox
                      checked={value === "true"}
                      onCheckedChange={(checked) =>
                        setOnboardingAnswer(
                          flow.id,
                          field.id,
                          checked === true ? "true" : "false",
                        )
                      }
                    />
                    <span>
                      {field.label}
                      {field.required ? " *" : ""}
                    </span>
                  </label>
                );
              }

              if (field.type === "select") {
                return (
                  <div key={field.id} className="flex flex-col gap-2">
                    <Label htmlFor={`${flow.id}-${field.id}`}>
                      {field.label}
                      {field.required ? " *" : ""}
                    </Label>
                    <Select
                      value={value || undefined}
                      onValueChange={(next) =>
                        setOnboardingAnswer(flow.id, field.id, next)
                      }
                    >
                      <SelectTrigger id={`${flow.id}-${field.id}`}>
                        <SelectValue placeholder="Select…" />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              }

              if (field.type === "choice") {
                return (
                  <fieldset key={field.id} className="flex flex-col gap-2">
                    <legend className="text-sm font-semibold text-text-primary">
                      {field.label}
                      {field.required ? " *" : ""}
                    </legend>
                    <div className="flex flex-col gap-2">
                      {field.options?.map((option) => {
                        const selected = value === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            aria-pressed={selected}
                            onClick={() =>
                              setOnboardingAnswer(
                                flow.id,
                                field.id,
                                option.value,
                              )
                            }
                            className={`border border-border-primary p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary focus-visible:ring-offset-2 ${
                              selected
                                ? "bg-background-secondary"
                                : "bg-background-primary hover:bg-background-secondary"
                            }`}
                          >
                            <span className="block text-sm font-semibold text-text-primary">
                              {option.label}
                            </span>
                            {option.description ? (
                              <span className="mt-1 block text-sm text-text-secondary">
                                {option.description}
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                );
              }

              return (
                <div key={field.id} className="flex flex-col gap-2">
                  <Label htmlFor={`${flow.id}-${field.id}`}>
                    {field.label}
                    {field.required ? " *" : ""}
                  </Label>
                  <Input
                    id={`${flow.id}-${field.id}`}
                    type={
                      field.type === "password"
                        ? "password"
                        : field.type === "email"
                          ? "email"
                          : "text"
                    }
                    value={value}
                    placeholder={field.placeholder}
                    onChange={(event) =>
                      setOnboardingAnswer(
                        flow.id,
                        field.id,
                        event.target.value,
                      )
                    }
                  />
                  {field.help ? (
                    <p className="text-sm text-text-secondary">{field.help}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}

        {error ? (
          <p className="mt-4 text-sm text-text-error" role="alert">
            {error}
          </p>
        ) : null}
      </section>

      {isLast && step.nextActions?.length ? (
        <section className="border border-border-primary bg-background-primary p-4">
          <h2 className="text-base font-semibold text-text-primary">
            Choose next action
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {step.nextActions.map((action) => (
              <Button
                key={action.id}
                asChild
                size="sm"
                variant={action.primary ? "primary" : "secondary"}
              >
                <Link
                  to={action.to}
                  onClick={() =>
                    completeOnboardingFlow(flow.id as OnboardingFlowId)
                  }
                >
                  {action.label}
                </Link>
              </Button>
            ))}
          </div>
        </section>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={stepIndex === 0}
          onClick={() => {
            setError(null);
            onStepChange(Math.max(0, stepIndex - 1));
          }}
        >
          Back
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="secondary">
            <Link to="/">Skip for now</Link>
          </Button>
          {!(isLast && step.nextActions?.length) ? (
            <Button
              type="button"
              size="sm"
              variant="primary"
              onClick={goNext}
            >
              {isLast ? "Finish" : "Continue"}
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="primary"
              onClick={() => {
                if (!canContinue) {
                  setError("Complete the required fields to continue.");
                  return;
                }
                completeOnboardingFlow(flow.id as OnboardingFlowId);
                showToast(`${flow.title} onboarding complete`);
              }}
            >
              Mark complete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
