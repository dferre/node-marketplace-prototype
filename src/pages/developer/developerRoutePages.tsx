import { DeveloperPlaceholderPage } from "./DeveloperPlaceholderPage";
import { AppEditorPage } from "./AppEditorPage";

export function DeveloperOrganizationPage() {
  return (
    <DeveloperPlaceholderPage
      title="Organization"
      description="Manage legal name, public profile, and verification documents for the developer organization."
      primaryTo="/developer/verification"
      primaryLabel="Open verification"
    />
  );
}

export function DeveloperTeamPage() {
  return (
    <DeveloperPlaceholderPage
      title="Team"
      description="Invite members and assign owner, administrator, developer, content, analyst, or viewer roles."
    />
  );
}

export function DeveloperProfilePage() {
  return (
    <DeveloperPlaceholderPage
      title="Developer profile"
      description="Public marketplace profile: display name, verification badge, support links, and published apps."
    />
  );
}

export function DeveloperSettingsPage() {
  return (
    <DeveloperPlaceholderPage
      title="Developer settings"
      description="Notification preferences, payout placeholders, and portal defaults for this prototype."
    />
  );
}

export function DeveloperDocumentationPage() {
  return (
    <DeveloperPlaceholderPage
      title="Documentation"
      description="Links to publishing policy, permission rules, and reward disclosure guidance."
    />
  );
}

export function DeveloperSupportPage() {
  return (
    <DeveloperPlaceholderPage
      title="Support"
      description="Contact marketplace review support for verification, submission, and suspension questions."
    />
  );
}

export function DeveloperSubmissionsPage() {
  return (
    <DeveloperPlaceholderPage
      title="Submissions"
      description="Cross-app submission queue. Open an app’s submission timeline for round history."
      primaryTo="/developer/apps"
      primaryLabel="Open My Apps"
    />
  );
}

export function DeveloperReleasesPage() {
  return (
    <DeveloperPlaceholderPage
      title="Releases"
      description="Organization-wide release list. Create releases from an individual app."
      primaryTo="/developer/apps"
      primaryLabel="Open My Apps"
    />
  );
}

export function DeveloperAnalyticsPage() {
  return (
    <DeveloperPlaceholderPage
      title="Analytics"
      description="Aggregate installs, conversion, and reward distribution across your apps."
    />
  );
}

export function DeveloperRewardsPage() {
  return (
    <DeveloperPlaceholderPage
      title="Rewards"
      description="Program-level reward configuration and operator distribution summaries."
    />
  );
}

export function AppBasicsPage() {
  return <AppEditorPage step="basics" />;
}
export function AppListingPage() {
  return <AppEditorPage step="listing" />;
}
export function AppMediaPage() {
  return <AppEditorPage step="media" />;
}
export function AppBuildPage() {
  return <AppEditorPage step="build" />;
}
export function AppCompatibilityPage() {
  return <AppEditorPage step="compatibility" />;
}
export function AppPermissionsPage() {
  return <AppEditorPage step="permissions" />;
}
export function AppRewardsEditorPage() {
  return <AppEditorPage step="rewards" />;
}
export function AppTestingPage() {
  return <AppEditorPage step="testing" />;
}
export function AppSupportSettingsPage() {
  return <AppEditorPage step="support" />;
}

export function AppReleasesPage() {
  return (
    <DeveloperPlaceholderPage
      title="App releases"
      description="Version history, staged rollout, pause, and rollback controls for this app."
    />
  );
}

export function CreateReleasePage() {
  return (
    <DeveloperPlaceholderPage
      title="Create release"
      description="Enter version, upload simulated build, review permission changes, and choose rollout plan."
    />
  );
}

export function AppAnalyticsPage() {
  return (
    <DeveloperPlaceholderPage
      title="App analytics"
      description="Wireframe metrics for views, installs, health, and rewards for this app."
    />
  );
}

export function AppInstallationsPage() {
  return (
    <DeveloperPlaceholderPage
      title="Installations"
      description="Aggregated installation health only — no private node-owner controls."
    />
  );
}

export function AppRewardsDashboardPage() {
  return (
    <DeveloperPlaceholderPage
      title="App rewards dashboard"
      description="Reward pool, eligibility, and operator-facing estimate preview for this app."
    />
  );
}
