import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { streamAssistant, MODEL_LABEL, type ChatTurn } from "../lib/claude";
import { SUGGESTED_QUESTIONS } from "../lib/suggestions";
import styles from "./Chat.module.css";

function formatTime(d: Date): string {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

interface RenderedTurn extends ChatTurn {
  time: string;
}

/* ── Mini-renderer de markdown inline ───────────────────────
   Soporta **bold**, *italic* y `code`. Ignora HTML por seguridad.
   Bloques: párrafos separados por \n\n; listas con líneas que
   inicien con "- " o "* ".                                     */

function renderInline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const pattern = /(\*\*([^*\n]+?)\*\*|\*([^*\n]+?)\*|`([^`\n]+?)`)/g;
  let lastIdx = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > lastIdx) out.push(text.slice(lastIdx, m.index));
    if (m[2] !== undefined) {
      out.push(<strong key={`${keyBase}-b-${i++}`}>{m[2]}</strong>);
    } else if (m[3] !== undefined) {
      out.push(<em key={`${keyBase}-i-${i++}`}>{m[3]}</em>);
    } else if (m[4] !== undefined) {
      out.push(<code key={`${keyBase}-c-${i++}`}>{m[4]}</code>);
    }
    lastIdx = m.index + m[0].length;
  }
  if (lastIdx < text.length) out.push(text.slice(lastIdx));
  return out;
}

function renderMessageBody(text: string): ReactNode[] {
  const elements: ReactNode[] = [];
  const paragraphs = text.split(/\n\n+/);
  let keyN = 0;

  paragraphs.forEach((para, pi) => {
    const lines = para.split("\n").filter((l) => l.trim().length > 0);
    let i = 0;
    while (i < lines.length) {
      const isList = /^\s*[-*]\s+/.test(lines[i]);
      if (isList) {
        const items: string[] = [];
        while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
          items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
          i++;
        }
        elements.push(
          <ul key={`p${pi}-l${keyN++}`} className={styles.list}>
            {items.map((it, k) => (
              <li key={k}>{renderInline(it, `p${pi}-li${k}`)}</li>
            ))}
          </ul>
        );
      } else {
        const textLines: string[] = [];
        while (i < lines.length && !/^\s*[-*]\s+/.test(lines[i])) {
          textLines.push(lines[i]);
          i++;
        }
        if (textLines.length > 0) {
          elements.push(
            <p key={`p${pi}-t${keyN++}`} className={styles.turnPara}>
              {textLines.map((tl, ti) => (
                <span key={ti}>
                  {renderInline(tl, `p${pi}-t${ti}`)}
                  {ti < textLines.length - 1 && " "}
                </span>
              ))}
            </p>
          );
        }
      }
    }
  });

  return elements;
}

export function Chat() {
  const [messages, setMessages] = useState<RenderedTurn[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  // Auto-alto del textarea
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [input]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;
    setError(null);

    const userTurn: RenderedTurn = { role: "user", text: trimmed, time: formatTime(new Date()) };
    const placeholderTurn: RenderedTurn = { role: "assistant", text: "", time: formatTime(new Date()) };

    const historyForApi: ChatTurn[] = [...messages, userTurn].map(({ role, text }) => ({ role, text }));

    setMessages((prev) => [...prev, userTurn, placeholderTurn]);
    setInput("");
    setStreaming(true);

    const abort = new AbortController();
    abortRef.current?.abort();
    abortRef.current = abort;

    try {
      await streamAssistant({
        history: historyForApi,
        signal: abort.signal,
        onChunk: (chunk) => {
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last?.role === "assistant") {
              next[next.length - 1] = { ...last, text: last.text + chunk };
            }
            return next;
          });
        },
      });
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setError(e instanceof Error ? e.message : "Algo salió mal. Intenta de nuevo.");
      // Quita el par pregunta/respuesta fallido para que el historial siga alternando.
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last?.role === "assistant" && !last.text) {
          next.pop();
          if (next[next.length - 1]?.role === "user") next.pop();
        }
        return next;
      });
      setInput(trimmed);
    } finally {
      setStreaming(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  function clearAll() {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    setInput("");
    inputRef.current?.focus();
  }

  return (
    <div className={`glass ${styles.chat}`}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.avatar} aria-hidden>
            iS
            <span className={styles.statusDot} />
          </span>
          <span className={styles.headerText}>
            <span className={styles.headerLabel}>Asistente de Iván</span>
            <span className={styles.headerMeta}>{MODEL_LABEL} · responde en segundos</span>
          </span>
        </div>
        <button
          type="button"
          onClick={clearAll}
          className={styles.clearBtn}
          disabled={messages.length === 0 && !streaming}
          aria-label="Limpiar conversación"
        >
          Limpiar
        </button>
      </div>

      <div className={styles.scroll} ref={scrollRef} aria-live="polite">
        {messages.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyOrb} aria-hidden>
              ✦
            </div>
            <p className={styles.emptyTitle}>¿Qué quieres saber de Iván?</p>
            <div className={styles.suggestions}>
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <motion.button
                  key={q}
                  type="button"
                  className={styles.suggestion}
                  onClick={() => send(q)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
                >
                  {q}
                  <span className={styles.suggestionArrow} aria-hidden>
                    ↗
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <ul className={styles.messages}>
            {messages.map((m, i) => {
              const isUser = m.role === "user";
              const isLast = i === messages.length - 1;
              const isStreamingThis = !isUser && isLast && streaming;
              const body = m.text;
              const isPendingFirstChunk = isStreamingThis && !body;
              return (
                <motion.li
                  key={i}
                  className={`${styles.turn} ${isUser ? styles.turnUser : styles.turnAssistant}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className={styles.bubble}>
                    {isPendingFirstChunk ? (
                      <span className={styles.thinking} aria-label="Pensando">
                        <span className={styles.thinkingDot} />
                        <span className={styles.thinkingDot} />
                        <span className={styles.thinkingDot} />
                      </span>
                    ) : isUser ? (
                      <p className={styles.turnPara}>{m.text}</p>
                    ) : (
                      <>
                        {renderMessageBody(body)}
                        {isStreamingThis && <span className={styles.cursor} aria-hidden />}
                      </>
                    )}
                  </div>
                  <span className={styles.turnTime}>
                    {isUser ? "Tú" : "Asistente"} · {m.time}
                  </span>
                </motion.li>
              );
            })}
          </ul>
        )}

        <AnimatePresence>
          {error && (
            <motion.div
              className={styles.error}
              role="alert"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder="Pregunta lo que quieras sobre Iván…"
          rows={1}
          maxLength={2000}
          className={styles.input}
          disabled={streaming}
          aria-label="Pregunta para el asistente"
        />
        <button
          type="submit"
          className={styles.send}
          disabled={!input.trim() || streaming}
          aria-label="Enviar pregunta"
        >
          ↑
        </button>
      </form>

      <p className={styles.disclaimer}>
        Responde solo con base en el CV, LinkedIn y este sitio. Puede equivocarse: para datos críticos,
        confirma con Iván.
      </p>
    </div>
  );
}
