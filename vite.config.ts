import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { Readable } from "node:stream";
import type { IncomingMessage } from "node:http";

/**
 * Monta api/chat.ts (la función de Vercel) dentro del dev server, para
 * probar el asistente en local sin `vercel dev`. Las variables sin prefijo
 * VITE_ (ANTHROPIC_API_KEY) se cargan solo en el proceso de Node: nunca
 * llegan al bundle del navegador.
 */
function localApi(): Plugin {
  return {
    name: "local-api-chat",
    apply: "serve",
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), "");
      for (const key of ["ANTHROPIC_API_KEY", "ANTHROPIC_MODEL"]) {
        if (env[key] && !process.env[key]) process.env[key] = env[key];
      }

      server.middlewares.use("/api/chat", async (req, res) => {
        try {
          const mod = await server.ssrLoadModule("/api/chat.ts");
          const request = await toWebRequest(req);
          if (req.method !== "POST" || typeof mod.POST !== "function") {
            res.statusCode = 405;
            res.setHeader("Allow", "POST");
            res.end(JSON.stringify({ error: "method_not_allowed" }));
            return;
          }
          const response: Response = await mod.POST(request);
          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          if (response.body) {
            Readable.fromWeb(response.body as never).pipe(res);
          } else {
            res.end();
          }
        } catch (err) {
          server.config.logger.error(`[api/chat] ${(err as Error).message}`);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "internal_error" }));
        }
      });
    },
  };
}

async function toWebRequest(req: IncomingMessage): Promise<Request> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  const url = `http://${req.headers.host}${(req as { originalUrl?: string }).originalUrl ?? req.url}`;
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (typeof v === "string") headers.set(k, v);
  }
  const controller = new AbortController();
  req.on("close", () => controller.abort());
  return new Request(url, {
    method: req.method,
    headers,
    body: req.method === "GET" || req.method === "HEAD" ? undefined : Buffer.concat(chunks),
    signal: controller.signal,
  });
}

export default defineConfig({
  plugins: [react(), localApi()],
  build: {
    outDir: "dist",
    assetsInlineLimit: 4096,
  },
});
