/**
 * Mirror en texto del contenido del sitio (§01–§04 + contacto).
 *
 * Se concatena al contexto del asistente junto con DOCS_CONTEXT.
 * Cuando se modifique el copy de una sección, actualizar aquí.
 * Todo debe coincidir con el CV 2026 (public/docs/Ivan_Sanchez_CV_2026.pdf).
 */

export const SITE_CONTEXT: string = `
# §01 · PERFIL

Titular: IA que se adopta, se mide y escala. Adopción de IA: de la experimentación a agentes en operación.

Presentación (en primera persona, escrita por Iván):
Convierto tecnología en decisiones de negocio: pruebo en pequeño, mido y escalo solo lo que funciona.
Soy Iván Sánchez Martínez, ingeniero en computación con más de 8 años de experiencia. En FUNDES, con Google.org, lidero el desarrollo de cuatro Estándares de Competencia en IA para MiPyMEs, de los primeros del país. En Innogyzer diseño y construyo agentes de IA para servicios financieros y automotriz: asistentes de análisis, bases de conocimiento y agentes de voz.

Cifras destacadas:
- 150+ experimentos al año coordinados en Grupo Rotoplas.
- ~75% de éxito en hipótesis de negocio evaluadas.
- $20M+ MXN en inversiones optimizadas o evitadas (resultado del equipo).
- 2,000+ personas formadas: 1,500 en innovación y 500 en IA.

EXPERIENCIA:
- Feb 2026 – hoy · Consultor Senior en IA · FUNDES (proyecto con Google.org). Lidera el desarrollo de cuatro Estándares de Competencia en IA para MiPyMEs ante CONOCER (mapas funcionales, criterios de desempeño, reactivos y guías de evaluación). Coordina la gestión del programa nacional Mi CompañIA; codiseñó contenido formativo e imparte webinars para MiPyMEs y técnicos.
- Ene 2025 – hoy · Consultor en IA · Innogyzer. Diseña y construye agentes de IA (RAG, voz) y arquitecturas multiagente para servicios financieros y automotriz. Diseña e imparte programas de IA para equipos directivos con casos y datos de su sector.
- May 2022 – Nov 2024 · Gerente de Experimentación e Innovación · Grupo Rotoplas (LATAM). El equipo coordinó 150+ experimentos al año, con ~75% de éxito en hipótesis evaluadas, y contribuyó a optimizar o evitar inversiones por más de $20 millones de pesos; Iván presentó recomendaciones a la alta dirección.
- Abr 2021 – Abr 2022 · Coordinador de Procesos y Metodologías de Innovación · Grupo Rotoplas. Diseñó el macroproceso corporativo de innovación; +20 puntos de satisfacción (NSS) de clientes internos y 1,500+ colaboradores formados.
- Sep 2019 – Abr 2021 · Analista de Innovación · Grupo Rotoplas. Hojas de ruta tecnológicas, vigilancia tecnológica y análisis estratégicos para la alta dirección.

FORMACIÓN:
- Doctorado en Alta Dirección · Universidad del Valle de Puebla · 2023 – en curso.
- Máster en Nuevas Tecnologías en Informática · Universidad de Murcia, España · 2018 – 2019 · beca Fundación Carolina.
- Maestría en Economía, Gestión y Políticas de Innovación · UAM Xochimilco · 2016 – 2018 · beca CONACYT · mención honorífica.
- Ingeniería en Computación · Universidad Autónoma de Tlaxcala · mención honorífica.

DOCENCIA Y MENTORÍA:
- Mentor · ITAM · Programa de Inteligencia Artificial Aplicada a los Negocios · 2026 – hoy.
- Docente · UPAEP · Emprendimiento e innovación · 2025 – 2026.
- Capacitación en IA generativa: 500+ personas en OpenAI, Claude, Gemini y Microsoft.

ESPECIALIDAD: adopción de IA, agentes y RAG, agentes de voz, experimentación y pilotos, portafolio de innovación, gobernanza de procesos, formación de equipos, gestión de proyectos, estándares de competencia, KPIs para dirección.

STACK: Claude, ChatGPT, Gemini, Copilot Studio, Microsoft Azure AI, Retell AI, Supabase / pgvector, Vercel, Make, n8n, LangChain.

IDIOMAS: español nativo; inglés intermedio (B1).

DISPONIBILIDAD: disponible para reubicación en México y para viajar.


# §02 · PROYECTOS CON RESULTADOS (los clientes van sin nombre por confidencialidad)

1. AFORE · Servicios financieros — Asistente de análisis de NPS que procesa la voz del cliente y genera hallazgos para el área de servicio. Estado: en operación mensual.
2. AFORE · Servicio y RH — Base de conocimiento RAG con los procedimientos de servicio para apoyar a asesores, y diseño de una arquitectura de dos agentes sobre Gemini + Supabase. Prueba de concepto de un agente de beneficios para RH en Microsoft Copilot Studio. Estado: base construida · PoC de RH.
3. Marca automotriz · Ventas — Agente de voz (Retell AI) que califica prospectos y agenda pruebas de manejo, integrado con calendario y SMS. Estado: agente construido · piloto propuesto.
4. Industria y grupos empresariales · Formación directiva — Programas multisesión de IA aplicada (Claude, Excel con IA) con casos y datos de su sector; herramienta de análisis de rutas de distribución con diagnóstico ejecutivo. Estado: entregados a equipos directivos.
5. Programa nacional · MiPyMEs · Marketing — Biblioteca de cinco asistentes de IA para que una MiPyME cree estrategia, textos, imágenes y video de marketing. Estado: desarrollada.
6. Productos de IA · Innogyzer — The Leap (orquestación de flujos con agentes), Ask Sherlock (usuarios sintéticos para investigación de mercado; Iván es cofundador) y avatares conversacionales. Estado: MVP · demos en vivo.
7. FUNDES · Google.org · Estándar nacional — Desarrollo de los EC ante CONOCER (EC1830, EC1835, EC1836, EC1848): mapas funcionales, criterios de desempeño e instrumentos de evaluación. Estado: publicados en el DOF el 28 de octubre de 2026.


# §03 · EVIDENCIA EN VIVO (URLs públicas)

Todo es público y se puede abrir al momento.

Asistente IA de este perfil: §05 de este mismo sitio (chat con Claude y avatar en video).

Estándares de Competencia en IA publicados en el Diario Oficial de la Federación (28 de octubre de 2026, Acuerdo SE/III-26/10,S del Comité Técnico del CONOCER, SIDOF 5802372: https://sidof.segob.gob.mx/notas/5802372). Proyecto Mi CompañIA de FUNDES México con Google.org:
- EC1830 · Estándar A · Adopción de soluciones de inteligencia artificial en los procesos de la MiPyME — https://www.conocer.gob.mx/contenido/publicaciones_dof/2026/tercera_so/EC1830.pdf
- EC1835 · Estándar B · Creación de soluciones comerciales con IA — https://www.conocer.gob.mx/contenido/publicaciones_dof/2026/tercera_so/EC1835.pdf
- EC1848 · Estándar C · Prestación de servicios de consultoría en mercadotecnia digital con IA — https://www.conocer.gob.mx/contenido/publicaciones_dof/2026/tercera_so/EC1848.pdf
- EC1836 · Estándar D · Creación de soluciones tecnológicas de modernización digital con IA — https://www.conocer.gob.mx/contenido/publicaciones_dof/2026/tercera_so/EC1836.pdf

Plataformas propias (2):
1. The Leap — https://theleap.innogyzer.com — Orquestación de flujos con agentes para procesos de innovación. Producto de Innogyzer con video demo en sitio.
2. Ask Sherlock — https://www.ask-sherlock.app — Usuarios sintéticos para investigación de mercado preliminar. Iván es cofundador.

Custom GPTs públicos (5) — todos en chatgpt.com/g/:
1. Experto en JTBD — https://chatgpt.com/g/g-67a114fbd6cc8191b3414808b6b71bbb-experto-en-jtbd — Marco Jobs to Be Done para entrevistas, síntesis y oportunidades de innovación.
2. Xperimenta by Innogyzer — https://chatgpt.com/g/g-0v021tXCJ-xperimenta-by-innogyzer — Diseño y planificación de experimentos para validar hipótesis de producto y modelo de negocio.
3. Yprototiper by Innogyzer — https://chatgpt.com/g/g-6799b2dba3048191bd7a4318a64de702-yprototiper-by-innogyzer — Generación rápida de prototipos conceptuales.
4. Canvas Maestro — https://chatgpt.com/g/g-wGAIdb1yZ-canvas-maestro-modelos-de-negocio — Business Model Canvas y propuestas de valor.
5. Arquetipos UX — https://chatgpt.com/g/g-67c0aa7f498c819183294fc62937ae41-arquetipos-ux — Arquetipos y personas con base en investigación cualitativa.

Siguientes pasos que ofrece (al final de §03; cada uno abre WhatsApp): demo en vivo, caso a fondo, o conversación sobre un rol, proyecto o colaboración.


# §04 · CÓMO TRABAJA (siete pasos; el sitio manda sobre el CV, que lista seis)

1. Entender la empresa — contexto, cultura y madurez digital antes de hablar de herramientas.
2. Entender el problema — levantamiento de información con las áreas involucradas.
3. Plantear hipótesis — qué se espera mejorar y cómo se va a medir.
4. Priorizar y armar el portafolio — definir qué va primero según impacto y esfuerzo, y ordenar las iniciativas en un portafolio que la dirección pueda gestionar.
5. Probar en pequeño — prueba de concepto o MVP antes de invertir.
6. Acompañar el cambio — formación práctica y gestión del cambio para que la gente adopte la herramienta.
7. Escalar lo que funciona — con indicadores claros.

Su regla: la IA apoya, no sustituye; la decisión final siempre la toma una persona. Su método viene de la experimentación corporativa: validar rápido con datos y escalar solo lo que funciona.


# CONTACTO (panel fijo de la barra lateral; en celular, arriba)

- WhatsApp y teléfono: +52 246 127 1067 (botón "Escríbeme por WhatsApp" en el panel de contacto)
- Correo: ivsanchezmx@gmail.com
- LinkedIn: linkedin.com/in/ivsanchezm
- Base: Tlaxcala, México
- CV en PDF: botón "Descargar CV" (barra superior y panel de contacto).
- Este sitio: ivsanchezmcv.vercel.app
`.trim();
