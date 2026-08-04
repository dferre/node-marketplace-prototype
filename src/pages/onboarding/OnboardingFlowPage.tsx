import { useMemo } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { OnboardingWizard } from "../../components/onboarding/OnboardingWizard";
import { StatePanel } from "../../components/shared/StatePanel";
import { getOnboardingFlow } from "../../data/onboardingFlows";

export function OnboardingFlowStartPage() {
  const { flowId = "" } = useParams();
  const flow = getOnboardingFlow(flowId);
  const first = flow?.steps[0];
  if (!flow || !first) {
    return (
      <StatePanel
        tone="empty"
        title="Unknown onboarding flow"
        description="Choose a flow from the onboarding hub."
        actionLabel="Back to onboarding"
        actionTo="/onboarding"
      />
    );
  }
  return <Navigate to={`/onboarding/${flow.id}/${first.id}`} replace />;
}

export function OnboardingFlowPage() {
  const { flowId = "", stepId } = useParams();
  const navigate = useNavigate();
  const flow = getOnboardingFlow(flowId);

  const stepIndex = useMemo(() => {
    if (!flow) return 0;
    if (!stepId) return 0;
    const index = flow.steps.findIndex((step) => step.id === stepId);
    return index >= 0 ? index : 0;
  }, [flow, stepId]);

  if (!flow) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-text-primary">
          Onboarding not found
        </h1>
        <StatePanel
          tone="empty"
          title="Unknown onboarding flow"
          description="Choose a flow from the onboarding hub."
          actionLabel="Back to onboarding"
          actionTo="/onboarding"
        />
      </div>
    );
  }

  if (stepId && !flow.steps.some((step) => step.id === stepId)) {
    return <Navigate to={`/onboarding/${flow.id}/${flow.steps[0].id}`} replace />;
  }

  return (
    <OnboardingWizard
      flow={flow}
      stepIndex={stepIndex}
      onStepChange={(index) => {
        const step = flow.steps[index];
        if (!step) {
          navigate("/onboarding");
          return;
        }
        navigate(`/onboarding/${flow.id}/${step.id}`);
      }}
    />
  );
}
