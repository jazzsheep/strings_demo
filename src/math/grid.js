// Grid / math helpers, vendored from the original CodePen module
// (https://codepen.io/shubniggurath/pen/OPyPdmm.js). Only the helpers this
// project actually uses are kept here.

// Map a (row, column) cell to its flat index in the particle array.
export function getPointID(x, y, w) {
  return y * w + x;
}

// Smooth 0..1 interpolation between two edges (Hermite). Used to fade the
// mouse repulsion force with distance.
export function smoothstep(edge0, edge1, x) {
  let t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}
