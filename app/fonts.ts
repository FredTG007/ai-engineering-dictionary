import { Fraunces, Source_Serif_4 } from "next/font/google";

/** Display face for titles and pencil notes; downloaded at build time and self-hosted. */
export const displayFont = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
  variable: "--font-display",
  display: "swap",
});

/** Reading face for definitions and map labels. */
export const bodyFont = Source_Serif_4({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
});
