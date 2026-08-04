import { Button } from "@relume_io/relume-ui";
import { useEffect } from "react";
import { usePrototypeStore } from "../../store/prototypeStore";

export function PrototypeToast() {
  const toast = usePrototypeStore((state) => state.toast);
  const clearToast = usePrototypeStore((state) => state.clearToast);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => clearToast(), 3200);
    return () => window.clearTimeout(timer);
  }, [toast, clearToast]);

  if (!toast) return null;

  return (
    <div
      className="fixed bottom-20 left-1/2 z-[110] w-[min(28rem,calc(100%-2rem))] -translate-x-1/2 border-2 border-border-primary bg-background-primary p-3 shadow-none md:bottom-6"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-text-primary">{toast.message}</p>
        <Button
          type="button"
          variant="link"
          size="link"
          onClick={clearToast}
          aria-label="Dismiss notification"
        >
          Dismiss
        </Button>
      </div>
    </div>
  );
}
