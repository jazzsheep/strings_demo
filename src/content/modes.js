import { CONFIG } from "../config.js";
import { tiledHorizontal, verticalRightToLeft } from "./layouts.js";
import { fetchSourceText } from "./sources.js";

const JP_FONT =
  '"Hiragino Kaku Gothic ProN", "Yu Gothic", "Noto Sans JP", "MS PGothic", sans-serif';

const JAPANESE_SAMPLE =
  "祇園精舎の鐘の声\n諸行無常の響きあり\n沙羅双樹の花の色\n盛者必衰の理をあらはす";

// Each mode bundles everything a display style needs: how to get its text, how
// to lay it out on the grid, and the font / cell shape that text wants.
// Add a new entry here (plus a layout in layouts.js) to add another option.
export const MODES = {
  // Default: the program's own source code, tiled to fill the cloth.
  source: {
    layout: tiledHorizontal,
    fontFamily: "monospace",
    fontWeight: "bold",
    charAspect: 0.6, // monospace advance width is ~0.6em
    loadText: () => fetchSourceText(),
  },
  // Arbitrary Japanese text, written vertically (top-to-bottom, right-to-left).
  vertical: {
    layout: verticalRightToLeft,
    fontFamily: JP_FONT,
    fontWeight: "500",
    charAspect: 1, // full-width CJK glyphs are ~1em wide
    loadText: (text) => Promise.resolve(text || JAPANESE_SAMPLE),
  },
};

// Resolve the active mode and text. Precedence: URL params, then CONFIG.
//   ?mode=vertical&text=...   (text is optional; a sample is used if omitted)
export function resolveMode() {
  const params = new URLSearchParams(location.search);
  const name = params.get("mode") || CONFIG.mode || "source";
  const mode = MODES[name] || MODES.source;
  const text = params.get("text") || "";
  return { name, mode, text };
}
