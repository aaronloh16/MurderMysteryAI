'use client';

import { experimental_useRealtime as useRealtime } from '@ai-sdk/react';
import { gateway } from 'ai';
import { useEffect, useMemo, useRef, useState } from 'react';

import type { PublicCase, PublicClue, PublicSuspect } from '@/lib/cases/types';
import { VOICE_MODEL } from '@/lib/models';

import type { Game } from './useGame';

/**
 * Live speech-to-speech interrogation over AI Gateway's realtime API.
 *
 * The browser fetches a short-lived client secret from /api/voice/session,
 * which also embeds the suspect's character sheet server-side. Only stable,
 * secret-free settings live here. Sessions are capped in length, and the
 * transcript is folded into the normal text log when the call ends, so the
 * text conversation and the voice conversation share one memory.
 */

const model = gateway.experimental_realtime(VOICE_MODEL);
const sessionConfig = {
  inputAudioTranscription: {},
  turnDetection: { type: 'semantic-vad' as const },
};

interface Props {
  c: PublicCase;
  suspect: PublicSuspect;
  game: Game;
  seconds: number;
  onActiveChange: (active: boolean) => void;
}

export function VoiceLine({ c, suspect, game, seconds, onActiveChange }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [left, setLeft] = useState(seconds);
  const [from, setFrom] = useState(0);
  const committed = useRef(0);
  const gameRef = useRef(game);
  useEffect(() => {
    gameRef.current = game;
  });

  const api = useMemo(
    () => ({ token: `/api/voice/session?caseId=${encodeURIComponent(c.id)}&suspectId=${encodeURIComponent(suspect.id)}` }),
    [c.id, suspect.id],
  );

  const rt = useRealtime({
    model,
    api,
    sessionConfig,
    onError: (err) => {
      setError(
        /429/.test(err.message)
          ? 'You have used today’s voice interrogations. Text still works.'
          : /503/.test(err.message)
            ? 'Voice is resting for today. Text still works.'
            : /Permission|NotAllowed/i.test(err.message)
              ? 'Microphone access was blocked. Allow it in your browser, or keep typing.'
              : 'The voice line dropped. You can keep going in text.',
      );
    },
    onToolCall: async ({ toolCall }) => {
      if (toolCall.toolName !== 'reveal_clue') return { ok: false };
      const clueId = (toolCall.args as { clueId?: string } | null)?.clueId;
      if (!clueId) return { ok: false };
      const res = await fetch('/api/reveal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId: c.id, suspectId: suspect.id, clueId }),
      });
      if (!res.ok) return { pinned: false };
      const { clue } = (await res.json()) as { clue: PublicClue };
      gameRef.current.addClue(clue, suspect.id);
      return { pinned: true };
    },
  });

  const live = rt.status === 'connecting' || rt.status === 'connected' || rt.status === 'closing';

  useEffect(() => {
    onActiveChange(live);
  }, [live, onActiveChange]);

  // Hard cap on session length: cost guard for a public demo.
  useEffect(() => {
    if (rt.status !== 'connected') return;
    const started = Date.now();
    const t = window.setInterval(() => {
      const remaining = Math.max(0, seconds - Math.floor((Date.now() - started) / 1000));
      setLeft(remaining);
      if (remaining === 0) {
        window.clearInterval(t);
        void rt.close();
      }
    }, 500);
    return () => window.clearInterval(t);
  }, [rt.status, rt, seconds]);

  // Fold finished voice turns into the shared transcript.
  useEffect(() => {
    if (live) return;
    const fresh = rt.messages.slice(committed.current);
    if (!fresh.length) return;
    committed.current = rt.messages.length;
    const msgs = fresh
      .map((m) => ({
        role: m.role === 'user' ? ('detective' as const) : ('suspect' as const),
        text: m.parts.map((p) => (p.type === 'text' ? p.text : '')).join('').trim(),
        via: 'voice' as const,
      }))
      .filter((m) => m.text);
    if (msgs.length) gameRef.current.pushMessages(suspect.id, msgs);
  }, [live, rt.messages, suspect.id]);

  const start = async () => {
    setError(null);
    setLeft(seconds);
    setFrom(rt.messages.length);
    try {
      await rt.connect();
    } catch {
      setError('Could not open the voice line. Text still works.');
    }
  };

  const latest = rt.messages.slice(from).slice(-4);

  if (!live) {
    return (
      <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-line/50 pt-3">
        <button
          type="button"
          onClick={() => void start()}
          className="inline-flex items-center gap-2 rounded-full border border-blood/70 bg-blood/15 px-3.5 py-1.5 text-[13px] font-medium text-cream transition-colors hover:bg-blood/30"
        >
          <MicIcon />
          Talk to {suspect.name.split(' ')[0]} out loud
        </button>
        <span className="text-xs text-fog">Beta. {Math.round(seconds / 60)} minute call, microphone required.</span>
        {error && (
          <p role="alert" className="w-full text-xs text-blood-2">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3" aria-live="polite">
      <div className="flex items-center gap-3">
        <span className="relative grid size-10 place-items-center" aria-hidden>
          <span className={`absolute inset-0 rounded-full bg-blood/40 ${rt.isPlaying ? 'animate-ping' : ''}`} />
          <span className="relative grid size-10 place-items-center rounded-full bg-blood text-cream">
            <MicIcon />
          </span>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-cream">
            {rt.status === 'connecting'
              ? 'Connecting the line...'
              : rt.status === 'closing'
                ? 'Hanging up...'
                : rt.isPlaying
                  ? `${suspect.name.split(' ')[0]} is speaking`
                  : 'Listening. Speak naturally.'}
          </p>
          <p className="text-xs tabular-nums text-fog">
            {Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')} left on this call
          </p>
        </div>
        <button
          type="button"
          onClick={() => void rt.close()}
          className="rounded-md border border-line px-3 py-1.5 text-[13px] text-cream transition-colors hover:border-cream/60"
        >
          Hang up
        </button>
      </div>
      {latest.length > 0 && (
        <ul className="space-y-1 rounded-md bg-ink-3/70 p-3 text-[13px] leading-snug">
          {latest.map((m) => (
            <li key={m.id} className={m.role === 'user' ? 'text-fog' : 'font-display text-cream'}>
              <span className="mr-1.5 font-sans text-[10px] uppercase tracking-[0.16em] text-brass">
                {m.role === 'user' ? 'You' : suspect.name.split(' ')[0]}
              </span>
              {m.parts.map((p) => (p.type === 'text' ? p.text : '')).join('')}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MicIcon() {
  return (
    <svg viewBox="0 0 20 20" className="size-4" aria-hidden>
      <path
        d="M10 3a2.5 2.5 0 0 0-2.5 2.5v4a2.5 2.5 0 0 0 5 0v-4A2.5 2.5 0 0 0 10 3zM5 9.5a5 5 0 0 0 10 0M10 14.5V17"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
