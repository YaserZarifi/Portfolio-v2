import type { ReactNode } from "react";

/** Corner ticks like registration marks on a drawing sheet. */
function CornerMarks() {
  const tick = "pointer-events-none absolute h-2 w-2 border-fg-muted/60";
  return (
    <span aria-hidden>
      <span className={`${tick} start-0 top-0 border-s border-t`} />
      <span className={`${tick} end-0 top-0 border-e border-t`} />
      <span className={`${tick} bottom-0 start-0 border-b border-s`} />
      <span className={`${tick} bottom-0 end-0 border-b border-e`} />
    </span>
  );
}

export function Card({
  children,
  className = "",
  marks = true,
}: {
  children: ReactNode;
  className?: string;
  marks?: boolean;
}) {
  return (
    <div
      className={`group relative border border-line bg-surface transition-all duration-300 hover:border-accent motion-safe:hover:-translate-y-1 ${className}`}
    >
      {marks ? <CornerMarks /> : null}
      {children}
    </div>
  );
}
