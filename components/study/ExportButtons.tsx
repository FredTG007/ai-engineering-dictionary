import type { StudyCard } from "@/lib/study/cards";
import { toAnkiTsv, toCsv } from "@/lib/study/exportDeck";
import { downloadText } from "./downloadText";

const DECK_NAME = "AI Engineering Dictionary";

interface ExportButtonsProps {
  cards: StudyCard[];
  trackNameOf: (trackId: string) => string;
  /** File name stem, e.g. "ai-engineering-dictionary-rag". */
  fileStem: string;
}

/** Download the filtered deck for Anki or a spreadsheet; built in the browser. */
export function ExportButtons({ cards, trackNameOf, fileStem }: ExportButtonsProps) {
  return (
    <div className="export-buttons">
      <span className="export-buttons__label">Export {cards.length} cards</span>
      <button
        type="button"
        className="chip"
        disabled={cards.length === 0}
        onClick={() => downloadText(`${fileStem}-anki.txt`, toAnkiTsv(cards, trackNameOf, DECK_NAME), "text/tab-separated-values")}
      >
        Anki (TSV)
      </button>
      <button
        type="button"
        className="chip"
        disabled={cards.length === 0}
        onClick={() => downloadText(`${fileStem}.csv`, toCsv(cards, trackNameOf), "text/csv")}
      >
        CSV
      </button>
    </div>
  );
}
