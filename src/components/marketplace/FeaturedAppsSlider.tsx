import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import type {
  CompatibilityResult,
  MarketplaceApp,
  PrototypeOverrides,
} from "../../types/prototype";
import { MarketplaceAppCard } from "./MarketplaceAppCard";

gsap.registerPlugin(useGSAP);

const VISIBLE_CARDS = 4;
const AUTO_ROTATE_SECONDS = 4;

type FeaturedAppsSliderProps = {
  apps: MarketplaceApp[];
  overrides: PrototypeOverrides;
  getCompatibility: (app: MarketplaceApp) => CompatibilityResult[];
};

export function FeaturedAppsSlider({
  apps,
  overrides,
  getCompatibility,
}: FeaturedAppsSliderProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!viewport || !track || apps.length <= VISIBLE_CARDS) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduceMotion) return;

      let index = 0;
      const maxIndex = apps.length - VISIBLE_CARDS;

      const goTo = (nextIndex: number) => {
        const gap = 16;
        const slideWidth = (viewport.clientWidth - gap * (VISIBLE_CARDS - 1)) / VISIBLE_CARDS;
        gsap.to(track, {
          x: -(slideWidth + gap) * nextIndex,
          duration: 0.5,
          ease: "power2.inOut",
        });
      };

      const loop = gsap.delayedCall(AUTO_ROTATE_SECONDS, () => {
        index = index >= maxIndex ? 0 : index + 1;
        goTo(index);
        loop.restart(true);
      });

      const pause = () => loop.pause();
      const resume = () => loop.resume();
      viewport.addEventListener("pointerenter", pause);
      viewport.addEventListener("pointerleave", resume);

      return () => {
        loop.kill();
        viewport.removeEventListener("pointerenter", pause);
        viewport.removeEventListener("pointerleave", resume);
      };
    },
    { dependencies: [apps] },
  );

  if (apps.length === 0) return null;

  return (
    <section className="flex w-full min-w-0 flex-col gap-3">
      <h2 className="text-text-lg-semibold text-text-primary">Featured</h2>
      <div ref={viewportRef} className="app-featured-viewport">
        <div ref={trackRef} className="app-featured-track">
          {apps.map((app) => (
            <div className="app-featured-slide" key={app.id}>
              <MarketplaceAppCard
                app={app}
                overrides={overrides}
                compatibilityResults={getCompatibility(app)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
