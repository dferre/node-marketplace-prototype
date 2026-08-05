import { Badge, Button, Input, Label } from "@relume_io/relume-ui";
import { Link, useParams } from "react-router-dom";
import { AppEditorNavigation } from "../../components/developer/AppEditorNavigation";
import { StatePanel } from "../../components/shared/StatePanel";
import { usePrototypeStore } from "../../store/prototypeStore";
import type { EditorStepId } from "../../types/developer";
import { getAppCompatibilityResults } from "../../utils/marketplaceBrowse";
import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";

type AppEditorPageProps = {
  step: EditorStepId;
};

export function AppEditorPage({ step }: AppEditorPageProps) {
  const { appId = "" } = useParams();
  const {
    app,
    nodes,
    overrides,
    updateDeveloperApp,
    markDeveloperStepComplete,
    showToast,
  } = usePrototypeStore(
    useShallow((state) => ({
      app: state.developerPortal.apps.find((item) => item.id === appId),
      nodes: state.nodes,
      overrides: state.overrides,
      updateDeveloperApp: state.updateDeveloperApp,
      markDeveloperStepComplete: state.markDeveloperStepComplete,
      showToast: state.showToast,
    })),
  );
  const uploadBlocked = usePrototypeStore(
    (state) => state.developerPortal.overrides.uploadUnavailable,
  );

  const [caption, setCaption] = useState("");

  const compatibility = useMemo(() => {
    if (!app) return [];
    const fakeMarketplaceApp = {
      id: app.id,
      name: app.basics.name,
      slug: app.basics.slug,
      developerId: app.organizationId,
      developerName: app.listing.developerDisplayName,
      developerStatus: "verified" as const,
      category: app.basics.category,
      tags: app.basics.tags,
      status: "published" as const,
      version: app.build.version,
      resourceIntensity: app.basics.resourceIntensity,
      shortDescription: app.listing.shortDescription,
      fullDescription: app.listing.fullDescription,
      primaryBenefit: app.basics.primaryBenefit,
      rewards: app.rewards,
      requirements: app.requirements,
      permissions: app.permissions,
      setupRequired: true,
      securityReviewStatus: "reviewed" as const,
    };
    return getAppCompatibilityResults(fakeMarketplaceApp, nodes, overrides);
  }, [app, nodes, overrides]);

  if (!app) {
    return (
      <StatePanel
        tone="empty"
        title="App not found"
        description="Choose an app from My Apps."
        actionLabel="My Apps"
        actionTo="/developer/apps"
      />
    );
  }

  const saveStep = () => {
    markDeveloperStepComplete(app.id, step);
    showToast(`Saved ${step} (prototype)`);
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[16rem_minmax(0,_1fr)]">
      <AppEditorNavigation
        appId={app.id}
        completionByStep={app.completionByStep}
      />
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
              {app.basics.name || "Untitled draft"}
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Step: {step} · Status {app.completionByStep[step]}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="primary" onClick={saveStep}>
              Save step
            </Button>
            <Button asChild size="sm" variant="secondary">
              <Link to={`/developer/apps/${app.id}`}>App dashboard</Link>
            </Button>
          </div>
        </div>

        {step === "basics" || step === "listing" ? (
          <section className="flex flex-col gap-3 border border-border-primary bg-background-primary p-4">
            <Label htmlFor="edit-name">Public / app name</Label>
            <Input
              id="edit-name"
              value={
                step === "listing" ? app.listing.publicName : app.basics.name
              }
              onChange={(event) => {
                const value = event.target.value;
                if (step === "listing") {
                  updateDeveloperApp(app.id, {
                    listing: { ...app.listing, publicName: value },
                  });
                } else {
                  updateDeveloperApp(app.id, {
                    basics: { ...app.basics, name: value },
                  });
                }
              }}
            />
            <Label htmlFor="edit-benefit">Primary benefit</Label>
            <Input
              id="edit-benefit"
              value={app.basics.primaryBenefit}
              onChange={(event) =>
                updateDeveloperApp(app.id, {
                  basics: {
                    ...app.basics,
                    primaryBenefit: event.target.value,
                  },
                  listing: {
                    ...app.listing,
                    whyInstall: event.target.value,
                  },
                })
              }
            />
            <Label htmlFor="edit-short">Short description</Label>
            <Input
              id="edit-short"
              value={app.listing.shortDescription}
              onChange={(event) =>
                updateDeveloperApp(app.id, {
                  listing: {
                    ...app.listing,
                    shortDescription: event.target.value,
                  },
                })
              }
            />
            {step === "listing" ? (
              <div className="border border-border-primary bg-background-secondary p-3">
                <p className="text-sm font-semibold text-text-primary">
                  Live app-card preview
                </p>
                <p className="mt-2 font-semibold text-text-primary">
                  {app.listing.publicName || "App name"}
                </p>
                <p className="mt-1 text-sm text-text-secondary">
                  {app.listing.shortDescription || "Short description"}
                </p>
              </div>
            ) : null}
          </section>
        ) : null}

        {step === "media" ? (
          <section className="flex flex-col gap-3 border border-border-primary bg-background-primary p-4">
            <p className="text-sm text-text-secondary">
              Simulated media manager — no real uploads.
            </p>
            {uploadBlocked ? (
              <p className="text-sm text-text-secondary">
                Upload unavailable (debugger override).
              </p>
            ) : null}
            <ul className="flex flex-col gap-2">
              {app.media.map((asset) => (
                <li
                  key={asset.id}
                  className="flex flex-wrap items-center justify-between gap-2 border border-border-primary px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {asset.title}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {asset.caption} · {asset.altText || "Missing alt text"}
                    </p>
                  </div>
                  <Badge
                    variant={
                      asset.status === "rejected" || asset.status === "failed"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {asset.status}
                  </Badge>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2 border border-border-primary bg-background-secondary p-3">
              <Label htmlFor="new-caption">Replace rejected screenshot caption</Label>
              <Input
                id="new-caption"
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                placeholder="Estimate vs eligibility"
              />
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={uploadBlocked}
                onClick={() => {
                  updateDeveloperApp(app.id, {
                    media: app.media.map((asset) =>
                      asset.id === "media_shot_2"
                        ? {
                            ...asset,
                            status: "ready",
                            caption: caption || "Estimate vs eligibility",
                            failureReason: undefined,
                          }
                        : asset,
                    ),
                  });
                  markDeveloperStepComplete(app.id, "media");
                  showToast("Screenshot replaced (simulated)");
                }}
              >
                Simulate replace screenshot
              </Button>
            </div>
          </section>
        ) : null}

        {step === "build" ? (
          <section className="flex flex-col gap-3 border border-border-primary bg-background-primary p-4">
            <p className="text-sm text-text-primary">
              Build v{app.build.version} · {app.build.status}
            </p>
            <ul className="list-inside list-disc text-sm text-text-secondary">
              {app.build.findings.map((finding) => (
                <li key={finding}>{finding}</li>
              ))}
            </ul>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={uploadBlocked}
              onClick={() => {
                updateDeveloperApp(app.id, {
                  build: {
                    ...app.build,
                    version: "1.0.1",
                    status: "security-passed",
                    signaturePresent: true,
                    findings: ["Non-blocking: package size above median"],
                  },
                });
                markDeveloperStepComplete(app.id, "build");
                showToast("Replacement build uploaded (simulated)");
              }}
            >
              Upload signed replacement build
            </Button>
          </section>
        ) : null}

        {step === "compatibility" ? (
          <section className="flex flex-col gap-3 border border-border-primary bg-background-primary p-4">
            <p className="text-sm text-text-secondary">
              Preview against the operator sample fleet.
            </p>
            <ul className="flex flex-col gap-2">
              {compatibility.map((result) => {
                const node = nodes.find((item) => item.id === result.nodeId);
                return (
                  <li
                    key={result.nodeId}
                    className="border border-border-primary px-3 py-2 text-sm"
                  >
                    <span className="font-semibold text-text-primary">
                      {node?.name ?? result.nodeId}
                    </span>
                    <span className="text-text-secondary">
                      {" "}
                      · {result.status}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        {step === "permissions" ? (
          <section className="flex flex-col gap-3 border border-border-primary bg-background-primary p-4">
            <ul className="flex flex-col gap-2">
              {app.permissions.map((permission) => (
                <li
                  key={permission.id}
                  className="border border-border-primary px-3 py-2 text-sm text-text-primary"
                >
                  {permission.label}
                </li>
              ))}
            </ul>
            <Label htmlFor="privacy">Privacy summary</Label>
            <Input
              id="privacy"
              value={app.privacySummary}
              onChange={(event) =>
                updateDeveloperApp(app.id, {
                  privacySummary: event.target.value,
                })
              }
            />
          </section>
        ) : null}

        {step === "rewards" ? (
          <section className="flex flex-col gap-3 border border-border-primary bg-background-primary p-4">
            <Label htmlFor="reward-summary">Operator-facing reward summary</Label>
            <Input
              id="reward-summary"
              value={app.listing.rewardSummary}
              onChange={(event) =>
                updateDeveloperApp(app.id, {
                  listing: {
                    ...app.listing,
                    rewardSummary: event.target.value,
                  },
                  rewards: {
                    ...app.rewards,
                    estimateLabel: event.target.value,
                    guaranteed: false,
                  },
                })
              }
            />
            <p className="text-sm text-text-secondary">
              Preview: {app.listing.rewardSummary}
            </p>
          </section>
        ) : null}

        {step === "support" ? (
          <section className="flex flex-col gap-3 border border-border-primary bg-background-primary p-4">
            <Label htmlFor="privacy-url">Privacy policy URL</Label>
            <Input
              id="privacy-url"
              value={app.support.privacyPolicyUrl}
              onChange={(event) =>
                updateDeveloperApp(app.id, {
                  support: {
                    ...app.support,
                    privacyPolicyUrl: event.target.value,
                  },
                  listing: {
                    ...app.listing,
                    privacyPolicyUrl: event.target.value,
                  },
                })
              }
            />
          </section>
        ) : null}

        {step === "testing" ? (
          <section className="flex flex-col gap-3 border border-border-primary bg-background-primary p-4">
            {app.tests.map((test) => (
              <div
                key={test.id}
                className="flex flex-wrap items-center justify-between gap-2 border border-border-primary px-3 py-2"
              >
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {test.name}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {test.finding ?? "No findings"}
                  </p>
                </div>
                <Badge variant="outline">{test.status}</Badge>
              </div>
            ))}
          </section>
        ) : null}
      </div>
    </div>
  );
}
