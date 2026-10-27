import { isStepCount, streamText, tool, type ModelMessage } from 'ai';
import { z } from 'zod';

import { getCase, getClue, getSuspect, revealableBy, toPublicClue } from '@/lib/cases';
import type { Case, Suspect } from '@/lib/cases/types';
import { config } from '@/lib/config';
import { buildSuspectInstructions } from '@/lib/engine/prompt';
import { scriptedReply } from '@/lib/engine/scripted';
import type { StreamEvent } from '@/lib/protocol';
import { clientIp, isAllowedOrigin, jsonError } from '@/lib/http';
import { rateLimit, spendDailyBudget } from '@/lib/rate-limit';

export const maxDuration = 30;

const Body = z.object({
  caseId: z.string().max(64),
  suspectId: z.string().max(64),
  message: z.string().max(config.maxMessageChars).default(''),
  presentedClueId: z.string().max(64).optional(),
  discovered: z.array(z.string().max(64)).max(64).default([]),
  asked: z.array(z.string().max(64)).max(64).default([]),
  history: z
    .array(z.object({ role: z.enum(['detective', 'suspect']), text: z.string().max(2000) }))
    .max(80)
    .default([]),
});
type BodyT = z.infer<typeof Body>;

const encoder = new TextEncoder();
const line = (e: StreamEvent) => encoder.encode(`${JSON.stringify(e)}\n`);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: Request) {
  if (!isAllowedOrigin(req)) return jsonError(403, 'forbidden_origin', 'Cross-origin requests are not allowed.');

  let body: BodyT;
  try {
    body = Body.parse(await req.json());
  } catch {
    return jsonError(400, 'bad_request', 'That question did not make it to the interrogation room.');
  }

  const c = getCase(body.caseId);
  const suspect = c && getSuspect(c, body.suspectId);
  if (!c || !suspect) return jsonError(404, 'not_found', 'No such case or suspect.');
  if (!body.message.trim() && !body.presentedClueId) return jsonError(400, 'empty', 'Ask a question or present evidence.');

  const presented = body.presentedClueId ? getClue(c, body.presentedClueId) : undefined;
  if (body.presentedClueId && (!presented || !canPresent(c, presented.id, body.discovered))) {
    return jsonError(400, 'bad_evidence', 'You do not have that evidence yet.');
  }

  const ip = clientIp(req);
  const discovered = new Set(body.discovered);
  const turn = body.history.filter((h) => h.role === 'detective').length;

  let engine: 'live' | 'scripted' = config.liveText ? 'live' : 'scripted';
  let notice: string | undefined;

  if (engine === 'live') {
    const limit = await rateLimit(`text:${ip}`, config.textPerIpPer10m, 600);
    if (!limit.ok) {
      return jsonError(429, 'rate_limited', 'The precinct needs a breather. Try again shortly.', {
        retryAfterSeconds: limit.retryAfterSeconds,
      });
    }
    if (turn >= config.questionsPerSuspect) {
      return stream(async (send) => {
        send({ type: 'meta', engine: 'scripted', notice: 'This suspect has asked for a lawyer. Make your accusation or talk to someone else.' });
        await typeOut(send, 'I’ve said all I’m going to say, detective. Talk to my lawyer.');
        send({ type: 'done', capped: true });
      });
    }
    if (!(await spendDailyBudget('text', config.dailyTextBudget))) {
      engine = 'scripted';
      notice = 'Today’s live AI budget is spent, so suspects are reading from their scripts.';
    }
  } else {
    const limit = await rateLimit(`demo:${ip}`, 200, 600);
    if (!limit.ok) return jsonError(429, 'rate_limited', 'Slow down, detective.', { retryAfterSeconds: limit.retryAfterSeconds });
  }

  return stream(async (send, signal) => {
    send({ type: 'meta', engine, ...(notice ? { notice } : {}) });

    if (engine === 'live') {
      try {
        const done = await runLive({ c, suspect, body, discovered, presented, send, signal });
        if (done) return;
      } catch (err) {
        if (signal.aborted) return;
        console.error('[interrogate] live model failed, falling back to script', err);
        send({ type: 'meta', engine: 'scripted', notice: 'The line went dead for a moment. This answer is from the script.' });
      }
    }

    const result = scriptedReply({
      suspect,
      message: body.message,
      ...(presented ? { presentedClueId: presented.id } : {}),
      discovered,
      asked: body.asked,
      turn,
    });
    await typeOut(send, result.reply, signal);
    if (result.reveals) {
      const clue = getClue(c, result.reveals);
      if (clue) send({ type: 'clue', clue: toPublicClue(clue) });
    }
    send({ type: 'done', ...(result.topicId ? { topicId: result.topicId } : {}) });
  });
}

