'use client';

import type { CharacterId } from '../SceneController';

export interface CharacterProps {
  id: CharacterId;
  state: 'idle' | 'animating' | 'paused';
  position: { x: string; y: string };
  size: number;
  onClick: (id: CharacterId) => void;
  ariaLabel: string;
  hidden?: boolean;
  reducedMotion?: boolean;
}

const IDLE_ANIM: Record<CharacterId, string> = {
  'guitar-girl':       'anim-guitar-strum',
  'tree-boy':          'anim-tree-plant',
  'dog':               'anim-dog-bounce',
  'software-engineer': 'anim-type-tap',
  'painter':           'anim-brush-stroke',
  'basketball-woman':  'anim-ball-dribble',
};

function GuitarGirlSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Head */}
      <circle cx="32" cy="12" r="10" fill="#f5c842" stroke="#1a1a1a" strokeWidth="2.5" />
      {/* Hair */}
      <ellipse cx="32" cy="6" rx="10" ry="5" fill="#c0392b" stroke="#1a1a1a" strokeWidth="2" />
      {/* Body */}
      <rect x="22" y="22" width="20" height="22" rx="4" fill="#e67e22" stroke="#1a1a1a" strokeWidth="2.5" />
      {/* Guitar body */}
      <ellipse cx="38" cy="46" rx="9" ry="11" fill="#d4a017" stroke="#1a1a1a" strokeWidth="2" />
      <ellipse cx="38" cy="46" rx="5" ry="6" fill="#b8860b" stroke="#1a1a1a" strokeWidth="1.5" />
      {/* Guitar neck */}
      <rect x="28" y="30" width="4" height="18" rx="2" fill="#8B6914" stroke="#1a1a1a" strokeWidth="1.5" />
      {/* Strings */}
      <line x1="30" y1="32" x2="30" y2="46" stroke="#1a1a1a" strokeWidth="0.8" />
      <line x1="32" y1="32" x2="32" y2="46" stroke="#1a1a1a" strokeWidth="0.8" />
      {/* Legs */}
      <rect x="24" y="43" width="7" height="16" rx="3" fill="#e67e22" stroke="#1a1a1a" strokeWidth="2" />
      <rect x="33" y="43" width="7" height="16" rx="3" fill="#e67e22" stroke="#1a1a1a" strokeWidth="2" />
      {/* Shoes */}
      <ellipse cx="27" cy="60" rx="5" ry="3" fill="#1a1a1a" />
      <ellipse cx="37" cy="60" rx="5" ry="3" fill="#1a1a1a" />
    </svg>
  );
}

function TreeBoySVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Head */}
      <circle cx="32" cy="12" r="10" fill="#f5c842" stroke="#1a1a1a" strokeWidth="2.5" />
      {/* Hat */}
      <rect x="22" y="4" width="20" height="6" rx="2" fill="#2ecc71" stroke="#1a1a1a" strokeWidth="2" />
      {/* Body */}
      <rect x="22" y="22" width="20" height="22" rx="4" fill="#27ae60" stroke="#1a1a1a" strokeWidth="2.5" />
      {/* Shovel */}
      <rect x="44" y="20" width="4" height="28" rx="2" fill="#8B6914" stroke="#1a1a1a" strokeWidth="1.5" />
      <rect x="40" y="44" width="12" height="8" rx="2" fill="#95a5a6" stroke="#1a1a1a" strokeWidth="1.5" />
      {/* Small tree */}
      <polygon points="14,44 20,28 26,44" fill="#27ae60" stroke="#1a1a1a" strokeWidth="2" />
      <rect x="18" y="44" width="4" height="8" rx="1" fill="#8B6914" stroke="#1a1a1a" strokeWidth="1.5" />
      {/* Legs */}
      <rect x="24" y="43" width="7" height="16" rx="3" fill="#27ae60" stroke="#1a1a1a" strokeWidth="2" />
      <rect x="33" y="43" width="7" height="16" rx="3" fill="#27ae60" stroke="#1a1a1a" strokeWidth="2" />
      {/* Shoes */}
      <ellipse cx="27" cy="60" rx="5" ry="3" fill="#1a1a1a" />
      <ellipse cx="37" cy="60" rx="5" ry="3" fill="#1a1a1a" />
    </svg>
  );
}

function DogSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Body */}
      <ellipse cx="32" cy="40" rx="18" ry="14" fill="#d4a574" stroke="#1a1a1a" strokeWidth="2.5" />
      {/* Spot */}
      <ellipse cx="36" cy="42" rx="6" ry="5" fill="#8B6914" stroke="#1a1a1a" strokeWidth="1.5" />
      {/* Head */}
      <circle cx="32" cy="20" r="13" fill="#d4a574" stroke="#1a1a1a" strokeWidth="2.5" />
      {/* Ears */}
      <ellipse cx="20" cy="16" rx="5" ry="8" fill="#b8860b" stroke="#1a1a1a" strokeWidth="2" />
      <ellipse cx="44" cy="16" rx="5" ry="8" fill="#b8860b" stroke="#1a1a1a" strokeWidth="2" />
      {/* Eyes */}
      <circle cx="26" cy="18" r="2.5" fill="#1a1a1a" />
      <circle cx="38" cy="18" r="2.5" fill="#1a1a1a" />
      <circle cx="27" cy="17" r="1" fill="white" />
      <circle cx="39" cy="17" r="1" fill="white" />
      {/* Nose */}
      <ellipse cx="32" cy="24" rx="3" ry="2" fill="#1a1a1a" />
      {/* Mouth */}
      <path d="M29 27 Q32 30 35 27" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Tail */}
      <path d="M50 38 Q58 28 54 22" stroke="#d4a574" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M50 38 Q58 28 54 22" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Legs */}
      <rect x="18" y="50" width="8" height="10" rx="4" fill="#d4a574" stroke="#1a1a1a" strokeWidth="2" />
      <rect x="38" y="50" width="8" height="10" rx="4" fill="#d4a574" stroke="#1a1a1a" strokeWidth="2" />
    </svg>
  );
}

function SoftwareEngineerSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Head */}
      <circle cx="32" cy="12" r="10" fill="#f5c842" stroke="#1a1a1a" strokeWidth="2.5" />
      {/* Glasses */}
      <rect x="22" y="10" width="8" height="6" rx="2" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
      <rect x="34" y="10" width="8" height="6" rx="2" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
      <line x1="30" y1="13" x2="34" y2="13" stroke="#1a1a1a" strokeWidth="1.5" />
      {/* Body */}
      <rect x="22" y="22" width="20" height="22" rx="4" fill="#3498db" stroke="#1a1a1a" strokeWidth="2.5" />
      {/* Laptop */}
      <rect x="14" y="40" width="28" height="16" rx="3" fill="#ecf0f1" stroke="#1a1a1a" strokeWidth="2" />
      <rect x="16" y="42" width="24" height="11" rx="2" fill="#2c3e50" stroke="#1a1a1a" strokeWidth="1" />
      {/* Screen content */}
      <line x1="18" y1="45" x2="28" y2="45" stroke="#2ecc71" strokeWidth="1" />
      <line x1="18" y1="48" x2="24" y2="48" stroke="#3498db" strokeWidth="1" />
      <line x1="18" y1="51" x2="26" y2="51" stroke="#2ecc71" strokeWidth="1" />
      {/* Arms */}
      <rect x="12" y="24" width="10" height="6" rx="3" fill="#f5c842" stroke="#1a1a1a" strokeWidth="2" />
      <rect x="42" y="24" width="10" height="6" rx="3" fill="#f5c842" stroke="#1a1a1a" strokeWidth="2" />
      {/* Legs */}
      <rect x="24" y="43" width="7" height="16" rx="3" fill="#2c3e50" stroke="#1a1a1a" strokeWidth="2" />
      <rect x="33" y="43" width="7" height="16" rx="3" fill="#2c3e50" stroke="#1a1a1a" strokeWidth="2" />
      {/* Shoes */}
      <ellipse cx="27" cy="60" rx="5" ry="3" fill="#1a1a1a" />
      <ellipse cx="37" cy="60" rx="5" ry="3" fill="#1a1a1a" />
    </svg>
  );
}

function PainterSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Head */}
      <circle cx="32" cy="12" r="10" fill="#f5c842" stroke="#1a1a1a" strokeWidth="2.5" />
      {/* Beret */}
      <ellipse cx="32" cy="5" rx="11" ry="6" fill="#9b59b6" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="38" cy="3" r="2" fill="#8e44ad" stroke="#1a1a1a" strokeWidth="1" />
      {/* Body */}
      <rect x="22" y="22" width="20" height="22" rx="4" fill="#e74c3c" stroke="#1a1a1a" strokeWidth="2.5" />
      {/* Palette */}
      <ellipse cx="46" cy="36" rx="10" ry="8" fill="#f39c12" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="42" cy="33" r="2.5" fill="#e74c3c" />
      <circle cx="48" cy="32" r="2.5" fill="#3498db" />
      <circle cx="50" cy="38" r="2.5" fill="#2ecc71" />
      <circle cx="44" cy="40" r="2.5" fill="#9b59b6" />
      {/* Brush */}
      <rect x="14" y="26" width="3" height="18" rx="1.5" fill="#8B6914" stroke="#1a1a1a" strokeWidth="1.5" />
      <ellipse cx="15.5" cy="44" rx="3" ry="5" fill="#e74c3c" stroke="#1a1a1a" strokeWidth="1" />
      {/* Legs */}
      <rect x="24" y="43" width="7" height="16" rx="3" fill="#e74c3c" stroke="#1a1a1a" strokeWidth="2" />
      <rect x="33" y="43" width="7" height="16" rx="3" fill="#e74c3c" stroke="#1a1a1a" strokeWidth="2" />
      {/* Shoes */}
      <ellipse cx="27" cy="60" rx="5" ry="3" fill="#1a1a1a" />
      <ellipse cx="37" cy="60" rx="5" ry="3" fill="#1a1a1a" />
    </svg>
  );
}

function BasketballWomanSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Head */}
      <circle cx="32" cy="12" r="10" fill="#f5c842" stroke="#1a1a1a" strokeWidth="2.5" />
      {/* Ponytail */}
      <path d="M40 8 Q50 4 48 14" stroke="#c0392b" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Body */}
      <rect x="22" y="22" width="20" height="22" rx="4" fill="#e67e22" stroke="#1a1a1a" strokeWidth="2.5" />
      {/* Jersey number */}
      <text x="32" y="36" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">23</text>
      {/* Basketball */}
      <circle cx="48" cy="30" r="10" fill="#e67e22" stroke="#1a1a1a" strokeWidth="2" />
      <path d="M38 30 Q48 24 58 30" stroke="#1a1a1a" strokeWidth="1.5" fill="none" />
      <path d="M38 30 Q48 36 58 30" stroke="#1a1a1a" strokeWidth="1.5" fill="none" />
      <line x1="48" y1="20" x2="48" y2="40" stroke="#1a1a1a" strokeWidth="1.5" />
      {/* Arm reaching */}
      <rect x="40" y="24" width="10" height="6" rx="3" fill="#f5c842" stroke="#1a1a1a" strokeWidth="2" />
      {/* Legs */}
      <rect x="24" y="43" width="7" height="16" rx="3" fill="#e67e22" stroke="#1a1a1a" strokeWidth="2" />
      <rect x="33" y="43" width="7" height="16" rx="3" fill="#e67e22" stroke="#1a1a1a" strokeWidth="2" />
      {/* Sneakers */}
      <ellipse cx="27" cy="60" rx="6" ry="3.5" fill="#e74c3c" stroke="#1a1a1a" strokeWidth="1.5" />
      <ellipse cx="37" cy="60" rx="6" ry="3.5" fill="#e74c3c" stroke="#1a1a1a" strokeWidth="1.5" />
    </svg>
  );
}

const CHARACTER_SVG: Record<CharacterId, (size: number) => React.ReactElement> = {
  'guitar-girl':       (s) => <GuitarGirlSVG size={s} />,
  'tree-boy':          (s) => <TreeBoySVG size={s} />,
  'dog':               (s) => <DogSVG size={s} />,
  'software-engineer': (s) => <SoftwareEngineerSVG size={s} />,
  'painter':           (s) => <PainterSVG size={s} />,
  'basketball-woman':  (s) => <BasketballWomanSVG size={s} />,
};

export default function Character({
  id,
  state,
  position,
  size,
  onClick,
  ariaLabel,
  hidden = false,
  reducedMotion = false,
}: CharacterProps) {
  if (hidden) return null;

  const animClass =
    !reducedMotion && state === 'idle' ? IDLE_ANIM[id] : '';

  return (
    <button
      aria-label={ariaLabel}
      onClick={() => onClick(id)}
      className={`absolute cursor-pointer bg-transparent border-none p-0 ${animClass}`}
      style={{
        left: position.x,
        top: position.y,
        width: size,
        height: size,
        transform: 'translate(-50%, -50%)',
      }}
      data-character-id={id}
      data-state={state}
    >
      {CHARACTER_SVG[id](size)}
    </button>
  );
}
