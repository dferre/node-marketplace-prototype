import { useEffect } from "react";
import { usePrototypeStore } from "../../store/prototypeStore";
import { debuggerBtnClass } from "./debuggerChrome";

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
      className="prototype-debugger-toast fixed bottom-20 left-1/2 z-[110] -translate-x-1/2 rounded-08 border border-border-base bg-background-secondary-base p-4 md:bottom-6"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-text-sm-regular text-text-primary">{toast.message}</p>
        <button
          type="button"
          className={`${debuggerBtnClass} border-0 bg-transparent px-2 py-1`}
          onClick={clearToast}
          aria-label="Dismiss notification"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
