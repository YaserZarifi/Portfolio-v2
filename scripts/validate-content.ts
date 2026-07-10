/**
 * Build gate: parses ALL content in BOTH locales so a bad file fails the
 * build, never production. Runs via `prebuild`.
 */
import {
  getCertificates,
  getEducation,
  getExperience,
  getProfile,
  getProject,
  getProjectSlugs,
  getSkills,
} from "../src/lib/content/loaders";
import { routing } from "../src/lib/i18n/routing";

let failures = 0;

function check(label: string, fn: () => unknown) {
  try {
    fn();
    console.log(`  ok  ${label}`);
  } catch (error) {
    failures += 1;
    console.error(`FAIL  ${label}`);
    console.error(
      error instanceof Error ? `      ${error.message}` : `      ${error}`,
    );
  }
}

console.log("Validating content …");

for (const locale of routing.locales) {
  check(`profile/${locale}.json`, () => getProfile(locale));
  check(`certificates.json [${locale}]`, () => getCertificates(locale));
  check(`experience.json [${locale}]`, () => getExperience(locale));
  check(`education.json [${locale}]`, () => getEducation(locale));
  check(`skills.json [${locale}]`, () => getSkills(locale));
}

const slugs = getProjectSlugs();
if (slugs.length === 0) {
  failures += 1;
  console.error("FAIL  no projects found in content/projects");
}
for (const slug of slugs) {
  for (const locale of routing.locales) {
    check(`projects/${slug}/${locale}.mdx`, () => getProject(slug, locale));
  }
}

if (failures > 0) {
  console.error(`\nContent validation failed: ${failures} problem(s).`);
  process.exit(1);
}
console.log(`\nContent valid: ${slugs.length} project(s), 2 locales.`);
