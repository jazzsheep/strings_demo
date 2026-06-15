import { Cloth } from "./physics/Cloth.js";
import { Input } from "./input/Input.js";
import { Renderer } from "./render/Renderer.js";

// The cloth literally displays this program's own source: at startup we fetch
// each module and stitch them together into the text stamped onto the grid.
const SOURCE_FILES = [
  "src/main.js",
  "src/config.js",
  "src/math/Vec2.js",
  "src/math/grid.js",
  "src/physics/Particle.js",
  "src/physics/Constraint.js",
  "src/physics/Cloth.js",
  "src/input/Input.js",
  "src/render/Renderer.js",
];

async function loadSourceText() {
  try {
    const texts = await Promise.all(
      SOURCE_FILES.map((path) => fetch(path).then((res) => res.text()))
    );
    return texts.join("\n");
  } catch (err) {
    // fetch only works over http(s); fall back so the demo still runs from file://
    console.warn("Could not fetch source files; using fallback text.", err);
    return "strings // a cloth simulation that shows its own source code ".repeat(40);
  }
}

async function start() {
  const container = document.getElementById("container");
  const sourceText = await loadSourceText();

  const cloth = new Cloth(sourceText);
  const renderer = new Renderer(container, sourceText);
  new Input({ canvas: renderer.canvas, particles: cloth.particles });

  let last = 0;
  function frame(time) {
    requestAnimationFrame(frame);
    const delta = time - last;
    last = time;

    cloth.update(delta);
    cloth.solve();
    renderer.render(cloth);
  }
  requestAnimationFrame(frame);
}

start();
