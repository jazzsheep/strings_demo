import { CONFIG } from "../config.js";
import { Vec2 } from "../math/Vec2.js";
import { smoothstep } from "../math/grid.js";

// Pointer interaction: grab a nearby particle and drag it, or push particles
// away from the cursor. Coordinates are converted from screen space (clientX/Y)
// into the cloth's local space, which is centred in the window.
export class Input {
  constructor({ canvas, particles }) {
    this.c = canvas;
    this.particles = particles;
    this.mousePos = new Vec2();
    this.grabRadius = 20;
    this.grabbedParticle = null;
    this.bind();
  }

  // Window space -> cloth space (the cloth is centred in the window).
  toLocal(e) {
    this.mousePos.x = e.clientX - window.innerWidth / 2 + CONFIG.awidth / 2;
    this.mousePos.y = e.clientY - window.innerHeight / 2 + CONFIG.aheight / 2;
  }

  pointerdown(e) {
    this.toLocal(e);

    for (const p of this.particles) {
      if (this.mousePos.subtractNew(p.pos).length < this.grabRadius) {
        this.grabbedParticle = p;
        this.grabbedParticle.originalPinnedState = this.grabbedParticle.pinned;
        this.grabbedParticle.pinned = true;
        break;
      }
    }
    if (!this.grabbedParticle) {
      this.pointerIsDown = true;
    }
  }

  pointerup() {
    if (this.grabbedParticle) {
      this.grabbedParticle.pinned = this.grabbedParticle.originalPinnedState;
      this.grabbedParticle = null;
    }
    clearTimeout(this.pointerUpTimer);
    this.pointerUpTimer = setTimeout(() => {
      this.pointerIsDown = false;
    }, 1000);
  }

  pointermove(e) {
    this.toLocal(e);

    if (this.grabbedParticle) {
      this.grabbedParticle.pos.reset(this.mousePos.x, this.mousePos.y);
      this.grabbedParticle.oldPos.reset(this.mousePos.x, this.mousePos.y);
    }

    for (const p of this.particles) {
      const diff = this.mousePos.subtractNew(p.pos);
      const ls = diff.lengthSquared;
      if (ls < CONFIG.mouseSize) {
        const a = diff.angle - Math.PI;
        const strength = (smoothstep(CONFIG.mouseSize, -2000, ls) * CONFIG.mouseStrength) / 300;
        p.applyForce(new Vec2(Math.cos(a) * strength, Math.sin(a) * strength));
      }
    }
  }

  contextmenu(e) {
    e.preventDefault();
  }

  bind() {
    this.pointerdown = this.pointerdown.bind(this);
    this.pointerup = this.pointerup.bind(this);
    this.pointermove = this.pointermove.bind(this);
    this.contextmenu = this.contextmenu.bind(this);
    document.addEventListener("pointerdown", this.pointerdown);
    document.addEventListener("pointerup", this.pointerup);
    document.addEventListener("pointermove", this.pointermove);
    document.addEventListener("contextmenu", this.contextmenu);
  }

  unbind() {
    document.removeEventListener("pointerdown", this.pointerdown);
    document.removeEventListener("pointerup", this.pointerup);
    document.removeEventListener("pointermove", this.pointermove);
    document.removeEventListener("contextmenu", this.contextmenu);
  }
}
