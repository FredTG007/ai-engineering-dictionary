import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "The AI Engineering Dictionary — by Fred Osei-Adu",
  description:
    "A plain-language, interconnected dictionary of AI engineering terms: RAG, evals, agents, guardrails, serving and more.",
  authors: [{ name: "Fred Osei-Adu" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0e19",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
