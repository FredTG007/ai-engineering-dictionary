import { describeDelay, GRADES, review, type CardSchedule, type Grade } from "@/lib/study/sm2";

const LABELS: Record<Grade, string> = { again: "Again", hard: "Hard", good: "Good", easy: "Easy" };

interface GradeButtonsProps {
  schedule: CardSchedule | undefined;
  now: number;
  onGrade: (grade: Grade) => void;
}

/** The four answer buttons, each showing when the card would come back. */
export function GradeButtons({ schedule, now, onGrade }: GradeButtonsProps) {
  return (
    <div className="grade-buttons" role="group" aria-label="How well did you know it?">
      {GRADES.map((grade, index) => (
        <button key={grade} type="button" className="grade-button" data-grade={grade} onClick={() => onGrade(grade)}>
          <span className="grade-button__label">
            <kbd>{index + 1}</kbd> {LABELS[grade]}
          </span>
          <span className="grade-button__delay">{describeDelay(review(schedule, grade, now).due - now)}</span>
        </button>
      ))}
    </div>
  );
}
