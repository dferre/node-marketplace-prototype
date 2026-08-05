import { Badge, Button } from "@relume_io/relume-ui";
import { Link } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { usePrototypeStore } from "../../store/prototypeStore";

export function DeveloperVerificationPage() {
  const { developer, organization } = usePrototypeStore(
    useShallow((state) => ({
      developer: state.developerPortal.developers.find(
        (item) => item.id === state.developerPortal.activeDeveloperId,
      ),
      organization: state.developerPortal.organizations.find(
        (item) => item.id === state.developerPortal.activeOrganizationId,
      ),
    })),
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
          Developer verification
        </h1>
        <p className="mt-2 max-w-3xl text-base text-text-secondary">
          Drafts are allowed before verification. Submission requires an approved
          individual or organization verification.
        </p>
      </div>

      <section className="border border-border-primary bg-background-primary p-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold text-text-primary">
            {organization?.publicName ?? "Organization"}
          </h2>
          <Badge variant="outline">
            {organization?.verificationStatus ?? "not-started"}
          </Badge>
          <Badge variant="secondary">{organization?.type ?? "individual"}</Badge>
        </div>
        <p className="mt-2 text-sm text-text-secondary">
          Persona: {developer?.personaLabel}
        </p>
        {organization?.reviewerComments?.length ? (
          <ul className="mt-3 list-inside list-disc text-sm text-text-primary">
            {organization.reviewerComments.map((comment) => (
              <li key={comment}>{comment}</li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="border border-border-primary bg-background-secondary p-4">
        <h2 className="text-base font-semibold text-text-primary">
          Simulated flow
        </h2>
        <ol className="mt-2 list-inside list-decimal text-sm text-text-secondary">
          <li>Start verification</li>
          <li>Choose individual or organization</li>
          <li>Enter identity/organization details (placeholders only)</li>
          <li>Upload simulated documents</li>
          <li>Accept developer agreement</li>
          <li>Submit → pending → approved / changes requested / rejected</li>
        </ol>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild size="sm" variant="secondary">
            <Link to="/developer/organization">Organization</Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link to="/developer/apps/new">Start a draft anyway</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
