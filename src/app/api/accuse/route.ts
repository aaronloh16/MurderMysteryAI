import { z } from 'zod';

import { getCase, getClue, getSuspect } from '@/lib/cases';
import { clientIp, isAllowedOrigin, jsonError } from '@/lib/http';
import type { Verdict } from '@/lib/protocol';
import { rateLimit } from '@/lib/rate-limit';

const Body = z.object({
  caseId: z.string().max(64),
  suspectId: z.string().max(64),
  motiveId: z.string().max(64),
  evidenceIds: z.array(z.string().max(64)).min(1).max(3),
  discovered: z.array(z.string().max(64)).max(64).default([]),
});

const RANKS = ['Walked into a lamppost', 'Lucky hunch', 'Sharp detective', 'Legendary gumshoe'] as const;

/**
 * The solution never leaves the server until the player commits to an
 * accusation. Scoring rewards the full chain: who, why, and what proves it.
 */
export async function POST(req: Request) {
  if (!isAllowedOrigin(req)) return jsonError(403, 'forbidden_origin', 'Cross-origin requests are not allowed.');
  const limit = await rateLimit(`accuse:${clientIp(req)}`, 30, 600);
  if (!limit.ok) return jsonError(429, 'rate_limited', 'Slow down, detective.', { retryAfterSeconds: limit.retryAfterSeconds });

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError(400, 'bad_request', 'The accusation was incomplete.');
  const body = parsed.data;

  const c = getCase(body.caseId);
  const accused = c && getSuspect(c, body.suspectId);
  if (!c || !accused) return jsonError(404, 'not_found', 'No such case or suspect.');

  const owned = new Set([...c.clues.filter((cl) => cl.source === 'scene').map((cl) => cl.id), ...body.discovered]);
  const evidence = [...new Set(body.evidenceIds)].filter((id) => owned.has(id) && getClue(c, id));

  const culpritCorrect = accused.id === c.solution.culprit;
  const motiveCorrect = culpritCorrect && body.motiveId === c.solution.motive;
  const evidenceScore = culpritCorrect ? evidence.filter((id) => c.solution.keyEvidence.includes(id)).length : 0;
  const evidenceNeeded = 2;

  let stars: Verdict['stars'] = 0;
  if (culpritCorrect) stars = (1 + (motiveCorrect ? 1 : 0) + (evidenceScore >= evidenceNeeded ? 1 : 0)) as Verdict['stars'];

  const culprit = getSuspect(c, c.solution.culprit)!;
  const verdict: Verdict = {
    correct: culpritCorrect,
    culpritCorrect,
    motiveCorrect,
    evidenceScore,
    evidenceNeeded,
    stars,
    rank: RANKS[stars],
    accused: { id: accused.id, name: accused.name },
    culprit: { id: culprit.id, name: culprit.name },
    motive: c.motives.find((m) => m.id === c.solution.motive)?.label ?? '',
    truth: c.solution.truth,
    headline: culpritCorrect ? c.solution.headline.correct : c.solution.headline.wrong,
    paper: c.solution.headline.paper,
    supportingEvidence: c.solution.keyEvidence.map((id) => getClue(c, id)?.title ?? id),
  };
  return Response.json(verdict, { headers: { 'Cache-Control': 'no-store' } });
}
