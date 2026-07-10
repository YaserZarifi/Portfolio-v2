import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  const t = useTranslations("notFound");

  return (
    <main
      id="content"
      className="bg-drafting-grid mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-6xl flex-col items-start justify-center px-6"
    >
      <p className="annotation mb-6 text-accent">{t("code")}</p>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-md text-fg-muted">{t("description")}</p>
      <div className="mt-10">
        <Button as={Link} href="/">
          {t("home")}
        </Button>
      </div>
    </main>
  );
}
