import { motion } from "framer-motion";
import { useGoToSection } from "../lib/sectionNav";
import { trackSpotlight } from "../lib/useSpotlight";
import { whatsappUrl, WhatsAppIcon } from "../lib/whatsapp";
import type { SectionId } from "../sections";
import styles from "./Evidence.module.css";

interface EvidenceItem {
  kind: string;
  title: string;
  description: string;
  href: string;
  host: string;
  /** Si está presente, el card es interno y navega a esa sección. */
  internalTarget?: SectionId;
}

interface EvidenceGroup {
  label: string;
  /** Composición del grupo: destacadas, cuatro columnas o lista compacta. */
  layout?: "feature" | "four" | "list";
  items: EvidenceItem[];
}

const GROUPS: EvidenceGroup[] = [
  {
    label: "Asistente IA de este perfil",
    items: [
      {
        kind: "Asistente · Claude + avatar",
        title: "Pregúntale lo que quieras sobre mí",
        description:
          "Chat con Claude y un avatar en video que responde por voz. Lo construí para que conozcas mi perfil a tu ritmo.",
        href: "#assistant",
        host: "05 · aquí mismo",
        internalTarget: "assistant",
      },
    ],
  },
  {
    label: "Estándares de Competencia en IA · publicados en el DOF",
    layout: "four",
    items: [
      {
        kind: "EC1830 · Estándar A",
        title: "Adopción de soluciones de IA en los procesos de la MiPyME",
        description:
          "Para quien incorpora herramientas de IA en los procesos de una MiPyME: diagnóstico, implementación y evaluación.",
        href: "https://www.conocer.gob.mx/contenido/publicaciones_dof/2026/tercera_so/EC1830.pdf",
        host: "conocer.gob.mx · EC1830.pdf",
      },
      {
        kind: "EC1835 · Estándar B",
        title: "Creación de soluciones comerciales con IA",
        description:
          "Para quien conceptualiza, prototipa y valida productos y soluciones comerciales apoyados en IA.",
        href: "https://www.conocer.gob.mx/contenido/publicaciones_dof/2026/tercera_so/EC1835.pdf",
        host: "conocer.gob.mx · EC1835.pdf",
      },
      {
        kind: "EC1848 · Estándar C",
        title: "Consultoría en mercadotecnia digital con IA",
        description:
          "Para quien planifica estrategias y genera piezas de texto, imagen, audio y video para campañas digitales con IA.",
        href: "https://www.conocer.gob.mx/contenido/publicaciones_dof/2026/tercera_so/EC1848.pdf",
        host: "conocer.gob.mx · EC1848.pdf",
      },
      {
        kind: "EC1836 · Estándar D",
        title: "Soluciones tecnológicas de modernización digital con IA",
        description:
          "Para quien construye soluciones tecnológicas personalizadas con IA para modernizar a la MiPyME.",
        href: "https://www.conocer.gob.mx/contenido/publicaciones_dof/2026/tercera_so/EC1836.pdf",
        host: "conocer.gob.mx · EC1836.pdf",
      },
      {
        kind: "Diario Oficial de la Federación",
        title: "Acuerdo SE/III-26/10,S del Comité Técnico del CONOCER",
        description:
          "Publicación oficial de los cuatro estándares, 28 de octubre de 2026. Proyecto Mi CompañIA de FUNDES México con Google.org.",
        href: "https://sidof.segob.gob.mx/notas/5802372",
        host: "sidof.segob.gob.mx · nota 5802372",
      },
    ],
  },
  {
    label: "Plataformas propias",
    layout: "feature",
    items: [
      {
        kind: "Plataforma · Orquestación",
        title: "The Leap",
        description:
          "Orquestación de flujos con agentes para procesos de innovación. Producto de Innogyzer, con video demo en el sitio.",
        href: "https://theleap.innogyzer.com",
        host: "theleap.innogyzer.com",
      },
      {
        kind: "Plataforma · Cofundador",
        title: "Ask Sherlock",
        description:
          "Usuarios sintéticos para investigación de mercado antes de desarrollar un producto.",
        href: "https://www.ask-sherlock.app",
        host: "ask-sherlock.app",
      },
    ],
  },
  {
    label: "Custom GPTs públicos",
    layout: "list",
    items: [
      {
        kind: "Custom GPT · Estrategia",
        title: "Experto en JTBD",
        description:
          "Asistente experto en el marco Jobs to Be Done para entrevistas, síntesis y oportunidades de innovación.",
        href: "https://chatgpt.com/g/g-67a114fbd6cc8191b3414808b6b71bbb-experto-en-jtbd",
        host: "chatgpt.com/g/experto-en-jtbd",
      },
      {
        kind: "Custom GPT · Experimentación",
        title: "Xperimenta by Innogyzer",
        description:
          "Diseño y planificación de experimentos para validar hipótesis de producto y modelo de negocio.",
        href: "https://chatgpt.com/g/g-0v021tXCJ-xperimenta-by-innogyzer",
        host: "chatgpt.com/g/Xperimenta",
      },
      {
        kind: "Custom GPT · Prototipado",
        title: "Yprototiper by Innogyzer",
        description:
          "Generación rápida de prototipos conceptuales para acelerar ciclos de validación.",
        href: "https://chatgpt.com/g/g-6799b2dba3048191bd7a4318a64de702-yprototiper-by-innogyzer",
        host: "chatgpt.com/g/Yprototiper",
      },
      {
        kind: "Custom GPT · Negocios",
        title: "Canvas Maestro",
        description:
          "Asistente para articular Business Model Canvas y refinar propuestas de valor en sesiones ejecutivas.",
        href: "https://chatgpt.com/g/g-wGAIdb1yZ-canvas-maestro-modelos-de-negocio",
        host: "chatgpt.com/g/Canvas-Maestro",
      },
      {
        kind: "Custom GPT · UX",
        title: "Arquetipos UX",
        description:
          "Construcción de arquetipos y personas con base en investigación cualitativa para equipos de producto.",
        href: "https://chatgpt.com/g/g-67c0aa7f498c819183294fc62937ae41-arquetipos-ux",
        host: "chatgpt.com/g/Arquetipos-UX",
      },
    ],
  },
];

