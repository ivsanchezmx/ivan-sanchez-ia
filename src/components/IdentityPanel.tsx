import { motion } from "framer-motion";
import { SECTIONS, CV_PDF_URL, type SectionId } from "../sections";
import { WHATSAPP_URL, WhatsAppIcon } from "../lib/whatsapp";
import styles from "./IdentityPanel.module.css";

interface Props {
  active: SectionId;
  onSelect: (id: SectionId) => void;
}

const CONTACT = [
  { label: "celular", value: "+52 246 127 1067", href: "tel:+522461271067" },
  { label: "email", value: "ivsanchezmx@gmail.com", href: "mailto:ivsanchezmx@gmail.com" },
  { label: "linkedin", value: "/in/ivsanchezm", href: "https://linkedin.com/in/ivsanchezm", external: true },
];

export function IdentityPanel({ active, onSelect }: Props) {
  return (
    <aside className={styles.panel} aria-label="Identidad y navegación">
      <div className={styles.scroll}>
        <div className={styles.identity}>
          <div className={styles.photoWrap}>
            <span className={styles.photoRing} aria-hidden />
            <img
              src="/img/ivan.jpg"
              alt="Iván Sánchez Martínez"
              className={styles.photo}
              loading="eager"
            />
            <span className={styles.photoStatus} aria-hidden>
              <span className={styles.photoStatusDot} />
            </span>
          </div>
          <div className={styles.identityBody}>
            <h2 className={styles.name}>
              Iván Sánchez <em>Martínez</em>
            </h2>
            <p className={styles.role}>Consultor Senior en IA · Ingeniero en computación</p>
          </div>
        </div>

        <nav className={styles.nav} aria-label="Secciones">
          <div className={styles.navHead}>
            <span className="eyebrow-muted">Índice</span>
            <span className={styles.navHint}>
              <kbd className={styles.kbd}>←</kbd>
              <kbd className={styles.kbd}>→</kbd>
            </span>
          </div>
          <ul className={styles.navList}>
            {SECTIONS.map((s) => {
              const isActive = s.id === active;
              const isAssistant = s.id === "assistant";
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(s.id)}
                    className={`${styles.navItem} ${isActive ? styles.navItemActive : ""} ${
                      isAssistant ? styles.navItemAi : ""
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="active-pill"
                        className={styles.navItemPill}
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className={styles.navItemContent}>
                      <span className={styles.navNum}>{s.num}</span>
                      <span className={styles.navItemLabel}>{s.label}</span>
                      {isAssistant ? (
                        <span className={styles.navBadge}>live</span>
                      ) : (
                        <span className={styles.navItemArrow} aria-hidden>
                          →
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.contact}>
          <span className="eyebrow-muted">Contacto</span>
          {CONTACT.map((c) => (
            <a
              key={c.label}
              href={c.href}
              className={styles.contactRow}
              {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <span className={styles.contactLabel}>{c.label}</span>
              <span className={styles.contactValue}>{c.value}</span>
            </a>
          ))}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.waButton}
          >
            <WhatsAppIcon size={17} />
            <span>Escríbeme por WhatsApp</span>
          </a>
          <a href={CV_PDF_URL} download className={styles.cvButton}>
            <span>Descargar CV</span>
            <span className={styles.cvButtonArrow} aria-hidden>
              ↓
            </span>
          </a>
        </div>
      </div>
    </aside>
  );
}
