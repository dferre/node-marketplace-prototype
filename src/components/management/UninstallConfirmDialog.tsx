import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@relume_io/relume-ui";

type UninstallConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appName: string;
  affectedCount: number;
  onConfirm: () => void;
};

export function UninstallConfirmDialog({
  open,
  onOpenChange,
  appName,
  affectedCount,
  onConfirm,
}: UninstallConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Uninstall {appName}?</DialogTitle>
          <DialogDescription>
            This will uninstall the app from {affectedCount} node
            {affectedCount === 1 ? "" : "s"}. Running workloads on those nodes
            will stop, and local app data for this installation may be removed.
          </DialogDescription>
        </DialogHeader>
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
            Uninstall from {affectedCount} node
            {affectedCount === 1 ? "" : "s"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
