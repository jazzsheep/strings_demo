import { CONFIG } from "../config.js";

// Cap the device pixel ratio so we stay crisp on HiDPI screens without making
// the backing store enormous. Phones/tablets (coarse pointers) often report a
// dpr of 2-3 on weaker GPUs, so we cap them lower to keep the frame rate up.
const getDpr = () => {
  const cap = window.matchMedia("(pointer: coarse)").matches ? 1.5 : 2;
  return Math.min(window.devicePixelRatio || 1, cap);
};

// Owns the canvas and draws the cloth. Each character is pre-rendered once into
// a small offscreen canvas (a glyph atlas) and then stamped, rotated, per frame.
export class Renderer {
  constructor(container, sourceText) {
    this.dpr = getDpr();
    this.tilePad = 1.8; // tile size in ems, generous so tall/bold glyphs aren't clipped
    // Size the glyph to fit its cell in BOTH directions so rows/columns don't
    // overlap. Monospace advance width is ~0.6em, so width needs cellWidth / 0.6.
    this.fontSize = Math.max(8, Math.min(CONFIG.cellHeight, CONFIG.cellWidth / 0.6));
    this.charCanvases = this.buildGlyphAtlas(sourceText);

    this.canvas = document.createElement("canvas");
    container.innerHTML = "";
    container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.resize();

    window.addEventListener("resize", () => this.resize());
  }

  // Size the canvas backing store to device pixels, but keep its CSS size in
  // layout pixels, so rendering is sharp on HiDPI screens.
  resize() {
    this.dpr = getDpr();
    const { canvas, dpr } = this;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
  }

  buildGlyphAtlas(text) {
    const { dpr, tilePad, fontSize } = this;
    const atlas = {};
    for (const ch of new Set(text)) {
      if (ch === " ") continue;
      const off = document.createElement("canvas");
      // Render at dpr resolution; the logical size it represents is fontSize * tilePad.
      off.width = off.height = Math.ceil(fontSize * tilePad * dpr);
      const octx = off.getContext("2d");
      octx.scale(dpr, dpr);
      octx.font = `bold ${fontSize}px monospace`;
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.fillStyle = "#333";
      octx.fillText(ch, off.width / (2 * dpr), off.height / (2 * dpr));
      atlas[ch] = off;
    }
    return atlas;
  }

  render(cloth) {
    const { ctx, canvas, dpr, fontSize, tilePad, charCanvases } = this;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // The cloth uses its own local coordinates; centre it in the window.
    const offsetX = window.innerWidth / 2 - CONFIG.awidth / 2;
    const offsetY = window.innerHeight / 2 - CONFIG.aheight / 2 - 30;
    const tileSize = fontSize * tilePad;
    const half = tileSize / 2;

    for (const p of cloth.particles) {
      if (!p.char || p.char === " ") continue;
      const img = charCanvases[p.char];
      if (!img) continue;

      // Rotate each glyph to follow the angle of its downward fibre.
      let cos = 1, sin = 0;
      const constraint = p.downConstraint;
      if (constraint) {
        const dx = constraint.p2.pos.x - constraint.p1.pos.x;
        const dy = constraint.p2.pos.y - constraint.p1.pos.y;
        const angle = Math.atan2(dy, dx) - Math.PI / 2;
        cos = Math.cos(angle);
        sin = Math.sin(angle);
      }

      // Bake dpr into the transform so positions map to device pixels.
      ctx.setTransform(
        cos * dpr, sin * dpr,
        -sin * dpr, cos * dpr,
        (p.pos.x + offsetX) * dpr, (p.pos.y + offsetY) * dpr
      );
      ctx.drawImage(img, -half, -half, tileSize, tileSize);
    }

    ctx.restore();
  }
}
