/**
 * Registry of the live torn-paper edges, so the nav can tell whether it sits over cream or dark
 * paper without reading pixels back from a canvas (a GPU readback every scroll frame, and it
 * forced the edge canvas to render on the CPU).
 */
interface Edge {
  el: HTMLElement;
  /** Is the paper below the tear light (cream) or dark? */
  paper: "light" | "dark";
  /** Tear line: y (px from the canvas top) for each CSS px column. */
  line: () => ArrayLike<number>;
}

const edges = new Set<Edge>();

export function registerPaperEdge(edge: Edge) {
  edges.add(edge);
  return () => {
    edges.delete(edge);
  };
}

/** true = dark behind the viewport point, false = light, null = no torn edge covers it. */
export function edgeToneAt(x: number, y: number): boolean | null {
  for (const e of edges) {
    const r = e.el.getBoundingClientRect();
    if (!r.width || x < r.left || x > r.right || y < r.top || y > r.bottom) continue;
    const line = e.line();
    if (!line.length) continue;
    const i = Math.min(line.length - 1, Math.max(0, Math.floor(x - r.left)));
    const onPaper = y - r.top >= line[i];
    const paperDark = e.paper === "dark";
    return onPaper ? paperDark : !paperDark;
  }
  return null;
}
