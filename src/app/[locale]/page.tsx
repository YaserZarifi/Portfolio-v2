import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import type { Locale } from "@/lib/i18n/routing";
import {
  getCertificates,
  getEducation,
  getExperience,
  getProfile,
  getProjects,
  getSkills,
} from "@/lib/content/loaders";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { ExplodedSheets } from "@/components/sections/exploded-sheets";
import { ProjectsSection } from "@/components/sections/projects-section";
import { CertificatesSection } from "@/components/sections/certificates-section";
import { TimelineSection } from "@/components/sections/timeline-section";
import { ContactSection } from "@/components/sections/contact-section";
import { SectionScrubber } from "@/components/motion/section-scrubber";

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  const profile = getProfile(locale);
  const projects = getProjects(locale, { featured: true });
  const certificates = getCertificates(locale);
  const experience = getExperience(locale);
  const education = getEducation(locale);
  const skills = getSkills(locale);

  return (
    <main id="content">
      <SectionScrubber />
      <Hero profile={profile} />
      <About profile={profile} skills={skills} />
      <ExplodedSheets />
      <ProjectsSection projects={projects} />
      <CertificatesSection certificates={certificates} />
      <TimelineSection
        experience={experience}
        education={education}
        profile={profile}
      />
      <ContactSection profile={profile} />
    </main>
  );
}
