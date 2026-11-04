import type { ReactNode } from "react";

export function Header({ children }: { children: ReactNode }) {
  return (
    <header className="header">
      <div className="brand">
        <h1 className="brand__title">The AI Engineering Dictionary</h1>
        <p className="brand__byline">by Fred Osei-Adu</p>
      </div>
      <div className="header__tools">{children}</div>
    </header>
  );
}
