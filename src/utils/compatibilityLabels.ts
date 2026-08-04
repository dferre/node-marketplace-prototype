import type { CompatibilityStatus } from "../types/prototype";

export function formatCompatibilityStatus(status: CompatibilityStatus): string {
  switch (status) {
    case "compatible":
      return "Compatible";
    case "compatible-with-warnings":
      return "Compatible with warnings";
    case "offline-queued":
      return "Offline · Installation will be queued";
    case "incompatible":
      return "Incompatible";
    case "unable-to-check":
      return "Unable to check compatibility";
    case "already-installed":
      return "Already installed";
  }
}

export function isSelectableCompatibility(
  status: CompatibilityStatus,
): boolean {
  return (
    status === "compatible" ||
    status === "compatible-with-warnings" ||
    status === "offline-queued"
  );
}
