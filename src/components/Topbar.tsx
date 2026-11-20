import { SECTIONS, CV_PDF_URL } from "../sections";
import styles from "./Topbar.module.css";

const ASSISTANT_KEY = SECTIONS.findIndex((s) => s.id === "assistant") + 1;

/**
 * Barra superior. No repite el nombre (ya está en el panel lateral):
 * dice qué es la pieza, la disponibilidad y deja las dos acciones clave.
 */
export function Topbar({ onAsk, onHome }: { onAsk: () => void; onHome: () => void }) {
  return (
    <header className={`${styles.topbar} no-print`} role="banner">
      <button type="button" className={styles.brand} onClick={onHome} aria-label="Ir al inicio">
        <span className={styles.brandMark} aria-hidden>
          <span className={styles.brandLetters}>iS</span>
          <span className={styles.brandDot} />
        </span>
        <span className={styles.brandText}>
          <span className={styles.brandName}>CV interactivo</span>
          <span className={styles.brandTag}>IA aplicada al negocio · 2026</span>
        </span>
      </button>

      <div className={styles.center}>
        <span className={styles.status}>
          <span className={styles.statusDot} aria-hidden />
          Disponible · reubicación en México
        </span>
      </div>

      <div className={styles.right}>
        <a href={CV_PDF_URL} download className={styles.cv}>
          <span className={styles.cvLabel}>Descargar CV</span>
          <span aria-hidden>↓</span>
        </a>
        <button type="button" className={styles.ask} onClick={onAsk}>
          <span className={styles.askSpark} aria-hidden>✦</span>
          <span className={styles.askLabel}>Pregúntale a la IA</span>
          <kbd className={styles.kbd}>{ASSISTANT_KEY}</kbd>
        </button>
      </div>
    </header>
  );
}
