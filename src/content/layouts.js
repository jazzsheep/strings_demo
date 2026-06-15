// Layout strategies decide *which character goes in which cell*. Each takes the
// text and grid size and returns a function charAt(col, row) -> a single
// character (" " for an empty cell). This is the seam that lets new display
// modes be added without touching the physics or rendering code.

// Source-code style: read left-to-right then top-to-bottom, tiling the text so
// the whole cloth is covered.
export function tiledHorizontal(text, gridW) {
  const chars = Array.from(text);
  if (chars.length === 0) return () => " ";
  return (col, row) => chars[(col + row * gridW) % chars.length] || " ";
}

// Japanese vertical writing (縦書き): characters run top-to-bottom within a
// column, and columns run right-to-left. The text is placed once (not tiled);
// "\n" starts a new column, and a column also wraps when it fills to the bottom.
export function verticalRightToLeft(text, gridW, gridH) {
  const columns = [];
  let current = [];
  for (const ch of Array.from(text)) {
    if (ch === "\n") {
      columns.push(current);
      current = [];
    } else {
      if (current.length >= gridH) {
        columns.push(current);
        current = [];
      }
      current.push(ch);
    }
  }
  columns.push(current);

  // Centre the block of used columns horizontally, so the text sits in the
  // middle of the cloth regardless of how many columns it occupies. The first
  // column read sits at the right edge of that centred block (right-to-left).
  const n = columns.length;
  const start = Math.max(0, Math.floor((gridW - n) / 2));
  const rightEdge = start + Math.min(n, gridW) - 1;

  return (col, row) => {
    const k = rightEdge - col;
    if (k < 0 || k >= n) return " ";
    const column = columns[k];
    return (column && column[row]) || " ";
  };
}
