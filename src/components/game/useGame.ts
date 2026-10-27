'use client';

import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';

import type { PublicCase, PublicClue } from '@/lib/cases/types';
import type { ApiError, StreamEvent, Verdict } from '@/lib/protocol';

export interface Msg {
  id: string;
  role: 'detective' | 'suspect' | 'system';
  text: string;
  presented?: string;
  revealed?: string;
  via?: 'voice';
  pending?: boolean;
  error?: boolean;
}

export interface GameState {
  v: 2;
  introSeen: boolean;
  active: string;
  /** Earned testimony and documents, keyed by id. Scene clues come from the case. */
  earned: Record<string, PublicClue>;
  unseen: string[];
  transcripts: Record<string, Msg[]>;
  asked: Record<string, string[]>;
  verdict: Verdict | null;
  engine: 'live' | 'scripted' | null;
  notice: string | null;
}

type Action =
  | { type: 'hydrate'; state: GameState }
  | { type: 'intro-seen' }
  | { type: 'select'; suspectId: string }
  | { type: 'push'; suspectId: string; msgs: Msg[] }
  | { type: 'patch'; suspectId: string; id: string; patch: Partial<Msg>; append?: string }
  | { type: 'clue'; clue: PublicClue; suspectId: string; msgId?: string }
  | { type: 'asked'; suspectId: string; topicId: string }
  | { type: 'seen'; ids: string[] }
  | { type: 'meta'; engine: GameState['engine']; notice: string | null }
  | { type: 'verdict'; verdict: Verdict }
  | { type: 'reset'; state: GameState };

function initial(c: PublicCase): GameState {
  return {
    v: 2,
    introSeen: false,
    active: c.suspects[0]!.id,
    earned: {},
    unseen: c.sceneClues.map((cl) => cl.id),
    transcripts: {},
    asked: {},
    verdict: null,
    engine: null,
    notice: null,
  };
}

function reducer(s: GameState, a: Action): GameState {
  switch (a.type) {
    case 'hydrate':
    case 'reset':
      return a.state;
    case 'intro-seen':
      return { ...s, introSeen: true };
    case 'select':
      return { ...s, active: a.suspectId };
    case 'push':
      return { ...s, transcripts: { ...s.transcripts, [a.suspectId]: [...(s.transcripts[a.suspectId] ?? []), ...a.msgs] } };
    case 'patch': {
      const list = (s.transcripts[a.suspectId] ?? []).map((m) =>
        m.id === a.id ? { ...m, ...a.patch, text: a.append ? m.text + a.append : (a.patch.text ?? m.text) } : m,
      );
      return { ...s, transcripts: { ...s.transcripts, [a.suspectId]: list } };
    }
    case 'clue': {
      if (s.earned[a.clue.id]) return s;
      const list = a.msgId
        ? (s.transcripts[a.suspectId] ?? []).map((m) => (m.id === a.msgId ? { ...m, revealed: a.clue.id } : m))
        : s.transcripts[a.suspectId];
      return {
        ...s,
        earned: { ...s.earned, [a.clue.id]: a.clue },
        unseen: [...s.unseen, a.clue.id],
        transcripts: list ? { ...s.transcripts, [a.suspectId]: list } : s.transcripts,
      };
    }
    case 'asked': {
      const prev = s.asked[a.suspectId] ?? [];
      if (prev.includes(a.topicId)) return s;
      return { ...s, asked: { ...s.asked, [a.suspectId]: [...prev, a.topicId] } };
    }
    case 'seen':
      return { ...s, unseen: s.unseen.filter((id) => !a.ids.includes(id)) };
    case 'meta':
      return { ...s, engine: a.engine, notice: a.notice };
    case 'verdict':
      return { ...s, verdict: a.verdict };
  }
}

const uid = () => Math.random().toString(36).slice(2, 10);

function storageKey(caseId: string) {
  return `mma:${caseId}`;
}

function load(c: PublicCase): GameState | null {
  try {
    const raw = window.localStorage.getItem(storageKey(c.id));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameState;
    if (parsed?.v !== 2 || !c.suspects.some((s) => s.id === parsed.active)) return null;
    // Never resume mid-stream.
    for (const k of Object.keys(parsed.transcripts)) {
      parsed.transcripts[k] = (parsed.transcripts[k] ?? []).filter((m) => !m.pending);
    }
    return parsed;
  } catch {
    return null;
  }
}

