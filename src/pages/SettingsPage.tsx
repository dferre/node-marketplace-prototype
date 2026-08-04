import { Badge, Button } from "@relume_io/relume-ui";
import { Link } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { usePrototypeStore } from "../store/prototypeStore";

export function SettingsPage() {
  const { user, nodeFleetId, scenarioId, overrides } = usePrototypeStore(
    useShallow((state) => ({
      user: state.users.find((item) => item.id === state.activeUserId),
      nodeFleetId: state.nodeFleetId,
      scenarioId: state.scenarioId,
      overrides: state.overrides,
    })),
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
          Settings
        </h1>
        <p className="max-w-3xl text-base text-text-secondary">
          Account permissions and marketplace preferences for this prototype
          session.
        </p>
      </div>

      <section className="border border-border-primary bg-background-primary p-4">
        <h2 className="text-base font-semibold text-text-primary">Account</h2>
        {user ? (
          <>
            <p className="mt-2 text-sm text-text-primary">{user.name}</p>
            <p className="mt-1 text-sm text-text-secondary">{user.role}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="outline">
                Install apps: {user.canInstallApps ? "Allowed" : "Blocked"}
              </Badge>
              <Badge variant="outline">
                Manage nodes: {user.canManageNodes ? "Allowed" : "Blocked"}
              </Badge>
              {overrides.userPermissionChanged ? (
                <Badge variant="secondary">Permission override active</Badge>
              ) : null}
            </div>
          </>
        ) : (
          <p className="mt-2 text-sm text-text-secondary">No active user.</p>
        )}
      </section>

      <section className="border border-border-primary bg-background-primary p-4">
        <h2 className="text-base font-semibold text-text-primary">
          Marketplace preferences
        </h2>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-text-secondary">Active scenario</dt>
            <dd className="text-sm text-text-primary">{scenarioId}</dd>
          </div>
          <div>
            <dt className="text-sm text-text-secondary">Node fleet</dt>
            <dd className="text-sm text-text-primary">
              {nodeFleetId.replace(/-/g, " ")}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-text-secondary">Reward estimates</dt>
            <dd className="text-sm text-text-primary">
              {overrides.rewardsUnavailable ? "Hidden" : "Shown when available"}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-text-secondary">Compatibility checks</dt>
            <dd className="text-sm text-text-primary">
              {overrides.compatibilityUnavailable || overrides.networkOffline
                ? "Unavailable"
                : "Enabled"}
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-sm text-text-secondary">
          User, fleet, and preference changes are driven by the Prototype
          debugger so scenarios stay shareable.
        </p>
      </section>

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="secondary" size="sm">
          <Link to="/marketplace">Open marketplace</Link>
        </Button>
        <Button asChild variant="secondary" size="sm">
          <Link to="/nodes">Open My Nodes</Link>
        </Button>
      </div>
    </div>
  );
}
