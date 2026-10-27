import 'server-only';

export function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  return fwd?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'local';
}

/**
 * Cheap guard against other sites driving our paid endpoints from a
 * visitor's browser. Requests without an Origin (curl, server-to-server) are
 * allowed; rate limits still apply to them.
 */
export function isAllowedOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true;
  try {
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function jsonError(status: number, code: string, message: string, extra?: Record<string, unknown>) {
  return Response.json({ error: { code, message, ...extra } }, { status, headers: { 'Cache-Control': 'no-store' } });
}
