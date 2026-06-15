# Strings

A cloth/string physics simulation rendered with HTML Canvas. The cloth is built
from a grid of particles connected by constraints (Verlet integration), and each
grid point is stamped with a character of this program's own source code, so the
page shows its own code hanging as fabric. Drag points with the mouse, or move
the cursor near the cloth to push it around.

## Run it locally

The code is split into native ES modules (no build step), and `src/main.js`
also `fetch`es the source files to display them on the cloth. Both require
HTTP, so you can't just double-click `index.html` (the `file://` protocol
blocks module loading and `fetch`). Serve it over HTTP:

- **VS Code:** install the *Live Server* extension, then right-click
  `index.html` → "Open with Live Server".
- **Any static server** also works (e.g. `npx serve`).

## Project structure

```
index.html              the page (loads style.css and src/main.js)
style.css               layout / centering
src/
  main.js               entry point: loads the source text and runs the loop
  config.js             shared CONFIG (grid size, gravity, damping, …)
  math/
    Vec2.js             2D vector helper
    grid.js             grid/math helpers (vendored from the original pen)
  physics/
    Particle.js         a point mass (Verlet integration)
    Constraint.js       a distance constraint between two particles
    Cloth.js            the cloth model: builds & steps the particle grid
  input/
    Input.js            mouse grab / push interaction
  render/
    Renderer.js         canvas + glyph atlas + per-frame drawing
```

How it fits together: `main.js` builds a `Cloth` (the model), a `Renderer`
(the view) and wires up `Input`, then each frame calls `cloth.update()`,
`cloth.solve()` and `renderer.render(cloth)`.

## Credits

Originally a CodePen by shubniggurath:
[ZYpjorm](https://codepen.io/shubniggurath/pen/ZYpjorm), forked from
[xbwOJye](https://codepen.io/shubniggurath/pen/xbwOJye). The helper module was
originally imported from
[OPyPdmm.js](https://codepen.io/shubniggurath/pen/OPyPdmm.js) and is now
vendored locally in `src/math/grid.js`.
