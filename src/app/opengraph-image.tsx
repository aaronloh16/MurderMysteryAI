import { ImageResponse } from 'next/og';

export const alt = 'Murder Mystery AI: interrogate AI suspects by voice or text.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  const stripes = Array.from({ length: 9 }, (_, i) => i);
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '72px 80px',
          background: 'radial-gradient(ellipse at 75% 20%, #2b2723 0%, #0c0b0a 65%)',
          color: '#efe7d6',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {stripes.map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 520,
              top: -80 + i * 64,
              width: 900,
              height: 26,
              background: 'rgba(239,231,214,0.06)',
              transform: 'rotate(-8deg)',
            }}
          />
        ))}
        <div style={{ display: 'flex', fontSize: 26, letterSpacing: 8, color: '#c9a45c', textTransform: 'uppercase' }}>
          A voice-first detective game
        </div>
        <div style={{ display: 'flex', fontSize: 128, fontWeight: 700, lineHeight: 1, marginTop: 18 }}>
          Murder Mystery&nbsp;<span style={{ color: '#d0393f', fontStyle: 'italic' }}>AI</span>
        </div>
        <div style={{ display: 'flex', fontSize: 34, marginTop: 28, color: 'rgba(239,231,214,0.8)', maxWidth: 900 }}>
          Every suspect is lying about something. Talk to them.
        </div>
        <div style={{ display: 'flex', width: 220, height: 6, background: '#a3242a', marginTop: 40 }} />
      </div>
    ),
    size,
  );
}
