'use client';

import { useEffect, useRef, useState } from 'react';

import { Portrait } from '@/components/Portrait';
import type { PublicCase, PublicClue, PublicSuspect } from '@/lib/cases/types';
import type { Capabilities } from '@/lib/protocol';

import { KindIcon } from './Evidence';
import type { Game, Msg } from './useGame';
import { VoiceLine } from './VoiceLine';

interface Props {
  c: PublicCase;
  game: Game;
  suspect: PublicSuspect;
  caps: Capabilities;
  onPresent: () => void;
  onOpenClue: (clue: PublicClue) => void;
}

export function Room({ c, game, suspect, caps, onPresent, onOpenClue }: Props) {
  const { state, clues, discovered } = game;
  const transcript = state.transcripts[suspect.id] ?? [];
  const asked = state.asked[suspect.id] ?? [];
  const [draft, setDraft] = useState('');
  const [voiceActive, setVoiceActive] = useState(false);
  const logRef = useRef<HTMLOListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pending = transcript.some((m) => m.pending);
  const revealedHere = Object.values(state.earned).filter((cl) => cl.sourceSuspectId === suspect.id).length;
  const pressure = suspect.secrets ? revealedHere / suspect.secrets : 0;
  const questionsUsed = transcript.filter((m) => m.role === 'detective' && !m.via).length;
  const questionsLeft = caps.questionsPerSuspect != null ? Math.max(0, caps.questionsPerSuspect - questionsUsed) : null;

  const suggestions = suspect.suggestions
    .filter((s) => !asked.includes(s.id) && (s.requires ?? []).every((r) => discovered.includes(r)))
    .slice(0, 3);

  const lastSuspectMsg = [...transcript].reverse().find((m) => m.role === 'suspect' && !m.pending);

  const tailText = transcript.at(-1)?.text;
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [transcript.length, tailText]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || pending) return;
    setDraft('');
    await game.ask(suspect.id, q);
    inputRef.current?.focus();
  };

  const byId = new Map(clues.map((cl) => [cl.id, cl]));
  const disabled = pending || questionsLeft === 0 || Boolean(state.verdict);

  return (
    <section aria-labelledby="room-title" className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-line/70 bg-ink-2">
      <div className="lamp-glow pointer-events-none absolute inset-x-0 top-0 h-72 animate-flicker" aria-hidden />

      {/* Suspect header */}
      <header className="relative flex items-end gap-4 border-b border-line/60 px-4 pb-4 pt-5 sm:gap-6 sm:px-6">
        <div className="relative shrink-0">
          <div className="absolute -top-5 left-1/2 h-5 w-px -translate-x-1/2 bg-line" aria-hidden />
          <Portrait
            spec={suspect.portrait}
            pressure={pressure}
            className="h-32 w-[6.4rem] rounded-sm shadow-[0_12px_30px_rgb(0_0_0/0.6)] sm:h-40 sm:w-32"
          />
        </div>
        <div className="min-w-0 flex-1 pb-1">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-brass">Interrogation room</p>
          <h2 id="room-title" className="mt-1 font-display text-2xl leading-tight text-cream sm:text-3xl">
            {suspect.name}
          </h2>
          <p className="text-sm text-fog">
            {suspect.role}, {suspect.age}
          </p>
          <blockquote className="mt-2 hidden border-l-2 border-blood/70 pl-3 font-display text-[15px] italic leading-snug text-cream/80 sm:block">
            &ldquo;{suspect.statement}&rdquo;
          </blockquote>
          <Composure revealed={revealedHere} total={suspect.secrets} />
        </div>
      </header>

      {/* Transcript */}
      <ol
        ref={logRef}
        className="scroll-thin relative min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6"
        aria-label={`Conversation with ${suspect.name}`}
      >
        {transcript.length === 0 && (
          <li className="mx-auto max-w-md py-6 text-center">
            <p className="font-display text-lg italic text-cream/90">
              {suspect.name.split(' ')[0]} sits across the table, waiting.
            </p>
            <p className="mt-2 text-sm text-fog">
              Ask anything in your own words, tap a suggested question, or lay a piece of evidence on the table.
            </p>
          </li>
        )}
        {transcript.map((m) => (
          <Line key={m.id} m={m} suspect={suspect} clue={m.revealed ? byId.get(m.revealed) : undefined} presented={m.presented ? byId.get(m.presented) : undefined} onOpenClue={onOpenClue} />
        ))}
      </ol>

      {/* Screen reader announcement of each finished answer. */}
      <p className="sr-only" aria-live="polite">
        {lastSuspectMsg && !pending ? `${suspect.name}: ${lastSuspectMsg.text}` : ''}
      </p>

      {/* Controls */}
      <div className="relative border-t border-line/60 bg-ink/60 px-4 pb-4 pt-3 sm:px-6">
        {voiceActive ? null : (
          <>
            {suggestions.length > 0 && !state.verdict && (
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1 scroll-thin" role="group" aria-label="Suggested questions">
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => void send(s.prompt)}
                    className="shrink-0 rounded-full border border-line bg-ink-3 px-3 py-1.5 text-left text-[13px] text-cream/90 transition-colors hover:border-brass/60 hover:text-cream disabled:opacity-40"
                  >
                    {s.prompt}
                  </button>
                ))}
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send(draft);
              }}
              className="flex items-center gap-2"
            >
              <label htmlFor="question" className="sr-only">
                Ask {suspect.name} a question
              </label>
              <input
                ref={inputRef}
                id="question"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                maxLength={400}
                autoComplete="off"
                disabled={questionsLeft === 0 || Boolean(state.verdict)}
                placeholder={questionsLeft === 0 ? `${suspect.name.split(' ')[0]} has stopped talking.` : `Ask ${suspect.name.split(' ')[0]} anything...`}
                className="min-w-0 flex-1 rounded-md border border-line bg-ink-3 px-3.5 py-2.5 font-type text-[15px] text-cream placeholder:text-fog/80 focus:border-brass/70 focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={disabled || !draft.trim()}
                className="rounded-md bg-cream px-4 py-2.5 font-sans text-sm font-semibold text-ink transition-[background-color,transform] hover:bg-paper active:scale-[0.97] disabled:opacity-40"
              >
                Ask
              </button>
            </form>
            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <button
                type="button"
                onClick={onPresent}
                disabled={disabled}
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-brass transition-colors hover:text-brass-2 disabled:opacity-40"
              >
                <KindIcon kind="object" />
                Present evidence
              </button>
              {questionsLeft != null && (
                <span className="text-xs tabular-nums text-fog">{questionsLeft} questions left with {suspect.name.split(' ')[0]}</span>
              )}
              {state.notice && <span className="text-xs text-brass/90">{state.notice}</span>}
            </div>
          </>
        )}
        {caps.voice && !state.verdict && (
          <VoiceLine key={suspect.id} c={c} suspect={suspect} game={game} seconds={caps.voiceSessionSeconds} onActiveChange={setVoiceActive} />
        )}
      </div>
    </section>
  );
}

