import { Badge, Button } from "@relume_io/relume-ui";
import { Link, useParams } from "react-router-dom";
import { StatePanel } from "../../components/shared/StatePanel";
import { usePrototypeStore } from "../../store/prototypeStore";

export function AppPreviewPage() {
  const { appId = "" } = useParams();
  const app = usePrototypeStore((state) =>
    state.developerPortal.apps.find((item) => item.id === appId),
  );

  if (!app) {
    return (
      <StatePanel
        tone="empty"
        title="App not found"
        description="Open an app draft to preview the public listing."
        actionLabel="My Apps"
        actionTo="/developer/apps"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
            Public app-detail preview
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Draft data as operators would see it — not live until published.
          </p>
        </div>
        <Button asChild size="sm" variant="secondary">
          <Link to={`/marketplace/apps/app_atlas_storage`}>
            Open live marketplace page
          </Link>
        </Button>
      </div>

      <section className="border border-border-primary bg-background-primary p-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-bold text-text-primary">
            {app.listing.publicName || app.basics.name}
          </h2>
          <Badge variant="outline">
            {app.listing.developerDisplayName}
          </Badge>
          <Badge variant="secondary">v{app.build.version}</Badge>
        </div>
        <p className="mt-3 text-base text-text-primary">
          {app.listing.shortDescription}
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {[
            ["Benefit", app.basics.primaryBenefit, "listing"],
            ["Rewards", app.listing.rewardSummary, "rewards"],
            ["Privacy", app.privacySummary || "Missing", "permissions"],
            ["Support", app.support.supportEmail || "Missing", "settings"],
          ].map(([label, value, path]) => (
            <div
              key={label as string}
              className="border border-border-primary p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-text-primary">{label}</p>
                <Button asChild size="sm" variant="secondary">
                  <Link to={`/developer/apps/${app.id}/${path}`}>Edit</Link>
                </Button>
              </div>
              <p className="mt-2 text-sm text-text-secondary">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border border-border-primary bg-background-secondary p-4">
        <h2 className="text-base font-semibold text-text-primary">Media</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {app.media.map((asset) => (
            <li
              key={asset.id}
              className="border border-border-primary bg-background-primary p-3 text-sm"
            >
              <p className="font-semibold text-text-primary">{asset.title}</p>
              <p className="mt-1 text-text-secondary">{asset.caption}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
