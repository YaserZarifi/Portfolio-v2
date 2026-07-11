import type { ComponentPropsWithoutRef, ElementType } from "react";

type Variant = "primary" | "outline" | "ghost";

const base =
  "inline-flex h-11 cursor-pointer items-center justify-center gap-2 px-5 font-mono text-sm uppercase tracking-widest transition-colors disabled:cursor-not-allowed disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-white hover:bg-accent/85",
  outline: "border border-line text-fg hover:border-accent hover:text-accent-fg",
  ghost: "text-fg-muted hover:text-fg",
};

type ButtonProps<T extends ElementType> = {
  as?: T;
  variant?: Variant;
} & ComponentPropsWithoutRef<T>;

export function Button<T extends ElementType = "button">({
  as,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps<T>) {
  const Component = (as ?? "button") as ElementType;
  return (
    <Component
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
