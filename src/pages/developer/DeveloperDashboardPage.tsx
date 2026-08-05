import { Badge, Button } from "@relume_io/relume-ui";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { usePrototypeStore } from "../../store/prototypeStore";

export function DeveloperDashboardPage() {
  const { portal, developer, organization } = usePrototypeStore(
    useShallow((state) => {
      const developer = state.developerPortal.developers.find(
        (item) => item.id === state.developerPortal.activeDeveloperId,
      );
      const organization = state.developerPortal.organizations.find(
        (item) => item.id === state.developerPortal.activeOrganizationId,
      );
      return {
        portal: state.developerPortal,
        developer,
        organization,
      };
    }),
  );

  const stats = useMemo(() => {
    const apps = portal.apps;
    return {
      published: apps.filter((app) => app.marketplaceStatus === "published")
        .length,
      draft: apps.filter((app) =>
        ["draft", "ready"].includes(app.marketplaceStatus),
      ).length,
      inReview: apps.filter((app) =>
        ["submitted", "automated-review", "manual-review", "resubmitted"].includes(
          app.marketplaceStatus,
        ),
      ).length,
      changes: apps.filter((app) => app.marketplaceStatus === "changes-requested")
        .length,
      installs: apps.reduce(
        (sum, app) => sum + app.analytics.activeInstallations,
        0,
      ),
      healthy: apps.reduce(
        (sum, app) => sum + app.analytics.healthyInstallations,
        0,
      ),
      attention: apps.flatMap((app) => app.attentionItems),
    };
  }, [portal.apps]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
            Developer overview
          </h1>
          <p className="mt-2 max-w-3xl text-base text-text-secondary">
            {developer
              ? `${developer.displayName} · ${organization?.publicName ?? "Organization"} · ${developer.personaLabel}`
              : "Developer portal dashboard"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="primary">
            <Link to="/developer/apps/new">Create app</Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link to="/developer/verification">Verification</Link>
          </Button>
        </div>
      </div>

      {developer?.suspended ? (
        <section className="border border-border-primary bg-background-secondary p-4">
          <p className="font-semibold text-text-primary">Account suspended</p>
          <p className="mt-1 text-sm text-text-secondary">
            Publishing and submission actions are disabled in this persona.
          </p>
        </section>
      ) : null}

      <section
        aria-label="Developer summary"
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {[
          ["Published apps", stats.published],
          ["Draft apps", stats.draft],
          ["In review", stats.inReview],
          ["Changes requested", stats.changes],
          ["Active installations", stats.installs],
          ["Healthy installations", stats.healthy],
        ].map(([label, value]) => (
          <div
            key={label as string}
            className="border border-border-primary bg-background-primary p-4"
          >
            <p className="text-sm text-text-secondary">{label}</p>
            <p className="mt-1 text-2xl font-bold text-text-primary">{value}</p>
          </div>
        ))}
      </section>

      <section className="border border-border-primary bg-background-primary p-4">
        <h2 className="text-lg font-semibold text-text-primary">
          Needs your attention
        </h2>
        {stats.attention.length === 0 ? (
          <p className="mt-2 text-sm text-text-secondary">
            No open developer tasks for the current scenario.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {stats.attention.map((item) => (
              <li
                key={item}
                className="flex flex-wrap items-center justify-between gap-2 border border-border-primary px-3 py-2"
              >
                <span className="text-sm text-text-primary">{item}</span>
                <Badge variant="secondary">Action</Badge>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild size="sm" variant="secondary">
            <Link to="/developer/apps">Open My Apps</Link>
          </Button>
          {portal.activeDeveloperAppId ? (
            <Button asChild size="sm" variant="primary">
              <Link
                to={`/developer/apps/${portal.activeDeveloperAppId}/review`}
              >
                Open review feedback
              </Link>
            </Button>
          ) : null}
        </div>
      </section>
    </div>
  );
}
