import { CONFIG } from "./config.js";
import { Cloth } from "./physics/Cloth.js";
import { Input } from "./input/Input.js";
import { Renderer } from "./render/Renderer.js";
import { resolveMode } from "./content/modes.js";

async function start() {
  const container = document.getElementById("container");
  const { gridW, gridH } = CONFIG;

  // A "mode" decides what text to show, how to lay it out, and which font to
  // use. Default is the source code; ?mode=vertical&text=... shows Japanese
  // vertical writing instead. See src/content/modes.js.
  const { mode, text } = resolveMode();
  const rawText = await mode.loadText(text);
  const charAt = mode.layout(rawText, gridW, gridH);

  const cloth = new Cloth(charAt);
  const renderer = new Renderer(container, cloth, {
    fontFamily: mode.fontFamily,
    fontWeight: mode.fontWeight,
    charAspect: mode.charAspect,
  });
  const input = new Input({ canvas: renderer.canvas, particles: cloth.particles });

  let last = 0;
  function frame(time) {
    requestAnimationFrame(frame);
    const delta = time - last;
    last = time;

    input.applyForces(); // add cursor forces once per frame, before they're consumed
    cloth.update(delta);
    cloth.solve();
    renderer.render(cloth);
  }
  requestAnimationFrame(frame);
}

// Surface any startup error on screen instead of failing to a silent blank
// page (handy on mobile, where the dev console isn't easily reachable).
start().catch((err) => {
  console.error(err);
  const el = document.getElementById("container");
  if (el) {
    el.innerHTML =
      '<pre style="margin:0;padding:1em;color:#900;font:14px/1.4 monospace;' +
      'white-space:pre-wrap;word-break:break-word">' +
      String((err && err.stack) || err) +
      "</pre>";
  }
});
