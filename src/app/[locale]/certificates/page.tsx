import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import type { Locale } from "@/lib/i18n/routing";
import { getCertificates } from "@/lib/content/loaders";
import { formatDate } from "@/lib/format";
import { SectionHeading } from "@/components/ui/section-heading";
import { CertificateRegister } from "@/components/certificates/certificate-register";
import { CountUp } from "@/components/motion/count-up";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "certificates" });
  return { title: t("registerTitle") };
}

export default function CertificatesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("certificates");
  const certificates = getCertificates(locale);

  const items = certificates.map((c, i) => ({
    key: `${c.title}-${c.date ?? i}`,
    idx: String(i + 1).padStart(2, "0"),
    title: c.title,
    issuer: c.issuer,
    dateLabel: c.date ? formatDate(locale, c.date) : undefined,
    url: c.credentialUrl,
  }));

  return (
    <main id="content" className="mx-auto max-w-6xl px-6 py-16">
      <SectionHeading
        level="h1"
        index={t("index")}
        label={t("label")}
        title={t("registerTitle")}
        description={t("registerDescription")}
      />
      <p className="annotation mb-8">
        <CountUp value={items.length} locale={locale} /> {t("indexed")}
      </p>
      <CertificateRegister
        items={items}
        issuedBy={t("issuedBy")}
        verify={t("verify")}
        allIssuers={t("allIssuers")}
      />
    </main>
  );
}
