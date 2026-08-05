import { createAtlasDeveloperApp } from "../data/developerApps";
import type {
  DeveloperApp,
  DeveloperOverrides,
  EditorStepId,
  ReviewFindingStatus,
} from "../types/developer";

export function patchDeveloperApp(
  apps: DeveloperApp[],
  appId: string,
  patch: Partial<DeveloperApp>,
): DeveloperApp[] {
  return apps.map((app) =>
    app.id === appId
      ? {
          ...app,
          ...patch,
          lastSavedAt: new Date().toISOString(),
        }
      : app,
  );
}

export function applyFindingStatus(
  app: DeveloperApp,
  findingId: string,
  status: ReviewFindingStatus,
  developerResponse?: string,
): DeveloperApp {
  if (!app.submission) return app;
  return {
    ...app,
    submission: {
      ...app.submission,
      findings: app.submission.findings.map((finding) =>
        finding.id === findingId
          ? {
              ...finding,
              status,
              developerResponse:
                developerResponse ?? finding.developerResponse,
            }
          : finding,
      ),
    },
    lastSavedAt: new Date().toISOString(),
  };
}

export function buildResubmittedApp(app: DeveloperApp): DeveloperApp {
  const revised = createAtlasDeveloperApp("resubmitted");
  return {
    ...revised,
    id: app.id,
    organizationId: app.organizationId,
    attentionItems: ["Awaiting review of resubmission"],
  };
}

export function buildPublishedApp(app: DeveloperApp): DeveloperApp {
  const published = createAtlasDeveloperApp("published");
  return {
    ...published,
    id: app.id,
    organizationId: app.organizationId,
    attentionItems: [],
  };
}

export function buildApprovedApp(app: DeveloperApp): DeveloperApp {
  const approved = createAtlasDeveloperApp("approved");
  return {
    ...approved,
    id: app.id,
    organizationId: app.organizationId,
    attentionItems: ["Publish approved version 1.0.1"],
  };
}

export function mergeDeveloperOverrides(
  overrides?: Partial<DeveloperOverrides>,
): DeveloperOverrides {
  return {
    uploadUnavailable: false,
    reviewUnavailable: false,
    analyticsUnavailable: false,
    rewardsUnavailable: false,
    securityScanUnavailable: false,
    publicationFailure: false,
    ...overrides,
  };
}

export function markStepComplete(
  app: DeveloperApp,
  step: EditorStepId,
): DeveloperApp {
  return {
    ...app,
    completionByStep: {
      ...app.completionByStep,
      [step]: "complete",
    },
    lastSavedAt: new Date().toISOString(),
  };
}
