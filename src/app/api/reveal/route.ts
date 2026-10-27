import { z } from 'zod';

import { getCase, getClue, getSuspect, revealableBy, toPublicClue } from '@/lib/cases';
import { clientIp, isAllowedOrigin, jsonError } from '@/lib/http';
import { rateLimit } from '@/lib/rate-limit';

const Body = z.object({
  caseId: z.string().max(64),
  suspectId: z.string().max(64),
  clueId: z.string().max(64),
});

/**
 * Voice sessions run model tool calls in the browser. When a suspect calls
 * `reveal_clue`, the client asks the server for the card, and the server
 * checks the clue really belongs to that suspect before handing it over.
 */
export async function POST(req: Request) {
  if (!isAllowedOrigin(req)) return jsonError(403, 'forbidden_origin', 'Cross-origin requests are not allowed.');
  const limit = await rateLimit(`reveal:${clientIp(req)}`, 60, 600);
  if (!limit.ok) return jsonError(429, 'rate_limited', 'Slow down, detective.');

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError(400, 'bad_request', 'Invalid request.');
  const c = getCase(parsed.data.caseId);
  const suspect = c && getSuspect(c, parsed.data.suspectId);
  if (!c || !suspect || !revealableBy(suspect).has(parsed.data.clueId)) {
    return jsonError(404, 'not_found', 'That suspect has no such evidence.');
  }
  const clue = getClue(c, parsed.data.clueId)!;
  return Response.json({ clue: toPublicClue(clue) }, { headers: { 'Cache-Control': 'no-store' } });
}
