import type { ReactNode } from "react";

/**
 * Drawing-sheet section header: mono index annotation over the title,
 * hairline rule extending to the end of the row.
 */
export function SectionHeading({
  index,
  label,
  title,
  description,
}: {
  index: string;
  label: string;
  title: ReactNode;
  description?: ReactNode;
}) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-4">
        <span className="annotation">
          {index} / {label}
        </span>
        <span aria-hidden className="h-px flex-1 bg-line" />
      </div>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 max-w-2xl text-fg-muted">{description}</p>
      ) : null}
    </div>
  );
}
