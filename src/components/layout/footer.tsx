import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="annotation">{t("note")}</p>
        <p className="annotation">N 35.6892° / E 51.3890°</p>
      </div>
    </footer>
  );
}
