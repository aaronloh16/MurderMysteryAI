import type { PublicCase, PublicClue } from '@/lib/cases/types';

/** NDJSON events streamed by POST /api/interrogate. */
export type StreamEvent =
  | { type: 'meta'; engine: 'live' | 'scripted'; notice?: string }
  | { type: 'text'; delta: string }
  | { type: 'clue'; clue: PublicClue }
  | { type: 'done'; topicId?: string; capped?: boolean }
  | { type: 'error'; message: string };

/** What this deployment has switched on. Safe to send to the browser. */
export interface Capabilities {
  mode: 'demo' | 'live';
  voice: boolean;
  questionsPerSuspect: number | null;
  voiceSessionSeconds: number;
}

export interface ApiError {
  error: { code: string; message: string; retryAfterSeconds?: number };
}

export interface Verdict {
  correct: boolean;
  culpritCorrect: boolean;
  motiveCorrect: boolean;
  evidenceScore: number;
  evidenceNeeded: number;
  stars: 0 | 1 | 2 | 3;
  rank: string;
  accused: { id: string; name: string };
  culprit: { id: string; name: string };
  motive: string;
  truth: string[];
  headline: string;
  paper: string;
  supportingEvidence: string[];
}

export type { PublicCase, PublicClue };
