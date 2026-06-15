// Global simulation configuration, derived from the current window size.
// Imported as a shared singleton by the other modules.

const w = Math.min(400, window.innerWidth - 100);
const h = Math.min(400, window.innerHeight - 100);

export const CONFIG = {
  awidth: w,
  aheight: h,
  // More columns than rows so cells are taller than wide (characters are taller than wide).
  gridW: Math.min(45, Math.floor(w / 12)),
  gridH: Math.min(30, Math.floor(w / 16)),
  gravity: 0.2,
  damping: 0.99,
  iterationsPerFrame: 5,
  compressFactor: 0.02,
  stretchFactor: 1.1,
  mouseSize: 5000,
  mouseStrength: 4,
  contain: false,
  randomSolve: false,
  // Default content mode; overridable via the ?mode= URL parameter.
  // See src/content/modes.js for the available modes ("source", "vertical").
  mode: "source",
};

CONFIG.cellWidth = CONFIG.awidth / (CONFIG.gridW - 1);
CONFIG.cellHeight = CONFIG.aheight / (CONFIG.gridH - 1);
