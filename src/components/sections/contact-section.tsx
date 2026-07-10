"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Github, Linkedin, Mail } from "lucide-react";
import type { Profile } from "@/lib/content/schemas";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { ZoomSection } from "@/components/motion/zoom-section";

type Status = "idle" | "sending" | "success" | "error";

const inputClass =
  "w-full border border-line bg-surface px-4 py-3 text-fg placeholder:text-fg-muted/60 focus-visible:border-accent";

export function ContactSection({ profile }: { profile: Profile }) {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<Status>("idle");
  const startedAt = useRef<number>(0);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          company: data.get("company"),
          elapsedMs: Date.now() - startedAt.current,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="scroll-mt-14">
      <ZoomSection className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <SectionHeading
            index={t("index")}
            label={t("label")}
            title={t("title")}
            description={t("description")}
          />
        </Reveal>
        <Reveal delay={0.08} className="grid gap-12 lg:grid-cols-2">
          <form
            onSubmit={onSubmit}
            onFocus={() => {
              if (startedAt.current === 0) startedAt.current = Date.now();
            }}
            className="flex flex-col gap-4"
          >
            <div>
              <label htmlFor="contact-name" className="annotation mb-2 block">
                {t("name")} *
              </label>
              <input
                id="contact-name"
                name="name"
                required
                maxLength={200}
                className={inputClass}
                autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="annotation mb-2 block">
                {t("email")} *
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                maxLength={200}
                className={inputClass}
                autoComplete="email"
              />
            </div>
            <div>
              <label
                htmlFor="contact-message"
                className="annotation mb-2 block"
              >
                {t("message")} *
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                maxLength={5000}
                className={inputClass}
              />
            </div>
            {/* Honeypot — humans never see or fill this. */}
            <div aria-hidden className="absolute -start-[9999px]">
              <label>
                Company
                <input name="company" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <div className="flex items-center gap-4">
              <Button type="submit" disabled={status === "sending"}>
                {status === "sending" ? t("sending") : t("send")}
              </Button>
              {status === "success" ? (
                <p role="status" className="text-sm text-ok">
                  {t("success")}
                </p>
              ) : null}
              {status === "error" ? (
                <p role="alert" className="text-sm text-err">
                  {t("error")}
                </p>
              ) : null}
            </div>
          </form>
          <div className="flex flex-col gap-4">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-3 text-fg-muted transition-colors hover:text-accent"
            >
              <Mail size={18} strokeWidth={1.5} aria-hidden />
              {profile.email}
            </a>
            {profile.social.github ? (
              <a
                href={profile.social.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 text-fg-muted transition-colors hover:text-accent"
              >
                <Github size={18} strokeWidth={1.5} aria-hidden />
                GitHub
              </a>
            ) : null}
            {profile.social.linkedin ? (
              <a
                href={profile.social.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 text-fg-muted transition-colors hover:text-accent"
              >
                <Linkedin size={18} strokeWidth={1.5} aria-hidden />
                LinkedIn
              </a>
            ) : null}
          </div>
        </Reveal>
      </ZoomSection>
    </section>
  );
}
