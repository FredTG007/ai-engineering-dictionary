import type { Difficulty } from "@/lib/content/types";

const DOTS: Record<Difficulty, number> = { beginner: 1, intermediate: 2, advanced: 3 };

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span className="difficulty" data-level={difficulty} title={`Difficulty: ${difficulty}`}>
      <span className="difficulty__dots" aria-hidden="true">
        {[1, 2, 3].map((dot) => (
          <span key={dot} className="difficulty__dot" data-filled={dot <= DOTS[difficulty]} />
        ))}
      </span>
      {difficulty}
    </span>
  );
}
