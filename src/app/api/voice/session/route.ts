import { experimental_getRealtimeToolDefinitions, gateway, tool } from 'ai';
import { z } from 'zod';

import { getCase, getSuspect, revealableBy } from '@/lib/cases';
import { config } from '@/lib/config';
import { buildSuspectInstructions } from '@/lib/engine/prompt';
import { clientIp, isAllowedOrigin, jsonError } from '@/lib/http';
import { rateLimit, spendDailyBudget } from '@/lib/rate-limit';

export const maxDuration = 15;

/**
 * Mints a short-lived AI Gateway realtime client secret for one suspect.
 *
 * The character sheet (which includes that suspect's secrets) is embedded in
 * the token request here on the server. The browser only receives the
 * ephemeral token, the WebSocket URL and the tool schema, so the solution is
 * never shipped to the client.
 *
 * Called by `experimental_useRealtime` with `api.token`; the case, suspect and
 * discovered clues travel in the query string because the hook owns the body.
 */
export async function POST(req: Request) {
  if (!isAllowedOrigin(req)) return jsonError(403, 'forbidden_origin', 'Cross-origin requests are not allowed.');
  if (!config.voice) {
    return jsonError(503, 'voice_disabled', 'Live voice is switched off on this deployment. Text interrogation still works.');
  }

  const url = new URL(req.url);
  const c = getCase(url.searchParams.get('caseId') ?? '');
  const suspect = c && getSuspect(c, url.searchParams.get('suspectId') ?? '');
  if (!c || !suspect) return jsonError(404, 'not_found', 'No such case or suspect.');
  const discovered = new Set((url.searchParams.get('discovered') ?? '').split(',').filter(Boolean).slice(0, 64));

  const ip = clientIp(req);
  const perIp = await rateLimit(`voice:${ip}`, config.voicePerIpPerDay, 86_400);
  if (!perIp.ok) {
    return jsonError(429, 'rate_limited', 'You have used today’s voice interrogations. Text mode is still open.', {
      retryAfterSeconds: perIp.retryAfterSeconds,
    });
  }
  if (!(await spendDailyBudget('voice', config.dailyVoiceBudget))) {
    return jsonError(503, 'budget_spent', 'Today’s voice budget is spent. Text mode is still open.');
  }

  const allowed = [...revealableBy(suspect)].filter((id) => !discovered.has(id));
  const tools = allowed.length
    ? await experimental_getRealtimeToolDefinitions({
        tools: {
          reveal_clue: tool({
            description:
              'Call this exactly when you give the detective one of the facts listed in your REVEAL RULES, so it is pinned to their evidence board.',
            inputSchema: z.object({ clueId: z.enum(allowed as [string, ...string[]]) }),
          }),
        },
      })
    : [];

  try {
    const token = await gateway.experimental_realtime.getToken({
      model: config.voiceModel,
      // Only long enough to open the socket; the session itself is capped client-side
      // to config.voiceSessionSeconds and per-IP / daily budgets cap the spend.
      expiresAfterSeconds: 60,
      sessionConfig: {
        instructions: buildSuspectInstructions(c, suspect, { discovered, mode: 'voice' }),
        voice: suspect.voice,
        inputAudioTranscription: {},
        turnDetection: { type: 'semantic-vad' },
        ...(tools.length ? { tools } : {}),
      },
    });
    return Response.json({ ...token, tools }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error('[voice] token mint failed', err);
    return jsonError(502, 'voice_unavailable', 'The voice line is down. Text interrogation still works.');
  }
}
