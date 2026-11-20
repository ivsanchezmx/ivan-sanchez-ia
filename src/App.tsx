import { useEffect, useRef, useState, type ComponentType } from "react";
import { motion } from "framer-motion";
import { Topbar } from "./components/Topbar";
import { IdentityPanel } from "./components/IdentityPanel";
import { AmbientOrb } from "./components/AmbientOrb";
import { Profile } from "./sections/Profile";
import { Projects } from "./sections/Projects";
import { Evidence } from "./sections/Evidence";
import { Approach } from "./sections/Approach";
import { Assistant } from "./sections/Assistant";
import { SECTIONS, type SectionId, type SectionMeta } from "./sections";
import { SectionNavContext } from "./lib/sectionNav";
import styles from "./App.module.css";

const SECTION_COMPONENTS: Record<SectionId, ComponentType> = {
  profile: Profile,
  projects: Projects,
  evidence: Evidence,
  approach: Approach,
  assistant: Assistant,
};

function SectionTitle({ meta }: { meta: SectionMeta }) {
  const { title, accent } = meta;
  if (!accent || !title.endsWith(accent)) return <>{title}</>;
  const head = title.slice(0, title.length - accent.length);
  return (
    <>
      {head}
      <em>{accent}</em>
    </>
  );
}

export default function App() {
  const [active, setActive] = useState<SectionId>("profile");
  const contentRef = useRef<HTMLElement | null>(null);

  // Navegación por teclado: ←/→ y números 1–N cambian de sección.
  // No captura teclas si el foco está en un input/textarea/contenteditable
  // (para no interrumpir cuando el usuario escribe en el chat).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t) {
        const tag = t.tagName?.toLowerCase();
        if (tag === "input" || tag === "textarea" || t.isContentEditable) {
          return;
        }
      }
      const idx = SECTIONS.findIndex((s) => s.id === active);
      if (e.key === "ArrowRight") {
        const next = SECTIONS[Math.min(idx + 1, SECTIONS.length - 1)];
        if (next) setActive(next.id);
      } else if (e.key === "ArrowLeft") {
        const prev = SECTIONS[Math.max(idx - 1, 0)];
        if (prev) setActive(prev.id);
      } else if (/^[1-9]$/.test(e.key)) {
        const target = SECTIONS[parseInt(e.key, 10) - 1];
        if (target) setActive(target.id);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  // Al cambiar de sección, regresa el scroll arriba (panel en desktop, ventana en mobile).
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "auto" });
    if (window.matchMedia("(max-width: 900px)").matches) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [active]);

  const ActiveSection = SECTION_COMPONENTS[active];
  const meta = SECTIONS.find((s) => s.id === active)!;
  const idx = SECTIONS.findIndex((s) => s.id === active);
  const progress = ((idx + 1) / SECTIONS.length) * 100;

  return (
    <SectionNavContext.Provider value={setActive}>
      <div className={styles.app}>
        <AmbientOrb />
        <Topbar onAsk={() => setActive("assistant")} onHome={() => setActive("profile")} />
        <div className={styles.shell}>
          <IdentityPanel active={active} onSelect={setActive} />
          <main className={styles.content} ref={contentRef} id="content">
            <div className={styles.progress} aria-hidden>
              <motion.span
                className={styles.progressBar}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 24 }}
              />
            </div>
            <div className={styles.inner}>
              <motion.header
                key={`head-${active}`}
                className={styles.contentHead}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className={styles.contentMeta}>
                  <span className={styles.contentNum}>{meta.num}</span>
                  <span className={styles.contentRule} aria-hidden />
                  <span className={styles.contentTotal}>
                    {String(idx + 1).padStart(2, "0")} / {String(SECTIONS.length).padStart(2, "0")}
                  </span>
                </div>
                <h1 className={`display-title ${styles.contentTitle}`}>
                  <SectionTitle meta={meta} />
                </h1>
                <p className={styles.contentSubtitle}>{meta.subtitle}</p>
              </motion.header>
              <div key={active} className={styles.contentBody}>
                <ActiveSection />
              </div>
              <footer className={`${styles.contentFoot} no-print`} aria-label="Navegación entre secciones">
                <NavPager active={active} onSelect={setActive} />
              </footer>
            </div>
          </main>
        </div>
      </div>
    </SectionNavContext.Provider>
  );
}

function NavPager({
  active,
  onSelect,
}: {
  active: SectionId;
  onSelect: (id: SectionId) => void;
}) {
  const idx = SECTIONS.findIndex((s) => s.id === active);
  const prev = SECTIONS[idx - 1];
  const next = SECTIONS[idx + 1];
  return (
    <div className={styles.pager}>
      <button
        type="button"
        className={styles.pagerBtn}
        onClick={() => prev && onSelect(prev.id)}
        disabled={!prev}
        aria-label={prev ? `Anterior: ${prev.label}` : "Sin sección anterior"}
      >
        <span className={styles.pagerArrow} aria-hidden>←</span>
        <span className={styles.pagerMeta}>
          <span className="eyebrow-muted">{prev ? `${prev.num} · anterior` : "inicio"}</span>
          <span className={styles.pagerLabel}>{prev ? prev.label : "—"}</span>
        </span>
      </button>
      <button
        type="button"
        className={`${styles.pagerBtn} ${styles.pagerBtnRight}`}
        onClick={() => next && onSelect(next.id)}
        disabled={!next}
        aria-label={next ? `Siguiente: ${next.label}` : "Sin sección siguiente"}
      >
        <span className={styles.pagerMeta}>
          <span className="eyebrow-muted">{next ? `${next.num} · siguiente` : "fin"}</span>
          <span className={styles.pagerLabel}>{next ? next.label : "—"}</span>
        </span>
        <span className={styles.pagerArrow} aria-hidden>→</span>
      </button>
    </div>
  );
}