function Composure({ revealed, total }: { revealed: number; total: number }) {
  if (!total) return null;
  const left = total - revealed;
  return (
    <div className="mt-3 flex items-center gap-2" aria-label={`Composure: ${left} of ${total} secrets still kept`}>
      <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-fog">Composure</span>
      <span className="flex gap-1" aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 w-5 rounded-full transition-colors duration-500 ${i < left ? 'bg-brass' : 'bg-blood/80'}`}
          />
        ))}
      </span>
      {left === 0 && <span className="text-[11px] italic text-blood-2">cracked</span>}
    </div>
  );
}

function Line({
  m,
  suspect,
  clue,
  presented,
  onOpenClue,
}: {
  m: Msg;
  suspect: PublicSuspect;
  clue?: PublicClue;
  presented?: PublicClue;
  onOpenClue: (clue: PublicClue) => void;
}) {
  if (m.role === 'detective') {
    return (
      <li className="flex animate-fade-up flex-col items-end">
        <span className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-fog">
          You{m.via === 'voice' ? ' (spoken)' : ''}
        </span>
        {presented && (
          <span className="mb-1.5 inline-flex items-center gap-1.5 rounded-sm bg-paper px-2 py-1 font-type text-[13px] text-paper-ink shadow">
            <KindIcon kind={presented.kind} />
            Lays down: {presented.title}
          </span>
        )}
        {m.text && <p className="max-w-[85%] rounded-md bg-smoke/80 px-3.5 py-2 font-type text-[15px] leading-relaxed text-cream">{m.text}</p>}
      </li>
    );
  }
  return (
    <li className="animate-fade-up">
      <span className="mb-1 block font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-brass">
        {suspect.name}
        {m.via === 'voice' ? ' (spoken)' : ''}
      </span>
      <p
        className={`max-w-[92%] font-display text-[17px] leading-relaxed ${m.error ? 'text-blood-2' : 'text-cream'} ${
          m.pending ? 'typed-caret' : ''
        }`}
      >
        {m.text || (m.pending ? <span className="sr-only">{suspect.name} is thinking</span> : null)}
      </p>
      {clue && (
        <button
          type="button"
          onClick={() => onOpenClue(clue)}
          className="mt-2 inline-flex animate-drop-in items-center gap-2 rounded-sm border border-blood/60 bg-blood/15 px-2.5 py-1 text-[13px] text-cream transition-colors hover:bg-blood/25"
        >
          <span className="pin size-2.5" aria-hidden />
          Pinned to the board: <span className="font-type">{clue.title}</span>
        </button>
      )}
    </li>
  );
}
