import { motion } from "framer-motion";
import { trackSpotlight } from "../lib/useSpotlight";
import styles from "./Approach.module.css";

/* Los pasos de "Cómo trabajo" del CV 2026, más el paso de priorización y
   portafolio (4), que hace visible la gestión entre la hipótesis y el piloto. */
const STEPS = [
  {
    title: "Entender la empresa",
    body: "Contexto, cultura y madurez digital antes de hablar de herramientas.",
  },
  {
    title: "Entender el problema",
    body: "Levantamiento de información con las áreas involucradas.",
  },
  {
    title: "Plantear hipótesis",
    body: "Qué se espera mejorar y cómo se va a medir.",
  },
  {
    title: "Priorizar y armar el portafolio",
    body: "Definir qué va primero según impacto y esfuerzo, y ordenar las iniciativas en un portafolio que la dirección pueda gestionar.",
    highlight: true,
  },
  {
    title: "Probar en pequeño",
    body: "Prueba de concepto o MVP antes de invertir.",
  },
  {
    title: "Acompañar el cambio",
    body: "Formación práctica y gestión del cambio para que la gente adopte la herramienta.",
  },
  {
    title: "Escalar lo que funciona",
    body: "Con indicadores claros.",
  },
];

export function Approach() {
  return (
    <section className={styles.wrap}>
      <ol className={styles.steps}>
        {STEPS.map((s, i) => (
          <motion.li
            key={s.title}
            className={`glass spotlight ${styles.step} ${s.highlight ? styles.stepKey : ""}`}
            onPointerMove={trackSpotlight}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.06 * i, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={`grad-text ${styles.stepNum}`}>{String(i + 1).padStart(2, "0")}</span>
            <h3 className={styles.stepTitle}>{s.title}</h3>
            <p className={styles.stepBody}>{s.body}</p>
          </motion.li>
        ))}

        {/* Octava celda: cierra la retícula con la regla de trabajo */}
        <motion.li
          className={`glass ${styles.principle}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06 * STEPS.length, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="eyebrow">Mi regla</span>
          <p>
            La IA apoya, no sustituye: <em>la decisión final siempre la toma una persona.</em>
          </p>
        </motion.li>
      </ol>
    </section>
  );
}
