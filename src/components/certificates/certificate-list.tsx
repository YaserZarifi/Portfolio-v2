"use client";

import { m } from "motion/react";
import { ExternalLink } from "lucide-react";

/**
 * Credential register — a scannable "drawing register" of certificates. Each
 * row carries a mono index, the credential + issuer, its date coordinate, and
 * a verify chip; an accent datum bar wipes down the start edge on hover. Rows
 * stagger in on scroll, and re-stagger when `animateKey` changes (filtering).
 */

export type CertItem = {
  key: string;
  idx: string;
  title: string;
  issuer: string;
  dateLabel?: string;
  url?: string;
};

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 26 },
  },
} as const;

export function CertificateList({
  items,
  issuedBy,
  verify,
  animateKey,
}: {
  items: CertItem[];
  issuedBy: string;
  verify: string;
  animateKey?: string;
}) {
  return (
    <m.ul
      key={animateKey}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="border-y border-line"
    >
      {items.map((c) => (
        <m.li
          key={c.key}
          variants={item}
          className="group relative grid grid-cols-[2.25rem_1fr] items-start gap-x-4 gap-y-2 border-b border-line px-2 py-5 transition-colors last:border-0 hover:bg-surface/60 sm:grid-cols-[2.25rem_1fr_auto] sm:items-center"
        >
          {/* Accent datum bar — wipes down on hover. */}
          <span
            aria-hidden
            className="absolute inset-y-0 start-0 w-px origin-top scale-y-0 bg-accent transition-transform duration-300 group-hover:scale-y-100"
          />
          <span className="annotation pt-0.5 text-accent-fg sm:pt-0">{c.idx}</span>
          <div className="min-w-0">
            <p className="font-medium leading-snug">{c.title}</p>
            <p className="mt-1 text-sm text-fg-muted">
              {issuedBy} {c.issuer}
            </p>
          </div>
          <div className="col-start-2 flex items-center gap-4 sm:col-start-3 sm:justify-end">
            {c.dateLabel ? (
              <span className="annotation">{c.dateLabel}</span>
            ) : null}
            {c.url ? (
              <a
                href={c.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-accent-fg hover:underline"
              >
                {verify}
                <ExternalLink size={12} strokeWidth={1.5} aria-hidden />
              </a>
            ) : null}
          </div>
        </m.li>
      ))}
    </m.ul>
  );
}
