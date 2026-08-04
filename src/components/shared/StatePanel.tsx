import { Button } from "@relume_io/relume-ui";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { marketplaceIcons } from "../../icons/iconMap";

export type StatePanelTone = "empty" | "error" | "warning" | "info" | "loading";

type StatePanelProps = {
  title: string;
  description: string;
  tone?: StatePanelTone;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
  children?: ReactNode;
};

export function StatePanel({
  title,
  description,
  tone = "empty",
  actionLabel,
  actionTo,
  onAction,
  children,
}: StatePanelProps) {
  const WarningIcon = marketplaceIcons.warning;
  const InfoIcon = marketplaceIcons.info;

  return (
    <div className="border border-border-primary bg-background-secondary p-6">
      <div className="flex items-start gap-2">
        {tone === "error" || tone === "warning" ? (
          <WarningIcon pack="basic" size="sm" aria-hidden="true" />
        ) : null}
        {tone === "info" || tone === "loading" ? (
          <InfoIcon pack="basic" size="sm" aria-hidden="true" />
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-text-primary">{title}</p>
          <p className="mt-2 text-sm text-text-secondary">{description}</p>
          {children}
          {actionLabel && actionTo ? (
            <Button asChild variant="secondary" size="sm" className="mt-4">
              <Link to={actionTo}>{actionLabel}</Link>
            </Button>
          ) : null}
          {actionLabel && onAction && !actionTo ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="mt-4"
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
