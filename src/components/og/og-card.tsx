import type { ReactElement } from "react";

const INK = "#0a0a0b";
const FG = "#fafafa";
const MUTED = "#a1a1aa";
const LINE = "#26262a";
const ACCENT = "#2563eb";

function CornerMark({ corner }: { corner: "tl" | "tr" | "bl" | "br" }) {
  const edge = `2px solid ${MUTED}`;
  const vertical = corner[0] === "t" ? { top: 28 } : { bottom: 28 };
  const horizontal = corner[1] === "l" ? { left: 28 } : { right: 28 };
  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        width: 22,
        height: 22,
        ...vertical,
        ...horizontal,
        ...(corner[0] === "t" ? { borderTop: edge } : { borderBottom: edge }),
        ...(corner[1] === "l" ? { borderLeft: edge } : { borderRight: edge }),
      }}
    />
  );
}

/**
 * Drafting-sheet OG card (1200×630). Latin content only — Satori's default
 * font has no Persian glyphs and we avoid a build-time font fetch, so both
 * locales share this English card.
 */
export function OgCard({
  kicker,
  title,
  subtitle,
  footerRight,
}: {
  kicker: string;
  title: string;
  subtitle: string;
  footerRight: string;
}): ReactElement {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: INK,
        padding: 72,
        position: "relative",
      }}
    >
      <CornerMark corner="tl" />
      <CornerMark corner="tr" />
      <CornerMark corner="bl" />
      <CornerMark corner="br" />

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div
          style={{
            display: "flex",
            color: ACCENT,
            fontSize: 22,
            letterSpacing: 6,
            fontWeight: 600,
          }}
        >
          {kicker}
        </div>
        <div style={{ display: "flex", width: 16, height: 16, background: ACCENT }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            color: FG,
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -1,
            maxWidth: 900,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            width: 120,
            height: 3,
            background: ACCENT,
            marginTop: 28,
            marginBottom: 28,
          }}
        />
        <div style={{ display: "flex", color: MUTED, fontSize: 30, maxWidth: 820 }}>
          {subtitle}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: `1px solid ${LINE}`,
          paddingTop: 24,
          color: MUTED,
          fontSize: 20,
          letterSpacing: 2,
        }}
      >
        <div style={{ display: "flex" }}>N 35.6892° / E 51.3890°</div>
        <div style={{ display: "flex" }}>{footerRight}</div>
      </div>
    </div>
  );
}
