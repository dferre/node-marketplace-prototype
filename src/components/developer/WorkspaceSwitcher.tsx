import { Button } from "@relume_io/relume-ui";
import { Link, useLocation } from "react-router-dom";

type WorkspaceSwitcherProps = {
  className?: string;
};

export function WorkspaceSwitcher({ className = "" }: WorkspaceSwitcherProps) {
  const { pathname } = useLocation();
  const isDeveloper = pathname.startsWith("/developer");

  return (
    <div
      className={`flex flex-col gap-1 rounded-md border border-border-primary bg-background-primary p-1 shadow-border ${className}`}
      role="group"
      aria-label="Workspace"
    >
      <Button
        asChild
        size="sm"
        variant={!isDeveloper ? "primary" : "secondary"}
        className="touch-target w-full justify-center"
      >
        <Link to="/">Node Operator</Link>
      </Button>
      <Button
        asChild
        size="sm"
        variant={isDeveloper ? "primary" : "secondary"}
        className="touch-target w-full justify-center"
      >
        <Link to="/developer">Developer Portal</Link>
      </Button>
    </div>
  );
}
