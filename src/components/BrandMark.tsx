import { useId, type CSSProperties } from "react";
import styles from "./BrandMark.module.css";

/**
 * Isotipo de Iván (tres elementos entrelazados: marco superior, marco
 * inferior y diagonal central de "cambio"). Original en extras/ISM_isotipo_fiel.svg
 * (morado + azul marino); aquí adaptado al fondo oscuro del sitio:
 *  - marco superior: morado aclarado hacia el índigo del sitio,
 *  - marco inferior: azul marino → azul cielo (--accent),
 *  - diagonal central: claro, la pieza más luminosa.
 * `plate` lo monta sobre una placa de vidrio (chat). Comparte diseño con el
 * favicon de index.html.
 */
export function BrandMark({ size = 40, plate = false }: { size?: number; plate?: boolean }) {
  const id = useId().replace(/:/g, "");
  const upper = `ism-up-${id}`;
  const lower = `ism-lo-${id}`;
  const center = `ism-ce-${id}`;

  return (
    <span
      className={`${styles.mark} ${plate ? styles.plate : ""}`}
      style={{ "--size": `${size}px` } as CSSProperties}
      aria-hidden
    >
      <svg className={styles.svg} viewBox="463 184.5 642 642" focusable="false">
        <defs>
          <linearGradient id={upper} x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c58bff" />
            <stop offset="0.45" stopColor="#a06bff" />
            <stop offset="1" stopColor="#7b6cff" />
          </linearGradient>
          <linearGradient id={lower} x1="0" y1="0" x2="0.9" y2="1">
            <stop offset="0" stopColor="#7cc0ff" />
            <stop offset="1" stopColor="#2f6bff" />
          </linearGradient>
          <linearGradient id={center} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#a9d4ff" />
            <stop offset="1" stopColor="#ffffff" />
          </linearGradient>
        </defs>
        <path
          fill={`url(#${upper})`}
          d="M707 304 C728 274 762 244 793 238 C799 236 806 235 814 235 H991 C1045 235 1085 275 1085 326 V483 C1085 530 1057 562 997 597 V359 C997 330 977 308 946 308 Z"
        />
        <path
          fill={`url(#${lower})`}
          d="M571 424 V655 C571 679 588 699 624 700 H871 C846 734 826 753 803 766 C792 773 781 775 767 775 H573 C521 775 483 737 483 687 V538 C483 489 516 453 571 424 Z"
        />
        <path
          fill={`url(#${center})`}
          d="M626 622 L774 417 C791 395 809 383 832 383 H940 L790 590 C775 611 754 622 728 622 Z"
        />
      </svg>
    </span>
  );
}
