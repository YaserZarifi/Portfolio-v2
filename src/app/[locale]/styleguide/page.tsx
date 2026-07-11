import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tag } from "@/components/ui/tag";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false },
};

const SWATCHES = [
  { name: "bg", cls: "bg-bg" },
  { name: "surface", cls: "bg-surface" },
  { name: "fg", cls: "bg-fg" },
  { name: "fg-muted", cls: "bg-fg-muted" },
  { name: "line", cls: "bg-line" },
  { name: "accent", cls: "bg-accent" },
  { name: "err", cls: "bg-err" },
  { name: "ok", cls: "bg-ok" },
];

const TYPE_RAMP = [
  { label: "text-5xl / 600", cls: "text-5xl font-semibold tracking-tight" },
  { label: "text-4xl / 600", cls: "text-4xl font-semibold tracking-tight" },
  { label: "text-3xl / 600", cls: "text-3xl font-semibold tracking-tight" },
  { label: "text-xl / 500", cls: "text-xl font-medium" },
  { label: "text-base / 400", cls: "text-base" },
  { label: "text-sm muted", cls: "text-sm text-fg-muted" },
];

// Internal reference page — intentionally not translated.
export default function StyleguidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <SectionHeading
        index="00"
        label="STYLEGUIDE"
        title="Drafting Table Modernism"
        description="Internal reference — every token and component, inspect in both themes and both directions."
      />

      <section className="mb-16">
        <p className="annotation mb-4">COLOR TOKENS</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {SWATCHES.map((s) => (
            <div key={s.name} className="border border-line">
              <div className={`h-16 ${s.cls}`} />
              <p className="annotation border-t border-line p-2">{s.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <p className="annotation mb-4">TYPE RAMP — IBM PLEX SANS / VAZIRMATN</p>
        <div className="flex flex-col gap-4 border border-line p-6">
          {TYPE_RAMP.map((row) => (
            <div key={row.label}>
              <p className="annotation mb-1">{row.label}</p>
              <p className={row.cls}>Systems people live in</p>
              <p className={row.cls} lang="fa" dir="rtl">
                سیستم‌هایی که مردم در آن‌ها زندگی می‌کنند
              </p>
            </div>
          ))}
          <div>
            <p className="annotation mb-1">mono annotation</p>
            <p className="annotation text-accent-fg">
              PRJ-004 / MASTERPLAN — 35.6892° N, 51.3890° E
            </p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <p className="annotation mb-4">BUTTONS</p>
        <div className="flex flex-wrap items-center gap-4 border border-line p-6">
          <Button>Primary action</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <section className="mb-16">
        <p className="annotation mb-4">TAGS</p>
        <div className="flex flex-wrap gap-2 border border-line p-6">
          <Tag>Next.js</Tag>
          <Tag>GIS</Tag>
          <Tag>Urban Analysis</Tag>
          <Tag>TypeScript</Tag>
        </div>
      </section>

      <section className="mb-16">
        <p className="annotation mb-4">CARD — REGISTRATION MARKS</p>
        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="p-8">
            <p className="annotation mb-2 text-accent-fg">PRJ-001</p>
            <h3 className="text-xl font-medium">Sample project card</h3>
            <p className="mt-2 text-sm text-fg-muted">
              Hairline border, surface fill, corner ticks. Border shifts to
              accent on hover.
            </p>
          </Card>
          <Card className="bg-drafting-grid p-8" marks={false}>
            <p className="annotation mb-2">TEXTURE</p>
            <h3 className="text-xl font-medium">Drafting grid surface</h3>
            <p className="mt-2 text-sm text-fg-muted">
              The 3rem grid texture at ~4% fg opacity, adapting per theme.
            </p>
          </Card>
        </div>
      </section>

      <section>
        <p className="annotation mb-4">HAIRLINES + FOCUS</p>
        <div className="border border-line p-6">
          <div className="mb-6 h-px bg-line" />
          <p className="text-sm text-fg-muted">
            Tab through the buttons above — focus ring is a 2px accent outline
            offset like a selection marquee.
          </p>
        </div>
      </section>
    </main>
  );
}
