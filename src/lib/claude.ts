/**
 * Cliente del asistente en el navegador. Habla con /api/chat (función de
 * Vercel), que es quien guarda la key de Claude. Aquí no hay secretos.
 */

export interface ChatTurn {
  role: "user" | "assistant";
  text: string;
}

interface StreamOptions {
  history: ChatTurn[];
  signal?: AbortSignal;
  onChunk: (text: string) => void;
}

/** Nombre visible del modelo en la UI. */
export const MODEL_LABEL = "Claude Haiku 5.5";

export class AssistantError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = "AssistantError";
    this.code = code;
  }
}

const MESSAGES: Record<string, string> = {
  missing_key:
    "El asistente aún no tiene configurada su key de Claude (ANTHROPIC_API_KEY).",
  bad_key: "La key de Claude configurada no es válida.",
  rate_limited: "Demasiadas preguntas seguidas. Espera unos segundos e intenta de nuevo.",
  bad_request: "La conversación es demasiado larga. Usa «limpiar» y vuelve a preguntar.",
  forbidden: "Petición bloqueada.",
};

/**
 * Envía el historial y va entregando el texto conforme llega.
 * Lanza AssistantError si el servidor responde con error.
 */
export async function streamAssistant({
  history,
  signal,
  onChunk,
}: StreamOptions): Promise<void> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ history }),
    signal,
  });

  if (!res.ok) {
    let code = "upstream_error";
    try {
      code = (await res.json())?.error || code;
    } catch {
      /* respuesta sin JSON */
    }
    throw new AssistantError(
      code,
      MESSAGES[code] || "Algo salió mal al consultar al asistente. Intenta de nuevo."
    );
  }
  if (!res.body) throw new AssistantError("empty", "Respuesta vacía del asistente.");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const text = decoder.decode(value, { stream: true });
    if (text) onChunk(text);
  }
}
