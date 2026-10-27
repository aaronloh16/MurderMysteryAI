'use client';

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ background: '#0c0b0a', color: '#efe7d6', fontFamily: 'Georgia, serif', display: 'grid', placeItems: 'center', minHeight: '100vh', margin: 0 }}>
        <main style={{ textAlign: 'center', padding: 24 }}>
          <h1 style={{ fontSize: 28 }}>The lights went out in the precinct.</h1>
          <button type="button" onClick={reset} style={{ marginTop: 16, padding: '10px 20px', background: '#efe7d6', color: '#0c0b0a', border: 0, borderRadius: 6, cursor: 'pointer' }}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
