import { useState } from "react";
import { motion } from "framer-motion";
import { Chat } from "../components/Chat";
import { Avatar } from "../components/Avatar";
import { MODEL_LABEL } from "../lib/claude";
import styles from "./Assistant.module.css";

type Mode = "chat" | "avatar";

const MODES: { id: Mode; label: string; hint: string }[] = [
  { id: "chat", label: "Chat de texto", hint: MODEL_LABEL },
  { id: "avatar", label: "Avatar en video", hint: "voz en tiempo real" },
];

export function Assistant() {
  const [mode, setMode] = useState<Mode>("chat");

  return (
    <section className={styles.wrap}>
      <div className={styles.top}>
        <p className={styles.lede}>
          Pregúntale sobre mi experiencia, proyectos, evidencia o cómo podría aportar a tu equipo. Responde
          solo con base en mi CV, mi LinkedIn y este sitio.
        </p>
        <div className={styles.switch} role="tablist" aria-label="Modo del asistente">
          {MODES.map((m) => {
            const isActive = m.id === mode;
            return (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`${styles.switchBtn} ${isActive ? styles.switchBtnActive : ""}`}
                onClick={() => setMode(m.id)}
              >
                {isActive && (
                  <motion.span
                    layoutId="assistant-mode"
                    className={styles.switchBg}
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <span className={styles.switchLabel}>{m.label}</span>
                <span className={styles.switchHint}>{m.hint}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* El chat queda montado para no perder la conversación al alternar;
          el avatar se desmonta al salir para cortar la videollamada. */}
      <div hidden={mode !== "chat"}>
        <Chat />
      </div>
      {mode === "avatar" && <Avatar />}
    </section>
  );
}
