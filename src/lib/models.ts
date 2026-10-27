/**
 * Realtime model routed through AI Gateway. Shared by the token route and the
 * browser hook, which must agree on it, so it is a constant rather than env.
 */
export const VOICE_MODEL = 'openai/gpt-realtime-2';
