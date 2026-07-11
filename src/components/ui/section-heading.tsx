import type { ReactNode } from "react";
import { KineticText } from "@/components/motion/kinetic-text";

/**
 * Drawing-sheet section header: mono index annotation over the title,
 * hairline rule extending to the end of the row.
 *
 * When `title` is a plain string it renders as KineticText — a per-glyph
 * entrance that reveals on scroll and waves under the cursor. Rich `title`
 * nodes fall back to a static h2.
 */
export function SectionHeading({
  index,
  label,
  title,
  description,
  level = "h2",
}: {
  index: string;
  label: string;
  title: ReactNode;
  description?: ReactNode;
  /** Standalone pages pass "h1" so each document has a single top-level heading. */
  level?: "h1" | "h2";
}) {
  const Tag = level;
  const headingClass = "mt-4 text-3xl font-semibold tracking-tight sm:text-4xl";
  return (
    <div className="mb-12">
      <div className="flex items-center gap-4">
        <span className="annotation">
          {index} / {label}
        </span>
        <span aria-hidden className="h-px flex-1 bg-line" />
      </div>
      {typeof title === "string" ? (
        <KineticText as={Tag} text={title} stagger={18} className={headingClass} />
      ) : (
        <Tag className={headingClass}>{title}</Tag>
      )}
      {description ? (
        <p className="mt-3 max-w-2xl text-fg-muted">{description}</p>
      ) : null}
    </div>
  );
}
