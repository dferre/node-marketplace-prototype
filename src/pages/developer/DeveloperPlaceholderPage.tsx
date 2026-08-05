import { Button } from "@relume_io/relume-ui";
import { Link } from "react-router-dom";

type DeveloperPlaceholderPageProps = {
  title: string;
  description: string;
  primaryLabel?: string;
  primaryTo?: string;
};

export function DeveloperPlaceholderPage({
  title,
  description,
  primaryLabel = "Back to overview",
  primaryTo = "/developer",
}: DeveloperPlaceholderPageProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
          {title}
        </h1>
        <p className="mt-2 max-w-3xl text-base text-text-secondary">
          {description}
        </p>
      </div>
      <section className="border border-border-primary bg-background-secondary p-6">
        <p className="text-sm font-semibold text-text-primary">
          Wireframe placeholder
        </p>
        <p className="mt-2 text-sm text-text-secondary">
          This route is registered for the developer portal. Deeper editing and
          review flows are implemented on the Atlas Storage vertical-slice
          pages.
        </p>
        <Button asChild size="sm" variant="secondary" className="mt-4">
          <Link to={primaryTo}>{primaryLabel}</Link>
        </Button>
      </section>
    </div>
  );
}
