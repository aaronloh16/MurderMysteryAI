import { capabilities } from '@/lib/config';
import { sharedLimiter } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

/** Health and capability probe. Never exposes secrets, only what is switched on. */
export function GET() {
  return Response.json(
    { ok: true, ...capabilities(), sharedRateLimits: sharedLimiter },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
