type LoadingSkeletonProps = {
  title?: string;
  rows?: number;
};

export function LoadingSkeleton({
  title = "Loading",
  rows = 3,
}: LoadingSkeletonProps) {
  return (
    <div
      className="flex flex-col gap-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div>
        <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Loading content for the current scenario…
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: rows }, (_, index) => (
          <div
            key={index}
            className="border border-border-primary bg-background-secondary p-4"
          >
            <div className="h-4 w-1/2 border border-border-primary bg-background-primary" />
            <div className="mt-3 h-3 w-full border border-border-primary bg-background-primary" />
            <div className="mt-2 h-3 w-3/4 border border-border-primary bg-background-primary" />
            <div className="mt-4 h-8 w-24 border border-border-primary bg-background-primary" />
          </div>
        ))}
      </div>
    </div>
  );
}
