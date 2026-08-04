import { Button, Checkbox } from "@relume_io/relume-ui";
import { useEffect, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { InstallFlowHeader } from "../components/installation/InstallFlowHeader";
import { FirstInstallCoach } from "../components/onboarding/FirstInstallCoach";
import { usePrototypeStore } from "../store/prototypeStore";
import type { CompatibilityResult } from "../types/prototype";
import {
  getInstallCompatibility,
  summarizeSelection,
} from "../utils/installationSelection";
import { formatCompatibilityStatus } from "../utils/compatibilityLabels";

export function InstallReviewPage() {
  const { appId = "" } = useParams();
  const navigate = useNavigate();

  const {
    apps,
    nodes,
    overrides,
    installation,
    setActiveAppId,
    setWarningsAcknowledged,
    confirmInstallation,
  } = usePrototypeStore(
    useShallow((state) => ({
      apps: state.apps,
      nodes: state.nodes,
      overrides: state.overrides,
      installation: state.installation,
      setActiveAppId: state.setActiveAppId,
      setWarningsAcknowledged: state.setWarningsAcknowledged,
      confirmInstallation: state.confirmInstallation,
    })),
  );

  const app = apps.find((item) => item.id === appId);

  useEffect(() => {
    if (appId) setActiveAppId(appId);
  }, [appId, setActiveAppId]);

  const selectedNodes = useMemo(
    () =>
      installation.selectedNodeIds
        .map((id) => nodes.find((node) => node.id === id))
        .filter((node): node is NonNullable<typeof node> => Boolean(node)),
    [installation.selectedNodeIds, nodes],
  );

  const resultsByNodeId = useMemo(() => {
    const map = new Map<string, CompatibilityResult>();
    if (!app) return map;
    for (const node of selectedNodes) {
      map.set(node.id, getInstallCompatibility(app, node, overrides));
    }
    return map;
  }, [app, selectedNodes, overrides]);

  const summary = summarizeSelection(
    installation.selectedNodeIds,
    resultsByNodeId,
  );

  const warningNodes = selectedNodes.filter((node) => {
    const result = resultsByNodeId.get(node.id);
    return (
      result?.status === "compatible-with-warnings" ||
      result?.status === "offline-queued"
    );
  });

  if (!app) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-text-primary">App not found</h1>
        <Button asChild variant="secondary" size="sm">
          <Link to="/marketplace">Back to marketplace</Link>
        </Button>
      </div>
    );
  }

  if (installation.selectedNodeIds.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <InstallFlowHeader app={app} step="review" selectedCount={0} />
        <div className="border border-border-primary bg-background-secondary p-4">
          <p className="font-semibold text-text-primary">No nodes selected</p>
          <p className="mt-2 text-sm text-text-secondary">
            Go back and choose an installation scope and nodes.
          </p>
          <Button asChild variant="primary" size="sm" className="mt-4">
            <Link to={`/marketplace/apps/${app.id}/install`}>
              Choose nodes
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const needsAcknowledgement = warningNodes.length > 0;
  const canConfirm =
    !needsAcknowledgement || installation.warningsAcknowledged;

  const handleConfirm = () => {
    const ok = confirmInstallation(app.id);
    if (ok) {
      navigate(`/marketplace/apps/${app.id}/install/progress`);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <InstallFlowHeader
        app={app}
        step="review"
        selectedCount={installation.selectedNodeIds.length}
      />

      <FirstInstallCoach stage="review" />

      <section className="border border-border-primary bg-background-primary p-4">
        <h2 className="text-lg font-semibold text-text-primary">
          Final review
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Confirming will install {app.name} on{" "}
          <span className="font-semibold text-text-primary">
            {installation.selectedNodeIds.length} node
            {installation.selectedNodeIds.length === 1 ? "" : "s"}
          </span>
          . Compatibility will be checked again before each installation starts.
        </p>
        <p className="mt-2 text-sm text-text-secondary">
          {summary.ready} ready · {summary.warnings} warning · {summary.queued}{" "}
          queued
        </p>
      </section>

      <section className="border border-border-primary bg-background-primary p-4">
        <h2 className="text-lg font-semibold text-text-primary">
          Selected nodes
        </h2>
        <ul className="mt-3 flex flex-col gap-2">
          {selectedNodes.map((node) => {
            const result = resultsByNodeId.get(node.id)!;
            return (
              <li
                key={node.id}
                className="border border-border-primary px-3 py-2 text-sm"
              >
                <p className="font-semibold text-text-primary">{node.name}</p>
                <p className="text-text-secondary">
                  {formatCompatibilityStatus(result.status)}
                  {result.issues[0] ? ` · ${result.issues[0].message}` : ""}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      {warningNodes.length > 0 ? (
        <section className="border border-border-primary bg-background-secondary p-4">
          <h2 className="text-lg font-semibold text-text-primary">
            Warnings and offline queues
          </h2>
          <ul className="mt-3 list-inside list-disc text-sm text-text-secondary">
            {warningNodes.map((node) => {
              const result = resultsByNodeId.get(node.id)!;
              return (
                <li key={node.id}>
                  <span className="font-semibold text-text-primary">
                    {node.name}:
                  </span>{" "}
                  {result.issues[0]?.message ??
                    formatCompatibilityStatus(result.status)}
                </li>
              );
            })}
          </ul>
          <label className="mt-4 flex items-start gap-2 text-sm text-text-primary">
            <Checkbox
              checked={installation.warningsAcknowledged}
              onCheckedChange={(checked) =>
                setWarningsAcknowledged(checked === true)
              }
              aria-label="Acknowledge warnings"
              className="mt-0.5"
            />
            I understand these warnings and want to continue. Offline nodes will
            be queued and rechecked when they reconnect.
          </label>
        </section>
      ) : null}

      <section className="border border-border-primary bg-background-primary p-4">
        <h2 className="text-lg font-semibold text-text-primary">
          Permissions and resources
        </h2>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-text-primary">Permissions</p>
            <ul className="mt-2 list-inside list-disc text-sm text-text-secondary">
              {app.permissions.slice(0, 6).map((permission) => (
                <li key={permission.id}>{permission.label}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">Resources</p>
            <ul className="mt-2 list-inside list-disc text-sm text-text-secondary">
              <li>
                {app.requirements.minCpuCores}+ CPU cores,{" "}
                {app.requirements.minMemoryGb}+ GB memory
              </li>
              <li>
                {app.requirements.minStorageGb}+ GB
                {app.requirements.requiredStorageType
                  ? ` ${app.requirements.requiredStorageType.toUpperCase()}`
                  : ""}{" "}
                storage
              </li>
              <li>{app.requirements.minBandwidthMbps}+ Mbps connection</li>
              <li>
                Security review: {app.securityReviewStatus} · Developer:{" "}
                {app.developerStatus}
              </li>
            </ul>
          </div>
        </div>
        {app.setupRequired ? (
          <p className="mt-3 text-sm text-text-secondary">
            Post-install configuration will be required after successful
            installation.
          </p>
        ) : null}
      </section>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="primary"
          disabled={!canConfirm}
          onClick={handleConfirm}
        >
          Confirm installation on {installation.selectedNodeIds.length} node
          {installation.selectedNodeIds.length === 1 ? "" : "s"}
        </Button>
        <Button asChild variant="secondary">
          <Link to={`/marketplace/apps/${app.id}/install`}>Back</Link>
        </Button>
      </div>
    </div>
  );
}
