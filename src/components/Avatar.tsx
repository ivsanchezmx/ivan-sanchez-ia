import { useEffect, useState } from "react";
import styles from "./Avatar.module.css";

/**
 * Avatar conversacional en video (Tavus). Su conocimiento se configura en
 * el panel de Tavus, no en context.ts.
 *
 * El script del widget se carga solo cuando el visitante decide iniciar la
 * conversación: así nadie recibe una solicitud de cámara/micrófono al
 * abrir la página, y el sitio no paga el peso del script si no se usa.
 */

const TAVUS_SCRIPT = "https://unpkg.com/@tavus/embed@0.26.1";
const DEPLOYMENT_ID = "b49ea332-8c58-4f9e-b31e-8b78b816e169";

let scriptPromise: Promise<void> | null = null;

function loadTavus(): Promise<void> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = TAVUS_SCRIPT;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error("No se pudo cargar el avatar."));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

type State = "idle" | "loading" | "ready" | "error";

export function Avatar() {
  const [state, setState] = useState<State>("idle");

  useEffect(() => {
    // Si el script ya estaba cargado (el visitante volvió a la sección), monta directo.
    if (scriptPromise && state === "idle") {
      scriptPromise.then(() => setState("ready")).catch(() => {});
    }
  }, [state]);

  async function start() {
    setState("loading");
    try {
      await loadTavus();
      setState("ready");
    } catch {
      setState("error");
    }
  }

  return (
    <div className={styles.stage}>
      {state === "ready" ? (
        <div className={styles.embed}>
          <tavus-embed deployment-id={DEPLOYMENT_ID}></tavus-embed>
        </div>
      ) : (
        <div className={styles.poster}>
          <div className={styles.portrait}>
            <span className={styles.wave} aria-hidden />
            <span className={`${styles.wave} ${styles.wave2}`} aria-hidden />
            <img src="/img/ivan.jpg" alt="" className={styles.portraitImg} />
          </div>
          <div className={styles.posterText}>
            <span className="eyebrow">Avatar en video · voz en tiempo real</span>
            <h3 className={styles.posterTitle}>
              Habla con mi avatar y pregúntale <em>lo que quieras</em>.
            </h3>
            <p className={styles.posterBody}>
              Conversación por voz, como una videollamada. Al iniciar, tu navegador te pedirá permiso de
              micrófono (y cámara si lo deseas).
            </p>
            <button
              type="button"
              className={styles.startBtn}
              onClick={start}
              disabled={state === "loading"}
            >
              <span className={styles.startDot} aria-hidden />
              {state === "loading" ? "Conectando…" : "Iniciar conversación"}
            </button>
            {state === "error" && (
              <p className={styles.error} role="alert">
                No se pudo cargar el avatar. Revisa tu conexión o usa el chat de texto.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
