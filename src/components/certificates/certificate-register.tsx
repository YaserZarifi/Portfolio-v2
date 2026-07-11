"use client";

import { useMemo, useState } from "react";
import { CertificateList, type CertItem } from "./certificate-list";

/**
 * The full /certificates register: an issuer filter over the complete list.
 * Changing the filter re-keys the list so rows re-stagger into place.
 */

type Item = CertItem & { issuer: string };
const ALL = "__all";

export function CertificateRegister({
  items,
  issuedBy,
  verify,
  allIssuers,
}: {
  items: Item[];
  issuedBy: string;
  verify: string;
  allIssuers: string;
}) {
  const [active, setActive] = useState<string>(ALL);
  const issuers = useMemo(
    () => Array.from(new Set(items.map((i) => i.issuer))).sort(),
    [items],
  );
  const visible =
    active === ALL ? items : items.filter((i) => i.issuer === active);

  const chip = (value: string, label: string) => {
    const on = active === value;
    return (
      <button
        key={value}
        type="button"
        onClick={() => setActive(value)}
        aria-pressed={on}
        className={`h-9 cursor-pointer border px-3 font-mono text-xs uppercase tracking-widest transition-colors ${
          on
            ? "border-accent text-accent-fg"
            : "border-line text-fg-muted hover:text-fg"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div>
      <div
        role="group"
        aria-label={allIssuers}
        className="mb-8 flex flex-wrap gap-2"
      >
        {chip(ALL, allIssuers)}
        {issuers.map((is) => chip(is, is))}
      </div>
      <CertificateList
        animateKey={active}
        items={visible}
        issuedBy={issuedBy}
        verify={verify}
      />
    </div>
  );
}
