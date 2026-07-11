import { useLocale, useTranslations } from "next-intl";
import type { ResolvedCertificate } from "@/lib/content/loaders";
import type { Locale } from "@/lib/i18n/routing";
import { formatDate, formatNumber } from "@/lib/format";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { ZoomSection } from "@/components/motion/zoom-section";
import { CertificateList } from "@/components/certificates/certificate-list";

/** Home showcase caps the register at the top slice; the rest live on /certificates. */
const HOME_LIMIT = 6;

export function CertificatesSection({
  certificates,
}: {
  certificates: ResolvedCertificate[];
}) {
  const t = useTranslations("certificates");
  const locale = useLocale() as Locale;

  const total = certificates.length;
  const shown = certificates.slice(0, HOME_LIMIT);
  const items = shown.map((c, i) => ({
    key: `${c.title}-${c.date ?? i}`,
    idx: String(i + 1).padStart(2, "0"),
    title: c.title,
    issuer: c.issuer,
    dateLabel: c.date ? formatDate(locale, c.date) : undefined,
    url: c.credentialUrl,
  }));

  return (
    <section id="certificates" className="scroll-mt-14 border-b border-line">
      <ZoomSection className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <SectionHeading
            index={t("index")}
            label={t("label")}
            title={t("title")}
          />
        </Reveal>

        <CertificateList
          items={items}
          issuedBy={t("issuedBy")}
          verify={t("verify")}
        />

        {total > HOME_LIMIT ? (
          <Reveal
            delay={0.1}
            className="mt-8 flex flex-wrap items-center justify-between gap-4"
          >
            <span className="annotation">
              {formatNumber(locale, shown.length)} / {formatNumber(locale, total)}{" "}
              {t("indexed")}
            </span>
            <Button as={Link} variant="outline" href="/certificates">
              {t("showAll")}
            </Button>
          </Reveal>
        ) : null}
      </ZoomSection>
    </section>
  );
}
