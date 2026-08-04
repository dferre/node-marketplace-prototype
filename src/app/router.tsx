import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoadingSkeleton } from "../components/shared/LoadingSkeleton";
import { InstallationPlayback } from "../components/prototype/InstallationPlayback";
import { PrototypeDebugger } from "../components/prototype/PrototypeDebugger";
import { PrototypeToast } from "../components/prototype/PrototypeToast";
import { ScenarioUrlSync } from "../components/prototype/ScenarioUrlSync";
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
      <PrototypeDebugger />
      <PrototypeToast />
    </BrowserRouter>
  );
}
