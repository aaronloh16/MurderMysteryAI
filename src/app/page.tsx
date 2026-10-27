import Link from 'next/link';

import { Portrait } from '@/components/Portrait';
import { CASES, toPublicCase } from '@/lib/cases';
import { capabilities } from '@/lib/config';

export const dynamic = 'force-dynamic';

const REPO = 'https://github.com/aaronloh16/MurderMysteryAI';

export default function Home() {
  const caps = capabilities();
  const cases = CASES.map(toPublicCase);
  const lineup = cases.flatMap((c) => c.suspects).slice(0, 5);
  const first = cases[0]!;

  return (
    <main id="main" className="relative overflow-x-clip">
      {/* Hero */}
      <section className="relative isolate flex min-h-[100svh] flex-col justify-end px-5 pb-10 pt-24 sm:px-10 sm:pb-16">
        <div className="blinds pointer-events-none absolute inset-0 -z-10" aria-hidden />
        <div className="vignette pointer-events-none absolute inset-0 -z-10" aria-hidden />

        {/* Police lineup */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[62svh] overflow-hidden" aria-hidden>
          <div className="absolute inset-0 opacity-40 [background:repeating-linear-gradient(to_bottom,transparent_0_47px,rgb(239_231_214/0.22)_47px_48px)]" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-2 px-4 sm:gap-6">
            {lineup.map((s, i) => (
              <div key={s.id} className="relative animate-fade-up" style={{ animationDelay: `${200 + i * 120}ms` }}>
                <Portrait spec={s.portrait} className="aspect-[4/5] h-[30svh] w-auto max-w-[22vw] opacity-80 sm:h-[38svh]" />
                <span className="absolute -bottom-0 left-1/2 -translate-x-1/2 translate-y-full pt-1 font-type text-xs text-fog">{i + 1}</span>
              </div>
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink to-transparent" />
        </div>

        <div className="mx-auto w-full max-w-5xl">
          <p className="animate-fade-up font-sans text-xs font-semibold uppercase tracking-[0.3em] text-brass">
            A voice-first detective game
          </p>
          <h1 className="mt-3 animate-fade-up font-display text-[clamp(3rem,10vw,7.5rem)] font-bold leading-[0.9] tracking-tight text-cream [animation-delay:80ms]">
            Murder <br className="sm:hidden" />
            Mystery <span className="italic text-blood-2">AI</span>
          </h1>
          <p className="mt-5 max-w-xl animate-fade-up text-lg leading-relaxed text-cream/85 [animation-delay:160ms] sm:text-xl">
            Every suspect is lying about something. Question them in your own words, lay evidence on the table, and name the
            killer before the trail goes cold.
          </p>
          <div className="mt-8 flex animate-fade-up flex-wrap items-center gap-3 [animation-delay:240ms]">
            <Link
              href={`/case/${first.id}`}
              className="rounded-md bg-cream px-6 py-3 font-sans text-[15px] font-semibold text-ink shadow-[0_10px_40px_rgb(239_231_214/0.15)] transition-[background-color,transform] hover:bg-paper active:scale-[0.98]"
            >
              Take the {first.minutes}-minute case
            </Link>
            <a href="#cases" className="rounded-md border border-line px-5 py-3 text-[15px] text-cream transition-colors hover:border-cream/60">
              Browse case files
            </a>
          </div>
          <p className="mt-5 flex animate-fade-up items-center gap-2 text-sm text-fog [animation-delay:320ms]">
            <span className={`inline-block size-2 rounded-full ${caps.mode === 'live' ? 'bg-brass shadow-[0_0_10px_var(--color-brass)]' : 'bg-fog/70'}`} aria-hidden />
            {caps.mode === 'live'
              ? caps.voice
                ? 'Live AI suspects are on duty. Voice interrogation is in beta.'
                : 'Live AI suspects are on duty. Type your questions.'
              : 'Demo mode: scripted suspects, no sign-up, no microphone needed.'}
          </p>
        </div>
      </section>

      {/* Cases */}
      <section id="cases" aria-labelledby="cases-title" className="mx-auto max-w-5xl scroll-mt-8 px-5 py-20 sm:px-10">
        <h2 id="cases-title" className="font-display text-4xl text-cream sm:text-5xl">
          Open cases
        </h2>
        <p className="mt-2 max-w-xl text-fog">Each case has one hidden truth. Every suspect plays from it, so lies stay consistent until your evidence breaks them.</p>
        <ul className="mt-10 grid gap-8 md:grid-cols-2">
          {cases.map((c, i) => (
            <li key={c.id} className="group relative" style={{ transform: `rotate(${i % 2 ? 0.6 : -0.6}deg)` }}>
              <span className="paper absolute -top-5 left-6 h-8 w-36 rounded-t-md" aria-hidden />
              <article className="paper relative rounded-sm rounded-tl-none p-6 shadow-[0_20px_50px_rgb(0_0_0/0.55)] transition-transform duration-300 ease-out group-hover:-translate-y-1 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-paper-ink/60">
                    Case {String(i + 1).padStart(3, '0')} · {c.difficulty}
                  </p>
                  <span className="stamp rotate-[-6deg] text-[11px] text-blood">Unsolved</span>
                </div>
                <h3 className="mt-3 font-display text-[1.7rem] leading-tight text-paper-ink">
                  <Link href={`/case/${c.id}`} className="after:absolute after:inset-0 focus-visible:outline-none">
                    {c.title}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-paper-ink/75">
                  {c.era} · about {c.minutes} minutes
                </p>
                <p className="mt-4 font-type text-[15px] leading-relaxed text-paper-ink/90">{c.subtitle}</p>
                <div className="mt-6 flex items-end justify-between">
                  <ul className="flex -space-x-2" aria-label={`${c.suspects.length} suspects`}>
                    {c.suspects.map((s) => (
                      <li key={s.id} title={s.name}>
                        <Portrait spec={s.portrait} className="h-14 w-11 rounded-[2px] ring-2 ring-paper" />
                      </li>
                    ))}
                  </ul>
                  <span className="font-sans text-sm font-semibold text-paper-ink transition-transform group-hover:translate-x-1">Open file &rarr;</span>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* How it plays */}
      <section aria-labelledby="how-title" className="border-y border-line/60 bg-ink-2/60">
        <div className="mx-auto max-w-5xl px-5 py-20 sm:px-10">
          <h2 id="how-title" className="font-display text-4xl text-cream">How it plays</h2>
          <ol className="mt-10 grid gap-10 sm:grid-cols-3">
            {[
              ['Interrogate', 'Ask anything, typed or spoken. Suspects answer in character, dodge, and slip.'],
              ['Confront', 'Lay a document on the table. The right piece of evidence breaks a story and pins new testimony to your board.'],
              ['Accuse', 'Name the killer, the motive, and the proof. You get one shot, and the papers will print whatever you decide.'],
            ].map(([title, body], i) => (
              <li key={title}>
                <span className="font-display text-5xl italic text-blood-2/90">{i + 1}</span>
                <h3 className="mt-2 font-display text-2xl text-cream">{title}</h3>
                <p className="mt-2 leading-relaxed text-fog">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Under the hood */}
      <section aria-labelledby="hood-title" className="mx-auto max-w-5xl px-5 py-20 sm:px-10">
        <div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 id="hood-title" className="font-display text-4xl text-cream">Under the hood</h2>
            <p className="mt-3 leading-relaxed text-fog">
              Free-form AI characters drift, contradict themselves and leak the ending. This game keeps them honest with structure
              instead of hope.
            </p>
            <a href={REPO} className="mt-5 inline-block text-sm font-medium text-brass underline-offset-4 hover:underline">
              Read the source on GitHub
            </a>
          </div>
          <dl className="grid gap-6 sm:grid-cols-2">
            {[
              ['One hidden truth', 'Each case is authored once and validated at build time. Every suspect, scripted or generated, plays from the same facts.'],
              ['Knowledge boundaries', 'A suspect only knows what their character would know. The solution never reaches the browser until you accuse.'],
              ['Tool-gated clues', 'Evidence reaches your board only through a reveal tool the server checks against what that suspect can actually give up.'],
              ['Voice and text, one memory', 'Speech-to-speech through AI Gateway realtime, typed questions through AI SDK 7, and a scripted engine when no key is set.'],
            ].map(([t, d]) => (
              <div key={t}>
                <dt className="font-display text-lg text-cream">{t}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-fog">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <footer className="border-t border-line/60 px-5 py-10 text-center text-sm text-fog sm:px-10">
        <p>
          Built by{' '}
          <a href="https://github.com/aaronloh16" className="text-cream underline-offset-4 hover:underline">
            Aaron Loh
          </a>
          . All characters, cases and portraits are fictional and drawn in code.
        </p>
      </footer>
    </main>
  );
}
