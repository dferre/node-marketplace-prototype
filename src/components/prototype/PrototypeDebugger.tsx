import {
  Checkbox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  useMediaQuery,
} from "@relume_io/relume-ui";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { nodeFleets } from "../../data/nodes";
import { scenarios } from "../../data/scenarios";
import { debuggerIcons } from "../../icons/iconMap";
import { listScenarios, usePrototypeStore } from "../../store/prototypeStore";
import {
  selectActiveApp,
  selectActiveUser,
  selectCompatibilitySummary,
  selectFixtureSummary,
} from "../../store/selectors";
import type {
  DebuggerTab,
  NodeInstallationStage,
  OverallInstallationStatus,
  PrototypeOverrides,
} from "../../types/prototype";
import { INSTALLATION_STAGES } from "../../utils/installationStages";
import {
  buildScenarioUrl,
  pickStateSnapshot,
} from "../../utils/scenarioUrl";
import {
  debuggerBtnClass,
  debuggerFieldClass,
  debuggerHeadingClass,
  debuggerHelpClass,
  debuggerLabelClass,
  debuggerSectionClass,
  debuggerTabActiveClass,
  debuggerTabIdleClass,
} from "./debuggerChrome";
import { StyleEditor } from "./StyleEditor";

const TABS: { id: DebuggerTab; label: string }[] = [
  { id: "scenario", label: "Scenario" },
  { id: "data", label: "Data" },
  { id: "installation", label: "Installation" },
  { id: "system", label: "System" },
  { id: "onboarding", label: "Onboarding" },
  { id: "style", label: "Style" },
  { id: "debug", label: "Debug" },
];

const OVERRIDE_LABELS: Record<keyof PrototypeOverrides, string> = {
  marketplaceUnavailable: "Marketplace unavailable",
  compatibilityUnavailable: "Compatibility unavailable",
  rewardsUnavailable: "Rewards unavailable",
  staleNodeData: "Stale node data",
  slowInstallation: "Slow installation",
  appSuspended: "App suspended",
  appRemoved: "App removed",
  updateRequired: "Update required",
  newPermissionsRequired: "New permissions required",
  userPermissionChanged: "User permission changed",
  networkOffline: "Network offline",
  catalogLoading: "Catalog loading",
};

const OVERALL_STATUSES: OverallInstallationStatus[] = [
  "not-started",
  "in-progress",
  "success",
  "partial-success",
  "failure",
  "queued",
  "canceled",
];

