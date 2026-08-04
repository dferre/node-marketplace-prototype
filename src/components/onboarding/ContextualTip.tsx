import { Button } from "@relume_io/relume-ui";
import type { ReactNode } from "react";
import type { OnboardingTipId } from "../../types/prototype";
import { usePrototypeStore } from "../../store/prototypeStore";

type ContextualTipProps = {
  tipId: OnboardingTipId;
  title: string;
  children: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
};

export function ContextualTip({
  tipId,
  title,
  children,
  actionLabel,
  onAction,
}: ContextualTipProps) {
  const dismissed = usePrototypeStore((state) =>
    state.onboarding.dismissedTips.includes(tipId),
  );
  const dismissOnboardingTip = usePrototypeStore(
    (state) => state.dismissOnboardingTip,
  );

  if (dismissed) return null;

  return (
    <aside className="border border-border-primary bg-background-secondary p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-text-primary">{title}</h2>
          <div className="mt-2 text-sm text-text-secondary">{children}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          {actionLabel && onAction ? (
            <Button type="button" size="sm" variant="primary" onClick={onAction}>
              {actionLabel}
            </Button>
          ) : null}
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => dismissOnboardingTip(tipId)}
          >
            Dismiss
          </Button>
        </div>
      </div>
    </aside>
  );
}
