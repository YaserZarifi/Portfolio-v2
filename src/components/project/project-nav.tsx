import { MoveLeft, MoveRight } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";

type Neighbor = { slug: string; title: string; ref: string } | null;

/**
 * Prev / next case-study navigator — two large drawing-register cells. A
 * missing neighbour (ends of the set) falls back to "more work" → the index.
 */
function Cell({
  neighbor,
  dir,
  label,
  moreLabel,
}: {
  neighbor: Neighbor;
  dir: "prev" | "next";
  label: string;
  moreLabel: string;
}) {
  const end = dir === "next";
  const Arrow = dir === "prev" ? MoveLeft : MoveRight;
  const href = neighbor ? `/projects/${neighbor.slug}` : "/projects";
  const title = neighbor?.title ?? moreLabel;
  const ref = neighbor?.ref ?? "IDX";

  return (
    <Link
      href={href}
      className={`group flex flex-col gap-3 p-8 transition-colors hover:bg-surface ${
        end ? "sm:items-end sm:text-end" : ""
      }`}
    >
      <span
        className={`annotation inline-flex items-center gap-2 text-accent-fg ${
          end ? "sm:flex-row-reverse" : ""
        }`}
      >
        <Arrow
          size={14}
          strokeWidth={1.5}
          aria-hidden
          className="transition-transform group-hover:-translate-x-0.5 rtl:-scale-x-100"
        />
        {label}
      </span>
      <span className="text-xl font-medium tracking-tight">{title}</span>
      <span className="annotation">{ref}</span>
    </Link>
  );
}

export function ProjectNav({
  prev,
  next,
  prevLabel,
  nextLabel,
  moreLabel,
}: {
  prev: Neighbor;
  next: Neighbor;
  prevLabel: string;
  nextLabel: string;
  moreLabel: string;
}) {
  return (
    <nav className="mx-auto mt-20 grid max-w-6xl gap-px border-y border-line bg-line sm:grid-cols-2">
      <div className="bg-bg">
        <Cell neighbor={prev} dir="prev" label={prevLabel} moreLabel={moreLabel} />
      </div>
      <div className="bg-bg">
        <Cell neighbor={next} dir="next" label={nextLabel} moreLabel={moreLabel} />
      </div>
    </nav>
  );
}