function DebuggerPanelBody() {
  const navigate = useNavigate();
  const activeTab = usePrototypeStore((state) => state.debugger.activeTab);
  const setDebuggerTab = usePrototypeStore((state) => state.setDebuggerTab);
  const loadScenario = usePrototypeStore((state) => state.loadScenario);
  const scenarioId = usePrototypeStore((state) => state.scenarioId);
  const activeUserId = usePrototypeStore((state) => state.activeUserId);
  const activeAppId = usePrototypeStore((state) => state.activeAppId);
  const nodeFleetId = usePrototypeStore((state) => state.nodeFleetId);
  const users = usePrototypeStore((state) => state.users);
  const apps = usePrototypeStore((state) => state.apps);
  const nodes = usePrototypeStore((state) => state.nodes);
  const installation = usePrototypeStore((state) => state.installation);
  const overrides = usePrototypeStore((state) => state.overrides);
  const setActiveUserId = usePrototypeStore((state) => state.setActiveUserId);
  const setActiveAppId = usePrototypeStore((state) => state.setActiveAppId);
  const setNodeFleetId = usePrototypeStore((state) => state.setNodeFleetId);
  const setOverallInstallationStatus = usePrototypeStore(
    (state) => state.setOverallInstallationStatus,
  );
  const setNodeInstallationStage = usePrototypeStore(
    (state) => state.setNodeInstallationStage,
  );
  const setFocusedNodeId = usePrototypeStore((state) => state.setFocusedNodeId);
  const setSelectedNodeIds = usePrototypeStore((state) => state.setSelectedNodeIds);
  const setOverride = usePrototypeStore((state) => state.setOverride);
  const playInstallation = usePrototypeStore((state) => state.playInstallation);
  const pauseInstallation = usePrototypeStore((state) => state.pauseInstallation);
  const advanceInstallation = usePrototypeStore(
    (state) => state.advanceInstallation,
  );
  const completeAllInstallations = usePrototypeStore(
    (state) => state.completeAllInstallations,
  );
  const failFocusedNode = usePrototypeStore((state) => state.failFocusedNode);
  const resetInstallation = usePrototypeStore((state) => state.resetInstallation);
  const resetPrototypeState = usePrototypeStore(
    (state) => state.resetPrototypeState,
  );
  const onboarding = usePrototypeStore((state) => state.onboarding);
  const resetOnboarding = usePrototypeStore((state) => state.resetOnboarding);
  const restoreOnboardingTip = usePrototypeStore(
    (state) => state.restoreOnboardingTip,
  );
  const showToast = usePrototypeStore((state) => state.showToast);
  const activeUser = usePrototypeStore(selectActiveUser);
  const activeApp = usePrototypeStore(selectActiveApp);
  const summary = usePrototypeStore(useShallow(selectFixtureSummary));
  const compatibilitySummary = usePrototypeStore(
    useShallow(selectCompatibilitySummary),
  );

  const applyScenario = (id: string) => {
    const route = loadScenario(id, { preserveDebugger: true });
    if (!route) return;
    const state = usePrototypeStore.getState();
    navigate(
      buildScenarioUrl(route, {
        scenarioId: state.scenarioId,
        activeUserId: state.activeUserId,
        activeAppId: state.activeAppId,
        nodeFleetId: state.nodeFleetId,
      }),
    );
  };

  const copyScenarioUrl = async () => {
    const scenario = scenarios.find((item) => item.id === scenarioId);
    const pathname = scenario?.startingRoute ?? window.location.pathname;
    const url = `${window.location.origin}${buildScenarioUrl(pathname, {
      scenarioId,
      activeUserId,
      activeAppId,
      nodeFleetId,
    })}`;
    await navigator.clipboard.writeText(url);
    showToast("Scenario URL copied");
  };

  const copyStateJson = async () => {
    const snapshot = pickStateSnapshot(usePrototypeStore.getState());
    await navigator.clipboard.writeText(JSON.stringify(snapshot, null, 2));
    showToast("State JSON copied");
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1" role="tablist" aria-label="Debugger sections">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={
              activeTab === tab.id ? debuggerTabActiveClass : debuggerTabIdleClass
            }
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setDebuggerTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "scenario" ? (
        <section className={debuggerSectionClass}>
          <h3 className={debuggerHeadingClass}>Scenario</h3>
          <div className="flex flex-col gap-2">
            <Label htmlFor="scenario-select" className={debuggerLabelClass}>
              Active scenario
            </Label>
            <Select
              value={scenarioId}
              onValueChange={(value) => applyScenario(value)}
            >
              <SelectTrigger id="scenario-select" className={debuggerFieldClass}>
                <SelectValue placeholder="Select scenario" />
              </SelectTrigger>
              <SelectContent>
                {listScenarios().map((scenario) => (
                  <SelectItem key={scenario.id} value={scenario.id}>
                    {scenario.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className={debuggerHelpClass}>
              {scenarios.find((item) => item.id === scenarioId)?.description}
            </p>
          </div>
          <button
            type="button"
            className={debuggerBtnClass}
            onClick={() => {
              resetPrototypeState();
              navigate(scenarios[0]?.startingRoute ?? "/marketplace");
            }}
          >
            Reset
          </button>
        </section>
      ) : null}

      {activeTab === "data" ? (
        <div className="flex flex-col gap-3">
          <section className={`${debuggerSectionClass} gap-2`}>
            <h3 className={debuggerHeadingClass}>User</h3>
            <Label htmlFor="user-select" className={debuggerLabelClass}>
              Active user
            </Label>
            <Select value={activeUserId} onValueChange={setActiveUserId}>
              <SelectTrigger id="user-select" className={debuggerFieldClass}>
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className={debuggerHelpClass}>
              {activeUser?.role ?? "No user selected"} · can install:{" "}
              {activeUser?.canInstallApps ? "yes" : "no"}
            </p>
          </section>

          <section className={`${debuggerSectionClass} gap-2`}>
            <h3 className={debuggerHeadingClass}>App</h3>
            <Label htmlFor="app-select" className={debuggerLabelClass}>
              Active app
            </Label>
            <Select value={activeAppId} onValueChange={setActiveAppId}>
              <SelectTrigger id="app-select" className={debuggerFieldClass}>
                <SelectValue placeholder="Select app" />
              </SelectTrigger>
              <SelectContent>
                {apps.map((app) => (
                  <SelectItem key={app.id} value={app.id}>
                    {app.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className={debuggerHelpClass}>
              {activeApp?.category ?? "n/a"} · {activeApp?.status ?? "n/a"} ·{" "}
              {activeApp?.resourceIntensity ?? "n/a"} resource
            </p>
          </section>

          <section className={`${debuggerSectionClass} gap-2`}>
            <h3 className={debuggerHeadingClass}>Node fleet</h3>
            <Label htmlFor="fleet-select" className={debuggerLabelClass}>
              Active fleet
            </Label>
            <Select value={nodeFleetId} onValueChange={setNodeFleetId}>
              <SelectTrigger id="fleet-select" className={debuggerFieldClass}>
                <SelectValue placeholder="Select fleet" />
              </SelectTrigger>
              <SelectContent>
                {nodeFleets.map((fleet) => (
                  <SelectItem key={fleet.id} value={fleet.id}>
                    {fleet.name} ({fleet.nodes.length})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className={debuggerHelpClass}>
              {nodes.length} nodes loaded · compat{" "}
              {compatibilitySummary.compatible}/
              {compatibilitySummary["compatible-with-warnings"]} warn /{" "}
              {compatibilitySummary["offline-queued"]} queued /{" "}
              {compatibilitySummary.incompatible} incompatible
            </p>
          </section>
        </div>
      ) : null}

      {activeTab === "installation" ? (
        <section className={debuggerSectionClass}>
          <h3 className={debuggerHeadingClass}>Installation</h3>

          <div className="flex flex-col gap-2">
            <Label htmlFor="overall-status" className={debuggerLabelClass}>
              Overall result
            </Label>
            <Select
              value={installation.overallStatus}
              onValueChange={(value) =>
                setOverallInstallationStatus(value as OverallInstallationStatus)
              }
            >
              <SelectTrigger id="overall-status" className={debuggerFieldClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OVERALL_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="focused-node" className={debuggerLabelClass}>
              Focused node
            </Label>
            <Select
              value={installation.focusedNodeId ?? undefined}
              onValueChange={(value) => {
                setFocusedNodeId(value);
                if (!installation.selectedNodeIds.includes(value)) {
                  setSelectedNodeIds([...installation.selectedNodeIds, value]);
                }
              }}
            >
              <SelectTrigger id="focused-node" className={debuggerFieldClass}>
                <SelectValue placeholder="Select node" />
              </SelectTrigger>
              <SelectContent>
                {nodes.map((node) => (
                  <SelectItem key={node.id} value={node.id}>
                    {node.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="node-stage" className={debuggerLabelClass}>
              Focused node stage
            </Label>
            <Select
              value={
                installation.focusedNodeId
                  ? (installation.nodeStatuses[installation.focusedNodeId]
                      ?.stage ?? "queued")
                  : undefined
              }
              onValueChange={(value) => {
                if (!installation.focusedNodeId) return;
                setNodeInstallationStage(
                  installation.focusedNodeId,
                  value as NodeInstallationStage,
                );
              }}
              disabled={!installation.focusedNodeId}
            >
              <SelectTrigger id="node-stage" className={debuggerFieldClass}>
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                {INSTALLATION_STAGES.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" className={debuggerBtnClass} onClick={playInstallation}>
              Play
            </button>
            <button type="button" className={debuggerBtnClass} onClick={pauseInstallation}>
              Pause
            </button>
            <button type="button" className={debuggerBtnClass} onClick={advanceInstallation}>
              Advance one stage
            </button>
            <button
              type="button"
              className={debuggerBtnClass}
              onClick={completeAllInstallations}
            >
              Complete all
            </button>
            <button type="button" className={debuggerBtnClass} onClick={failFocusedNode}>
              Fail selected node
            </button>
            <button type="button" className={debuggerBtnClass} onClick={resetInstallation}>
              Reset installation
            </button>
          </div>

          <p className={debuggerHelpClass}>
            Selected: {installation.selectedNodeIds.length} · Playing:{" "}
            {installation.isPlaying ? "yes" : "no"}
          </p>

          <ul className="prototype-debugger-list space-y-1 overflow-y-auto text-text-sm-regular text-text-primary">
            {installation.selectedNodeIds.map((nodeId) => {
              const node = nodes.find((item) => item.id === nodeId);
              const stage = installation.nodeStatuses[nodeId]?.stage ?? "not set";
              return (
                <li
                  key={nodeId}
                  className="rounded-06 border border-border-base px-2 py-1"
                >
                  {node?.name ?? nodeId}: {stage}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {activeTab === "system" ? (
        <section className={debuggerSectionClass}>
          <h3 className={debuggerHeadingClass}>System overrides</h3>
          <div className="flex flex-col gap-2">
            {(Object.keys(OVERRIDE_LABELS) as (keyof PrototypeOverrides)[]).map(
              (key) => (
                <label
                  key={key}
                  className="flex items-center gap-2 text-text-sm-regular text-text-primary"
                >
                  <Checkbox
                    checked={overrides[key]}
                    onCheckedChange={(checked) =>
                      setOverride(key, checked === true)
                    }
                    aria-label={OVERRIDE_LABELS[key]}
                  />
                  <span>{OVERRIDE_LABELS[key]}</span>
                </label>
              ),
            )}
          </div>
        </section>
      ) : null}

      {activeTab === "onboarding" ? (
        <section className={debuggerSectionClass}>
          <h3 className={debuggerHeadingClass}>Onboarding jumps</h3>
          <p className={debuggerHelpClass}>
            Completed:{" "}
            {onboarding.completedFlows.length
              ? onboarding.completedFlows.join(", ")
              : "none"}
          </p>
          <p className={debuggerHelpClass}>
            Dismissed tips:{" "}
            {onboarding.dismissedTips.length
              ? onboarding.dismissedTips.join(", ")
              : "none"}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={debuggerBtnClass}
              onClick={() => navigate("/onboarding")}
            >
              Hub
            </button>
            <button
              type="button"
              className={debuggerBtnClass}
              onClick={() => navigate("/onboarding/account")}
            >
              Account
            </button>
            <button
              type="button"
              className={debuggerBtnClass}
              onClick={() => navigate("/onboarding/new-node")}
            >
              New node
            </button>
            <button
              type="button"
              className={debuggerBtnClass}
              onClick={() => navigate("/onboarding/import-node")}
            >
              Import node
            </button>
            <button
              type="button"
              className={debuggerBtnClass}
              onClick={() => navigate("/onboarding/developer")}
            >
              Developer stub
            </button>
            <button
              type="button"
              className={debuggerBtnClass}
              onClick={() =>
                navigate("/marketplace/apps/app_atlas_storage/install")
              }
            >
              First-install coach
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={debuggerBtnClass}
              onClick={() => {
                restoreOnboardingTip("marketplace-basics");
                restoreOnboardingTip("first-install-coach");
                showToast("Onboarding tips restored");
              }}
            >
              Restore tips
            </button>
            <button
              type="button"
              className={debuggerBtnClass}
              onClick={() => {
                resetOnboarding();
                showToast("Onboarding progress reset");
              }}
            >
              Reset onboarding
            </button>
          </div>
        </section>
      ) : null}

      {activeTab === "style" ? <StyleEditor /> : null}

      {activeTab === "debug" ? (
        <section className={debuggerSectionClass}>
          <h3 className={debuggerHeadingClass}>Debug data</h3>
          <div className="grid grid-cols-2 gap-2 text-text-sm-regular text-text-primary">
            <p>Scenario: {summary.scenarioId}</p>
            <p>Users: {summary.userCount}</p>
            <p>Apps: {summary.appCount}</p>
            <p>Nodes: {summary.nodeCount}</p>
            <p>Deployments: {summary.deploymentCount}</p>
            <p>Selected: {summary.selectedCount}</p>
            <p>Status: {summary.overallStatus}</p>
            <p>Overrides on: {summary.overridesEnabled}</p>
          </div>
          <Label htmlFor="debug-route" className={debuggerLabelClass}>
            Current path
          </Label>
          <Input
            id="debug-route"
            readOnly
            value={window.location.pathname + window.location.search}
            className={debuggerFieldClass}
          />
          <div className="flex flex-wrap gap-2">
            <button type="button" className={debuggerBtnClass} onClick={copyScenarioUrl}>
              Copy scenario URL
            </button>
            <button type="button" className={debuggerBtnClass} onClick={copyStateJson}>
              Copy state JSON
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

export function PrototypeDebugger() {
  const isOpen = usePrototypeStore((state) => state.debugger.isOpen);
  const setDebuggerOpen = usePrototypeStore((state) => state.setDebuggerOpen);
  const toggleDebugger = usePrototypeStore((state) => state.toggleDebugger);
  const isNarrow = useMediaQuery("(max-width: 767px)");
  const BugIcon = debuggerIcons.bug;

  useEffect(() => {
    if (!isOpen || isNarrow) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDebuggerOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, isNarrow, setDebuggerOpen]);

  const launcher = (
    <button
      type="button"
      className={`${debuggerBtnClass} touch-target`}
      onClick={isNarrow ? () => setDebuggerOpen(true) : toggleDebugger}
      aria-expanded={isOpen}
      aria-controls="prototype-debugger-panel"
      aria-label={
        isNarrow
          ? "Open prototype debugger"
          : isOpen
            ? "Close prototype debugger"
            : "Open prototype debugger"
      }
    >
      <BugIcon pack="basic" size="sm" aria-hidden="true" />
      Prototype
    </button>
  );

  if (isNarrow) {
    return (
      <div className="fixed bottom-4 right-4 z-[100]">
        <Sheet open={isOpen} onOpenChange={setDebuggerOpen}>
          {!isOpen ? launcher : null}
          <SheetContent
            side="bottom"
            className="z-[100] max-h-[85vh] border-t border-border-base bg-background-secondary-base"
            overlayClassName="z-[90]"
          >
            <SheetHeader>
              <SheetTitle className="text-text-md-semibold text-text-primary">
                Prototype Debugger
              </SheetTitle>
              <SheetDescription className="text-text-sm-regular text-text-secondary">
                Swap scenarios and fixture state without leaving the wireframe.
              </SheetDescription>
            </SheetHeader>
            <div id="prototype-debugger-panel" className="mt-4 overflow-y-auto pb-8">
              <DebuggerPanelBody />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end gap-2">
      {isOpen ? (
        <aside
          id="prototype-debugger-panel"
          className="prototype-debugger-panel flex flex-col rounded-08 border border-border-base bg-background-secondary-base"
          role="dialog"
          aria-label="Prototype debugger"
        >
          <div className="flex items-center justify-between border-b border-border-base px-4 py-3">
            <div className="flex items-center gap-2 text-text-primary">
              <BugIcon pack="basic" size="sm" aria-hidden="true" />
              <p className="text-text-sm-semibold text-text-primary">
                Prototype Debugger
              </p>
            </div>
            <button
              type="button"
              className="text-text-sm-medium text-text-secondary hover:text-text-primary"
              onClick={() => setDebuggerOpen(false)}
              aria-label="Close prototype debugger"
            >
              Close
            </button>
          </div>
          <div className="overflow-y-auto p-4">
            <DebuggerPanelBody />
          </div>
        </aside>
      ) : null}

      {launcher}
    </div>
  );
}
