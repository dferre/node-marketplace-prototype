import { Badge } from "@relume_io/relume-ui";
import { useParams } from "react-router-dom";
import { StatePanel } from "../../components/shared/StatePanel";
import { usePrototypeStore } from "../../store/prototypeStore";

export function AppSubmissionPage() {
  const { appId = "" } = useParams();
  const app = usePrototypeStore((state) =>
    state.developerPortal.apps.find((item) => item.id === appId),
  );

  if (!app?.submission) {
    return (
      <StatePanel
        tone="empty"
        title="No submission history"
        description="Submit an app to populate the timeline."
        actionLabel="Submission checklist"
        actionTo={`/developer/apps/${appId}/submit`}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
          Submission timeline
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          {app.basics.name} · {app.submission.status} · Round{" "}
          {app.submission.round}
        </p>
      </div>
      <ol className="flex flex-col gap-3">
        {app.submission.timeline.map((event) => (
          <li
            key={event.id}
            className="border border-border-primary bg-background-primary p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{event.status}</Badge>
              <span className="text-sm text-text-secondary">{event.at}</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-text-primary">
              {event.summary}
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              {event.actor}
              {event.buildVersion ? ` · build ${event.buildVersion}` : ""}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
