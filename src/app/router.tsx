import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoadingSkeleton } from "../components/shared/LoadingSkeleton";
import { InstallationPlayback } from "../components/prototype/InstallationPlayback";
import { PrototypeDebugger } from "../components/prototype/PrototypeDebugger";
import { PrototypeToast } from "../components/prototype/PrototypeToast";
import { ScenarioUrlSync } from "../components/prototype/ScenarioUrlSync";
import { DeveloperShell } from "../components/developer/DeveloperShell";
import { AppShell } from "./AppShell";

const OverviewPage = lazy(() =>
  import("../pages/OverviewPage").then((module) => ({
    default: module.OverviewPage,
  })),
);
const MarketplaceHomePage = lazy(() =>
  import("../pages/MarketplaceHomePage").then((module) => ({
    default: module.MarketplaceHomePage,
  })),
);
const MarketplaceSearchPage = lazy(() =>
  import("../pages/MarketplaceSearchPage").then((module) => ({
    default: module.MarketplaceSearchPage,
  })),
);
const AppDetailPage = lazy(() =>
  import("../pages/AppDetailPage").then((module) => ({
    default: module.AppDetailPage,
  })),
);
const InstallScopePage = lazy(() =>
  import("../pages/InstallScopePage").then((module) => ({
    default: module.InstallScopePage,
  })),
);
const InstallReviewPage = lazy(() =>
  import("../pages/InstallReviewPage").then((module) => ({
    default: module.InstallReviewPage,
  })),
);
const InstallProgressPage = lazy(() =>
  import("../pages/InstallProgressPage").then((module) => ({
    default: module.InstallProgressPage,
  })),
);
const InstallResultsPage = lazy(() =>
  import("../pages/InstallResultsPage").then((module) => ({
    default: module.InstallResultsPage,
  })),
);
const InstalledAppsPage = lazy(() =>
  import("../pages/InstalledAppsPage").then((module) => ({
    default: module.InstalledAppsPage,
  })),
);
const InstalledAppDetailPage = lazy(() =>
  import("../pages/InstalledAppDetailPage").then((module) => ({
    default: module.InstalledAppDetailPage,
  })),
);
const NodeAppInstallationPage = lazy(() =>
  import("../pages/NodeAppInstallationPage").then((module) => ({
    default: module.NodeAppInstallationPage,
  })),
);
const NodesPage = lazy(() =>
  import("../pages/NodesPage").then((module) => ({
    default: module.NodesPage,
  })),
);
const NodeDetailPage = lazy(() =>
  import("../pages/NodeDetailPage").then((module) => ({
    default: module.NodeDetailPage,
  })),
);
const RewardsPage = lazy(() =>
  import("../pages/RewardsPage").then((module) => ({
    default: module.RewardsPage,
  })),
);
const ActivityPage = lazy(() =>
  import("../pages/ActivityPage").then((module) => ({
    default: module.ActivityPage,
  })),
);
const SettingsPage = lazy(() =>
  import("../pages/SettingsPage").then((module) => ({
    default: module.SettingsPage,
  })),
);
const OnboardingHubPage = lazy(() =>
  import("../pages/onboarding/OnboardingHubPage").then((module) => ({
    default: module.OnboardingHubPage,
  })),
);
const OnboardingFlowPage = lazy(() =>
  import("../pages/onboarding/OnboardingFlowPage").then((module) => ({
    default: module.OnboardingFlowPage,
  })),
);
const OnboardingFlowStartPage = lazy(() =>
  import("../pages/onboarding/OnboardingFlowPage").then((module) => ({
    default: module.OnboardingFlowStartPage,
  })),
);
const DeveloperOnboardingPage = lazy(() =>
  import("../pages/onboarding/DeveloperOnboardingPage").then((module) => ({
    default: module.DeveloperOnboardingPage,
  })),
);

