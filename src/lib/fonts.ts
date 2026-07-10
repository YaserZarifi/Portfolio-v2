import { IBM_Plex_Mono, IBM_Plex_Sans, Vazirmatn } from "next/font/google";

export const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

// Not preloaded globally: only Persian routes need it. Perf phase adds a
// manual per-locale preload once real font URLs are stable.
export const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  display: "swap",
  preload: false,
});

export const fontVariables = [
  plexSans.variable,
  plexMono.variable,
  vazirmatn.variable,
].join(" ");
