# Murder Mystery AI

**A noir detective game where you question AI suspects out loud or in text, then name the killer.**

Every suspect is lying about something. Ask them anything in your own words, lay evidence on the table when a story doesn't add up, and make one accusation: who did it, why, and what proves it. The morning paper prints whatever you decide.

> Screenshots: _add `docs/landing.png`, `docs/interrogation.png` and `docs/verdict.png` after the first deploy._

**Play the demo in about ten minutes, with no API keys, sign-up or microphone.**

---

## Why this exists

Most "talk to an AI character" games fall apart in the same ways. Characters drift, contradict themselves, confess too early, or make up evidence that sends you down a dead end. A mystery can't survive that: if the facts move, there is nothing to solve.

This project tests a different approach. **The model plays the characters, but the game owns the truth.**

- **One hidden truth per case.** Each case is authored once as typed data: the culprit, the motive, every clue, and what each suspect knows. A consistency check runs at build time, so an unsolvable case can't ship.
- **Knowledge boundaries.** Each suspect gets only their own facts, their cover story, and the exact conditions under which they crack. They never see the solution or anyone else's secrets.
- **Tool-gated progress.** A clue only reaches your evidence board when the suspect calls a `reveal_clue` tool. The server checks that call against what that suspect can actually give up. Presenting the right evidence breaks a story deterministically, so a stubborn model can't soft-lock the case.
- **Graceful degradation.** With no keys, a scripted engine plays the same cases from the same data. If the model errors or the daily budget runs out, the game falls back to the script mid-conversation and tells you.
- **Voice and text share one memory.** Speak to a suspect, hang up, and keep typing. The spoken transcript becomes part of the same interrogation log.

## How it plays

1. **Interrogate.** Pick a suspect. Ask questions by typing, tapping a suggested question, or (with voice on) just talking.
2. **Confront.** Open the evidence board and present a document or object. The right piece makes a suspect concede, and their new testimony gets pinned to the board.
3. **Accuse.** Choose the killer, the motive and up to three pieces of proof. You're scored on all three, then the full truth is revealed.

Two cases ship today:

| Case | Setting | Suspects | Length |
| --- | --- | --- | --- |
| **The Last Set at the Blue Lantern** | Harbor City jazz club, 1948 | 3 | ~10 min |
| **The Banhammer Affair** | San Francisco tech startup, present day | 4 | ~15 min |

## Run it

### Demo mode (no keys)

```bash
pnpm install
pnpm dev            # http://localhost:3400
```

All suspects run on the scripted engine, which has the same cases, clues and solutions as live mode.

### Live AI suspects (text)

```bash
cp .env.example .env.local
# set AI_GATEWAY_API_KEY (https://vercel.com/ai-gateway)
pnpm dev
```

Text interrogations use AI SDK 7 `streamText` through Vercel AI Gateway. The default model is `anthropic/claude-haiku-5.5` (fast, cheap, strong at staying in character). Set `AI_MODEL` to any Gateway model id to switch.

### Live voice (beta)

Set `ENABLE_VOICE=true` as well. Voice is speech-to-speech over AI Gateway's realtime API (`openai/gpt-realtime-2`), driven by `experimental_useRealtime` from `@ai-sdk/react`. It costs real money per minute, so it is opt-in and capped (see below).

### Checks

```bash
pnpm check          # typecheck + lint + production build
pnpm build && pnpm start   # then, in another terminal:
pnpm smoke          # pages, spoiler-leak check, scripted playthrough, origin guard
```

## Architecture

```
                         Browser
  ┌──────────────────────────────────────────────────────────┐
  │  Landing  ·  Case file  ·  Interrogation room            │
  │  Evidence board  ·  Accusation  ·  Verdict               │
  │                                                          │
  │  useGame (progress in localStorage)                      │
  │     │ text                        │ voice (beta)         │
  └─────┼─────────────────────────────┼──────────────────────┘
        │ POST /api/interrogate        │ POST /api/voice/session  -> short-lived secret
        │ NDJSON stream                │ WebSocket straight to AI Gateway realtime
        ▼                              │ reveal_clue -> POST /api/reveal
  ┌─────────────────────────────────────────────────────────┐
  │  Next.js 16 route handlers (Vercel Functions)            │
  │                                                          │
  │  guards: origin check · per-IP limits · question caps    │
  │          · daily budgets (Upstash Redis or in-memory)    │
  │                                                          │
  │  ┌──────────────┐   no key / error /   ┌──────────────┐  │
  │  │ Live engine  │ ── budget spent ───▶ │  Scripted    │  │
  │  │ AI SDK 7     │                      │  engine      │  │
  │  │ streamText + │                      │  keywords +  │  │
  │  │ reveal_clue  │                      │  reactions   │  │
  │  └──────┬───────┘                      └──────┬───────┘  │
  │         └───────────── both read ─────────────┘          │
  │                  Case data (server-only)                 │
  │   truth · suspects · knows · hiding · cover story ·      │
  │   topics · evidence reactions · solution                 │
  │   validated at build: 1 culprit, all clues reachable     │
  │                                                          │
  │  POST /api/accuse  -> scores who/why/proof, then reveals │
  └─────────────────────────────────────────────────────────┘
                 │
                 ▼
        Vercel AI Gateway  (text models + realtime voice)
```

