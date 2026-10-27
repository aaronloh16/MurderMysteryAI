'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Portrait } from '@/components/Portrait';
import { CloseButton, Modal } from '@/components/ui/Modal';
import type { PublicCase, PublicClue } from '@/lib/cases/types';
import type { Capabilities } from '@/lib/protocol';

import { Accusation, VerdictView } from './Accusation';
import { EvidenceBoard, EvidenceCard, KindIcon } from './Evidence';
import { Room } from './Room';
import { useGame } from './useGame';

type Panel = null | 'file' | 'board' | 'present' | 'accuse' | { clue: PublicClue };

export function Game({ c, caps }: { c: PublicCase; caps: Capabilities }) {
  const game = useGame(c);
  const { state, clues } = game;
  const [panel, setPanel] = useState<Panel>(null);
  const suspect = c.suspects.find((s) => s.id === state.active) ?? c.suspects[0]!;
  const briefingOpen = Boolean(state.hydrated) && !state.introSeen && !state.verdict;

  const openClue = (clue: PublicClue) => {
    game.markSeen([clue.id]);
    setPanel({ clue });
  };
  const openBoard = () => {
    setPanel('board');
  };
  const closeBoard = () => {
    game.markSeen(state.unseen);
    setPanel(null);
  };

  if (state.verdict) {
    return (
      <main id="main" className="relative min-h-dvh px-4 py-10 sm:py-16">
        <div className="blinds pointer-events-none fixed inset-0" aria-hidden />
        <VerdictView c={c} verdict={state.verdict} onReplay={game.reset} />
      </main>
    );
  }

  const unseenCount = state.unseen.length;

  return (
    <div className="flex h-dvh flex-col">
      {/* Top bar */}
      <header className="flex items-center gap-3 border-b border-line/70 bg-ink/90 px-3 py-2.5 sm:px-5">
        <Link href="/" className="group flex shrink-0 items-center gap-2 text-fog hover:text-cream" aria-label="Back to all cases">
          <svg viewBox="0 0 20 20" className="size-4" aria-hidden>
            <path d="M12 4l-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-base leading-tight text-cream sm:text-lg">{c.title}</h1>
          <p className="truncate text-[11px] text-fog">
            {c.era}
            <span className="mx-1.5 text-line">|</span>
            <ModeBadge caps={caps} engine={state.engine} />
          </p>
        </div>
        <nav className="flex shrink-0 items-center gap-1.5 sm:gap-2" aria-label="Case tools">
          <ToolButton onClick={() => setPanel('file')} label="Case file">
            <KindIcon kind="report" className="size-4" />
          </ToolButton>
          <ToolButton onClick={openBoard} label={`Evidence, ${clues.length} pinned`} className="lg:hidden" badge={unseenCount || undefined}>
            <KindIcon kind="object" className="size-4" />
          </ToolButton>
          <button
            type="button"
            onClick={() => setPanel('accuse')}
            className="rounded-md bg-blood px-3 py-1.5 font-sans text-[13px] font-semibold text-cream shadow-[0_0_0_1px_rgb(0_0_0/0.4)] transition-[background-color,transform] hover:bg-blood-2 active:scale-[0.97] sm:px-4"
          >
            Accuse
          </button>
        </nav>
      </header>

      <main id="main" className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[auto_minmax(0,1fr)] gap-3 lg:grid-rows-1 p-3 lg:grid-cols-[15rem_minmax(0,1fr)_21rem] lg:gap-4 lg:p-4 xl:grid-cols-[16rem_minmax(0,1fr)_25rem]">
        {/* Suspect roster: a strip on small screens, a column on large ones. */}
        <nav aria-label="Suspects" className="min-h-0">
          <h2 className="sr-only">Suspects</h2>
          <ul className="scroll-thin flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-2.5 lg:overflow-y-auto lg:pb-0">
            {c.suspects.map((s) => {
              const active = s.id === suspect.id;
              const revealed = Object.values(state.earned).filter((cl) => cl.sourceSuspectId === s.id).length;
              const talked = (state.transcripts[s.id] ?? []).length > 0;
              return (
                <li key={s.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => game.select(s.id)}
                    aria-current={active ? 'true' : undefined}
                    className={`group flex w-full items-center gap-3 rounded-md border p-1.5 pr-3 text-left transition-colors lg:p-2 ${
                      active ? 'border-brass/70 bg-ink-3' : 'border-transparent hover:border-line hover:bg-ink-2'
                    }`}
                  >
                    <Portrait
                      spec={s.portrait}
                      pressure={s.secrets ? revealed / s.secrets : 0}
                      className={`h-14 w-11 shrink-0 rounded-[2px] transition-[filter] lg:h-16 lg:w-[3.2rem] ${active ? '' : 'grayscale-[0.7] group-hover:grayscale-0'}`}
                    />
                    <span className="min-w-0">
                      <span className={`block truncate font-display text-[15px] leading-tight ${active ? 'text-cream' : 'text-cream/80'}`}>{s.name}</span>
                      <span className="block truncate text-[11px] text-fog">{s.role}</span>
                      <span className="mt-0.5 hidden text-[10px] uppercase tracking-[0.14em] text-fog/90 lg:block">
                        {!talked ? 'Not yet questioned' : revealed === s.secrets && s.secrets > 0 ? 'Cracked' : `${revealed}/${s.secrets} secrets out`}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 hidden rounded-md border border-line/60 p-3 lg:block">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-fog">Victim</p>
            <p className="mt-1 font-display text-[15px] text-cream">{c.victim.name}</p>
            <p className="mt-1 text-xs leading-relaxed text-fog">{c.victim.description}</p>
          </div>
        </nav>

        <Room c={c} game={game} suspect={suspect} caps={caps} onPresent={() => setPanel('present')} onOpenClue={openClue} />

        <aside className="hidden min-h-0 lg:flex">
          <div className="flex min-h-0 w-full flex-col">
            <EvidenceBoard clues={clues} suspects={c.suspects} unseen={state.unseen} total={c.totalClues} onOpen={openClue} />
          </div>
        </aside>
      </main>

      {/* Briefing */}
      <Modal open={briefingOpen} onClose={game.introSeen} label="Case briefing" className="[--w:40rem]">
        <CaseFile c={c} onClose={game.introSeen} first />
      </Modal>
      <Modal open={panel === 'file'} onClose={() => setPanel(null)} label="Case file" className="[--w:40rem]">
        <CaseFile c={c} onClose={() => setPanel(null)} />
      </Modal>

      {/* Mobile evidence board */}
      <Modal open={panel === 'board'} onClose={closeBoard} label="Evidence board" className="[--w:36rem]">
        <div className="flex max-h-[88dvh] flex-col rounded-md border border-line bg-ink-2 p-4">
          <div className="-mr-2 -mt-2 flex justify-end">
            <CloseButton onClick={closeBoard} />
          </div>
          <EvidenceBoard clues={clues} suspects={c.suspects} unseen={state.unseen} total={c.totalClues} onOpen={openClue} />
        </div>
      </Modal>

      {/* Present evidence */}
      <Modal open={panel === 'present'} onClose={() => setPanel(null)} label="Present evidence" className="[--w:44rem]">
        <div className="flex max-h-[88dvh] flex-col rounded-md border border-line bg-ink-2">
          <header className="flex items-start justify-between gap-3 border-b border-line/70 px-5 py-4">
            <div>
              <h2 className="font-display text-xl text-cream">Lay evidence on the table</h2>
              <p className="mt-0.5 text-sm text-fog">Watch how {suspect.name.split(' ')[0]} reacts. The right piece can break a story.</p>
            </div>
            <CloseButton onClick={() => setPanel(null)} />
          </header>
          <ul className="cork scroll-thin grid min-h-0 grid-cols-1 gap-4 overflow-y-auto p-5 sm:grid-cols-2">
            {clues.map((cl) => (
              <li key={cl.id}>
                <EvidenceCard
                  clue={cl}
                  source={cl.sourceSuspectId ? c.suspects.find((s) => s.id === cl.sourceSuspectId) : undefined}
                  onOpen={() => {
                    setPanel(null);
                    void game.ask(suspect.id, '', cl.id);
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      </Modal>

      {/* Clue detail */}
      <Modal open={typeof panel === 'object' && panel !== null} onClose={() => setPanel(null)} label="Evidence detail" className="[--w:32rem]">
        {typeof panel === 'object' && panel !== null && (
          <article className="paper relative rounded-sm px-6 pb-6 pt-7 shadow-2xl">
            <span className="pin absolute left-1/2 top-2 -translate-x-1/2" aria-hidden />
            <div className="absolute right-2 top-2">
              <CloseButton onClick={() => setPanel(null)} dark />
            </div>
            <p className="flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-paper-ink/60">
              <KindIcon kind={panel.clue.kind} />
              {panel.clue.kind}
              {panel.clue.sourceSuspectId && <> · from {c.suspects.find((s) => s.id === panel.clue.sourceSuspectId)?.name}</>}
            </p>
            <h2 className="mt-2 font-type text-2xl leading-tight text-paper-ink">{panel.clue.title}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-paper-ink/90">{panel.clue.detail}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  const id = panel.clue.id;
                  setPanel(null);
                  void game.ask(suspect.id, '', id);
                }}
                className="rounded-md bg-paper-ink px-4 py-2 text-sm font-semibold text-paper"
              >
                Show it to {suspect.name.split(' ')[0]}
              </button>
            </div>
          </article>
        )}
      </Modal>

      <Modal open={panel === 'accuse'} onClose={() => setPanel(null)} label="Make an accusation" className="[--w:56rem]">
        <Accusation
          c={c}
          clues={clues}
          discovered={game.discovered}
          onClose={() => setPanel(null)}
          onVerdict={(v) => {
            setPanel(null);
            game.setVerdict(v);
            window.scrollTo({ top: 0 });
          }}
        />
      </Modal>
    </div>
  );
}

function ToolButton({
  onClick,
  label,
  children,
  className = '',
  badge,
}: {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
  className?: string;
  badge?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={badge ? `${label}, ${badge} new` : label}
      title={label}
      className={`relative grid size-9 place-items-center rounded-md border border-line text-cream/85 transition-colors hover:border-cream/50 hover:text-cream ${className}`}
    >
      {children}
      {badge ? (
        <span className="absolute -right-1.5 -top-1.5 grid min-w-4 place-items-center rounded-full bg-blood px-1 text-[10px] font-semibold tabular-nums text-cream">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

function ModeBadge({ caps, engine }: { caps: Capabilities; engine: 'live' | 'scripted' | null }) {
  const live = caps.mode === 'live' && engine !== 'scripted';
  return (
    <span className={live ? 'text-brass' : 'text-fog'}>
      {live ? (caps.voice ? 'Live AI suspects, voice beta' : 'Live AI suspects') : 'Demo mode: scripted suspects'}
    </span>
  );
}

function CaseFile({ c, onClose, first = false }: { c: PublicCase; onClose: () => void; first?: boolean }) {
  return (
    <article className="paper relative max-h-[90dvh] overflow-y-auto rounded-sm px-6 pb-7 pt-8 shadow-2xl sm:px-9">
      <span className="stamp absolute right-4 top-4 rotate-[-8deg] text-[10px] text-blood sm:right-5 sm:top-5 sm:text-xs" aria-hidden>
        Confidential
      </span>
      {!first && (
        <div className="absolute left-2 top-2">
          <CloseButton onClick={onClose} dark />
        </div>
      )}
      <p className="pr-28 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-paper-ink/60 sm:pr-32">Case file · {c.era}</p>
      <h2 className="mt-2 pr-24 font-display text-3xl leading-tight text-paper-ink">{c.title}</h2>
      <p className="mt-1 text-sm text-paper-ink/75">{c.location}</p>
      <div className="mt-5 space-y-3 font-type text-[15px] leading-relaxed text-paper-ink">
        {c.briefing.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <h3 className="mt-6 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-paper-ink/60">Persons of interest</h3>
      <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {c.suspects.map((s) => (
          <li key={s.id} className="flex gap-3">
            <Portrait spec={s.portrait} className="h-16 w-[3.2rem] shrink-0 rounded-[2px]" />
            <div className="min-w-0">
              <p className="font-display text-[15px] leading-tight text-paper-ink">{s.name}</p>
              <p className="text-xs text-paper-ink/70">{s.role}</p>
              <p className="mt-0.5 text-xs leading-snug text-paper-ink/85">{s.tagline}</p>
            </div>
          </li>
        ))}
      </ul>
      {first && (
        <div className="mt-7 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            autoFocus
            className="rounded-md bg-paper-ink px-5 py-2.5 text-sm font-semibold text-paper transition-transform active:scale-[0.97]"
          >
            Start the interrogations
          </button>
        </div>
      )}
    </article>
  );
}
