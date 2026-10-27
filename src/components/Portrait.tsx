import { useId } from 'react';

import type { PortraitSpec, SkinTone } from '@/lib/cases/types';

/**
 * Procedural noir portraits, drawn in SVG from a small spec. No image assets.
 * Hard side light from the left, the right half of the face in shadow, a
 * spotlight behind the sitter, and a single accent colour per character.
 */

const SKIN: Record<SkinTone, { base: string; shade: string }> = {
  porcelain: { base: '#e8d2c2', shade: '#b89a88' },
  fair: { base: '#dfbea4', shade: '#ad8a71' },
  olive: { base: '#c7a07c', shade: '#94704f' },
  tan: { base: '#b68960', shade: '#835e3e' },
  brown: { base: '#8c5e40', shade: '#5f3d27' },
  deep: { base: '#5d3c29', shade: '#3c2519' },
};

interface Props {
  spec: PortraitSpec;
  /** Pressure from 0 (composed) to 1 (cracking). Tightens the brow and adds sweat. */
  pressure?: number;
  className?: string;
  title?: string;
}

export function Portrait({ spec, pressure = 0, className, title }: Props) {
  const raw = useId();
  const id = raw.replace(/[^a-zA-Z0-9]/g, '');
  const skin = SKIN[spec.skin];
  const hc = spec.hairColor;
  const p = Math.max(0, Math.min(1, pressure));

  return (
    <svg
      viewBox="0 0 160 200"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <radialGradient id={`${id}-spot`} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor={spec.accent} stopOpacity="0.32" />
          <stop offset="45%" stopColor="#1a1714" stopOpacity="1" />
          <stop offset="100%" stopColor="#070606" />
        </radialGradient>
        <linearGradient id={`${id}-light`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="48%" stopColor="#fff" stopOpacity="0" />
          <stop offset="52%" stopColor="#000" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={`${id}-cloth`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={spec.outfitColor} />
          <stop offset="100%" stopColor="#050505" />
        </linearGradient>
        <clipPath id={`${id}-face`}>
          <ellipse cx="80" cy="84" rx="26" ry="32" />
          <rect x="70" y="108" width="20" height="30" />
        </clipPath>
        <filter id={`${id}-tone`}>
          <feColorMatrix type="saturate" values="0.55" />
        </filter>
      </defs>

      <rect width="160" height="200" fill={`url(#${id}-spot)`} />

      <g filter={`url(#${id}-tone)`}>
        <BackHair style={spec.hair} color={hc} />

        {/* neck */}
        <path d="M70 108 L70 134 Q80 140 90 134 L90 108 Z" fill={skin.base} />
        <path d="M70 120 Q80 128 90 120 L90 108 L70 108 Z" fill={skin.shade} opacity="0.55" />

        <Outfit spec={spec} skin={skin.base} clothId={`${id}-cloth`} />

        {/* ears */}
        <ellipse cx="54" cy="88" rx="4.5" ry="7" fill={skin.base} />
        <ellipse cx="106" cy="88" rx="4.5" ry="7" fill={skin.shade} />
        {spec.earrings && (
          <>
            <circle cx="54" cy="97" r="2.6" fill={spec.accent} />
            <circle cx="106" cy="97" r="2.6" fill={spec.accent} opacity="0.7" />
          </>
        )}

        {/* head */}
        <ellipse cx="80" cy="84" rx="26" ry="32" fill={skin.base} />

        {/* features */}
        <g>
          {/* brows tighten and lift under pressure */}
          <path
            d={`M64 ${75 - p * 1.5} Q70 ${72 - p * 2} 76 ${75 + p * 1.2}`}
            stroke={hc === '#111' ? '#2a2420' : hc}
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M84 ${75 + p * 1.2} Q90 ${72 - p * 2} 96 ${75 - p * 1.5}`}
            stroke={hc === '#111' ? '#2a2420' : hc}
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
          />
          <ellipse cx="70" cy="83" rx="3.6" ry={2.2 - p * 0.4} fill="#1b1512" />
          <ellipse cx="90" cy="83" rx="3.6" ry={2.2 - p * 0.4} fill="#1b1512" />
          <circle cx="71" cy="82.4" r="0.8" fill="#fff" opacity="0.8" />
          <path d="M66 80.5 Q70 79 74 80.5" stroke={skin.shade} strokeWidth="1.2" fill="none" />
          <path d="M86 80.5 Q90 79 94 80.5" stroke={skin.shade} strokeWidth="1.2" fill="none" />
          <path d="M80 86 L77 97 Q80 99 83 97.5" stroke={skin.shade} strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path
            d={`M71 106 Q80 ${109 - p * 4} 89 106`}
            stroke={spec.lipstick ?? '#7a4a3c'}
            strokeWidth={spec.lipstick ? 3.4 : 2}
            fill="none"
            strokeLinecap="round"
          />
          {spec.mustache && (
            <path d="M70 102 Q75 98 80 101 Q85 98 90 102 Q85 104 80 102.5 Q75 104 70 102 Z" fill={hc} />
          )}
          {p > 0.55 && (
            <path d="M101 74 q2 4 0 6 q-2 -2 0 -6 Z" fill="#cfe3ef" opacity={0.4 + p * 0.4} />
          )}
        </g>

        {/* side light: right half of the face falls into shadow */}
        <g clipPath={`url(#${id}-face)`}>
          <rect x="40" y="40" width="80" height="110" fill={`url(#${id}-light)`} />
        </g>

        <FrontHair style={spec.hair} color={hc} />

        {spec.glasses && (
          <g stroke="#0c0b0a" strokeWidth="1.8" fill="rgb(200 220 230 / 0.12)">
            <rect x="61" y="77" width="16" height="12" rx="4" />
            <rect x="83" y="77" width="16" height="12" rx="4" />
            <path d="M77 82 Q80 80 83 82" fill="none" />
            <path d="M61 81 L54 79 M99 81 L106 79" fill="none" />
          </g>
        )}

        {spec.hat === 'fedora' && (
          <g>
            <path d="M54 62 C54 34 106 34 106 62 Z" fill="#1a1715" />
            <rect x="54" y="54" width="52" height="7" fill={spec.accent} opacity="0.85" />
            <ellipse cx="80" cy="63" rx="44" ry="8" fill="#141210" />
          </g>
        )}
        {spec.hat === 'cloche' && (
          <g>
            <path d="M50 78 C46 40 114 40 110 78 Q80 66 50 78 Z" fill={spec.outfitColor} />
            <path d="M52 72 Q80 62 108 72" stroke={spec.accent} strokeWidth="3" fill="none" />
          </g>
        )}
      </g>

      {/* vignette frame */}
      <rect width="160" height="200" fill="none" stroke="#000" strokeOpacity="0.5" strokeWidth="10" />
    </svg>
  );
}

function BackHair({ style, color }: { style: PortraitSpec['hair']; color: string }) {
  switch (style) {
    case 'bob':
      return <path d="M50 84 C46 46 114 46 110 84 L112 114 Q96 120 92 112 L68 112 Q64 120 48 114 Z" fill={color} />;
    case 'waves':
      return (
        <path
          d="M50 82 C44 42 116 42 110 82 C116 98 108 108 116 122 C120 136 108 146 100 140 L60 140 C52 146 40 136 44 122 C52 108 44 98 50 82 Z"
          fill={color}
        />
      );
    case 'long':
      return <path d="M50 84 C46 44 114 44 110 84 L114 156 L92 150 L68 150 L46 156 Z" fill={color} />;
    case 'bun':
      return <circle cx="80" cy="46" r="13" fill={color} />;
    default:
      return null;
  }
}

function FrontHair({ style, color }: { style: PortraitSpec['hair']; color: string }) {
  switch (style) {
    case 'short':
      return <path d="M54 80 C50 50 70 44 82 44 C98 44 110 54 106 80 C104 66 96 58 82 58 C66 58 58 66 54 80 Z" fill={color} />;
    case 'slick':
      return (
        <g>
          <path d="M54 78 C50 48 72 44 84 44 C100 44 110 54 106 78 C102 62 92 56 76 58 C64 60 58 66 54 78 Z" fill={color} />
          <path d="M66 52 C76 48 92 48 100 56" stroke="#fff" strokeOpacity="0.25" strokeWidth="1.4" fill="none" />
        </g>
      );
    case 'bob':
      return <path d="M54 82 C52 52 72 46 84 48 C98 50 108 58 106 82 C100 66 92 62 80 66 C70 62 60 68 54 82 Z" fill={color} />;
    case 'waves':
      return (
        <path
          d="M54 84 C50 52 70 46 84 48 C100 50 110 62 106 82 C102 70 96 64 90 64 C82 72 70 60 62 70 C58 74 56 78 54 84 Z"
          fill={color}
        />
      );
    case 'long':
      return <path d="M54 84 C52 52 70 48 80 48 C92 48 108 54 106 84 C102 66 90 58 80 56 C72 58 58 66 54 84 Z" fill={color} />;
    case 'bun':
      return <path d="M54 80 C52 54 70 50 80 50 C92 50 108 54 106 80 C102 66 92 60 80 60 C68 60 58 66 54 80 Z" fill={color} />;
    case 'bald':
      return <path d="M58 64 C66 52 94 52 102 64" stroke="#fff" strokeOpacity="0.12" strokeWidth="3" fill="none" />;
  }
}

function Outfit({ spec, skin, clothId }: { spec: PortraitSpec; skin: string; clothId: string }) {
  const body = 'M8 200 C10 160 34 142 66 134 L94 134 C126 142 150 160 152 200 Z';
  const cloth = `url(#${clothId})`;
  switch (spec.outfit) {
    case 'gown':
      return (
        <g>
          <path d="M14 200 C18 162 40 146 70 136 L90 136 C120 146 142 162 146 200 Z" fill={skin} />
          <path d="M20 200 C30 172 50 164 80 172 C110 164 130 172 140 200 Z" fill={cloth} />
          <path d="M46 168 L54 146 M114 168 L106 146" stroke={spec.accent} strokeWidth="2" />
          <path d="M66 148 Q80 160 94 148" stroke={spec.accent} strokeWidth="1.6" fill="none" opacity="0.8" />
        </g>
      );
    case 'turtleneck':
      return (
        <g>
          <path d={body} fill={cloth} />
          <path d="M64 120 Q80 130 96 120 L98 142 Q80 150 62 142 Z" fill={spec.outfitColor} />
          <path d="M64 128 Q80 136 96 128 M63 135 Q80 143 97 135" stroke="#000" strokeOpacity="0.35" fill="none" />
          <circle cx="80" cy="170" r="3" fill={spec.accent} opacity="0.7" />
        </g>
      );
    case 'uniform':
      return (
        <g>
          <path d={body} fill={cloth} />
          <path d="M66 134 L80 158 L94 134" fill="#d9d4c8" />
          <path d="M78 140 L80 170 L82 140 Z" fill="#111" />
          <rect x="26" y="152" width="22" height="6" rx="2" fill={spec.accent} />
          <rect x="112" y="152" width="22" height="6" rx="2" fill={spec.accent} />
          <path d="M104 172 l6 -4 l6 4 l-2 7 h-8 Z" fill={spec.accent} />
        </g>
      );
    case 'vest':
      return (
        <g>
          <path d={body} fill="#d8d2c4" />
          <path d="M40 200 C42 170 56 150 70 140 L80 176 L90 140 C104 150 118 170 120 200 Z" fill={cloth} />
          <path d="M72 138 L80 144 L88 138 L88 146 L80 142 L72 146 Z" fill="#111" />
          <circle cx="80" cy="184" r="1.8" fill={spec.accent} />
          <circle cx="80" cy="194" r="1.8" fill={spec.accent} />
        </g>
      );
    case 'cardigan':
      return (
        <g>
          <path d={body} fill={cloth} />
          <path d="M66 134 L80 176 L94 134 Z" fill={spec.accent} />
          <path d="M68 136 Q80 146 92 136" stroke="#fff" strokeOpacity="0.4" fill="none" />
        </g>
      );
    case 'blazer':
      return (
        <g>
          <path d={body} fill={cloth} />
          <path d="M66 134 L80 172 L94 134 Z" fill={spec.accent} />
          <path d="M66 134 L58 160 L74 156 L80 172 Z M94 134 L102 160 L86 156 L80 172 Z" fill="#000" opacity="0.28" />
        </g>
      );
    case 'suit':
    default:
      return (
        <g>
          <path d={body} fill={cloth} />
          <path d="M66 134 L80 176 L94 134 Z" fill="#e7e1d4" />
          <path d="M77 138 L80 172 L83 138 L80 135 Z" fill={spec.accent} />
          <path d="M66 134 L56 162 L74 156 L80 176 Z M94 134 L104 162 L86 156 L80 176 Z" fill="#000" opacity="0.3" />
        </g>
      );
  }
}
