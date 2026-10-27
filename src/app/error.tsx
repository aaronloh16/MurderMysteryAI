'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main id="main" className="grid min-h-dvh place-items-center px-6">
      <div className="max-w-md text-center">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-blood-2">Something went wrong</p>
        <h1 className="mt-3 font-display text-3xl text-cream">The lights went out in the precinct.</h1>
        <p className="mt-3 text-sm text-fog">An unexpected error interrupted the investigation. Your progress is saved in this browser.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button type="button" onClick={reset} className="rounded-md bg-cream px-5 py-2.5 text-sm font-semibold text-ink">
            Try again
          </button>
          <Link href="/" className="rounded-md border border-line px-5 py-2.5 text-sm text-cream hover:border-cream/60">
            All cases
          </Link>
        </div>
      </div>
    </main>
  );
}
