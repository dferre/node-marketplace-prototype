import {
  Button,
  Checkbox,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@relume_io/relume-ui";
import { useNavigate } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { developerScenarios } from "../../data/developerScenarios";
import { usePrototypeStore } from "../../store/prototypeStore";
import type { DeveloperOverrides } from "../../types/developer";
import {
  createAtlasDeveloperApp,
  createEmptyDraftApp,
} from "../../data/developerApps";

const OVERRIDE_LABELS: Record<keyof DeveloperOverrides, string> = {
  uploadUnavailable: "Upload unavailable",
  reviewUnavailable: "Review unavailable",
  analyticsUnavailable: "Analytics unavailable",
  rewardsUnavailable: "Rewards unavailable",
  securityScanUnavailable: "Security scan unavailable",
  publicationFailure: "Publication failure",
};

type AtlasPhase = Parameters<typeof createAtlasDeveloperApp>[0];

const APP_PHASE_JUMPS: {
  id: string;
  label: string;
  phase: AtlasPhase | "empty-draft";
  route: string;
}[] = [
  {
    id: "draft",
    label: "Draft incomplete",
    phase: "empty-draft",
    route: "/developer/apps/dapp_atlas_storage_dev/edit",
  },
  {
    id: "ready",
    label: "Ready to submit",
    phase: "draft-ready",
    route: "/developer/apps/dapp_atlas_storage_dev/submit",
  },
  {
    id: "changes",
    label: "Changes requested",
    phase: "changes-requested",
    route: "/developer/apps/dapp_atlas_storage_dev/review",
  },
  {
    id: "approved",
    label: "Approved",
    phase: "approved",
    route: "/developer/apps/dapp_atlas_storage_dev",
  },
  {
    id: "published",
    label: "Published",
    phase: "published",
    route: "/developer/apps/dapp_atlas_storage_dev",
  },
];

export function DeveloperDebuggerControls() {
  const navigate = useNavigate();
  const {
    developerScenarioId,
    portal,
    loadDeveloperScenario,
    setActiveDeveloperId,
    setActiveDeveloperAppId,
    setDeveloperOverride,
    updateDeveloperApp,
  } = usePrototypeStore(
    useShallow((state) => ({
      developerScenarioId: state.developerScenarioId,
      portal: state.developerPortal,
      loadDeveloperScenario: state.loadDeveloperScenario,
      setActiveDeveloperId: state.setActiveDeveloperId,
      setActiveDeveloperAppId: state.setActiveDeveloperAppId,
      setDeveloperOverride: state.setDeveloperOverride,
      updateDeveloperApp: state.updateDeveloperApp,
    })),
  );

  const activeDeveloper = portal.developers.find(
    (item) => item.id === portal.activeDeveloperId,
  );
  const activeApp = portal.apps.find(
    (item) => item.id === portal.activeDeveloperAppId,
  );

  const applyScenario = (id: string) => {
    const route = loadDeveloperScenario(id);
    if (route) navigate(route);
  };

  const jumpToPhase = (
    phase: AtlasPhase | "empty-draft",
    route: string,
  ) => {
    const next =
      phase === "empty-draft"
        ? {
            ...createEmptyDraftApp("org_atlas", "dapp_atlas_storage_dev"),
            basics: {
              ...createEmptyDraftApp("org_atlas", "dapp_atlas_storage_dev")
                .basics,
              name: "Atlas Storage Developer Edition",
              slug: "atlas-storage-dev",
            },
          }
        : createAtlasDeveloperApp(phase);
    updateDeveloperApp(next.id, next);
    setActiveDeveloperAppId(next.id);
    navigate(route);
  };

  return (
    <div className="flex flex-col gap-3">
      <section className="flex flex-col gap-2 border border-border-primary bg-background-primary p-3">
        <h3 className="text-sm font-semibold text-text-primary">
          Developer scenario
        </h3>
        <Label htmlFor="dev-scenario-select">Active developer scenario</Label>
        <Select value={developerScenarioId} onValueChange={applyScenario}>
          <SelectTrigger id="dev-scenario-select">
            <SelectValue placeholder="Select scenario" />
          </SelectTrigger>
          <SelectContent>
            {developerScenarios.map((scenario) => (
              <SelectItem key={scenario.id} value={scenario.id}>
                {scenario.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-text-secondary">
          {
            developerScenarios.find((item) => item.id === developerScenarioId)
              ?.description
          }
        </p>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => navigate("/developer")}
        >
          Open developer overview
        </Button>
      </section>

      <section className="flex flex-col gap-2 border border-border-primary bg-background-primary p-3">
        <h3 className="text-sm font-semibold text-text-primary">
          Developer persona
        </h3>
        <Label htmlFor="dev-persona-select">Active developer</Label>
        <Select
          value={portal.activeDeveloperId}
          onValueChange={setActiveDeveloperId}
        >
          <SelectTrigger id="dev-persona-select">
            <SelectValue placeholder="Select developer" />
          </SelectTrigger>
          <SelectContent>
            {portal.developers.map((developer) => (
              <SelectItem key={developer.id} value={developer.id}>
                {developer.personaLabel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-text-secondary">
          {activeDeveloper
            ? `${activeDeveloper.displayName} · ${activeDeveloper.role} · verification: ${activeDeveloper.verificationStatus}`
            : "No developer selected"}
        </p>
      </section>

      <section className="flex flex-col gap-2 border border-border-primary bg-background-primary p-3">
        <h3 className="text-sm font-semibold text-text-primary">Active app</h3>
        <Label htmlFor="dev-app-select">Developer app</Label>
        <Select
          value={portal.activeDeveloperAppId ?? "none"}
          onValueChange={(value) =>
            setActiveDeveloperAppId(value === "none" ? null : value)
          }
        >
          <SelectTrigger id="dev-app-select">
            <SelectValue placeholder="Select app" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No app</SelectItem>
            {portal.apps.map((app) => (
              <SelectItem key={app.id} value={app.id}>
                {app.basics.name} ({app.marketplaceStatus})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {activeApp ? (
          <div className="space-y-1 text-sm text-text-secondary">
            <p>Status: {activeApp.marketplaceStatus}</p>
            <p>Build: {activeApp.build.status}</p>
            <p>
              Submission: {activeApp.submission?.status ?? "none"} · findings:{" "}
              {activeApp.submission?.findings.length ?? 0}
            </p>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => navigate(`/developer/apps/${activeApp.id}`)}
            >
              Open app dashboard
            </Button>
          </div>
        ) : null}
      </section>

      <section className="flex flex-col gap-2 border border-border-primary bg-background-primary p-3">
        <h3 className="text-sm font-semibold text-text-primary">
          Atlas vertical-slice jumps
        </h3>
        <div className="flex flex-wrap gap-2">
          {APP_PHASE_JUMPS.map((jump) => (
            <Button
              key={jump.id}
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => jumpToPhase(jump.phase, jump.route)}
            >
              {jump.label}
            </Button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2 border border-border-primary bg-background-primary p-3">
        <h3 className="text-sm font-semibold text-text-primary">
          Developer system overrides
        </h3>
        <div className="flex flex-col gap-2">
          {(Object.keys(OVERRIDE_LABELS) as (keyof DeveloperOverrides)[]).map(
            (key) => (
              <label
                key={key}
                className="flex items-center gap-2 text-sm text-text-primary"
              >
                <Checkbox
                  checked={portal.overrides[key]}
                  onCheckedChange={(checked) =>
                    setDeveloperOverride(key, checked === true)
                  }
                  aria-label={OVERRIDE_LABELS[key]}
                />
                <span>{OVERRIDE_LABELS[key]}</span>
              </label>
            ),
          )}
        </div>
      </section>
    </div>
  );
}
