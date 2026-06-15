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

## Display modes

What text appears on the cloth, and how it is laid out, is chosen by a "mode".
Pick one with the `?mode=` URL parameter (or change the default in
`src/config.js`):

- **`source`** (default) — the program's own source code, written horizontally
  and tiled to fill the cloth.
- **`vertical`** — arbitrary Japanese text in vertical writing (縦書き:
  top-to-bottom, columns right-to-left). Pass your own text with `?text=`:

  ```
  index.html?mode=vertical&text=春はあけぼの
  ```

  Use a literal newline in `text` (or just let it wrap) to start a new column.
  With no `text`, a sample passage is shown.

To add another mode, add a layout function in `src/content/layouts.js` and an
entry in `src/content/modes.js` — the physics and rendering code stays untouched.

## Project structure

```
index.html              the page (loads style.css and src/main.js)
style.css               layout / centering
src/
  main.js               entry point: resolves the mode, builds everything, runs the loop
  config.js             shared CONFIG (grid size, gravity, damping, default mode, …)
  content/
    modes.js            available display modes (text source + layout + font)
    layouts.js          how text maps onto the grid (horizontal tiled / vertical RTL)
    sources.js          fetches this project's own source for the "source" mode
  math/
    Vec2.js             2D vector helper
    grid.js             grid/math helpers (vendored from the original pen)
  physics/
    Particle.js         a point mass (Verlet integration)
    Constraint.js       a distance constraint between two particles
    Cloth.js            the cloth model: builds & steps the particle grid
  input/
    Input.js            mouse / touch grab / push interaction
  render/
    Renderer.js         canvas + glyph atlas + per-frame drawing
```

How it fits together: `main.js` resolves the active mode, gets a
`charAt(col, row)` from its layout, and builds a `Cloth` (the model) and a
`Renderer` (the view), wiring up `Input`. Each frame it calls
`input.applyForces()`, `cloth.update()`, `cloth.solve()` and
`renderer.render(cloth)`.

## Credits

Originally a CodePen by shubniggurath:
[ZYpjorm](https://codepen.io/shubniggurath/pen/ZYpjorm), forked from
[xbwOJye](https://codepen.io/shubniggurath/pen/xbwOJye). The helper module was
originally imported from
[OPyPdmm.js](https://codepen.io/shubniggurath/pen/OPyPdmm.js) and is now
vendored locally in `src/math/grid.js`.
