import 'server-only';

import { VOICE_MODEL } from '@/lib/models';
import type { Capabilities } from '@/lib/protocol';

/**
 * Runtime configuration. Everything is optional: with no env vars the game
 * runs fully in scripted demo mode.
 */

function int(name: string, fallback: number): number {
  const raw = process.env[name];
  const n = raw ? Number.parseInt(raw, 10) : NaN;
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

/** AI Gateway auth: an API key locally, or the OIDC token Vercel injects. */
export function hasGatewayAuth(): boolean {
  return Boolean(process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN);
}

export const config = {
  /** Live text interrogations through AI Gateway. On when auth exists, unless disabled. */
  get liveText(): boolean {
    return hasGatewayAuth() && process.env.DISABLE_LIVE_AI !== 'true';
  },
  /** Live voice costs real money per minute, so it is opt-in. */
  get voice(): boolean {
    return this.liveText && process.env.ENABLE_VOICE === 'true';
  },
  textModel: process.env.AI_MODEL || 'anthropic/claude-haiku-5.5',
  voiceModel: VOICE_MODEL,

  /** Hard caps for a public demo. */
  maxMessageChars: 400,
  maxHistoryTurns: 24,
  maxOutputTokens: 260,
  questionsPerSuspect: int('QUESTIONS_PER_SUSPECT', 20),
  voiceSessionSeconds: int('VOICE_SESSION_SECONDS', 120),

  /** Per-IP rate limits. */
  textPerIpPer10m: int('RATE_TEXT_PER_10M', 40),
  voicePerIpPerDay: int('RATE_VOICE_PER_DAY', 6),
  /** Global daily budgets. When spent, text falls back to the script and voice turns off. */
  dailyTextBudget: int('DAILY_TEXT_BUDGET', 3000),
  dailyVoiceBudget: int('DAILY_VOICE_BUDGET', 150),
};


export function capabilities(): Capabilities {
  return {
    mode: config.liveText ? 'live' : 'demo',
    voice: config.voice,
    questionsPerSuspect: config.liveText ? config.questionsPerSuspect : null,
    voiceSessionSeconds: config.voiceSessionSeconds,
  };
}
