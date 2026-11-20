import { useEffect, useState } from "react";
import { animate, motion } from "framer-motion";
import { useGoToSection } from "../lib/sectionNav";
import { trackSpotlight } from "../lib/useSpotlight";
import styles from "./Profile.module.css";

interface Stat {
  value: number;
  prefix?: string;
  suffix: string;
  label: string;
}

/* Mismas cifras y redacción que el CV 2026. */
const STATS: Stat[] = [
  { value: 150, suffix: "+", label: "experimentos al año coordinados en Grupo Rotoplas" },
  { value: 75, prefix: "~", suffix: "%", label: "de éxito en hipótesis de negocio evaluadas" },
  { value: 20, prefix: "$", suffix: "M+", label: "MXN en inversiones optimizadas o evitadas (equipo)" },
  { value: 2000, suffix: "+", label: "personas formadas: 1,500 en innovación y 500 en IA" },
];

interface TrackItem {
  year: string;
  role: string;
  org: string;
  note?: string;
  current?: boolean;
}

const EXPERIENCE: TrackItem[] = [
  { year: "2026 → hoy", role: "Consultor Senior en IA", org: "FUNDES", note: "con Google.org", current: true },
  { year: "2025 → hoy", role: "Consultor en IA", org: "Innogyzer", current: true },
  { year: "2022–2024", role: "Gerente de Experimentación e Innovación", org: "Grupo Rotoplas", note: "LATAM" },
  { year: "2019–2022", role: "Analista → Coordinador de Innovación", org: "Grupo Rotoplas" },
];

const EDUCATION: TrackItem[] = [
  { year: "2023 → en curso", role: "Doctorado en Alta Dirección", org: "Univ. del Valle de Puebla", current: true },
  { year: "2018–2019", role: "Máster en Nuevas Tecnologías en Informática", org: "Univ. de Murcia", note: "beca Fundación Carolina" },
  { year: "2016–2018", role: "Maestría en Economía, Gestión y Políticas de Innovación", org: "UAM Xochimilco", note: "beca CONACYT" },
  { year: "Ingeniería", role: "Ingeniería en Computación", org: "Univ. Autónoma de Tlaxcala", note: "mención honorífica" },
];

function CountUp({ stat }: { stat: Stat }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const controls = animate(0, stat.value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [stat.value]);
  return (
    <>
      {stat.prefix}
      {n.toLocaleString("es-MX")}
      {stat.suffix}
    </>
  );
}

function Timeline({ label, items }: { label: string; items: TrackItem[] }) {
  return (
    <div className={`glass ${styles.tlCol}`}>
      <span className="eyebrow">{label}</span>
      <ol className={styles.tlList}>
        {items.map((item) => (
          <li key={item.role + item.year} className={styles.tlItem}>
            <span className={`${styles.tlDot} ${item.current ? styles.tlDotLive : ""}`} aria-hidden />
            <span className={styles.tlYear}>{item.year}</span>
            <span className={styles.tlRole}>{item.role}</span>
            <span className={styles.tlOrg}>
              {item.org}
              {item.note && <span className={styles.tlNote}> · {item.note}</span>}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Profile() {
  const goTo = useGoToSection();

  return (
    <section className={styles.wrap}>
      <div className={styles.hero}>
        <div className={`body-prose ${styles.intro}`}>
          <p className={styles.lede}>
            Convierto tecnología en <strong>decisiones de negocio</strong>: pruebo en pequeño, mido y
            escalo solo lo que funciona.
          </p>
          <p>
            Soy <strong>Iván Sánchez Martínez</strong>, ingeniero en computación con más de 8 años de
            experiencia. En FUNDES, con Google.org, lidero el desarrollo de{" "}
            <strong>cuatro Estándares de Competencia en IA</strong> para MiPyMEs, de los primeros del
            país. En Innogyzer diseño y construyo <strong>agentes de IA</strong> para servicios financieros
            y automotriz: asistentes de análisis, bases de conocimiento y agentes de voz.
          </p>
          <div className={styles.ctaRow}>
            <button type="button" className={styles.ctaPrimary} onClick={() => goTo("projects")}>
              Ver proyectos con resultados <span aria-hidden>→</span>
            </button>
            <button type="button" className={styles.ctaGhost} onClick={() => goTo("assistant")}>
              <span aria-hidden>✦</span> Pregúntale a mi asistente IA
            </button>
          </div>
        </div>

        <div className={styles.stats}>
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              className={`glass spotlight ${styles.stat}`}
              onPointerMove={trackSpotlight}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={`grad-text ${styles.statNum}`}>
                <CountUp stat={s} />
              </div>
              <div className={styles.statLabel}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className={styles.timeline}>
        <Timeline label="Experiencia" items={EXPERIENCE} />
        <Timeline label="Formación" items={EDUCATION} />
      </div>
    </section>
  );
}
