'use client';

import type { PropId } from '../SceneController';

export interface PropProps {
  id: PropId;
  state: 'idle' | 'animating';
  position: { x: string; y: string };
  onClick: (id: PropId) => void;
  ariaLabel: string;
  reducedMotion?: boolean;
}

const PROP_ANIM: Record<PropId, string> = {
  'chair':        'anim-chair-rock',
  'vinyl-record': 'anim-record-spin',
  'shoe':         'anim-shoe-tap',
};

function ChairSVG() {
  return (
    <svg width="44" height="52" viewBox="0 0 44 52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Back legs */}
      <rect x="6" y="28" width="5" height="22" rx="2" fill="#8B6914" stroke="#1a1a1a" strokeWidth="2" />
      <rect x="33" y="28" width="5" height="22" rx="2" fill="#8B6914" stroke="#1a1a1a" strokeWidth="2" />
      {/* Seat */}
      <rect x="4" y="24" width="36" height="8" rx="3" fill="#d4a017" stroke="#1a1a1a" strokeWidth="2.5" />
      {/* Chair back */}
      <rect x="4" y="4" width="36" height="22" rx="3" fill="#d4a017" stroke="#1a1a1a" strokeWidth="2.5" />
      {/* Back slats */}
      <line x1="14" y1="6" x2="14" y2="24" stroke="#8B6914" strokeWidth="2" />
      <line x1="22" y1="6" x2="22" y2="24" stroke="#8B6914" strokeWidth="2" />
      <line x1="30" y1="6" x2="30" y2="24" stroke="#8B6914" strokeWidth="2" />
      {/* Front legs */}
      <rect x="6" y="32" width="5" height="18" rx="2" fill="#8B6914" stroke="#1a1a1a" strokeWidth="2" />
      <rect x="33" y="32" width="5" height="18" rx="2" fill="#8B6914" stroke="#1a1a1a" strokeWidth="2" />
    </svg>
  );
}

function VinylRecordSVG() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Outer record */}
      <circle cx="24" cy="24" r="22" fill="#1a1a1a" stroke="#1a1a1a" strokeWidth="2" />
      {/* Grooves */}
      <circle cx="24" cy="24" r="18" fill="none" stroke="#333" strokeWidth="1" />
      <circle cx="24" cy="24" r="14" fill="none" stroke="#333" strokeWidth="1" />
      <circle cx="24" cy="24" r="10" fill="none" stroke="#333" strokeWidth="1" />
      {/* Label */}
      <circle cx="24" cy="24" r="8" fill="#e74c3c" stroke="#1a1a1a" strokeWidth="1.5" />
      {/* Label text lines */}
      <line x1="18" y1="22" x2="30" y2="22" stroke="white" strokeWidth="1" />
      <line x1="19" y1="25" x2="29" y2="25" stroke="white" strokeWidth="1" />
      {/* Center hole */}
      <circle cx="24" cy="24" r="2" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
      {/* Shine */}
      <path d="M10 14 Q14 10 18 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}

function ShoeSVG() {
  return (
    <svg width="52" height="36" viewBox="0 0 52 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Sole */}
      <path d="M4 28 Q4 34 14 34 L44 34 Q50 34 50 28 L50 26 Q50 22 44 22 L40 22 L40 28 Z" fill="#1a1a1a" stroke="#1a1a1a" strokeWidth="1.5" />
      {/* Midsole */}
      <path d="M6 26 L44 26 Q48 26 48 24 L48 22 Q48 20 44 20 L8 20 Q4 20 4 24 Z" fill="#ecf0f1" stroke="#1a1a1a" strokeWidth="1.5" />
      {/* Upper */}
      <path d="M8 20 Q8 8 18 6 L36 6 Q44 6 46 14 L46 20 Z" fill="#e74c3c" stroke="#1a1a1a" strokeWidth="2.5" />
      {/* Toe cap */}
      <path d="M8 20 Q6 14 12 10 Q16 8 20 8 L20 20 Z" fill="#c0392b" stroke="#1a1a1a" strokeWidth="1.5" />
      {/* Laces */}
      <line x1="22" y1="10" x2="38" y2="10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="13" x2="38" y2="13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="16" x2="38" y2="16" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      {/* Lace eyelets */}
      <circle cx="22" cy="10" r="1.5" fill="#1a1a1a" />
      <circle cx="22" cy="13" r="1.5" fill="#1a1a1a" />
      <circle cx="22" cy="16" r="1.5" fill="#1a1a1a" />
      <circle cx="38" cy="10" r="1.5" fill="#1a1a1a" />
      <circle cx="38" cy="13" r="1.5" fill="#1a1a1a" />
      <circle cx="38" cy="16" r="1.5" fill="#1a1a1a" />
      {/* Swoosh-like stripe */}
      <path d="M14 18 Q22 12 34 14" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

const PROP_SVG: Record<PropId, () => React.ReactElement> = {
  'chair':        () => <ChairSVG />,
  'vinyl-record': () => <VinylRecordSVG />,
  'shoe':         () => <ShoeSVG />,
};

export default function Prop({
  id,
  state,
  position,
  onClick,
  ariaLabel,
  reducedMotion = false,
}: PropProps) {
  const animClass = !reducedMotion ? PROP_ANIM[id] : '';

  return (
    <button
      aria-label={ariaLabel}
      onClick={() => onClick(id)}
      className={`absolute cursor-pointer bg-transparent border-none p-0 ${animClass}`}
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
      data-prop-id={id}
      data-state={state}
    >
      {PROP_SVG[id]()}
    </button>
  );
}
