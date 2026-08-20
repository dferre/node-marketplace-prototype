import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@relume_io/relume-ui";
import { Button } from "../ui/Button";
import type { MarketplaceApp } from "../../types/prototype";

type UpdatePermissionsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  app: MarketplaceApp;
  affectedCount: number;
  onConfirm: () => void;
};

export function UpdatePermissionsDialog({
  open,
  onOpenChange,
  app,
  affectedCount,
  onConfirm,
}: UpdatePermissionsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review new permissions</DialogTitle>
          <DialogDescription>
            Updating {app.name} on {affectedCount} node
            {affectedCount === 1 ? "" : "s"} requires accepting updated
            permissions before the update can continue.
          </DialogDescription>
        </DialogHeader>
        <ul className="list-disc pl-5 text-sm text-text-primary">
          {app.permissions.map((permission) => (
            <li key={permission.id} className="mt-1">
              <span className="font-semibold">{permission.label}</span>
              {permission.description ? (
                <span className="text-text-secondary">
                  {" "}
                  — {permission.description}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
        <DialogFooter className="gap-2 sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Accept and update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
