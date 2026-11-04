import type { Insets, Size } from "@/lib/map/viewport";

/** Keep in sync with the header, panel and lines-card rules in app/globals.css. */
const DESKTOP_MIN_WIDTH = 861;
const PANEL_WIDTH = 450;
/** Header text plus the paper wash around it. */
const HEADER_HEIGHT = 100;
/** The folded "Lines" tab at the bottom left, plus its gap. */
const LINES_TAB_HEIGHT = 72;
const MOBILE_HEADER_HEIGHT = 120;
/** On small screens the folded "Lines" tab sits just under the header. */
const MOBILE_LINES_TAB_HEIGHT = 48;
const MOBILE_SHEET_SHARE = 0.55;

/**
 * The parts of the map hidden behind the header, the panel (the welcome card
 * and the term panel take the same spot) and, while a term is open, the
 * folded "Lines" tab.
 */
export function overlayInsets(view: Size, termOpen: boolean): Insets {
  if (view.width >= DESKTOP_MIN_WIDTH) {
    return { top: HEADER_HEIGHT, right: PANEL_WIDTH, bottom: termOpen ? LINES_TAB_HEIGHT : 0, left: 0 };
  }
  return {
    top: MOBILE_HEADER_HEIGHT + (termOpen ? MOBILE_LINES_TAB_HEIGHT : 0),
    right: 0,
    bottom: view.height * MOBILE_SHEET_SHARE,
    left: 0,
  };
}
