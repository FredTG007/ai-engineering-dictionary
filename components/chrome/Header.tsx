import type { ReactNode } from "react";
import { RoughUnderline } from "../sketch/RoughUnderline";

export function Header({ children }: { children: ReactNode }) {
  return (
    <header className="header">
      <div className="brand">
        <h1 className="brand__title">The AI Engineering Dictionary</h1>
        <RoughUnderline seed="brand" className="brand__underline" />
        <p className="brand__byline">a field notebook by Fred Osei-Adu</p>
      </div>
      <div className="header__tools">{children}</div>
    </header>
  );
}
