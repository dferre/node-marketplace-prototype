import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import chevronDownIcon from "../../assets/wallet/chevron-down.svg";
import xCloseIcon from "../../assets/wallet/x-close.svg";
import type { AppCategory } from "../../types/prototype";
import { APP_CATEGORIES } from "../../utils/marketplaceBrowse";

export const CATEGORY_LABELS: Record<AppCategory, string> = {
  storage: "Storage",
  compute: "Compute",
  networking: "Networking",
  security: "Security",
  data: "Data",
  media: "Media",
  ai: "AI",
  utility: "Utility",
  infrastructure: "Infrastructure",
};

export type DiscoverFiltersState = {
  category: "all" | AppCategory;
  rewardTokens: string[];
  minRating: 0 | 4 | 4.5 | 4.8;
};

export const DEFAULT_DISCOVER_FILTERS: DiscoverFiltersState = {
  category: "all",
  rewardTokens: [],
  minRating: 0,
};

function CloseGlyph() {
  return (
    <span
      className="app-wallet-glyph size-3 shrink-0 text-text-tertiary"
      style={{ "--app-wallet-glyph": `url("${xCloseIcon}")` } as CSSProperties}
      aria-hidden="true"
    />
  );
}

function ChevronGlyph() {
  return (
    <span className="relative size-3 shrink-0" aria-hidden="true">
      <span
        className="app-wallet-glyph absolute"
        style={
          {
            inset: "33.54% 26.22% 36.79% 26.22%",
            "--app-wallet-glyph": `url("${chevronDownIcon}")`,
          } as CSSProperties
        }
      />
    </span>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={`flex shrink-0 appearance-none items-center gap-1 rounded-06 px-3 py-2 text-text-sm-semibold ${
        active
          ? "bg-text-primary text-background-primary-base"
          : "bg-background-tertiary-base text-text-tertiary hover:text-text-primary"
      }`}
      aria-pressed={active}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function DiscoverFilterMenu({
  value,
  rewardTokens,
  onChange,
}: {
  value: DiscoverFiltersState;
  rewardTokens: string[];
  onChange: (next: DiscoverFiltersState) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const chips: { id: string; label: string; clear: () => DiscoverFiltersState }[] =
    [];
  if (value.category !== "all") {
    chips.push({
      id: `category-${value.category}`,
      label: CATEGORY_LABELS[value.category],
      clear: () => ({ ...value, category: "all" }),
    });
  }
  for (const token of value.rewardTokens) {
    chips.push({
      id: `token-${token}`,
      label: token,
      clear: () => ({
        ...value,
        rewardTokens: value.rewardTokens.filter((item) => item !== token),
      }),
    });
  }
  if (value.minRating !== 0) {
    chips.push({
      id: "rating",
      label: `${value.minRating}+`,
      clear: () => ({ ...value, minRating: 0 }),
    });
  }

  const extraCount =
    value.rewardTokens.length + (value.minRating !== 0 ? 1 : 0);
  const active = open || extraCount > 0;

  const toggleToken = (token: string) => {
    const next = value.rewardTokens.includes(token)
      ? value.rewardTokens.filter((item) => item !== token)
      : [...value.rewardTokens, token];
    onChange({ ...value, rewardTokens: next });
  };

  const toggleCategory = (category: AppCategory) => {
    onChange({
      ...value,
      category: value.category === category ? "all" : category,
    });
  };

  return (
    <div className="relative shrink-0" ref={rootRef}>
      <button
        type="button"
        className={`flex appearance-none items-center gap-1 rounded-06 px-3 py-2 text-text-sm-semibold ${
          active
            ? "bg-text-primary text-background-primary-base"
            : "bg-background-tertiary-base text-text-tertiary hover:text-text-primary"
        }`}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((current) => !current)}
      >
        Filter
        {extraCount > 0 ? (
          <span className="flex size-5 items-center justify-center rounded-full bg-primitives-green text-text-xs-bold text-text-white">
            {extraCount}
          </span>
        ) : null}
        <ChevronGlyph />
      </button>

      {open ? (
        <div
          className="absolute right-0 top-full z-20 mt-1 flex w-64 flex-col gap-3 rounded-08 border border-border-base bg-background-secondary-base p-3"
          role="dialog"
          aria-label="Filters"
        >
          {chips.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {chips.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  className="flex appearance-none items-center gap-1 rounded-04 border border-border-elevated px-2 py-1 text-text-xs-semibold text-text-primary hover:bg-background-primary-hover"
                  onClick={() => onChange(chip.clear())}
                >
                  {chip.label}
                  <CloseGlyph />
                </button>
              ))}
            </div>
          ) : null}

          {rewardTokens.length > 0 ? (
            <div className="flex flex-col gap-2">
              <p className="text-text-sm-medium text-text-primary">Rewards</p>
              {rewardTokens.map((token) => (
                <label
                  key={token}
                  className="flex items-center gap-2 text-text-sm-regular text-text-secondary"
                >
                  <input
                    type="checkbox"
                    checked={value.rewardTokens.includes(token)}
                    onChange={() => toggleToken(token)}
                    className="size-4 rounded-04 border-border-base"
                  />
                  {token}
                </label>
              ))}
            </div>
          ) : null}

          <div className="flex flex-col gap-2 border-t border-border-base pt-3">
            <p className="text-text-sm-medium text-text-primary">Categories</p>
            {APP_CATEGORIES.map((category) => (
              <label
                key={category}
                className="flex items-center gap-2 text-text-sm-regular text-text-secondary"
              >
                <input
                  type="checkbox"
                  checked={value.category === category}
                  onChange={() => toggleCategory(category)}
                  className="size-4 rounded-04 border-border-base"
                />
                {CATEGORY_LABELS[category]}
              </label>
            ))}
          </div>

          <div className="flex flex-col gap-2 border-t border-border-base pt-3">
            <p className="text-text-sm-medium text-text-primary">
              Minimum rating
            </p>
            <div className="flex flex-wrap gap-1">
              {(
                [
                  [0, "Any"],
                  [4, "4+"],
                  [4.5, "4.5+"],
                  [4.8, "4.8+"],
                ] as const
              ).map(([rating, label]) => (
                <button
                  key={label}
                  type="button"
                  className={`appearance-none rounded-06 px-2 py-1 text-text-xs-semibold ${
                    value.minRating === rating
                      ? "bg-primitives-blue text-text-white"
                      : "bg-background-tertiary-base text-text-secondary hover:text-text-primary"
                  }`}
                  aria-pressed={value.minRating === rating}
                  onClick={() => onChange({ ...value, minRating: rating })}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function DiscoverTabs({
  value,
  rewardTokens,
  onChange,
}: {
  value: DiscoverFiltersState;
  rewardTokens: string[];
  onChange: (next: DiscoverFiltersState) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      <TabButton
        active={value.category === "all"}
        onClick={() => onChange({ ...value, category: "all" })}
      >
        All
      </TabButton>
      {APP_CATEGORIES.map((item) => (
        <TabButton
          key={item}
          active={value.category === item}
          onClick={() => onChange({ ...value, category: item })}
        >
          {CATEGORY_LABELS[item]}
        </TabButton>
      ))}
      <DiscoverFilterMenu
        value={value}
        rewardTokens={rewardTokens}
        onChange={onChange}
      />
    </div>
  );
}
