import type { PointerEvent } from "react";

/**
 * Handler para la clase global `.spotlight`: guarda la posición del
 * cursor en --mx / --my para que el brillo radial lo siga.
 */
export function trackSpotlight(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}
