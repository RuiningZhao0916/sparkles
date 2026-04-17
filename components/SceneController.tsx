'use client';

import { useState } from 'react';

// ─── Snoopy SVG (original flat-style beagle, Peanuts-inspired design) ─────────

function SnoopySVG({ isHolding }: { isHolding: boolean }) {
  return (
    <svg width="110" height="130" viewBox="0 0 110 130" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Body — white with black patch */}
      <ellipse cx="55" cy="88" rx="22" ry="26" fill="white" stroke="#1a1a1a" strokeWidth="2.5" />
      <ellipse cx="62" cy="96" rx="10" ry="12" fill="#1a1a1a" />

      {/* Head */}
      <ellipse cx="55" cy="52" rx="22" ry="20" fill="white" stroke="#1a1a1a" strokeWidth="2.5" />

      {/* Ears — long floppy black ears */}
      <ellipse cx="34" cy="56" rx="8" ry="18" fill="#1a1a1a" stroke="#1a1a1a" strokeWidth="1.5" transform="rotate(-10 34 56)" />
      <ellipse cx="76" cy="56" rx="8" ry="18" fill="#1a1a1a" stroke="#1a1a1a" strokeWidth="1.5" transform="rotate(10 76 56)" />

      {/* Eyes */}
      <circle cx="46" cy="48" r="3.5" fill="#1a1a1a" />
      <circle cx="64" cy="48" r="3.5" fill="#1a1a1a" />
      <circle cx="47" cy="47" r="1.2" fill="white" />
      <circle cx="65" cy="47" r="1.2" fill="white" />

      {/* Nose */}
      <ellipse cx="55" cy="56" rx="5" ry="3.5" fill="#1a1a1a" />

      {/* Smile */}
      <path d="M48 62 Q55 68 62 62" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Left arm — reaching down toward star */}
      <path d="M34 82 Q22 95 18 108" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Right arm — raised to hand off */}
      <path d="M76 82 Q88 72 92 62" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Legs */}
      <path d="M44 112 Q40 122 36 126" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M66 112 Q70 122 74 126" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Feet */}
      <ellipse cx="34" cy="127" rx="8" ry="3" fill="#1a1a1a" />
      <ellipse cx="76" cy="127" rx="8" ry="3" fill="#1a1a1a" />

      {/* Star being held — appears at right hand when isHolding */}
      {isHolding && (
        <text x="88" y="58" fontSize="22" textAnchor="middle">🌟</text>
      )}
    </svg>
  );
}

// ─── Star on the ground ───────────────────────────────────────────────────────

function StarOnGround() {
  return (
    <div
      className="absolute select-none pointer-events-none"
      style={{ left: '32%', top: '76%', fontSize: 28, transform: 'translate(-50%, -50%)' }}
      aria-hidden="true"
    >
      🌟
    </div>
  );
}

// ─── Dancing girl SVG (Sally-inspired: yellow hair, pink dress, arms out) ─────

function DancingGirlSVG({ isReceiving }: { isReceiving: boolean }) {
  return (
    <svg width="100" height="130" viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Head */}
      <circle cx="50" cy="22" r="18" fill="#f5c842" stroke="#1a1a1a" strokeWidth="2.5" />

      {/* Hair — big fluffy yellow */}
      <ellipse cx="50" cy="10" rx="18" ry="10" fill="#f5c842" stroke="#1a1a1a" strokeWidth="2" />
      <ellipse cx="32" cy="18" rx="7" ry="12" fill="#f5c842" stroke="#1a1a1a" strokeWidth="2" />
      <ellipse cx="68" cy="18" rx="7" ry="12" fill="#f5c842" stroke="#1a1a1a" strokeWidth="2" />

      {/* Eyes */}
      <circle cx="43" cy="20" r="3" fill="#1a1a1a" />
      <circle cx="57" cy="20" r="3" fill="#1a1a1a" />
      <circle cx="44" cy="19" r="1" fill="white" />
      <circle cx="58" cy="19" r="1" fill="white" />

      {/* Smile */}
      <path d="M43 28 Q50 34 57 28" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Dress body — pink */}
      <path d="M32 40 Q28 70 24 90 L76 90 Q72 70 68 40 Z" fill="#f48fb1" stroke="#1a1a1a" strokeWidth="2.5" />
      {/* Dress collar */}
      <path d="M38 40 Q50 48 62 40" stroke="#1a1a1a" strokeWidth="2" fill="none" />

      {/* Left arm — raised up in dance */}
      <path d="M32 50 Q18 38 12 28" stroke="#f5c842" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M32 50 Q18 38 12 28" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Right arm — reaching toward Snoopy to receive star */}
      <path d="M68 50 Q82 44 90 40" stroke="#f5c842" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M68 50 Q82 44 90 40" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Legs — one kicked out for dancing */}
      <path d="M40 90 Q36 108 32 118" stroke="#f5c842" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M40 90 Q36 108 32 118" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M60 90 Q66 106 72 112" stroke="#f5c842" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M60 90 Q66 106 72 112" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Shoes */}
      <ellipse cx="30" cy="120" rx="9" ry="4" fill="#e74c3c" stroke="#1a1a1a" strokeWidth="1.5" />
      <ellipse cx="74" cy="114" rx="9" ry="4" fill="#e74c3c" stroke="#1a1a1a" strokeWidth="1.5" transform="rotate(-20 74 114)" />

      {/* Star received — appears at left hand when receiving */}
      {isReceiving && (
        <text x="10" y="26" fontSize="22" textAnchor="middle">🌟</text>
      )}
    </svg>
  );
}

// ─── Scene states ─────────────────────────────────────────────────────────────

type ScenePhase = 'idle' | 'holding' | 'given';

export default function SceneController() {
  const [phase, setPhase] = useState<ScenePhase>('idle');

  function handleSnoopyClick() {
    if (phase === 'idle') {
      // Snoopy picks up the star
      setPhase('holding');
      // After a beat, hand it to the girl
      setTimeout(() => setPhase('given'), 1200);
    }
  }

  return (
    <div className="w-full h-screen relative overflow-hidden bg-white">
      {/* Ground line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"
        style={{ bottom: '18%' }}
      />

      {/* Star on the ground — only visible before Snoopy picks it up */}
      {phase === 'idle' && <StarOnGround />}

      {/* Snoopy — left side */}
      <button
        aria-label="Snoopy — click to pick up the star"
        onClick={handleSnoopyClick}
        className="absolute bg-transparent border-none p-0 cursor-pointer"
        style={{
          left: '28%',
          bottom: '18%',
          transform: 'translateX(-50%)',
        }}
      >
        <SnoopySVG isHolding={phase === 'holding'} />
      </button>

      {/* Dancing girl — right side */}
      <div
        className="absolute"
        style={{
          left: '62%',
          bottom: '18%',
          transform: 'translateX(-50%)',
        }}
        aria-label="Dancing girl"
      >
        <DancingGirlSVG isReceiving={phase === 'given'} />
      </div>
    </div>
  );
}
