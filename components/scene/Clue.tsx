'use client';

import type { ClueId } from '../SceneController';

export interface ClueProps {
  id: ClueId;
  state: 'idle' | 'active';
  position: { x: string; y: string };
  onClick: (id: ClueId) => void;
  ariaLabel: string;
  reducedMotion?: boolean;
}

const CLUE_ANIM: Record<ClueId, string> = {
  'red-string': 'anim-clue-sway',
  'key':        'anim-clue-bob',
  'letter':     'anim-clue-drift',
  'bottle':     'anim-clue-bob',
};

function RedStringSVG() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Tangled red string */}
      <path d="M8 32 Q14 20 20 24 Q26 28 22 16 Q18 8 28 12 Q36 16 32 26" stroke="#e74c3c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M10 28 Q16 22 12 14 Q10 8 18 10" stroke="#c0392b" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="8" cy="32" r="2.5" fill="#e74c3c" stroke="#1a1a1a" strokeWidth="1" />
      <circle cx="32" cy="26" r="2.5" fill="#e74c3c" stroke="#1a1a1a" strokeWidth="1" />
    </svg>
  );
}

function KeySVG() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Key ring */}
      <circle cx="12" cy="14" r="8" fill="#f1c40f" stroke="#1a1a1a" strokeWidth="2.5" />
      <circle cx="12" cy="14" r="4" fill="none" stroke="#1a1a1a" strokeWidth="2" />
      {/* Key shaft */}
      <rect x="18" y="12" width="16" height="4" rx="2" fill="#f1c40f" stroke="#1a1a1a" strokeWidth="2" />
      {/* Key teeth */}
      <rect x="26" y="16" width="3" height="5" rx="1" fill="#f1c40f" stroke="#1a1a1a" strokeWidth="1.5" />
      <rect x="31" y="16" width="3" height="4" rx="1" fill="#f1c40f" stroke="#1a1a1a" strokeWidth="1.5" />
    </svg>
  );
}

function LetterSVG() {
  return (
    <svg width="40" height="32" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Envelope body */}
      <rect x="2" y="6" width="36" height="24" rx="3" fill="#fdf6e3" stroke="#1a1a1a" strokeWidth="2.5" />
      {/* Envelope flap */}
      <path d="M2 6 L20 18 L38 6" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinejoin="round" />
      {/* Envelope bottom fold lines */}
      <path d="M2 30 L14 18" stroke="#d4c5a0" strokeWidth="1.5" />
      <path d="M38 30 L26 18" stroke="#d4c5a0" strokeWidth="1.5" />
      {/* Wax seal */}
      <circle cx="20" cy="22" r="4" fill="#e74c3c" stroke="#1a1a1a" strokeWidth="1.5" />
      <text x="20" y="25" textAnchor="middle" fontSize="5" fill="white" fontWeight="bold">S</text>
    </svg>
  );
}

function BottleSVG() {
  return (
    <svg width="28" height="48" viewBox="0 0 28 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Bottle neck */}
      <rect x="10" y="2" width="8" height="10" rx="3" fill="#a8d8ea" stroke="#1a1a1a" strokeWidth="2" />
      {/* Bottle cap */}
      <rect x="9" y="1" width="10" height="5" rx="2" fill="#2c3e50" stroke="#1a1a1a" strokeWidth="1.5" />
      {/* Bottle body */}
      <path d="M8 12 Q4 16 4 22 L4 40 Q4 44 14 44 Q24 44 24 40 L24 22 Q24 16 20 12 Z" fill="#a8d8ea" stroke="#1a1a1a" strokeWidth="2.5" />
      {/* Liquid inside */}
      <path d="M6 30 Q6 42 14 42 Q22 42 22 30 Z" fill="#7ec8e3" opacity="0.7" />
      {/* Highlight */}
      <path d="M8 18 Q7 26 7 32" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      {/* Message scroll inside */}
      <rect x="10" y="22" width="8" height="10" rx="1" fill="#fdf6e3" stroke="#d4c5a0" strokeWidth="1" />
      <line x1="11" y1="25" x2="17" y2="25" stroke="#d4c5a0" strokeWidth="0.8" />
      <line x1="11" y1="27" x2="17" y2="27" stroke="#d4c5a0" strokeWidth="0.8" />
      <line x1="11" y1="29" x2="15" y2="29" stroke="#d4c5a0" strokeWidth="0.8" />
    </svg>
  );
}

const CLUE_SVG: Record<ClueId, () => React.ReactElement> = {
  'red-string': () => <RedStringSVG />,
  'key':        () => <KeySVG />,
  'letter':     () => <LetterSVG />,
  'bottle':     () => <BottleSVG />,
};

export default function Clue({
  id,
  state,
  position,
  onClick,
  ariaLabel,
  reducedMotion = false,
}: ClueProps) {
  const animClass = !reducedMotion ? CLUE_ANIM[id] : '';
  const opacity = state === 'active' ? 1.0 : 0.7;

  return (
    <button
      aria-label={ariaLabel}
      onClick={() => onClick(id)}
      className={`absolute cursor-pointer bg-transparent border-none p-0 ${animClass}`}
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        opacity,
      }}
      data-clue-id={id}
      data-state={state}
    >
      {CLUE_SVG[id]()}
    </button>
  );
}
