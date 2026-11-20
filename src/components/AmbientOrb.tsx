import { motion } from "framer-motion";
import styles from "./AmbientOrb.module.css";

/**
 * Aurora de fondo: tres masas de luz que derivan lento detrás del contenido.
 * Solo decorativo; con reduced-motion queda estático (regla global).
 */
export function AmbientOrb() {
  return (
    <div className={styles.host} aria-hidden>
      <motion.div
        className={`${styles.orb} ${styles.orbA}`}
        animate={{ x: ["-10%", "8%", "-4%", "-10%"], y: ["4%", "-6%", "8%", "4%"] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={`${styles.orb} ${styles.orbB}`}
        animate={{ x: ["8%", "-8%", "4%", "8%"], y: ["-4%", "6%", "-2%", "-4%"] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={`${styles.orb} ${styles.orbC}`}
        animate={{ x: ["0%", "10%", "-6%", "0%"], y: ["0%", "-8%", "4%", "0%"] }}
        transition={{ duration: 38, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className={styles.horizon} />
    </div>
  );
}
