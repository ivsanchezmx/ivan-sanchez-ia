import { motion } from "framer-motion";
import { useGoToSection } from "../lib/sectionNav";
import { trackSpotlight } from "../lib/useSpotlight";
import styles from "./Projects.module.css";

interface Project {
  client: string;
  area: string;
  what: string;
  status: string;
  /** "live" resalta los proyectos que ya están en operación o publicados. */
  tone?: "live";
}

/* Mismo orden y redacción que el CV 2026. Los clientes van sin nombre a propósito. */
const PROJECTS: Project[] = [
  {
    client: "AFORE",
    area: "Servicios financieros",
    what: "Asistente de análisis de NPS que procesa la voz del cliente y genera hallazgos para el área de servicio.",
    status: "En operación mensual",
    tone: "live",
  },
  {
    client: "AFORE",
    area: "Servicio y RH",
    what: "Base de conocimiento RAG con los procedimientos de servicio para apoyar a asesores, y prueba de concepto de un agente de beneficios para RH en Microsoft Copilot Studio.",
    status: "Base construida · PoC de RH",
  },
  {
    client: "Marca automotriz",
    area: "Ventas",
    what: "Agente de voz que califica prospectos y agenda pruebas de manejo, integrado con calendario y SMS.",
    status: "Agente construido · piloto propuesto",
  },
  {
    client: "Industria y grupos empresariales",
    area: "Formación directiva",
    what: "Programas de IA aplicada (Claude, Excel con IA) con casos y datos de su sector, y una herramienta de análisis de rutas de distribución.",
    status: "Entregados a equipos directivos",
    tone: "live",
  },
  {
    client: "Programa nacional",
    area: "MiPyMEs · Marketing",
    what: "Biblioteca de cinco asistentes de IA para que una MiPyME cree estrategia, textos, imágenes y video de marketing.",
    status: "Desarrollada",
  },
  {
    client: "Productos de IA",
    area: "Innogyzer",
    what: "The Leap (orquestación de flujos con agentes), Ask Sherlock (usuarios sintéticos para investigación de mercado) y avatares conversacionales.",
    status: "MVP · demos en vivo",
  },
  {
    client: "FUNDES · Google.org",
    area: "Estándar nacional",
    what: "Desarrollo de cuatro Estándares de Competencia en IA ante CONOCER: mapas funcionales, criterios de desempeño e instrumentos de evaluación.",
    status: "Publicados en el DOF · 28 oct 2026",
    tone: "live",
  },
];

export function Projects() {
  const goTo = useGoToSection();

  return (
    <section className={styles.wrap}>
      <ol className={styles.list}>
        {PROJECTS.map((p, i) => (
          <motion.li
            key={p.client + p.area}
            className={`glass spotlight ${styles.row}`}
            onPointerMove={trackSpotlight}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.who}>
              <span className={styles.client}>{p.client}</span>
              <span className={styles.area}>{p.area}</span>
            </div>
            <p className={styles.what}>{p.what}</p>
            <span className={`${styles.status} ${p.tone === "live" ? styles.statusLive : ""}`}>
              {p.tone === "live" && <span className={styles.statusDot} aria-hidden />}
              {p.status}
            </span>
          </motion.li>
        ))}
      </ol>

      <p className={styles.note}>
        Los nombres de los clientes se omiten por confidencialidad.{" "}
        <button type="button" className={styles.noteLink} onClick={() => goTo("evidence")}>
          Ver lo que sí puedes abrir hoy →
        </button>
      </p>
    </section>
  );
}
