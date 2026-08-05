import { Badge, Button } from "@relume_io/relume-ui";
import { Link, useParams } from "react-router-dom";
import { usePrototypeStore } from "../../store/prototypeStore";
import { StatePanel } from "../../components/shared/StatePanel";

export function AppDashboardPage() {
  const { appId = "" } = useParams();
  const app = usePrototypeStore((state) =>
    state.developerPortal.apps.find((item) => item.id === appId),
  );
  const publishDeveloperApp = usePrototypeStore(
    (state) => state.publishDeveloperApp,
  );
  const approveDeveloperApp = usePrototypeStore(
    (state) => state.approveDeveloperApp,
  );

  if (!app) {
    return (
      <StatePanel
        tone="empty"
        title="App not found"
        description="Load a developer scenario that includes this app."
        actionLabel="My Apps"
        actionTo="/developer/apps"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
              {app.basics.name}
            </h1>
            <Badge variant="outline">{app.marketplaceStatus}</Badge>
          </div>
          <p className="mt-2 text-sm text-text-secondary">
            v{app.build.version} · Last saved {app.lastSavedAt}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="secondary">
            <Link to={`/developer/apps/${app.id}/edit`}>Edit listing</Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link to={`/developer/apps/${app.id}/preview`}>Preview</Link>
          </Button>
          {app.marketplaceStatus === "changes-requested" ? (
            <Button asChild size="sm" variant="primary">
              <Link to={`/developer/apps/${app.id}/review`}>
                Review feedback
              </Link>
            </Button>
          ) : null}
          {app.marketplaceStatus === "approved" ? (
            <Button
              type="button"
              size="sm"
              variant="primary"
              onClick={() => publishDeveloperApp(app.id)}
            >
              Publish app
            </Button>
          ) : null}
          {app.marketplaceStatus === "resubmitted" ? (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => approveDeveloperApp(app.id)}
            >
              Simulate approval
            </Button>
          ) : null}
        </div>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Active installations", app.analytics.activeInstallations],
          ["Healthy", app.analytics.healthyInstallations],
          ["Failed installs", app.analytics.failedInstallations],
          ["Detail views", app.analytics.detailViews],
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

      {app.attentionItems.length > 0 ? (
        <section className="border border-border-primary bg-background-secondary p-4">
          <h2 className="text-base font-semibold text-text-primary">
            Needs attention
          </h2>
          <ul className="mt-2 list-inside list-disc text-sm text-text-secondary">
            {app.attentionItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {[
          ["Listing", "listing"],
          ["Media", "media"],
          ["Build", "build"],
          ["Compatibility", "compatibility"],
          ["Permissions", "permissions"],
          ["Rewards", "rewards"],
          ["Testing", "testing"],
          ["Submit", "submit"],
          ["Releases", "releases"],
        ].map(([label, path]) => (
          <Link
            key={path}
            to={`/developer/apps/${app.id}/${path}`}
            className="border border-border-primary bg-background-primary p-4 text-sm font-semibold text-text-primary hover:bg-background-secondary"
          >
            {label}
          </Link>
        ))}
      </section>
    </div>
  );
}
