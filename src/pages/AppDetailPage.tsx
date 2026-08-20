import { Badge } from "@relume_io/relume-ui";
import { Button } from "../components/ui/Button";
import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { usePageChrome } from "../app/pageChrome";
import { AppDetailSections } from "../components/marketplace/AppDetailSections";
import { AppMediaGallery } from "../components/marketplace/AppMediaGallery";
import { AppReviewsSection } from "../components/marketplace/AppReviewsSection";
import { CompatibilitySummary } from "../components/marketplace/CompatibilitySummary";
import { LoadingSkeleton } from "../components/shared/LoadingSkeleton";
import { StatePanel } from "../components/shared/StatePanel";
import { SystemStatusBanners } from "../components/shared/SystemStatusBanners";
import { getAppSocialProof } from "../data/appSocialProof";
import { categoryIcons, marketplaceIcons } from "../icons/iconMap";
import { usePrototypeStore } from "../store/prototypeStore";
import {
  getAppCompatibilityResults,
  getEffectiveAppStatus,
} from "../utils/marketplaceBrowse";
import { canInstallApps } from "../utils/prototypePermissions";

export function AppDetailPage() {
  const { appId } = useParams();
  const VerifiedIcon = marketplaceIcons.verified;
  const WarningIcon = marketplaceIcons.warning;
  const setActiveAppId = usePrototypeStore((state) => state.setActiveAppId);

  const { apps, nodes, overrides, user } = usePrototypeStore(
    useShallow((state) => ({
      apps: state.apps,
      nodes: state.nodes,
      overrides: state.overrides,
      user: state.users.find((item) => item.id === state.activeUserId),
    })),
  );

  const app = apps.find((item) => item.id === appId);
  const compatibilityResults = useMemo(
    () => (app ? getAppCompatibilityResults(app, nodes, overrides) : []),
    [app, nodes, overrides],
  );
  const socialProof = useMemo(
    () => (app ? getAppSocialProof(app.id, app.name) : null),
    [app],
  );

  const status = app ? getEffectiveAppStatus(app, overrides) : null;
  const canInstallPermission = canInstallApps(user, overrides);
  const installBlocked =
    !app ||
    !status ||
    status === "suspended" ||
    status === "deprecated" ||
    status === "removed" ||
    !canInstallPermission ||
    overrides.networkOffline;

  const installBlockedReason = !app
    ? null
    : overrides.networkOffline
      ? "You are offline. Installation cannot start until connectivity is restored."
      : !canInstallPermission
        ? "You do not have permission to install apps."
        : status === "suspended"
          ? (app.suspensionReason ??
            "This app has been temporarily suspended while a security issue is reviewed.")
          : status === "deprecated"
            ? "This app is no longer available for new installations."
            : status === "removed"
              ? "This app has been removed from the marketplace."
              : null;

  usePageChrome(
    app
      ? {
          backTo: "/marketplace/search",
          backLabel: "Back to browse",
          actions: installBlocked
            ? [
                {
                  id: "install-blocked",
                  label: "Install unavailable",
                  variant: "primary",
                  disabled: true,
                  title: installBlockedReason ?? "Installation unavailable",
                },
                app.replacementAppId
                  ? {
                      id: "replacement",
                      label: "View replacement",
                      to: `/marketplace/apps/${app.replacementAppId}`,
                      variant: "secondary" as const,
                    }
                  : {
                      id: "marketplace",
                      label: "Marketplace",
                      to: "/marketplace",
                      variant: "secondary" as const,
                    },
              ]
            : [
                {
                  id: "install",
                  label: "Install on nodes",
                  to: `/marketplace/apps/${app.id}/install`,
                  variant: "primary" as const,
                },
              ],
        }
      : {
          backTo: "/marketplace",
          backLabel: "Marketplace",
          actions: [],
        },
    [
      app?.id,
      app?.replacementAppId,
      installBlocked,
      installBlockedReason,
    ],
  );

  useEffect(() => {
    if (appId) setActiveAppId(appId);
  }, [appId, setActiveAppId]);

  if (overrides.catalogLoading) {
    return <LoadingSkeleton title="App details" rows={2} />;
  }

  if (overrides.marketplaceUnavailable) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-text-primary">App details</h1>
        <StatePanel
          tone="error"
          title="Marketplace unavailable"
          description="App details cannot be loaded while the marketplace is unavailable."
          actionLabel="Back to marketplace"
          actionTo="/marketplace"
        />
      </div>
    );
  }

  if (!app || !status || !socialProof) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-text-primary">App not found</h1>
        <StatePanel
          tone="empty"
          title="No matching app"
          description="No marketplace app matches this ID in the current scenario."
          actionLabel="Back to marketplace"
          actionTo="/marketplace"
        />
      </div>
    );
  }

  const Icon = categoryIcons[app.category];

  return (
    <div className="flex flex-col gap-6">
      <SystemStatusBanners overrides={overrides} context="marketplace" />

      <div className="flex flex-col gap-4 border border-border-primary bg-background-primary p-4 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div
            className="flex size-16 shrink-0 items-center justify-center border border-border-primary bg-background-secondary"
            aria-hidden="true"
          >
            <Icon pack="basic" size="md" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
                {app.name}
              </h1>
              {status !== "published" ? (
                <Badge variant="secondary">{status}</Badge>
              ) : null}
            </div>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-text-secondary">
              <span>{app.developerName}</span>
              {app.developerStatus === "verified" ? (
                <span className="inline-flex items-center gap-1 text-text-primary">
                  <VerifiedIcon pack="basic" size="xs" aria-hidden="true" />
                  Verified developer
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <WarningIcon pack="basic" size="xs" aria-hidden="true" />
                  Developer {app.developerStatus}
                </span>
              )}
              <span>·</span>
              <span className="capitalize">{app.category}</span>
              <span>·</span>
              <span>v{app.version}</span>
              <span>·</span>
              <span>
                {socialProof.averageRating.toFixed(1)} sample rating (
                {socialProof.reviewCount})
              </span>
            </p>
            <p className="mt-3 max-w-3xl text-base text-text-primary">
              {app.shortDescription}
            </p>
          </div>
        </div>

        {installBlocked ? (
          <div className="max-w-xs border border-border-primary bg-background-secondary p-3 text-sm text-text-primary">
            <p className="font-semibold">Installation unavailable</p>
            <p className="mt-1 text-text-secondary">{installBlockedReason}</p>
            {status === "deprecated" && app.replacementAppId ? (
              <Button asChild variant="secondary" size="sm" className="mt-3">
                <Link to={`/marketplace/apps/${app.replacementAppId}`}>
                  View replacement app
                </Link>
              </Button>
            ) : null}
          </div>
        ) : (
          <p className="max-w-xs text-sm text-text-secondary md:text-right">
            Use <span className="font-semibold text-text-primary">Install on nodes</span> in
            the top header to start installation.
          </p>
        )}
      </div>

      {app.developerStatus !== "verified" ? (
        <div className="border border-border-primary bg-background-secondary p-3 text-sm text-text-primary">
          <p className="inline-flex items-center gap-2 font-semibold">
            <WarningIcon pack="basic" size="xs" aria-hidden="true" />
            Developer verification incomplete
          </p>
          <p className="mt-1 text-text-secondary">
            This developer has not completed verification. Review permissions and
            security details carefully before installing.
          </p>
        </div>
      ) : null}

      <AppMediaGallery appName={app.name} frames={socialProof.gallery} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)]">
        <div className="flex flex-col gap-4">
          <AppDetailSections app={app} overrides={overrides} />
          <AppReviewsSection
            appName={app.name}
            averageRating={socialProof.averageRating}
            reviewCount={socialProof.reviewCount}
            reviews={socialProof.reviews}
            comments={socialProof.comments}
          />
        </div>
        <div className="flex flex-col gap-4">
          <CompatibilitySummary
            appId={app.id}
            nodes={nodes}
            results={compatibilityResults}
            showInstallAction={!installBlocked}
            checkUnavailable={
              overrides.compatibilityUnavailable || overrides.networkOffline
            }
          />
          <section className="border border-border-primary bg-background-primary p-4">
            <h2 className="text-lg font-semibold text-text-primary">
              Resource intensity
            </h2>
            <p className="mt-2 capitalize text-sm text-text-primary">
              {app.resourceIntensity} resource use
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              Benefits are explained first. Technical requirements and node-level
              compatibility details are listed so you can decide with clear next
              steps.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
