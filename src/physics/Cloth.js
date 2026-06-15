import { CONFIG } from "../config.js";
import { getPointID } from "../math/grid.js";
import { Particle } from "./Particle.js";
import { Constraint } from "./Constraint.js";

// The cloth model: a grid of particles wired together with constraints.
// Owns the simulation state; knows nothing about how it is drawn.
export class Cloth {
  constructor(sourceText) {
    this.particles = [];
    this.constraints = [];
    this.build(sourceText);
  }

  build(text) {
    const { gridW, gridH, cellWidth, cellHeight, compressFactor, stretchFactor } = CONFIG;
    const { particles, constraints } = this;

    // Particles: one per grid cell. The top row (j === 0) is pinned so the
    // cloth hangs. Each particle carries one character of the source text.
    for (let i = 0; i < gridW; i++) {
      for (let j = 0; j < gridH; j++) {
        const x = i * cellWidth;
        const y = j * cellHeight;
        const id = getPointID(j, i, gridH);
        const pinned = j === 0;
        const charIndex = (i + j * gridW) % text.length;
        const char = text[charIndex] || " ";

        particles.push(new Particle({ x, y, pinned, id, char }));
      }
    }

    // Constraints: vertical (the cloth fibres) and horizontal (spacers that
    // keep adjacent characters apart).
    for (let i = 0; i < gridW; i++) {
      for (let j = 0; j < gridH; j++) {
        const id = getPointID(j, i, gridH);
        const p = particles[id];

        if (j < gridH - 1) {
          const bottomP = particles[getPointID(j + 1, i, gridH)];
          const down = new Constraint({
            p1: p,
            p2: bottomP,
            length: cellHeight,
            id: id + gridW * gridH,
            compressFactor,
            stretchFactor,
          });
          constraints.push(down);
          p.downConstraint = down; // cached so the renderer can read each column's angle
        }
        if (i < gridW - 1) {
          const rightP = particles[getPointID(j, i + 1, gridH)];
          constraints.push(
            new Constraint({
              p1: p,
              p2: rightP,
              length: cellWidth,
              id: id + gridW * gridH * 2,
              compressFactor: 0.6,
              stretchFactor: 4,
              isSpacer: true,
            })
          );
        }
      }
    }
  }

  update(delta) {
    for (const p of this.particles) p.update(delta);
  }

  solve() {
    const { iterationsPerFrame, randomSolve, contain } = CONFIG;
    if (randomSolve) shuffle(this.constraints);
    for (let i = 0; i < iterationsPerFrame; i++) {
      for (const c of this.constraints) c.solve();
    }
    if (contain) for (const p of this.particles) p.contain();
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
