import { ImageResponse } from "next/og";
import { OgCard } from "@/components/og/og-card";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Yaser Zarifi — Full-Stack Developer & Urban Planner";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <OgCard
        kicker="YASER ZARIFI"
        title="I design systems people live in."
        subtitle="Full-stack developer & urban planner — cities and software."
        footerRight="PORTFOLIO / V2"
      />
    ),
    size,
  );
}
