/**
 * POST /api/chat — proxy del asistente hacia la API de Claude.
 *
 * La key (ANTHROPIC_API_KEY) vive solo aquí, en el servidor. El navegador
 * manda el historial de la conversación y recibe texto en streaming.
 * El system prompt se arma en el servidor para que el endpoint no sirva
 * como proxy genérico de Claude.
 *
 * En producción corre como Vercel Function en runtime Node.js (el SDK importa
 * @opentelemetry/api, que el runtime Edge no admite). Se exporta `POST` con
 * firma web (Request → Response): en Node, un `export default` recibiría
 * (req, res) al estilo antiguo. En local, el plugin de vite.config.ts monta
 * este mismo handler en el dev server.
 *
 * Los imports relativos llevan extensión .js porque package.json es
 * "type": "module" y Vercel transpila cada archivo sin empaquetar.
 */

import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "../src/lib/context.js";

// Haiku 5.5: Q&A acotado a un documento ⇒ mejor costo-beneficio (~$0.001 por pregunta).
const DEFAULT_MODEL = "claude-haiku-5-5";

// Modelos que aceptan el respaldo server-side ante rechazos de seguridad.
// Haiku no lo soporta: enviarlo provocaría un error 400.
const SUPPORTS_FALLBACKS = /^claude-(opus-5|sonnet-5-5|fable-5)/;
const MAX_TURNS = 24;
const MAX_CHARS_PER_TURN = 2000;

interface IncomingTurn {
  role: "user" | "assistant";
  text: string;
}

function json(status: number, body: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

/** Valida forma, tamaño y alternancia del historial que manda el navegador. */
function parseHistory(raw: unknown): Anthropic.Beta.BetaMessageParam[] | null {
  if (!raw || typeof raw !== "object") return null;
  const history = (raw as { history?: unknown }).history;
  if (!Array.isArray(history) || history.length === 0) return null;
  if (history.length > MAX_TURNS) return null;

  const messages: Anthropic.Beta.BetaMessageParam[] = [];
  for (let i = 0; i < history.length; i++) {
    const t = history[i] as Partial<IncomingTurn>;
    const expected = i % 2 === 0 ? "user" : "assistant";
    if (t?.role !== expected || typeof t.text !== "string") return null;
    const text = t.text.trim();
    if (!text || text.length > MAX_CHARS_PER_TURN * (expected === "user" ? 1 : 4)) {
      return null;
    }
    messages.push({ role: expected, content: text });
  }
  // El último turno siempre es la pregunta del visitante.
  if (messages[messages.length - 1].role !== "user") return null;
  return messages;
}

/** Bloquea llamadas desde otros sitios (protección ligera contra abuso). */
function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true; // curl / mismo origen sin cabecera
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

export async function POST(request: Request): Promise<Response> {
  if (!isSameOrigin(request)) {
    return json(403, { error: "forbidden" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey || apiKey === "pega-tu-key-aqui") {
    return json(503, { error: "missing_key" });
  }

  let messages: Anthropic.Beta.BetaMessageParam[] | null = null;
  try {
    messages = parseHistory(await request.json());
  } catch {
    messages = null;
  }
  if (!messages) {
    return json(400, { error: "bad_request" });
  }

  const client = new Anthropic({ apiKey, maxRetries: 1 });
  const model = process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_MODEL;

  const stream = client.beta.messages.stream(
    {
      model,
      max_tokens: 2048,
      // Respuestas de chat cortas: effort bajo = más rápido y barato.
      output_config: { effort: "low" },
      // En Opus/Sonnet: si un clasificador de seguridad rechaza la petición,
      // la API la reintenta en otro modelo dentro de la misma llamada.
      ...(SUPPORTS_FALLBACKS.test(model)
        ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const }
        : {}),
      // El prompt (CV + LinkedIn + copy del sitio) es grande y estable:
      // se cachea para abaratar las preguntas siguientes.
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages,
    },
    { signal: request.signal }
  );

  // Esperamos el primer evento para poder responder con un status HTTP
  // correcto si la API falla antes de empezar a generar.
  const iterator = stream[Symbol.asyncIterator]();
  let first: IteratorResult<Anthropic.Beta.BetaRawMessageStreamEvent>;
  try {
    first = await iterator.next();
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return json(429, { error: "rate_limited" });
    }
    if (err instanceof Anthropic.AuthenticationError) {
      return json(502, { error: "bad_key" });
    }
    if (err instanceof Anthropic.APIError) {
      return json(502, { error: "upstream_error" });
    }
    return json(500, { error: "internal_error" });
  }

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      let wroteText = false;
      const emit = (event: Anthropic.Beta.BetaRawMessageStreamEvent) => {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          wroteText = true;
          controller.enqueue(encoder.encode(event.delta.text));
        }
      };
      try {
        if (!first.done) emit(first.value);
        while (true) {
          const next = await iterator.next();
          if (next.done) break;
          emit(next.value);
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal" && !wroteText) {
          controller.enqueue(
            encoder.encode(
              "No puedo responder eso. Para cualquier duda, escríbele a Iván: ivsanchezmx@gmail.com."
            )
          );
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
