import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { StatusBar } from "@/components/layout/status-bar";
import { CommandPalette } from "@/components/command/command-palette";
import { CustomCursor } from "@/components/cursor/custom-cursor";
import { PenTrail } from "@/components/cursor/pen-trail";
import { WireframeController } from "@/components/dev/wireframe-controller";
import { Preloader } from "@/components/intro/preloader";
import { MotionProvider } from "@/components/motion/motion-provider";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { ThemeProvider } from "@/components/theme-provider";
import { getProfile } from "@/lib/content/loaders";
import { fontVariables } from "@/lib/fonts";
import { Analytics } from "@vercel/analytics/next";
import { isRtl, routing, type Locale } from "@/lib/i18n/routing";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("title"),
      template: `%s — Yaser Zarifi`,
    },
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        fa: "/fa",
        "x-default": "/en",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale: locale === "fa" ? "fa_IR" : "en_US",
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const profile = getProfile(locale as Locale);

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Yaser Zarifi",
    alternateName: "Mohammad Yaser Zarifi",
    url: SITE_URL,
    email: profile.email,
    jobTitle: "Full-Stack Developer & Urban Planner",
    address: { "@type": "PostalAddress", addressLocality: profile.location },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Amirkabir University of Technology" },
      { "@type": "CollegeOrUniversity", name: "Kabul Polytechnic University" },
    ],
    knowsAbout: [
      "Full-Stack Web Development",
      "Next.js",
      "Python",
      "Urban Planning",
      "GIS",
      "Computational Design",
    ],
    sameAs: Object.values(profile.social),
  };

  return (
    <html
      lang={locale}
      dir={isRtl(locale) ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <body
        className={`${fontVariables} antialiased`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
        <ThemeProvider>
          <NextIntlClientProvider>
            <MotionProvider>
              <Preloader />
              <CustomCursor />
              <PenTrail />
              <WireframeController />
              <Header />
              <ScrollProgress />
              <CommandPalette cvUrl={profile.cvUrl} social={profile.social} />
              <div className="pb-7">
                {children}
                <Footer />
              </div>
              <StatusBar />
            </MotionProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
