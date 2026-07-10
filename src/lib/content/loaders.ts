import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Locale } from "@/lib/i18n/routing";
import {
  certificateSchema,
  educationSchema,
  experienceSchema,
  profileSchema,
  projectFrontmatterSchema,
  projectMetaSchema,
  skillGroupSchema,
  type Certificate,
  type Education,
  type Experience,
  type LocalizedString,
  type Profile,
  type ProjectCategory,
  type ProjectMeta,
  type SkillGroup,
} from "./schemas";
import { z } from "zod";

const CONTENT_DIR = path.join(process.cwd(), "content");

function readJson(...segments: string[]): unknown {
  const file = path.join(CONTENT_DIR, ...segments);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function pick(value: LocalizedString, locale: Locale): string {
  return value[locale];
}

/* ------------------------------- projects ------------------------------- */

export type Project = Omit<ProjectMeta, never> & {
  slug: string;
  title: string;
  summary: string;
  seoDescription?: string;
  /** Raw MDX body for the requested locale. */
  body: string;
  coverAlt?: string;
};

export function getProjectSlugs(): string[] {
  const dir = path.join(CONTENT_DIR, "projects");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

export function getProject(slug: string, locale: Locale): Project {
  const dir = path.join(CONTENT_DIR, "projects", slug);
  const meta = projectMetaSchema.parse(
    JSON.parse(fs.readFileSync(path.join(dir, "meta.json"), "utf8")),
  );
  const raw = fs.readFileSync(path.join(dir, `${locale}.mdx`), "utf8");
  const { data, content } = matter(raw);
  const fm = projectFrontmatterSchema.parse(data);

  return {
    ...meta,
    slug,
    title: fm.title,
    summary: fm.summary,
    seoDescription: fm.seoDescription,
    body: content,
    coverAlt: meta.cover ? pick(meta.cover.alt, locale) : undefined,
  };
}

export function getProjects(
  locale: Locale,
  opts?: { featured?: boolean; category?: ProjectCategory },
): Project[] {
  let projects = getProjectSlugs().map((slug) => getProject(slug, locale));
  if (opts?.featured) projects = projects.filter((p) => p.featured);
  if (opts?.category)
    projects = projects.filter((p) => p.category === opts.category);
  return projects.sort((a, b) => a.order - b.order || b.year - a.year);
}

/* --------------------------- structured content -------------------------- */

export type ResolvedCertificate = Omit<Certificate, "title"> & {
  title: string;
};

export function getCertificates(locale: Locale): ResolvedCertificate[] {
  const items = z.array(certificateSchema).parse(readJson("certificates.json"));
  return items
    .map((c) => ({ ...c, title: pick(c.title, locale) }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export type ResolvedExperience = {
  org: string;
  role: string;
  description: string;
  start: string;
  end: string | null;
};

export function getExperience(locale: Locale): ResolvedExperience[] {
  const items = z.array(experienceSchema).parse(readJson("experience.json"));
  return items
    .map((e) => ({
      org: pick(e.org, locale),
      role: pick(e.role, locale),
      description: pick(e.description, locale),
      start: e.start,
      end: e.end,
    }))
    .sort((a, b) => b.start.localeCompare(a.start));
}

export type ResolvedEducation = {
  institution: string;
  degree: string;
  field: string;
  start: string;
  end: string | null;
  note?: string;
};

export function getEducation(locale: Locale): ResolvedEducation[] {
  const items = z.array(educationSchema).parse(readJson("education.json"));
  return items
    .map((e) => ({
      institution: pick(e.institution, locale),
      degree: pick(e.degree, locale),
      field: pick(e.field, locale),
      start: e.start,
      end: e.end,
      note: e.note ? pick(e.note, locale) : undefined,
    }))
    .sort((a, b) => b.start.localeCompare(a.start));
}

export type ResolvedSkillGroup = { label: string; items: string[] };

export function getSkills(locale: Locale): ResolvedSkillGroup[] {
  const groups = z.array(skillGroupSchema).parse(readJson("skills.json"));
  return groups.map((g) => ({ label: pick(g.label, locale), items: g.items }));
}

export function getProfile(locale: Locale): Profile {
  return profileSchema.parse(readJson("profile", `${locale}.json`));
}