const DeveloperDashboardPage = lazy(() =>
  import("../pages/developer/DeveloperDashboardPage").then((module) => ({
    default: module.DeveloperDashboardPage,
  })),
);
const DeveloperAppsPage = lazy(() =>
  import("../pages/developer/DeveloperAppsPage").then((module) => ({
    default: module.DeveloperAppsPage,
  })),
);
const CreateAppPage = lazy(() =>
  import("../pages/developer/CreateAppPage").then((module) => ({
    default: module.CreateAppPage,
  })),
);
const AppDashboardPage = lazy(() =>
  import("../pages/developer/AppDashboardPage").then((module) => ({
    default: module.AppDashboardPage,
  })),
);
const AppPreviewPage = lazy(() =>
  import("../pages/developer/AppPreviewPage").then((module) => ({
    default: module.AppPreviewPage,
  })),
);
const AppSubmitPage = lazy(() =>
  import("../pages/developer/AppSubmitPage").then((module) => ({
    default: module.AppSubmitPage,
  })),
);
const AppSubmissionPage = lazy(() =>
  import("../pages/developer/AppSubmissionPage").then((module) => ({
    default: module.AppSubmissionPage,
  })),
);
const AppReviewPage = lazy(() =>
  import("../pages/developer/AppReviewPage").then((module) => ({
    default: module.AppReviewPage,
  })),
);
const DeveloperVerificationPage = lazy(() =>
  import("../pages/developer/DeveloperVerificationPage").then((module) => ({
    default: module.DeveloperVerificationPage,
  })),
);
const AppBasicsPage = lazy(() =>
  import("../pages/developer/developerRoutePages").then((module) => ({
    default: module.AppBasicsPage,
  })),
);
const AppListingPage = lazy(() =>
  import("../pages/developer/developerRoutePages").then((module) => ({
    default: module.AppListingPage,
  })),
);
const AppMediaPage = lazy(() =>
  import("../pages/developer/developerRoutePages").then((module) => ({
    default: module.AppMediaPage,
  })),
);
const AppBuildPage = lazy(() =>
  import("../pages/developer/developerRoutePages").then((module) => ({
    default: module.AppBuildPage,
  })),
);
const AppCompatibilityPage = lazy(() =>
  import("../pages/developer/developerRoutePages").then((module) => ({
    default: module.AppCompatibilityPage,
  })),
);
const AppPermissionsPage = lazy(() =>
  import("../pages/developer/developerRoutePages").then((module) => ({
    default: module.AppPermissionsPage,
  })),
);
const AppRewardsEditorPage = lazy(() =>
  import("../pages/developer/developerRoutePages").then((module) => ({
    default: module.AppRewardsEditorPage,
  })),
);
const AppTestingPage = lazy(() =>
  import("../pages/developer/developerRoutePages").then((module) => ({
    default: module.AppTestingPage,
  })),
);
const AppSupportSettingsPage = lazy(() =>
  import("../pages/developer/developerRoutePages").then((module) => ({
    default: module.AppSupportSettingsPage,
  })),
);
const AppReleasesPage = lazy(() =>
  import("../pages/developer/developerRoutePages").then((module) => ({
    default: module.AppReleasesPage,
  })),
);
const CreateReleasePage = lazy(() =>
  import("../pages/developer/developerRoutePages").then((module) => ({
    default: module.CreateReleasePage,
  })),
);
const AppAnalyticsPage = lazy(() =>
  import("../pages/developer/developerRoutePages").then((module) => ({
    default: module.AppAnalyticsPage,
  })),
);
const AppInstallationsPage = lazy(() =>
  import("../pages/developer/developerRoutePages").then((module) => ({
    default: module.AppInstallationsPage,
  })),
);
const AppRewardsDashboardPage = lazy(() =>
  import("../pages/developer/developerRoutePages").then((module) => ({
    default: module.AppRewardsDashboardPage,
  })),
);
const DeveloperSubmissionsPage = lazy(() =>
  import("../pages/developer/developerRoutePages").then((module) => ({
    default: module.DeveloperSubmissionsPage,
  })),
);
const DeveloperReleasesPage = lazy(() =>
  import("../pages/developer/developerRoutePages").then((module) => ({
    default: module.DeveloperReleasesPage,
  })),
);
const DeveloperAnalyticsPage = lazy(() =>
  import("../pages/developer/developerRoutePages").then((module) => ({
    default: module.DeveloperAnalyticsPage,
  })),
);
const DeveloperRewardsPage = lazy(() =>
  import("../pages/developer/developerRoutePages").then((module) => ({
    default: module.DeveloperRewardsPage,
  })),
);
const DeveloperOrganizationPage = lazy(() =>
  import("../pages/developer/developerRoutePages").then((module) => ({
    default: module.DeveloperOrganizationPage,
  })),
);
const DeveloperTeamPage = lazy(() =>
  import("../pages/developer/developerRoutePages").then((module) => ({
    default: module.DeveloperTeamPage,
  })),
);
const DeveloperProfilePage = lazy(() =>
  import("../pages/developer/developerRoutePages").then((module) => ({
    default: module.DeveloperProfilePage,
  })),
);
const DeveloperSettingsPage = lazy(() =>
  import("../pages/developer/developerRoutePages").then((module) => ({
    default: module.DeveloperSettingsPage,
  })),
);
const DeveloperDocumentationPage = lazy(() =>
  import("../pages/developer/developerRoutePages").then((module) => ({
    default: module.DeveloperDocumentationPage,
  })),
);
const DeveloperSupportPage = lazy(() =>
  import("../pages/developer/developerRoutePages").then((module) => ({
    default: module.DeveloperSupportPage,
  })),
);

