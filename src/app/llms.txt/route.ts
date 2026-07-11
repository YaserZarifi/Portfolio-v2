import { getProfile, getProjects, getCertificates } from "@/lib/content/loaders";

/**
 * /llms.txt — a concise, structured map of the site for LLM agents
 * (llmstxt.org). Generated from the same content the pages use, so it never
 * drifts. Mirrors the robots.ts / sitemap.ts route-handler pattern.
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const dynamic = "force-static";

export function GET() {
  const profile = getProfile("en");
  const projects = getProjects("en");
  const certificates = getCertificates("en");
  const u = (path: string) => `${SITE_URL}${path}`;

  const lines: string[] = [
    `# ${profile.name} — Full-Stack Developer & Urban Planner`,
    "",
    `> ${profile.tagline}`,
    "",
    "Bilingual (English / Persian, RTL) portfolio presented as a CAD/drafting instrument. Yaser Zarifi builds full-stack web products (React, Next.js, Python, Django) with an urban planner's eye for systems, flows, and people. Based in Tehran; originally from Kabul.",
    "",
    "## Pages",
    `- [Home (English)](${u("/en")}): Overview, featured projects, top certificates, experience, and contact.`,
    `- [Home (Persian)](${u("/fa")}): Persian (RTL) version.`,
    `- [Projects](${u("/en/projects")}): Full project index, filterable by discipline (code, architecture, hybrid).`,
    `- [Certificates](${u("/en/certificates")}): Full credential register (${certificates.length} verified certificates), filterable by issuer.`,
    "",
    "## Projects",
    ...projects.map(
      (p) => `- [${p.title}](${u(`/en/projects/${p.slug}`)}): ${p.summary}`,
    ),
    "",
    "## Contact",
    `- Email: ${profile.email}`,
    `- GitHub: ${profile.social.github}`,
    `- LinkedIn: ${profile.social.linkedin}`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
