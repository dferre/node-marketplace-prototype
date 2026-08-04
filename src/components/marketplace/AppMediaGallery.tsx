import { Badge, Button } from "@relume_io/relume-ui";
import { useState } from "react";
import type { AppGalleryFrame } from "../../data/appSocialProof";
import { marketplaceIcons } from "../../icons/iconMap";

type AppMediaGalleryProps = {
  appName: string;
  frames: AppGalleryFrame[];
};

const kindLabel: Record<AppGalleryFrame["kind"], string> = {
  screenshot: "Screenshot",
  diagram: "Diagram",
  marketing: "Marketing",
};

export function AppMediaGallery({ appName, frames }: AppMediaGalleryProps) {
  const [activeId, setActiveId] = useState(frames[0]?.id ?? "");
  const MediaIcon = marketplaceIcons.media;
  const active = frames.find((frame) => frame.id === activeId) ?? frames[0];

  if (!active) {
    return (
      <section className="border border-border-primary bg-background-secondary p-4">
        <h2 className="text-lg font-semibold text-text-primary">
          Screenshots & media
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          No media frames are available for this app in the prototype.
        </p>
      </section>
    );
  }

  return (
    <section className="border border-border-primary bg-background-primary p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold text-text-primary">
          Screenshots & media
        </h2>
        <p className="text-sm text-text-secondary">
          Wireframe placeholders for {appName}
        </p>
      </div>

      <div
        className="mt-4 flex min-h-[14rem] flex-col items-center justify-center border border-border-primary bg-background-secondary p-6"
        aria-live="polite"
      >
        <div
          className="flex size-14 items-center justify-center border border-border-primary bg-background-primary"
          aria-hidden="true"
        >
          <MediaIcon pack="basic" size="md" />
        </div>
        <p className="mt-3 text-base font-semibold text-text-primary">
          {active.title}
        </p>
        <Badge variant="outline" className="mt-2">
          {kindLabel[active.kind]}
        </Badge>
        <p className="mt-3 max-w-xl text-center text-sm text-text-secondary">
          {active.caption}
        </p>
      </div>

      <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {frames.map((frame, index) => {
          const selected = frame.id === active.id;
          return (
            <li key={frame.id}>
              <button
                type="button"
                onClick={() => setActiveId(frame.id)}
                aria-pressed={selected}
                className={`flex h-full w-full flex-col border border-border-primary p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-primary focus-visible:ring-offset-2 ${
                  selected
                    ? "bg-background-secondary"
                    : "bg-background-primary hover:bg-background-secondary"
                }`}
              >
                <span className="text-xs text-text-secondary">
                  Frame {index + 1}
                </span>
                <span className="mt-1 text-sm font-semibold text-text-primary">
                  {frame.title}
                </span>
                <span className="mt-1 text-xs text-text-secondary">
                  {kindLabel[frame.kind]}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={frames[0]?.id === active.id}
          onClick={() => {
            const index = frames.findIndex((frame) => frame.id === active.id);
            const previous = frames[Math.max(0, index - 1)];
            if (previous) setActiveId(previous.id);
          }}
        >
          Previous
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={frames[frames.length - 1]?.id === active.id}
          onClick={() => {
            const index = frames.findIndex((frame) => frame.id === active.id);
            const next = frames[Math.min(frames.length - 1, index + 1)];
            if (next) setActiveId(next.id);
          }}
        >
          Next
        </Button>
      </div>
    </section>
  );
}