export function useGame(c: PublicCase) {
  const [state, dispatch] = useReducer(reducer, c, initial);
  const hydrated = useRef(false);
  const busy = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const saved = load(c);
    if (saved) dispatch({ type: 'hydrate', state: saved });
    hydrated.current = true;
  }, [c]);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(storageKey(c.id), JSON.stringify(state));
    } catch {
      /* storage unavailable: the game still works for this session */
    }
  }, [c.id, state]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const clues = useMemo<PublicClue[]>(() => [...c.sceneClues, ...Object.values(state.earned)], [c.sceneClues, state.earned]);
  const discovered = useMemo(() => Object.keys(state.earned), [state.earned]);

  const ask = useCallback(
    async (suspectId: string, message: string, presentedClueId?: string): Promise<{ ok: boolean; error?: string }> => {
      if (busy.current) return { ok: false };
      busy.current = true;
      const transcript = state.transcripts[suspectId] ?? [];
      const history = transcript
        .filter((m) => m.role !== 'system' && !m.error && m.text)
        .map((m) => ({ role: m.role as 'detective' | 'suspect', text: m.text }));

      const qId = uid();
      const aId = uid();
      dispatch({
        type: 'push',
        suspectId,
        msgs: [
          { id: qId, role: 'detective', text: message, ...(presentedClueId ? { presented: presentedClueId } : {}) },
          { id: aId, role: 'suspect', text: '', pending: true },
        ],
      });

      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const res = await fetch('/api/interrogate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            caseId: c.id,
            suspectId,
            message,
            presentedClueId,
            discovered,
            asked: state.asked[suspectId] ?? [],
            history,
          }),
        });

        if (!res.ok || !res.body) {
          const err = (await res.json().catch(() => null)) as ApiError | null;
          const text = err?.error.message ?? 'The line went dead. Try again.';
          dispatch({ type: 'patch', suspectId, id: aId, patch: { pending: false, error: true, text } });
          return { ok: false, error: text };
        }

        const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
        let buf = '';
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buf += value;
          let nl: number;
          while ((nl = buf.indexOf('\n')) >= 0) {
            const raw = buf.slice(0, nl).trim();
            buf = buf.slice(nl + 1);
            if (!raw) continue;
            const ev = JSON.parse(raw) as StreamEvent;
            if (ev.type === 'text') dispatch({ type: 'patch', suspectId, id: aId, patch: {}, append: ev.delta });
            else if (ev.type === 'clue') dispatch({ type: 'clue', clue: ev.clue, suspectId, msgId: aId });
            else if (ev.type === 'meta') dispatch({ type: 'meta', engine: ev.engine, notice: ev.notice ?? null });
            else if (ev.type === 'done' && ev.topicId) dispatch({ type: 'asked', suspectId, topicId: ev.topicId });
            else if (ev.type === 'error') dispatch({ type: 'patch', suspectId, id: aId, patch: { error: true, text: ev.message } });
          }
        }
        dispatch({ type: 'patch', suspectId, id: aId, patch: { pending: false } });
        return { ok: true };
      } catch (err) {
        if ((err as Error).name === 'AbortError') return { ok: false };
        const text = 'Lost the connection to the interrogation room. Check your network and try again.';
        dispatch({ type: 'patch', suspectId, id: aId, patch: { pending: false, error: true, text } });
        return { ok: false, error: text };
      } finally {
        busy.current = false;
      }
    },
    [c.id, discovered, state.asked, state.transcripts],
  );

  return {
    state,
    clues,
    discovered,
    ask,
    select: (suspectId: string) => dispatch({ type: 'select', suspectId }),
    introSeen: () => dispatch({ type: 'intro-seen' }),
    markSeen: (ids: string[]) => dispatch({ type: 'seen', ids }),
    addClue: (clue: PublicClue, suspectId: string) => dispatch({ type: 'clue', clue, suspectId }),
    pushMessages: (suspectId: string, msgs: Omit<Msg, 'id'>[]) =>
      dispatch({ type: 'push', suspectId, msgs: msgs.map((m) => ({ ...m, id: uid() })) }),
    setVerdict: (verdict: Verdict) => dispatch({ type: 'verdict', verdict }),
    reset: () => {
      abortRef.current?.abort();
      dispatch({ type: 'reset', state: { ...initial(c), introSeen: true } });
    },
  };
}

export type Game = ReturnType<typeof useGame>;
