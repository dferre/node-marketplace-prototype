import { Input, Label } from "@relume_io/relume-ui";
import { useMemo, useState } from "react";
import { usePrototypeStore } from "../../store/prototypeStore";
import {
  exportThemeCss,
  getColorMode,
  getOverrides,
  getTokenValue,
  getTokens,
  resetOverrides,
  setColorMode,
  setOverride,
  type ColorMode,
  type DesignToken,
} from "../../design-system/themeRuntime";
import {
  debuggerBtnActiveClass,
  debuggerBtnClass,
  debuggerFieldClass,
  debuggerHeadingClass,
  debuggerHelpClass,
  debuggerLabelClass,
  debuggerSectionClass,
} from "./debuggerChrome";

function parsePx(value: string): number | null {
  const match = value.trim().match(/^(-?\d+(?:\.\d+)?)px$/);
  return match ? Number(match[1]) : null;
}

function hexParts(value: string): { rgb: string; alpha: number } | null {
  const hex6 = value.match(/^#([0-9a-fA-F]{6})$/);
  if (hex6) return { rgb: value, alpha: 1 };
  const hex8 = value.match(/^#([0-9a-fA-F]{6})([0-9a-fA-F]{2})$/);
  if (hex8) return { rgb: `#${hex8[1]}`, alpha: parseInt(hex8[2], 16) / 255 };
  return null;
}

function toHex8(rgb: string, alpha: number): string {
  if (alpha >= 1) return rgb;
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0");
  return `${rgb}${a}`;
}

function TokenControl({
  token,
  mode,
  onChange,
}: {
  token: DesignToken;
  mode: ColorMode;
  onChange: (cssVar: string, value: string) => void;
}) {
  const value = getTokenValue(token, mode);
  const px = parsePx(value);
  const hex = hexParts(value);

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={token.id} className={debuggerLabelClass}>
        {token.figmaName}
      </Label>
      {token.type === "color" && hex ? (
        <div className="flex items-center gap-2">
          <input
            id={token.id}
            type="color"
            value={hex.rgb}
            aria-label={`${token.figmaName} color`}
            className="size-8 shrink-0 cursor-pointer rounded-06 border border-border-base bg-transparent p-0"
            onChange={(event) => onChange(token.cssVar, toHex8(event.target.value, hex.alpha))}
          />
          <Input
            value={value}
            onChange={(event) => onChange(token.cssVar, event.target.value)}
            className={`${debuggerFieldClass} min-w-0`}
          />
          {hex.alpha < 1 || value.length === 9 ? (
            <Input
              type="number"
              min={0}
              max={1}
              step={0.01}
              value={Number(hex.alpha.toFixed(2))}
              aria-label={`${token.figmaName} alpha`}
              className={`${debuggerFieldClass} w-16`}
              onChange={(event) =>
                onChange(token.cssVar, toHex8(hex.rgb, Number(event.target.value)))
              }
            />
          ) : null}
        </div>
      ) : token.type === "color" ? (
        <Input
          id={token.id}
          value={value}
          onChange={(event) => onChange(token.cssVar, event.target.value)}
          className={debuggerFieldClass}
        />
      ) : px !== null ? (
        <div className="flex items-center gap-2">
          <Input
            id={token.id}
            type="number"
            min={0}
            value={px}
            className={debuggerFieldClass}
            onChange={(event) => onChange(token.cssVar, `${event.target.value}px`)}
          />
          <span className="text-text-xs-regular text-text-secondary">px</span>
        </div>
      ) : (
        <Input
          id={token.id}
          value={value}
          onChange={(event) => onChange(token.cssVar, event.target.value)}
          className={debuggerFieldClass}
        />
      )}
    </div>
  );
}

export function StyleEditor() {
  const showToast = usePrototypeStore((state) => state.showToast);
  const [, setVersion] = useState(0);
  const mode = getColorMode();
  const tokens = useMemo(() => getTokens(), []);
  const groups = useMemo(() => {
    const map = new Map<string, DesignToken[]>();
    for (const token of tokens) {
      const list = map.get(token.editorGroup) ?? [];
      list.push(token);
      map.set(token.editorGroup, list);
    }
    return [...map.entries()];
  }, [tokens]);

  const refresh = () => setVersion((value) => value + 1);

  const handleChange = (cssVar: string, value: string) => {
    setOverride(cssVar, value);
    refresh();
  };

  const handleMode = (next: ColorMode) => {
    setColorMode(next);
    refresh();
  };

  const handleReset = () => {
    resetOverrides();
    refresh();
    showToast("Theme reset to Figma defaults");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(exportThemeCss());
    showToast("Theme CSS copied");
  };

  const overrideCount = Object.keys(getOverrides()).length;

  return (
    <section className={debuggerSectionClass}>
      <div className="flex flex-col gap-2">
        <h3 className={debuggerHeadingClass}>Style</h3>
        <p className={debuggerHelpClass}>
          Live-edit Webstack design tokens. Changes apply immediately and persist in this
          browser until reset.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={mode === "light" ? debuggerBtnActiveClass : debuggerBtnClass}
          onClick={() => handleMode("light")}
        >
          Light
        </button>
        <button
          type="button"
          className={mode === "dark" ? debuggerBtnActiveClass : debuggerBtnClass}
          onClick={() => handleMode("dark")}
        >
          Dark
        </button>
        <button type="button" className={debuggerBtnClass} onClick={handleReset}>
          Reset to Figma
        </button>
        <button type="button" className={debuggerBtnClass} onClick={handleCopy}>
          Copy CSS
        </button>
      </div>
      <p className="text-text-xs-regular text-text-secondary">
        {overrideCount} override{overrideCount === 1 ? "" : "s"} · mode {mode}
      </p>

      <div className="prototype-debugger-style-list flex flex-col gap-2 overflow-y-auto pr-1">
        {groups.map(([group, groupTokens]) => (
          <details
            key={group}
            className="rounded-08 border border-border-base bg-background-secondary-base p-3"
            open={group === "Fonts"}
          >
            <summary className="cursor-pointer text-text-sm-semibold text-text-primary">
              {group}
            </summary>
            <div className="mt-2 flex flex-col gap-3">
              {groupTokens.map((token) => (
                <TokenControl
                  key={token.cssVar}
                  token={token}
                  mode={mode}
                  onChange={handleChange}
                />
              ))}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
