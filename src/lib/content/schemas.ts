import { z } from "zod";

/** Every user-facing string exists in both locales — enforced at build. */
export const localizedString = z.object({
  en: z.string().min(1),
  fa: z.string().min(1),
});
export type LocalizedString = z.infer<typeof localizedString>;

/** Width/height are mandatory: they are the CLS defense for external URLs. */
export const imageRef = z.object({
  // Absolute https URL, or a root-relative path into /public (rot-proof).
  url: z.union([z.string().url(), z.string().regex(/^\/.+/)]),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: localizedString,
});
export type ImageRef = z.infer<typeof imageRef>;

export const projectCategory = z.enum(["code", "architecture", "hybrid"]);
export type ProjectCategory = z.infer<typeof projectCategory>;

/** content/projects/<slug>/meta.json — locale-independent facts. */
export const projectMetaSchema = z.object({
  category: projectCategory,
  year: z.number().int().min(2000).max(2100),
  stack: z.array(z.string()).min(1),
  links: z
    .object({
      live: z.string().url().optional(),
      repo: z.string().url().optional(),
    })
    .default({}),
  cover: imageRef.optional(),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
});
export type ProjectMeta = z.infer<typeof projectMetaSchema>;

/** Frontmatter of content/projects/<slug>/{en,fa}.mdx */
export const projectFrontmatterSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  seoDescription: z.string().optional(),
});
export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;

export const certificateSchema = z.object({
  title: localizedString,
  issuer: z.string().min(1),
  date: z
    .string()
    .regex(/^\d{4}(-\d{2})?$/, "YYYY or YYYY-MM")
    .optional(),
  imageUrl: z.string().url().optional(),
  credentialUrl: z.string().url().optional(),
});
export type Certificate = z.infer<typeof certificateSchema>;

export const experienceSchema = z.object({
  org: localizedString,
  role: localizedString,
  description: localizedString,
  start: z.string().regex(/^\d{4}(-\d{2})?$/),
  end: z
    .string()
    .regex(/^\d{4}(-\d{2})?$/)
    .nullable(),
});
export type Experience = z.infer<typeof experienceSchema>;

export const educationSchema = z.object({
  institution: localizedString,
  degree: localizedString,
  field: localizedString,
  start: z.string().regex(/^\d{4}$/),
  end: z.string().regex(/^\d{4}$/).nullable(),
  note: localizedString.optional(),
});
export type Education = z.infer<typeof educationSchema>;

export const skillGroupSchema = z.object({
  label: localizedString,
  items: z.array(z.string()).min(1),
});
export type SkillGroup = z.infer<typeof skillGroupSchema>;

/** content/profile/{en,fa}.json — already single-locale files. */
export const profileSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().min(1),
  bio: z.array(z.string().min(1)).min(1),
  email: z.string().email(),
  location: z.string().min(1),
  cvUrl: z.string().min(1),
  social: z.record(z.string(), z.string().url()),
});
export type Profile = z.infer<typeof profileSchema>;
