import { Badge, Button, Input, Label } from "@relume_io/relume-ui";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { VersionComparison } from "../../components/developer/VersionComparison";
import { StatePanel } from "../../components/shared/StatePanel";
import { usePrototypeStore } from "../../store/prototypeStore";

export function AppReviewPage() {
  const { appId = "" } = useParams();
  const app = usePrototypeStore((state) =>
    state.developerPortal.apps.find((item) => item.id === appId),
  );
  const setReviewFindingStatus = usePrototypeStore(
    (state) => state.setReviewFindingStatus,
  );
  const resubmitDeveloperApp = usePrototypeStore(
    (state) => state.resubmitDeveloperApp,
  );
  const [responses, setResponses] = useState<Record<string, string>>({});

  if (!app?.submission) {
    return (
      <StatePanel
        tone="empty"
        title="No submission yet"
        description="Submit the app before review findings appear."
        actionLabel="Submission checklist"
        actionTo={`/developer/apps/${appId}/submit`}
      />
    );
  }

  const openBlocking = app.submission.findings.filter(
    (finding) =>
      finding.severity === "blocking" &&
      finding.status !== "resolved" &&
      finding.status !== "accepted",
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
            Review feedback
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Round {app.submission.round} · {app.submission.status} · This is
            changes requested, not rejection.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="secondary">
            <Link to={`/developer/apps/${app.id}/submission`}>Timeline</Link>
          </Button>
          <Button
            type="button"
            size="sm"
            variant="primary"
            disabled={openBlocking.length > 0}
            onClick={() => resubmitDeveloperApp(app.id)}
          >
            Resubmit version 1.0.1
          </Button>
        </div>
      </div>

      <VersionComparison app={app} />

      <ul className="flex flex-col gap-3">
        {app.submission.findings.map((finding) => (
          <li
            key={finding.id}
            className="border border-border-primary bg-background-primary p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold text-text-primary">{finding.title}</h2>
              <Badge variant="secondary">{finding.severity}</Badge>
              <Badge variant="outline">{finding.status}</Badge>
              <Badge variant="outline">{finding.category}</Badge>
            </div>
            <p className="mt-2 text-sm text-text-primary">{finding.description}</p>
            {finding.reviewerComment ? (
              <p className="mt-2 text-sm text-text-secondary">
                Reviewer: {finding.reviewerComment}
              </p>
            ) : null}
            {finding.affectedSection ? (
              <Button asChild size="sm" variant="secondary" className="mt-3">
                <Link
                  to={`/developer/apps/${app.id}/${
                    finding.affectedSection === "basics"
                      ? "edit"
                      : finding.affectedSection === "support"
                        ? "settings"
                        : finding.affectedSection
                  }`}
                >
                  Fix in {finding.affectedSection}
                </Link>
              </Button>
            ) : null}
            <div className="mt-3 flex flex-col gap-2">
              <Label htmlFor={`response-${finding.id}`}>Developer response</Label>
              <Input
                id={`response-${finding.id}`}
                value={responses[finding.id] ?? finding.developerResponse ?? ""}
                onChange={(event) =>
                  setResponses((current) => ({
                    ...current,
                    [finding.id]: event.target.value,
                  }))
                }
                placeholder="Explain the fix or link the revised section"
              />
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() =>
                  setReviewFindingStatus(
                    app.id,
                    finding.id,
                    "resolved",
                    responses[finding.id] ||
                      finding.developerResponse ||
                      "Resolved in revision",
                  )
                }
              >
                Mark resolved
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
