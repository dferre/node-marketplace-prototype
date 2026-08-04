import { StatePanel } from "./StatePanel";
import type { PrototypeOverrides } from "../../types/prototype";

type SystemStatusBannersProps = {
  overrides: PrototypeOverrides;
  context?: "marketplace" | "install" | "management";
};

export function SystemStatusBanners({
  overrides,
  context = "marketplace",
}: SystemStatusBannersProps) {
  return (
    <>
      {overrides.networkOffline ? (
        <StatePanel
          tone="error"
          title="You appear to be offline"
          description={
            context === "install"
              ? "Compatibility checks and installation actions are limited while the network is offline. Offline nodes can still be queued when connectivity returns."
              : context === "management"
                ? "Management actions that require the marketplace service may fail until connectivity is restored."
                : "Marketplace browsing and compatibility checks are limited while the network is offline."
          }
        />
      ) : null}

      {overrides.staleNodeData && context !== "marketplace" ? (
        <StatePanel
          tone="warning"
          title="Node data may be out of date"
          description="Fleet telemetry is stale. Compatibility and resource values reflect the last known snapshot and may change when nodes reconnect."
        />
      ) : null}

      {overrides.compatibilityUnavailable && context !== "management" ? (
        <StatePanel
          tone="error"
          title="Compatibility service unavailable"
          description="Node compatibility cannot be verified right now. Retry later or use the Prototype debugger to clear the compatibility unavailable override."
        />
      ) : null}
    </>
  );
}
