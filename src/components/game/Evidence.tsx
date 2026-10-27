'use client';

import type { ClueKind, PublicClue, PublicSuspect } from '@/lib/cases/types';

const KIND_LABEL: Record<ClueKind, string> = {
  report: 'Report',
  object: 'Physical',
  document: 'Document',
  testimony: 'Testimony',
  record: 'Record',
};

// Deterministic small tilt per card so the board looks pinned by hand.
function tilt(id: string) {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return ((Math.abs(h) % 7) - 3) * 0.6;
}

export function KindIcon({ kind, className = 'size-3.5' }: { kind: ClueKind; className?: string }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden>
      {kind === 'testimony' && <path {...common} d="M4 5h12v8H9l-4 3v-3H4z" />}
      {kind === 'report' && <path {...common} d="M6 3h6l3 3v11H6zM12 3v3h3M8 10h5M8 13h5" />}
      {kind === 'document' && <path {...common} d="M5 4h10v12H5zM8 8h4M8 11h4" />}
      {kind === 'object' && <path {...common} d="M10 3l6 3.5v7L10 17l-6-3.5v-7zM4 6.5l6 3.5 6-3.5M10 10v7" />}
      {kind === 'record' && <path {...common} d="M4 5h12v10H4zM4 9h12M8 5v10" />}
    </svg>
  );
}

interface CardProps {
  clue: PublicClue;
  source?: PublicSuspect;
  isNew?: boolean;
  onOpen?: () => void;
  selected?: boolean;
  compact?: boolean;
}

export function EvidenceCard({ clue, source, isNew, onOpen, selected, compact }: CardProps) {
  const t = tilt(clue.id);
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-pressed={selected}
      style={{ '--tilt': `${t}deg`, transform: `rotate(${t}deg)` } as React.CSSProperties}
      className={`paper group relative w-full animate-drop-in rounded-[3px] px-3 pb-3 pt-4 text-left shadow-[0_6px_14px_rgb(0_0_0/0.45)] transition-[transform,box-shadow] duration-200 ease-out hover:z-10 hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgb(0_0_0/0.55)] focus-visible:z-10 ${
        selected ? 'ring-2 ring-blood ring-offset-2 ring-offset-ink' : ''
      }`}
    >
      <span className="pin absolute left-1/2 top-1.5 -translate-x-1/2" aria-hidden />
      <span className="flex items-center gap-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-paper-ink/60">
        <KindIcon kind={clue.kind} />
        {KIND_LABEL[clue.kind]}
        {source && <span className="truncate normal-case tracking-normal">· {source.name.split(' ')[0]}</span>}
      </span>
      <span className="mt-1 block font-type text-[15px] leading-snug text-paper-ink">{clue.title}</span>
      {!compact && <span className="mt-1 block text-[13px] leading-snug text-paper-ink/80">{clue.summary}</span>}
      {isNew && (
        <span className="stamp absolute -right-1 -top-2 animate-stamp bg-paper text-[10px] text-blood" aria-label="New evidence">
          New
        </span>
      )}
    </button>
  );
}

interface BoardProps {
  clues: PublicClue[];
  suspects: PublicSuspect[];
  unseen: string[];
  total: number;
  onOpen: (clue: PublicClue) => void;
}

export function EvidenceBoard({ clues, suspects, unseen, total, onOpen }: BoardProps) {
  const byId = new Map(suspects.map((s) => [s.id, s]));
  return (
    <section aria-labelledby="board-title" className="flex min-h-0 flex-col">
      <header className="flex items-baseline justify-between px-1 pb-3">
        <h2 id="board-title" className="font-display text-xl italic text-cream">
          Evidence board
        </h2>
        <p className="font-sans text-xs tabular-nums text-fog">
          {clues.length} of {total} pinned
        </p>
      </header>
      <div className="cork scroll-thin min-h-0 flex-1 overflow-y-auto rounded-md p-4 shadow-[inset_0_2px_12px_rgb(0_0_0/0.6)]">
        {clues.length === 0 ? (
          <p className="py-10 text-center font-type text-sm text-paper/70">Nothing pinned yet.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {clues.map((clue) => (
              <li key={clue.id}>
                <EvidenceCard
                  clue={clue}
                  source={clue.sourceSuspectId ? byId.get(clue.sourceSuspectId) : undefined}
                  isNew={unseen.includes(clue.id)}
                  onOpen={() => onOpen(clue)}
                />
              </li>
            ))}
          </ul>
        )}
        <p className="mt-5 text-center font-sans text-[11px] text-paper/60">
          {total - clues.length > 0
            ? `${total - clues.length} more ${total - clues.length === 1 ? 'piece is' : 'pieces are'} out there. Keep asking.`
            : 'Every piece of evidence is on the board.'}
        </p>
      </div>
    </section>
  );
}
