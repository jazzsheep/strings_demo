// Fetches this project's own source and stitches it into one string, so the
// "source" mode can display the program's code on the cloth.
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
  "src/content/sources.js",
  "src/content/layouts.js",
  "src/content/modes.js",
];

export async function fetchSourceText() {
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
