import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { DEFAULT_PALETTE_ID, paletteBootScript } from "@/lib/theme/palettes";
import { bodyFont, displayFont } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "The AI Engineering Dictionary — by Fred Osei-Adu",
  description:
    "A plain-language subway map of AI engineering terms: RAG, evals, agents, guardrails, serving and more, with learning tracks and interview questions.",
  authors: [{ name: "Fred Osei-Adu" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4eedf",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-palette={DEFAULT_PALETTE_ID} className={`${displayFont.variable} ${bodyFont.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: paletteBootScript() }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
