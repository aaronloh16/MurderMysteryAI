'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Portrait } from '@/components/Portrait';
import { CloseButton } from '@/components/ui/Modal';
import type { PublicCase, PublicClue } from '@/lib/cases/types';
import type { ApiError, Verdict } from '@/lib/protocol';

import { EvidenceCard } from './Evidence';

interface Props {
  c: PublicCase;
  clues: PublicClue[];
  discovered: string[];
  onClose: () => void;
  onVerdict: (v: Verdict) => void;
}

const STEPS = ['Who', 'Why', 'Proof'] as const;

/** Three-step accusation: the culprit, the motive, and up to three pieces of evidence. */
export function Accusation({ c, clues, discovered, onClose, onVerdict }: Props) {
  const [step, setStep] = useState(0);
  const [suspectId, setSuspectId] = useState<string | null>(null);
  const [motiveId, setMotiveId] = useState<string | null>(null);
  const [evidence, setEvidence] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accused = c.suspects.find((s) => s.id === suspectId);
  const canNext = (step === 0 && suspectId) || (step === 1 && motiveId) || (step === 2 && evidence.length > 0);

  const toggle = (id: string) =>
    setEvidence((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : prev.length >= 3 ? prev : [...prev, id]));

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/accuse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId: c.id, suspectId, motiveId, evidenceIds: evidence, discovered }),
      });
      const data = (await res.json()) as Verdict | ApiError;
      if (!res.ok || 'error' in data) throw new Error('error' in data ? data.error.message : 'Failed');
      onVerdict(data);
    } catch (e) {
      setError((e as Error).message || 'The DA did not pick up. Try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="paper relative flex max-h-[92dvh] flex-col overflow-hidden rounded-sm shadow-2xl">
      <header className="flex items-start justify-between gap-4 border-b border-paper-ink/15 px-5 pb-4 pt-5 sm:px-7">
        <div>
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-blood">Formal accusation</p>
          <h2 className="mt-1 font-display text-2xl text-paper-ink sm:text-3xl">
            {step === 0 ? 'Who killed ' + c.victim.name.split(' ')[0] + '?' : step === 1 ? 'Why did they do it?' : 'What proves it?'}
          </h2>
          <ol className="mt-3 flex gap-2" aria-label="Accusation steps">
            {STEPS.map((s, i) => (
              <li
                key={s}
                aria-current={i === step ? 'step' : undefined}
                className={`rounded-full px-2.5 py-0.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] ${
                  i === step ? 'bg-paper-ink text-paper' : i < step ? 'bg-paper-ink/15 text-paper-ink' : 'text-paper-ink/50'
                }`}
              >
                {i + 1}. {s}
              </li>
            ))}
          </ol>
        </div>
        <CloseButton onClick={onClose} dark label="Cancel accusation" />
      </header>

      <div className="scroll-thin min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7">
        {step === 0 && (
          <fieldset>
            <legend className="sr-only">Choose the killer</legend>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {c.suspects.map((s) => (
                <label
                  key={s.id}
                  className={`group cursor-pointer rounded-sm border-2 p-2 transition-colors ${
                    suspectId === s.id ? 'border-blood bg-blood/10' : 'border-transparent hover:border-paper-ink/25'
                  }`}
                >
                  <input type="radio" name="culprit" value={s.id} checked={suspectId === s.id} onChange={() => setSuspectId(s.id)} className="sr-only" />
                  <Portrait spec={s.portrait} className="aspect-[4/5] w-full rounded-[2px]" />
                  <span className="mt-2 block font-display text-[15px] leading-tight">{s.name}</span>
                  <span className="block text-xs text-paper-ink/70">{s.role}</span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <fieldset className="space-y-2.5">
            <legend className="mb-3 text-sm text-paper-ink/80">
              What drove <strong>{accused?.name}</strong> to it?
            </legend>
            {c.motives.map((m) => (
              <label
                key={m.id}
                className={`flex cursor-pointer items-start gap-3 rounded-sm border-2 px-4 py-3 transition-colors ${
                  motiveId === m.id ? 'border-blood bg-blood/10' : 'border-paper-ink/15 hover:border-paper-ink/35'
                }`}
              >
                <input type="radio" name="motive" value={m.id} checked={motiveId === m.id} onChange={() => setMotiveId(m.id)} className="mt-1 accent-[#a3242a]" />
                <span className="font-type text-[15px] leading-snug">{m.label}</span>
              </label>
            ))}
          </fieldset>
        )}

        {step === 2 && (
          <fieldset>
            <legend className="mb-4 text-sm text-paper-ink/80">
              Pick up to three pieces of evidence for the DA. <span className="tabular-nums">({evidence.length}/3)</span>
            </legend>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {clues.map((cl) => (
                <li key={cl.id} className="rounded-sm bg-paper-ink/80 p-2">
                  <EvidenceCard clue={cl} selected={evidence.includes(cl.id)} onOpen={() => toggle(cl.id)} />
                </li>
              ))}
            </ul>
          </fieldset>
        )}
        {error && (
          <p role="alert" className="mt-4 text-sm text-blood">
            {error}
          </p>
        )}
      </div>

      <footer className="flex items-center justify-between gap-3 border-t border-paper-ink/15 px-5 py-4 sm:px-7">
        <button
          type="button"
          onClick={() => (step === 0 ? onClose() : setStep(step - 1))}
          className="rounded-md px-3 py-2 text-sm font-medium text-paper-ink/80 hover:bg-paper-ink/10"
        >
          {step === 0 ? 'Keep investigating' : 'Back'}
        </button>
        {step < 2 ? (
          <button
            type="button"
            disabled={!canNext}
            onClick={() => setStep(step + 1)}
            className="rounded-md bg-paper-ink px-5 py-2.5 text-sm font-semibold text-paper transition-transform active:scale-[0.97] disabled:opacity-35"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            disabled={!canNext || submitting}
            onClick={() => void submit()}
            className="rounded-md bg-blood px-5 py-2.5 text-sm font-semibold text-cream transition-transform active:scale-[0.97] disabled:opacity-40"
          >
            {submitting ? 'Filing charges...' : `Accuse ${accused?.name.split(' ')[0] ?? ''}`}
          </button>
        )}
      </footer>
    </div>
  );
}

export function VerdictView({ c, verdict, onReplay }: { c: PublicCase; verdict: Verdict; onReplay: () => void }) {
  const culprit = c.suspects.find((s) => s.id === verdict.culprit.id);
  const other = verdict.correct ? null : 'The real killer was ' + verdict.culprit.name + '.';
  return (
    <article className="paper mx-auto w-full max-w-3xl animate-fade-up rounded-sm px-5 py-7 shadow-2xl sm:px-10 sm:py-10" aria-labelledby="headline">
      <header className="border-b-4 border-double border-paper-ink/70 pb-3 text-center">
        <p className="font-display text-3xl tracking-tight sm:text-5xl">{verdict.paper}</p>
        <p className="mt-1 flex justify-between font-sans text-[10px] uppercase tracking-[0.2em] text-paper-ink/70">
          <span>{c.era}</span>
          <span>Late edition</span>
        </p>
      </header>
      <h1 id="headline" className="mt-5 text-center font-display text-3xl font-bold uppercase leading-[1.05] sm:text-5xl">
        {verdict.headline}
      </h1>
      <div className="mt-6 grid gap-6 sm:grid-cols-[180px_1fr]">
        <figure className="mx-auto w-40 sm:w-full">
          {culprit && <Portrait spec={culprit.portrait} pressure={1} className="aspect-[4/5] w-full grayscale-[0.6]" />}
          <figcaption className="mt-1.5 text-center font-type text-xs text-paper-ink/80">{verdict.culprit.name}, in custody</figcaption>
        </figure>
        <div className="space-y-3 text-[15px] leading-relaxed">
          {other && <p className="font-semibold text-blood">You accused {verdict.accused.name}. {other}</p>}
          {verdict.truth.map((p, i) => (
            <p key={i} className={i === 0 ? 'first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-5xl first-letter:leading-none' : ''}>
              {p}
            </p>
          ))}
        </div>
      </div>
      <section className="mt-7 grid gap-4 border-t border-paper-ink/25 pt-5 sm:grid-cols-3" aria-label="Your score">
        <Score label="The killer" ok={verdict.culpritCorrect} />
        <Score label="The motive" ok={verdict.motiveCorrect} detail={verdict.motive} />
        <Score
          label="The proof"
          ok={verdict.evidenceScore >= verdict.evidenceNeeded}
          detail={`${verdict.evidenceScore} key ${verdict.evidenceScore === 1 ? 'piece' : 'pieces'} presented`}
        />
      </section>
      <p className="mt-6 text-center">
        <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-paper-ink/70">Rank</span>
        <span className="mt-1 block font-display text-2xl italic">
          <span aria-hidden className="mr-2 text-blood">
            {'★'.repeat(verdict.stars)}
            <span className="text-paper-ink/25">{'★'.repeat(3 - verdict.stars)}</span>
          </span>
          <span className="sr-only">{verdict.stars} of 3 stars: </span>
          {verdict.rank}
        </span>
      </p>
      <details className="mt-5 text-sm text-paper-ink/85">
        <summary className="cursor-pointer font-medium">The evidence that cracked it</summary>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {verdict.supportingEvidence.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </details>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={onReplay} className="rounded-md bg-paper-ink px-5 py-2.5 text-sm font-semibold text-paper">
          Reopen the case
        </button>
        <Link href="/#cases" className="rounded-md border-2 border-paper-ink/70 px-5 py-2 text-sm font-semibold text-paper-ink hover:bg-paper-ink/10">
          Another case
        </Link>
      </div>
    </article>
  );
}

function Score({ label, ok, detail }: { label: string; ok: boolean; detail?: string }) {
  return (
    <div className="text-center">
      <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-paper-ink/70">{label}</p>
      <p className={`mt-1 font-type text-lg ${ok ? 'text-paper-ink' : 'text-blood'}`}>{ok ? 'Solved' : 'Missed'}</p>
      {detail && <p className="mt-0.5 text-xs text-paper-ink/75">{detail}</p>}
    </div>
  );
}
