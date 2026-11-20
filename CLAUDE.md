# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Single-page React + Vite + TypeScript **interactive CV** of Iván Sánchez Martínez (AI strategy & innovation consultant). It is generic — meant to be linked from his CV and seen by any company — so never add company-specific content or consulting client names (the CV says "una AFORE", "marca automotriz") (an earlier version was a response to one employer; that copy was removed on purpose). Structured as a 5-tab app (Perfil · Proyectos · Evidencia · Cómo trabajo · Asistente IA) with persistent sidebar, not as scroll. Deployed on Vercel (static `dist/` + the `api/` function). `robots: noindex,nofollow` is still set in `index.html`.

## Commands

```bash
npm run dev        # vite dev (port 5173) — predev re-extracts docs
npm run build      # tsc -b && vite build — prebuild re-extracts docs
npm run preview    # serve dist locally
npm run extract-docs  # re-run PDF/MD extraction manually
```

There is no test runner, linter, or formatter configured. Type-checking happens via `tsc -b` inside `npm run build`.

## Architecture

### Tab-based navigation, not scroll

[src/App.tsx](src/App.tsx) renders a fixed shell (`AmbientOrb` + `Topbar` + sidebar `IdentityPanel` + content `<main>`). Only one section is mounted at a time, switched by an `active: SectionId` state. The 5 sections are declared in [src/sections.ts](src/sections.ts) (`SECTIONS` array — order matters, it drives both the sidebar and the prev/next pager).

Three nav surfaces all call `setActive`:
- Sidebar buttons in [src/components/IdentityPanel.tsx](src/components/IdentityPanel.tsx)
- Prev/next pager at the bottom of `<main>` in `App.tsx`
- Keyboard: `←` / `→` step, number keys jump (handler in [App.tsx](src/App.tsx) — skips when focus is in an input/textarea/contenteditable so the chat in §05 keeps working)

Contact info lives only in the sidebar `IdentityPanel` (WhatsApp, email, LinkedIn, CV) — there is no Contact section on purpose; on mobile that panel stays visible as two buttons. WhatsApp links come from [src/lib/whatsapp.tsx](src/lib/whatsapp.tsx).

Cross-section jumps (e.g. an Evidence card opening the Assistant) go through `SectionNavContext` — see [src/lib/sectionNav.ts](src/lib/sectionNav.ts). Sections call `useGoToSection()`.

The content body is wrapped in `<div key={active}>` in [App.tsx](src/App.tsx) — this remount-on-tab-change is intentional, it was the fix for a blank-after-switch bug (commit `7269437`). Don't remove the key.

### Assistant (§05): Claude chat + Tavus avatar

[src/sections/Assistant.tsx](src/sections/Assistant.tsx) switches between two modes:

- **Chat** ([src/components/Chat.tsx](src/components/Chat.tsx)) → [src/lib/claude.ts](src/lib/claude.ts) → `POST /api/chat` ([api/chat.ts](api/chat.ts), a Vercel Function on the **Node.js runtime** — not Edge: the SDK imports `@opentelemetry/api`, which Edge rejects. It exports `POST` (web signature; a default export would get Node `(req, res)`), and relative imports in its chain use `.js` extensions because the package is `"type": "module"`). The function holds `ANTHROPIC_API_KEY` (no `VITE_` prefix, so it never reaches the bundle), builds the system prompt server-side, validates the history (alternating turns, size caps), rejects cross-origin calls, and streams plain text back. Model defaults to `claude-haiku-5-5` for cost (override with `ANTHROPIC_MODEL`; keep `MODEL_LABEL` in `src/lib/claude.ts` in sync), effort `low`, prompt caching on the system prompt; server-side refusal fallbacks are sent only for Opus/Sonnet/Fable models (Haiku rejects them). In `npm run dev` the `localApi` plugin in [vite.config.ts](vite.config.ts) mounts the same handler and loads the key from `.env.local`. **Never read `.env.local`** — the user asked that the key file not be opened.
- **Avatar** ([src/components/Avatar.tsx](src/components/Avatar.tsx)) — Tavus `<tavus-embed>` web component. The script (`@tavus/embed`, version pinned) loads only after the visitor clicks "Iniciar conversación" (no mic/camera prompt on page load) and the component unmounts when switching back to chat (ends the call). Its knowledge is configured in the Tavus dashboard, not here.

The chat model can only answer from two declared sources:

- **Fuente A · official docs**: PDFs in `public/docs/` (`Ivan_Sanchez_CV_2026.pdf` — the final CV, also the public download via `CV_PDF_URL` in `sections.ts` — plus the LinkedIn export `Profile.pdf`; the prompt tells the model the CV wins on conflicts) get extracted at build time by [scripts/extract-docs.mjs](scripts/extract-docs.mjs) (uses `pdf-parse`) into `src/lib/docs.generated.ts`. This file is **gitignored and auto-regenerated** by the `predev` / `prebuild` npm scripts — never edit it by hand and don't commit it.
- **Fuente B · site copy**: hand-maintained in [src/lib/site-content.ts](src/lib/site-content.ts). Edit this when you change copy in a section so the assistant stays in sync.

Both are concatenated in [src/lib/context.ts](src/lib/context.ts) into `SYSTEM_PROMPT`, along with hard rules (Spanish, third person, refuse out-of-source questions with the canonical contact-Iván line, deflect salary/relocation, etc.). `context.ts` is imported only by `api/chat.ts` — keep client code importing from [src/lib/suggestions.ts](src/lib/suggestions.ts) instead, so the prompt stays out of the public bundle.

### Styling system

Global design tokens live in [src/styles/tokens.css](src/styles/tokens.css) (imported once via [src/styles/global.css](src/styles/global.css)). Per-component styles use CSS Modules (`*.module.css`). Palette: deep ink surfaces with **sky blue (`--accent`) as the main color, blended toward indigo (`--accent-2`) only inside gradients (`--grad`, `--grad-strong`) and glows** — don't introduce other hues. Global helpers in `global.css`: `.glass` (glass card with 1px gradient border), `.spotlight` + `trackSpotlight` ([src/lib/useSpotlight.ts](src/lib/useSpotlight.ts)) for the cursor glow, `.grad-text`, `.display-title em` (serif italic gradient accent — section titles get it via the `accent` field in `sections.ts`). Layout dims like `--sidebar-w`, `--topbar-h`, `--max-content`, `--gutter` are tokens too; reuse them.

Motion uses `framer-motion`. Keep it subtle — see existing tab-switch and stagger patterns in `IdentityPanel`, `Chat`, sections.

## Conventions worth knowing

- Spanish (es-MX) copy throughout — UI labels, comments in code, commit messages. Match this when editing.
- File paths in this app's content (Evidence section URLs incl. the CONOCER/DOF links for EC1830/EC1835/EC1836/EC1848, contact info) are real — don't invent or alter URLs/emails/phone numbers; they're cited in the system prompt and must match the docs.
- `noUnusedLocals` and `noUnusedParameters` are on in [tsconfig.json](tsconfig.json) — strict mode. The build will fail on unused symbols.
- The `dist/` folder is gitignored but the `dist/` outdir is what gets deployed. `public/media/` is also gitignored (large media is served via Drive in production per `.gitignore` comment).

## Repo-specific Claude assets

`.claude/agents/` and `.claude/skills/` contain project-scoped agents (landing-page-designer, motion-choreographer, react-app-architect, a11y-reviewer, landing-page-copywriter) and skills (build-landing-page, build-react-landing-page, landing-page-polish). They're tuned for this kind of editorial single-page piece and will be picked up automatically by their descriptions.
