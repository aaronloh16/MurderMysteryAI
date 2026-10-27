'use client';

import { useEffect, useRef } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  /** Accessible name. */
  label: string;
  children: React.ReactNode;
  className?: string;
  /** Prevent closing with Escape or the backdrop (used mid-accusation). */
  locked?: boolean;
}

/**
 * Native <dialog> for free focus trapping, Escape handling, inert background
 * and correct screen reader semantics.
 */
export function Modal({ open, onClose, label, children, className = '', locked = false }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      onCancel={(e) => {
        e.preventDefault();
        if (!locked) onClose();
      }}
      onClick={(e) => {
        if (!locked && e.target === e.currentTarget) onClose();
      }}
      className={`m-auto max-h-[92dvh] w-[min(100vw-1.5rem,var(--w,42rem))] overflow-visible bg-transparent p-0 text-cream backdrop:bg-transparent open:animate-fade-up ${className}`}
    >
      {open ? children : null}
    </dialog>
  );
}

export function CloseButton({ onClick, label = 'Close', dark = false }: { onClick: () => void; label?: string; dark?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`grid size-9 place-items-center rounded-full transition-colors ${
        dark ? 'text-paper-ink/70 hover:bg-paper-ink/10 hover:text-paper-ink' : 'text-fog hover:bg-white/10 hover:text-cream'
      }`}
    >
      <svg viewBox="0 0 20 20" className="size-4" aria-hidden>
        <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </button>
  );
}
