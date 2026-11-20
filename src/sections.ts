export type SectionId = "profile" | "projects" | "evidence" | "approach" | "assistant";

export interface SectionMeta {
  id: SectionId;
  num: string;
  label: string;
  title: string;
  subtitle: string;
  /** Palabras finales del título que se muestran en serif itálica con degradado. */
  accent?: string;
}

/** CV descargable (vive en public/docs/; también es fuente del asistente). */
export const CV_PDF_URL = "/docs/Ivan_Sanchez_CV_2026.pdf";

export const SECTIONS: SectionMeta[] = [
  {
    id: "profile",
    num: "01",
    label: "Perfil",
    title: "IA que se adopta, se mide y escala",
    accent: "se mide y escala",
    subtitle: "Adopción de IA: de la experimentación a agentes en operación",
  },
  {
    id: "projects",
    num: "02",
    label: "Proyectos",
    title: "Proyectos con resultados",
    accent: "con resultados",
    subtitle: "Qué construí, para quién y en qué estado está hoy",
  },
  {
    id: "evidence",
    num: "03",
    label: "Evidencia",
    title: "Evidencia en vivo",
    accent: "en vivo",
    subtitle: "Estándares oficiales, plataformas y asistentes que puedes abrir hoy",
  },
  {
    id: "approach",
    num: "04",
    label: "Cómo trabajo",
    title: "Validar rápido, escalar lo que funciona",
    accent: "escalar lo que funciona",
    subtitle: "Siete pasos, de entender la empresa a escalar con indicadores",
  },
  {
    id: "assistant",
    num: "05",
    label: "Asistente IA",
    title: "Pregúntale a mi asistente",
    accent: "mi asistente",
    subtitle: "Chat con Claude o conversación en video con mi avatar",
  },
];