function RouteFallback() {
  return <LoadingSkeleton title="Loading" rows={3} />;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <ScenarioUrlSync />
      <InstallationPlayback />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<OverviewPage />} />
            <Route path="marketplace" element={<MarketplaceHomePage />} />
            <Route
              path="marketplace/search"
              element={<MarketplaceSearchPage />}
            />
            <Route path="marketplace/apps/:appId" element={<AppDetailPage />} />
            <Route
              path="marketplace/apps/:appId/install"
              element={<InstallScopePage />}
            />
            <Route
              path="marketplace/apps/:appId/install/review"
              element={<InstallReviewPage />}
            />
            <Route
              path="marketplace/apps/:appId/install/progress"
              element={<InstallProgressPage />}
            />
            <Route
              path="marketplace/apps/:appId/install/results"
              element={<InstallResultsPage />}
            />
            <Route path="installed" element={<InstalledAppsPage />} />
            <Route
              path="installed/:appId"
              element={<InstalledAppDetailPage />}
            />
            <Route
              path="installed/:appId/nodes/:nodeId"
              element={<NodeAppInstallationPage />}
            />
            <Route path="nodes" element={<NodesPage />} />
            <Route path="nodes/:nodeId" element={<NodeDetailPage />} />
            <Route path="rewards" element={<RewardsPage />} />
            <Route path="activity" element={<ActivityPage />} />
            <Route path="onboarding" element={<OnboardingHubPage />} />
            <Route
              path="onboarding/developer"
              element={<DeveloperOnboardingPage />}
            />
            <Route
              path="onboarding/:flowId"
              element={<OnboardingFlowStartPage />}
            />
            <Route
              path="onboarding/:flowId/:stepId"
              element={<OnboardingFlowPage />}
            />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="developer" element={<DeveloperShell />}>
            <Route index element={<DeveloperDashboardPage />} />
            <Route path="apps" element={<DeveloperAppsPage />} />
            <Route path="apps/new" element={<CreateAppPage />} />
            <Route path="apps/:appId" element={<AppDashboardPage />} />
            <Route path="apps/:appId/edit" element={<AppBasicsPage />} />
            <Route path="apps/:appId/listing" element={<AppListingPage />} />
            <Route path="apps/:appId/media" element={<AppMediaPage />} />
            <Route path="apps/:appId/build" element={<AppBuildPage />} />
            <Route
              path="apps/:appId/compatibility"
              element={<AppCompatibilityPage />}
            />
            <Route
              path="apps/:appId/permissions"
              element={<AppPermissionsPage />}
            />
            <Route
              path="apps/:appId/rewards"
              element={<AppRewardsEditorPage />}
            />
            <Route path="apps/:appId/testing" element={<AppTestingPage />} />
            <Route path="apps/:appId/preview" element={<AppPreviewPage />} />
            <Route path="apps/:appId/submit" element={<AppSubmitPage />} />
            <Route
              path="apps/:appId/submission"
              element={<AppSubmissionPage />}
            />
            <Route path="apps/:appId/review" element={<AppReviewPage />} />
            <Route path="apps/:appId/releases" element={<AppReleasesPage />} />
            <Route
              path="apps/:appId/releases/new"
              element={<CreateReleasePage />}
            />
            <Route path="apps/:appId/analytics" element={<AppAnalyticsPage />} />
            <Route
              path="apps/:appId/installations"
              element={<AppInstallationsPage />}
            />
            <Route
              path="apps/:appId/rewards-dashboard"
              element={<AppRewardsDashboardPage />}
            />
            <Route
              path="apps/:appId/settings"
              element={<AppSupportSettingsPage />}
            />
            <Route path="submissions" element={<DeveloperSubmissionsPage />} />
            <Route path="releases" element={<DeveloperReleasesPage />} />
            <Route path="analytics" element={<DeveloperAnalyticsPage />} />
            <Route path="rewards" element={<DeveloperRewardsPage />} />
            <Route
              path="organization"
              element={<DeveloperOrganizationPage />}
            />
            <Route path="team" element={<DeveloperTeamPage />} />
            <Route path="profile" element={<DeveloperProfilePage />} />
            <Route
              path="verification"
              element={<DeveloperVerificationPage />}
            />
            <Route path="settings" element={<DeveloperSettingsPage />} />
            <Route path="docs" element={<DeveloperDocumentationPage />} />
            <Route path="support" element={<DeveloperSupportPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <PrototypeDebugger />
      <PrototypeToast />
    </BrowserRouter>
  );
}
