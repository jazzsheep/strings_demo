# Strings

A cloth/string physics simulation rendered with HTML Canvas. The cloth is built
from a grid of particles connected by constraints (Verlet integration), and each
grid point is stamped with a character of this program's own source code, so the
page shows its own code hanging as fabric. Drag points with the mouse, or move
the cursor near the cloth to push it around.

## Run it locally

Because `script.js` uses ES module `import`, you can't just double-click
`index.html` (the `file://` protocol blocks module loading). Serve it over HTTP:

- **VS Code:** install the *Live Server* extension, then right-click
  `index.html` → "Open with Live Server".
- **Any static server** also works (e.g. `npx serve`).

## Files

- `index.html` — the page (loads the CSS and the module script)
- `style.css` — layout / centering
- `script.js` — the simulation (particles, constraints, input, render loop)
- `lib.js` — small math/grid helpers (vendored from the original pen so the
  project is self-contained)

## Credits

Originally a CodePen by shubniggurath:
[ZYpjorm](https://codepen.io/shubniggurath/pen/ZYpjorm), forked from
[xbwOJye](https://codepen.io/shubniggurath/pen/xbwOJye). The helper module was
originally imported from
[OPyPdmm.js](https://codepen.io/shubniggurath/pen/OPyPdmm.js) and is now
included locally as `lib.js`.
