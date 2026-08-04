import { Button } from "@relume_io/relume-ui";
import { Link } from "react-router-dom";

type BulkActionBarProps = {
  appId: string;
  selectedCount: number;
  totalCount: number;
  updateAvailable: boolean;
  hasSetupRequired: boolean;
  canManage: boolean;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onStop: () => void;
  onRestart: () => void;
  onUpdate: () => void;
  onCompleteSetup: () => void;
  onUninstall: () => void;
};

export function BulkActionBar({
  appId,
  selectedCount,
  totalCount,
  updateAvailable,
  hasSetupRequired,
  canManage,
  onSelectAll,
  onClearSelection,
  onStop,
  onRestart,
  onUpdate,
  onCompleteSetup,
  onUninstall,
}: BulkActionBarProps) {
  const disabled = selectedCount === 0 || !canManage;

  return (
    <section className="flex flex-col gap-3 border border-border-primary bg-background-secondary p-4">
      {!canManage ? (
        <p className="text-sm text-text-secondary">
          View only — you do not have permission to manage installed apps.
        </p>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-text-primary">
          {selectedCount} of {totalCount} node
          {totalCount === 1 ? "" : "s"} selected
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={onSelectAll}
            disabled={!canManage}
          >
            Select all
          </Button>
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={onClearSelection}
          >
            Clear
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={disabled}
          onClick={onStop}
        >
          Stop
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={disabled}
          onClick={onRestart}
        >
          Restart
        </Button>
        {updateAvailable ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={disabled}
            onClick={onUpdate}
          >
            Update
          </Button>
        ) : null}
        {hasSetupRequired ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={disabled}
            onClick={onCompleteSetup}
          >
            Complete setup
          </Button>
        ) : null}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={disabled}
          onClick={onUninstall}
        >
          Uninstall
        </Button>
        <Button asChild variant="primary" size="sm">
          <Link to={`/marketplace/apps/${appId}/install`}>
            Install on more nodes
          </Link>
        </Button>
      </div>
    </section>
  );
}
