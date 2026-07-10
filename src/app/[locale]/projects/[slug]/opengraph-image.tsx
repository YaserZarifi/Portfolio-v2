import { ImageResponse } from "next/og";
import { OgCard } from "@/components/og/og-card";
import { getProject, getProjectSlugs } from "@/lib/content/loaders";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Project — Yaser Zarifi";

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Always render the English content: Satori's default font has no Persian
  // glyphs, so a fa title would render as tofu on shared cards.
  const project = getProject(slug, "en");
  const ref = "PRJ / " + project.category.toUpperCase();

  return new ImageResponse(
    (
      <OgCard
        kicker="YASER ZARIFI — CASE STUDY"
        title={project.title}
        subtitle={project.summary}
        footerRight={ref}
      />
    ),
    size,
  );
}
