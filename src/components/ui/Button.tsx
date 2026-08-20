import {
  cloneElement,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";

export type ButtonVariant = "primary" | "secondary" | "link";
export type ButtonSize = "sm" | "md" | "lg" | "link";

const BASE_CLASS =
  "inline-flex appearance-none cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-04 disabled:pointer-events-none disabled:opacity-50";

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary:
    "border border-text-primary bg-text-primary font-display text-background-primary-base hover:opacity-90",
  secondary:
    "border border-border-elevated bg-transparent text-text-sm-semibold text-text-primary hover:bg-background-primary-hover",
  link: "border-0 bg-transparent text-text-sm-semibold text-text-primary hover:text-text-secondary",
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: "px-4 py-3",
  md: "px-4 py-3",
  lg: "px-4 py-3",
  link: "px-0 py-0",
};

const PRIMARY_TYPE_CLASS: Record<ButtonSize, string> = {
  sm: "text-text-sm-bold",
  md: "text-text-sm-bold",
  lg: "text-text-md-bold",
  link: "text-text-sm-bold",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function buttonClassName({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  const resolvedSize = variant === "link" || size === "link" ? "link" : size;
  return cx(
    BASE_CLASS,
    VARIANT_CLASS[variant],
    SIZE_CLASS[resolvedSize],
    variant === "primary" ? PRIMARY_TYPE_CLASS[resolvedSize] : null,
    className,
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  children: ReactNode;
};

export function Button({
  asChild,
  variant = "primary",
  size = "md",
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const classes = buttonClassName({ variant, size, className });

  if (asChild) {
    if (!isValidElement(children)) {
      throw new Error("Button asChild requires a single React element child.");
    }
    const child = children as ReactElement<{ className?: string }>;
    return cloneElement(child, {
      ...props,
      className: cx(classes, child.props.className),
    });
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
