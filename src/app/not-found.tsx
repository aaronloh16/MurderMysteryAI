import Link from 'next/link';

export default function NotFound() {
  return (
    <main id="main" className="grid min-h-dvh place-items-center px-6">
      <div className="paper max-w-md rotate-[-1deg] rounded-sm px-8 py-10 text-center shadow-2xl">
        <p className="stamp mx-auto inline-block rotate-[-6deg] text-sm text-blood">No record</p>
        <h1 className="mt-5 font-display text-3xl text-paper-ink">This file was never opened.</h1>
        <p className="mt-2 font-type text-sm text-paper-ink/80">The precinct has no case at this address.</p>
        <Link href="/" className="mt-6 inline-block rounded-md bg-paper-ink px-5 py-2.5 text-sm font-semibold text-paper">
          Back to the case files
        </Link>
      </div>
    </main>
  );
}
