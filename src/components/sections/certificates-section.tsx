import { useLocale, useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";
import type { ResolvedCertificate } from "@/lib/content/loaders";
import type { Locale } from "@/lib/i18n/routing";
import { formatDate } from "@/lib/format";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

export function CertificatesSection({
  certificates,
}: {
  certificates: ResolvedCertificate[];
}) {
  const t = useTranslations("certificates");
  const locale = useLocale() as Locale;

  return (
    <section id="certificates" className="scroll-mt-14 border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <SectionHeading
            index={t("index")}
            label={t("label")}
            title={t("title")}
          />
        </Reveal>
        <Stagger className="border-y border-line">
          {certificates.map((cert) => (
            <StaggerItem
              key={`${cert.title}-${cert.date}`}
              className="grid gap-1 border-b border-line py-5 last:border-0 sm:grid-cols-[1fr_auto] sm:items-center"
            >
              <div>
                <p className="font-medium">{cert.title}</p>
                <p className="mt-1 text-sm text-fg-muted">
                  {t("issuedBy")} {cert.issuer}
                </p>
              </div>
              <div className="flex items-center gap-4 sm:justify-end">
                <span className="annotation">
                  {formatDate(locale, cert.date)}
                </span>
                {cert.credentialUrl ? (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-accent hover:underline"
                  >
                    {t("verify")}
                    <ExternalLink size={12} strokeWidth={1.5} aria-hidden />
                  </a>
                ) : null}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