Key files:

- `src/lib/cases/` holds the case schema, both cases, build-time validation and the public projection sent to the browser.
- `src/lib/engine/prompt.ts` builds the character sheet: knowledge boundary, cover story, reveal rules and hard rules.
- `src/lib/engine/scripted.ts` is the keyless engine.
- `src/app/api/interrogate/route.ts` has live and scripted streaming, tool-validated reveals and fallbacks.
- `src/app/api/voice/session/route.ts` mints realtime tokens with the instructions embedded on the server.
- `src/components/Portrait.tsx` draws procedural SVG portraits (no image assets).

### Why not the original stack?

The first version (2025) used a Next.js frontend, a Python LiveKit Agents worker, Deepgram for speech-to-text, OpenAI for the LLM, Cartesia for text-to-speech and Postgres. It worked, but a demo needed four vendor accounts and a long-running worker process, so it was never deployed.

In 2026, speech-to-speech models handle the whole voice loop, and AI Gateway exposes them alongside text models behind one credential. So the agent folder is gone, and the game is a single Next.js app that deploys to Vercel as-is. LiveKit is still the right call for phone lines, multi-party rooms or server-side audio processing. This game needs none of those.

## Abuse and cost guards

A public voice demo is an open tap on a paid API. The game limits it in layers:

| Guard | Default | Env |
| --- | --- | --- |
| Live text requests per IP | 40 / 10 min | `RATE_TEXT_PER_10M` |
| Questions per suspect (then they "ask for a lawyer") | 20 | `QUESTIONS_PER_SUSPECT` |
| Global live text budget (then the script takes over) | 3,000 / day | `DAILY_TEXT_BUDGET` |
| Voice calls per IP | 6 / day | `RATE_VOICE_PER_DAY` |
| Voice call length (client hangs up) | 120 s | `VOICE_SESSION_SECONDS` |
| Global voice budget (then voice turns off) | 150 / day | `DAILY_VOICE_BUDGET` |
| Realtime client secret lifetime | 60 s | (code) |
| Message length / history / output tokens | 400 chars / 24 turns / 260 tokens | (code) |
| Cross-origin POSTs to API routes | rejected | (code) |

Counters use Upstash Redis when `UPSTASH_REDIS_REST_URL`/`TOKEN` (or the Marketplace's `KV_REST_API_*`) are set. Otherwise they fall back to per-instance memory, which is fine locally but should not be relied on in production. For a public launch, also set a spend cap on the AI Gateway key.

## Deploying to Vercel

1. Import the repo into Vercel. The framework (Next.js) and `pnpm` are detected automatically from `vercel.json`.
2. Enable AI Gateway on the project. The OIDC token is injected automatically, so no key is needed in production. Otherwise set `AI_GATEWAY_API_KEY`.
3. Add Upstash Redis from the Marketplace for shared rate limits.
4. Optionally set `ENABLE_VOICE=true` and set a Gateway spend cap.
5. Deploy. With nothing configured, the site still works in demo mode.

## Built with

Next.js 16, React 19, AI SDK 7, Vercel AI Gateway (text and realtime), Tailwind CSS 4, Zod 4, Upstash Redis, TypeScript.

## Credits

Designed and built by [Aaron Loh](https://github.com/aaronloh16). All characters, cases and portraits are fictional. Portraits are drawn procedurally in SVG, and there are no third-party art assets. Fonts are Playfair Display, Special Elite and IBM Plex Sans (SIL Open Font License), served via `next/font`.

Design notes drew on research into LLM role-play consistency: the [MIRAGE](https://arxiv.org/abs/2501.01652) murder-mystery benchmark (context drift and clue triage), perspective-bounded memory for role-playing agents, and lessons from shipped LLM games like *Vaudeville* and *Suck Up!*, where free-form characters were fun until they forgot the plot.
