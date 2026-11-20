import type { CSSProperties } from "react";
import styles from "./BrandMark.module.css";

/**
 * Monograma "IS". Usa la misma fórmula tipográfica que los títulos del
 * sitio: sans en negrita + acento en serif itálica con degradado, sobre
 * una placa de vidrio con borde degradado (como las tarjetas .glass).
 * Es el único logo: barra superior, chat y favicon (index.html) lo comparten.
 */
export function BrandMark({ size = 40 }: { size?: number }) {
  return (
    <span className={styles.mark} style={{ "--size": `${size}px` } as CSSProperties} aria-hidden>
      <span className={styles.letters}>
        <span className={styles.i}>I</span>
        <span className={styles.s}>S</span>
      </span>
    </span>
  );
}