function canPresent(c: Case, clueId: string, discovered: string[]): boolean {
  const clue = getClue(c, clueId);
  return Boolean(clue && (clue.source === 'scene' || discovered.includes(clueId)));
}

/** Returns true when the live model produced a complete answer. */
async function runLive(args: {
  c: Case;
  suspect: Suspect;
  body: BodyT;
  discovered: Set<string>;
  presented: ReturnType<typeof getClue>;
  send: (e: StreamEvent) => void;
  signal: AbortSignal;
}): Promise<boolean> {
  const { c, suspect, body, discovered, presented, send, signal } = args;

  const allowed = [...revealableBy(suspect)].filter((id) => !discovered.has(id));
  const revealed = new Set<string>();
  const unlock = (id: string) => {
    if (revealed.has(id) || discovered.has(id) || !allowed.includes(id)) return false;
    const clue = getClue(c, id);
    if (!clue) return false;
    revealed.add(id);
    send({ type: 'clue', clue: toPublicClue(clue) });
    return true;
  };

  // Presenting the right evidence breaks a story deterministically, even if the
  // model is coy. The model is told to concede, and the clue is unlocked here.
  const reaction = presented ? suspect.reactions.find((r) => r.clueId === presented.id) : undefined;

  const history: ModelMessage[] = body.history.slice(-config.maxHistoryTurns).map((h) => ({
    role: h.role === 'detective' ? ('user' as const) : ('assistant' as const),
    content: h.text,
  }));
  if (history[0]?.role !== 'user') history.unshift({ role: 'user', content: '(The detective sits down across the table.)' });

  let userTurn = body.message.trim();
  if (presented) {
    userTurn = `[The detective lays evidence on the table: "${presented.title}": ${presented.detail}]${userTurn ? ` ${userTurn}` : ''}`;
    if (reaction?.reveals && allowed.includes(reaction.reveals)) {
      userTurn += `\n[Game note: this evidence breaks your story. Concede what you must now, in character: ${reaction.reply}]`;
    }
  }

  const tools = allowed.length
    ? {
        reveal_clue: tool({
          description:
            'Call this exactly when you give the detective one of the facts listed in your REVEAL RULES, so it is pinned to their evidence board.',
          inputSchema: z.object({ clueId: z.enum(allowed as [string, ...string[]]) }),
          execute: async ({ clueId }) => ({ pinned: unlock(clueId) }),
        }),
      }
    : undefined;

  const result = streamText({
    model: config.textModel,
    system: buildSuspectInstructions(c, suspect, { discovered, mode: 'text' }),
    messages: [...history, { role: 'user', content: userTurn }],
    ...(tools ? { tools, stopWhen: isStepCount(2) } : {}),
    maxOutputTokens: config.maxOutputTokens,
    temperature: 0.8,
    abortSignal: signal,
    timeout: { firstChunkMs: 12_000, totalMs: 25_000 },
  });

  let wrote = false;
  for await (const part of result.stream) {
    if (part.type === 'text-delta' && part.text) {
      wrote = true;
      send({ type: 'text', delta: part.text });
    } else if (part.type === 'error') {
      if (!wrote) throw part.error;
    }
  }
  if (!wrote) throw new Error('empty model response');

  if (reaction?.reveals) unlock(reaction.reveals);
  send({ type: 'done' });
  return true;
}

function stream(run: (send: (e: StreamEvent) => void, signal: AbortSignal) => Promise<void>) {
  const abort = new AbortController();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (e: StreamEvent) => {
        if (!abort.signal.aborted) controller.enqueue(line(e));
      };
      try {
        await run(send, abort.signal);
      } catch (err) {
        console.error('[interrogate]', err);
        send({ type: 'error', message: 'Something went wrong in the interrogation room.' });
      } finally {
        if (!abort.signal.aborted) controller.close();
      }
    },
    cancel() {
      abort.abort();
    },
  });
  return new Response(body, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Accel-Buffering': 'no',
    },
  });
}

/** Streams a scripted line word by word so demo mode feels spoken, not pasted. */
async function typeOut(send: (e: StreamEvent) => void, text: string, signal?: AbortSignal) {
  await sleep(350);
  const words = text.split(/(\s+)/);
  for (let i = 0; i < words.length; i += 2) {
    if (signal?.aborted) return;
    send({ type: 'text', delta: (words[i] ?? '') + (words[i + 1] ?? '') });
    await sleep(22 + Math.min(60, (words[i]?.length ?? 0) * 6));
  }
}