const NEXT_STEPS = [
  {
    title: "Demo en vivo",
    body: "Te muestro The Leap, Sherlock o cualquiera de mis agentes funcionando.",
    message: "Hola Iván, vi tu CV interactivo y me gustaría agendar una demo en vivo.",
  },
  {
    title: "Caso a fondo",
    body: "Te cuento a detalle cualquier caso de habilitación con IA que haya trabajado.",
    message: "Hola Iván, vi tu CV interactivo y me gustaría conocer a fondo uno de tus casos.",
  },
  {
    title: "Conversación",
    body: "Platicamos sobre un rol, proyecto o colaboración en tu organización.",
    message: "Hola Iván, vi tu CV interactivo y me gustaría platicar sobre un rol o proyecto.",
  },
];

export function Evidence() {
  const goTo = useGoToSection();

  return (
    <section className={styles.wrap}>
      <p className={styles.intro}>
        Todo es público: cada tarjeta abre el recurso real, no una captura.
      </p>

      {GROUPS.map((group, gi) => (
        <div key={group.label} className={styles.group}>
          <header className={styles.groupHead}>
            <h3 className={styles.groupLabel}>{group.label}</h3>
            <span className={styles.groupCount}>
              {String(group.items.length).padStart(2, "0")}
            </span>
          </header>
          <div
            className={`${styles.grid} ${
              group.layout === "feature"
                ? styles.gridFeature
                : group.layout === "four"
                  ? styles.gridFour
                  : group.layout === "list"
                    ? styles.gridList
                    : ""
            }`}
          >
            {group.items.map((item, i) => {
              const motionProps = {
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                transition: {
                  duration: 0.4,
                  delay: 0.05 * i + 0.08 * gi,
                  ease: [0.2, 0.8, 0.2, 1] as const,
                },
                whileHover: { y: -4 },
              };

              const content = (
                <>
                  <span className={styles.cardArrow} aria-hidden>
                    {item.internalTarget ? "→" : "↗"}
                  </span>
                  <span className={styles.cardKind}>{item.kind}</span>
                  <h4 className={styles.cardTitle}>{item.title}</h4>
                  <p className={styles.cardDesc}>{item.description}</p>
                  <span className={styles.cardHost}>{item.host}</span>
                </>
              );

              if (item.internalTarget) {
                return (
                  <motion.button
                    key={item.title}
                    type="button"
                    onClick={() => goTo(item.internalTarget!)}
                    className={`glass spotlight ${styles.card} ${styles.cardInternal}`}
                    onPointerMove={trackSpotlight}
                    {...motionProps}
                  >
                    {content}
                  </motion.button>
                );
              }

              return (
                <motion.a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`glass spotlight ${styles.card}`}
                  onPointerMove={trackSpotlight}
                  {...motionProps}
                >
                  {content}
                </motion.a>
              );
            })}
          </div>
        </div>
      ))}
      <div className={styles.group}>
        <header className={styles.groupHead}>
          <h3 className={styles.groupLabel}>¿Quieres verlo en acción?</h3>
        </header>
        <div className={styles.nextGrid}>
          {NEXT_STEPS.map((n, i) => (
            <a
              key={n.title}
              href={whatsappUrl(n.message)}
              target="_blank"
              rel="noopener noreferrer"
              className={`glass spotlight ${styles.next}`}
              onPointerMove={trackSpotlight}
            >
              <span className={`grad-text ${styles.nextNum}`}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.nextTitle}>{n.title}</span>
              <span className={styles.nextBody}>{n.body}</span>
              <span className={styles.nextCta}>
                <WhatsAppIcon size={14} /> Pídelo por WhatsApp
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
