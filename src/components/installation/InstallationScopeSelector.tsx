import { Label, RadioGroup, RadioGroupItem } from "@relume_io/relume-ui";
import type { InstallationScope } from "../../types/prototype";

type InstallationScopeSelectorProps = {
  value: InstallationScope;
  compatibleCount: number;
  disableAllCompatible?: boolean;
  onChange: (scope: InstallationScope) => void;
};

const OPTIONS: {
  value: InstallationScope;
  label: string;
  description: string;
}[] = [
  {
    value: "one",
    label: "One node",
    description: "Install on a single compatible node.",
  },
  {
    value: "selected",
    label: "Selected nodes",
    description: "Choose exactly which compatible nodes to include.",
  },
  {
    value: "all-compatible",
    label: "All compatible nodes",
    description:
      "Install on every node that is compatible when you confirm. Later nodes are not added automatically.",
  },
];

export function InstallationScopeSelector({
  value,
  compatibleCount,
  disableAllCompatible = false,
  onChange,
}: InstallationScopeSelectorProps) {
  return (
    <section className="border border-border-primary bg-background-primary p-4">
      <h2 className="text-lg font-semibold text-text-primary">
        Installation scope
      </h2>
      <p className="mt-1 text-sm text-text-secondary">
        {compatibleCount} compatible node{compatibleCount === 1 ? "" : "s"}{" "}
        available right now.
      </p>

      <RadioGroup
        value={value}
        onValueChange={(next) => onChange(next as InstallationScope)}
        className="mt-4 flex flex-col gap-3"
      >
        {OPTIONS.map((option) => {
          const disabled =
            option.value === "all-compatible" && disableAllCompatible;
          return (
            <label
              key={option.value}
              className={`flex cursor-pointer items-start gap-3 border border-border-primary p-3 ${
                disabled ? "opacity-50" : ""
              } ${value === option.value ? "bg-background-secondary" : ""}`}
            >
              <RadioGroupItem
                value={option.value}
                id={`scope-${option.value}`}
                disabled={disabled}
                className="mt-1"
              />
              <span>
                <Label htmlFor={`scope-${option.value}`} className="font-semibold">
                  {option.label}
                </Label>
                <span className="mt-1 block text-sm text-text-secondary">
                  {option.description}
                </span>
              </span>
            </label>
          );
        })}
      </RadioGroup>
    </section>
  );
}
