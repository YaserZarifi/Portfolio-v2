"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { m, useReducedMotion } from "motion/react";
import { Github, Linkedin, Mail } from "lucide-react";
import type { Profile } from "@/lib/content/schemas";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { ZoomSection } from "@/components/motion/zoom-section";
import { Magnetic } from "@/components/motion/magnetic";

type Status = "idle" | "sending" | "success" | "error";

const inputClass =
  "w-full border border-line bg-surface px-4 py-3 text-fg placeholder:text-fg-muted/60 focus-visible:border-accent";

export function ContactSection({ profile }: { profile: Profile }) {
  const t = useTranslations("contact");
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<Status>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
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
          name,
          email,
          message,
          company: data.get("company"),
          elapsedMs: Date.now() - startedAt.current,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
      form.reset();
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  const statusLabel =
    status === "success"
      ? t("statusFiled")
      : status === "sending"
        ? t("statusSending")
        : t("statusDraft");

  const empty = <span className="text-fg-muted/50">{t("ticketEmpty")}</span>;

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
          {/* Form. */}
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
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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
              <Magnetic>
                <Button type="submit" disabled={status === "sending"}>
                  {status === "sending" ? t("sending") : t("send")}
                </Button>
              </Magnetic>
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

          {/* Live work-order ticket — fills as you type; stamped on submit. */}
          <div className="flex flex-col gap-6">
            <div
              aria-hidden
              className="relative overflow-hidden border border-line bg-surface"
            >
              {/* Title block. */}
              <div className="flex items-center justify-between border-b border-line px-5 py-3">
                <span className="annotation text-accent-fg">{t("ticketTitle")}</span>
                <span className="annotation">{t("ticketRef")}</span>
              </div>

              <dl className="divide-y divide-line">
                <div className="grid grid-cols-[5.5rem_1fr] gap-3 px-5 py-4">
                  <dt className="annotation pt-0.5">{t("fldClient")}</dt>
                  <dd className="min-w-0 truncate text-sm">{name || empty}</dd>
                </div>
                <div className="grid grid-cols-[5.5rem_1fr] gap-3 px-5 py-4">
                  <dt className="annotation pt-0.5">{t("fldContact")}</dt>
                  <dd className="min-w-0 truncate text-sm">{email || empty}</dd>
                </div>
                <div className="grid grid-cols-[5.5rem_1fr] gap-3 px-5 py-4">
                  <dt className="annotation pt-0.5">{t("fldScope")}</dt>
                  <dd className="min-w-0 whitespace-pre-wrap break-words text-sm">
                    {message || empty}
                  </dd>
                </div>
                <div className="grid grid-cols-[5.5rem_1fr] items-center gap-3 px-5 py-4">
                  <dt className="annotation">{t("fldStatus")}</dt>
                  <dd className="flex items-center gap-2 text-sm">
                    <span
                      className={`inline-block h-1.5 w-1.5 ${
                        status === "success"
                          ? "bg-ok"
                          : status === "sending"
                            ? "bg-accent"
                            : "bg-fg-muted"
                      }`}
                    />
                    <span className="font-mono text-xs uppercase tracking-widest">
                      {statusLabel}
                    </span>
                  </dd>
                </div>
              </dl>

              {/* Rubber stamp on success. */}
              {status === "success" ? (
                <m.div
                  className="pointer-events-none absolute end-4 top-16 select-none border-2 border-ok px-3 py-1"
                  initial={
                    reduce ? false : { opacity: 0, scale: 1.6, rotate: -18 }
                  }
                  animate={{ opacity: 1, scale: 1, rotate: -12 }}
                  transition={{ type: "spring", stiffness: 300, damping: 14 }}
                >
                  <span className="font-mono text-lg font-bold uppercase tracking-widest text-ok">
                    {t("stamp")}
                  </span>
                </m.div>
              ) : null}
            </div>

            {/* Direct channels. */}
            <div className="flex flex-col gap-4">
              <a
                href={`mailto:${profile.email}`}
                className="group inline-flex w-fit items-center gap-3 text-fg-muted transition-colors hover:text-accent-fg"
              >
                <Mail size={18} strokeWidth={1.5} aria-hidden />
                <span className="link-underline">{profile.email}</span>
              </a>
              {profile.social.github ? (
                <a
                  href={profile.social.github}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex w-fit items-center gap-3 text-fg-muted transition-colors hover:text-accent-fg"
                >
                  <Github size={18} strokeWidth={1.5} aria-hidden />
                  <span className="link-underline">GitHub</span>
                </a>
              ) : null}
              {profile.social.linkedin ? (
                <a
                  href={profile.social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex w-fit items-center gap-3 text-fg-muted transition-colors hover:text-accent-fg"
                >
                  <Linkedin size={18} strokeWidth={1.5} aria-hidden />
                  <span className="link-underline">LinkedIn</span>
                </a>
              ) : null}
            </div>
          </div>
        </Reveal>
      </ZoomSection>
    </section>
  );
}
