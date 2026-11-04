import type { Insets, Size } from "@/lib/map/viewport";

/** Keep in sync with the panel rules in app/globals.css. */
const DESKTOP_MIN_WIDTH = 861;
const PANEL_WIDTH = 450;
const HEADER_HEIGHT = 84;
const MOBILE_HEADER_HEIGHT = 120;
const MOBILE_SHEET_SHARE = 0.55;

/**
 * The parts of the map hidden behind the header and the panel (the welcome
 * card and the term panel take the same spot).
 */
export function overlayInsets(view: Size): Insets {
  if (view.width >= DESKTOP_MIN_WIDTH) {
    return { top: HEADER_HEIGHT, right: PANEL_WIDTH, bottom: 0, left: 0 };
  }
  return { top: MOBILE_HEADER_HEIGHT, right: 0, bottom: view.height * MOBILE_SHEET_SHARE, left: 0 };
}
