'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Character from './scene/Character';
import Clue from './scene/Clue';
import Prop from './scene/Prop';
import ThoughtBubble from './scene/ThoughtBubble';

// ─── Connection Animation Overlay ─────────────────────────────────────────────

interface AnimationOverlay {
  type: AnimationType;
  fromPos: { x: string; y: string };
  toPos: { x: string; y: string };
}

/** Converts a percentage string like "68%" to a number like 68 */
function pct(s: string): number {
  return parseFloat(s);
}

function KeyPassOverlay({ from, to }: { from: { x: string; y: string }; to: { x: string; y: string } }) {
  const dx = pct(to.x) - pct(from.x);
  const dy = pct(to.y) - pct(from.y);
  return (
    <div
      className="absolute pointer-events-none anim-key-pass"
      style={{
        left: from.x,
        top: from.y,
        transform: 'translate(-50%, -50%)',
        zIndex: 5,
        // CSS custom properties used by key-pass-travel keyframe
        ['--dest-x' as string]: `${dx}vw`,
        ['--dest-y' as string]: `${dy}vh`,
        ['--travel-x' as string]: `${dx * 0.5}vw`,
        ['--travel-y' as string]: `${dy * 0.5 - 5}vh`,
      }}
    >
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="12" cy="14" r="8" fill="#f1c40f" stroke="#1a1a1a" strokeWidth="2.5" />
        <circle cx="12" cy="14" r="4" fill="none" stroke="#1a1a1a" strokeWidth="2" />
        <rect x="18" y="12" width="16" height="4" rx="2" fill="#f1c40f" stroke="#1a1a1a" strokeWidth="2" />
        <rect x="26" y="16" width="3" height="5" rx="1" fill="#f1c40f" stroke="#1a1a1a" strokeWidth="1.5" />
        <rect x="31" y="16" width="3" height="4" rx="1" fill="#f1c40f" stroke="#1a1a1a" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function RedStringOverlay({ from, to }: { from: { x: string; y: string }; to: { x: string; y: string } }) {
  const [pulling, setPulling] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPulling(true), 1500);
    return () => clearTimeout(t);
  }, []);

  // Compute SVG dimensions from percentage positions
  // We render the SVG absolutely spanning the full scene, drawing a line between the two points
  const fromXPct = pct(from.x);
  const fromYPct = pct(from.y);
  const toXPct = pct(to.x);
  const toYPct = pct(to.y);

  const pullOffset = pulling ? 3 : 0; // vw/vh nudge toward each other

  return (
    <>
      {/* SVG line overlay spanning full scene */}
      <svg
        className="absolute inset-0 pointer-events-none anim-red-string-extend"
        style={{ width: '100%', height: '100%', zIndex: 5 }}
        aria-hidden="true"
      >
        <line
          x1={`${fromXPct}%`}
          y1={`${fromYPct}%`}
          x2={`${toXPct}%`}
          y2={`${toYPct}%`}
          stroke="#e74c3c"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      {/* Pull nudge overlays — small circles at each end to show the pull */}
      {pulling && (
        <>
          <div
            className="absolute pointer-events-none"
            style={{
              left: from.x,
              top: from.y,
              transform: `translate(-50%, -50%) translate(${pullOffset}vw, 0)`,
              zIndex: 5,
              transition: 'transform 0.5s ease-in-out',
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e74c3c' }} />
          </div>
          <div
            className="absolute pointer-events-none"
            style={{
              left: to.x,
              top: to.y,
              transform: `translate(-50%, -50%) translate(${-pullOffset}vw, 0)`,
              zIndex: 5,
              transition: 'transform 0.5s ease-in-out',
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e74c3c' }} />
          </div>
        </>
      )}
    </>
  );
}

function BottlePassOverlay({ from, to }: { from: { x: string; y: string }; to: { x: string; y: string } }) {
  const dx = pct(to.x) - pct(from.x);
  const dy = pct(to.y) - pct(from.y);
  return (
    <div
      className="absolute pointer-events-none anim-bottle-arc"
      style={{
        left: from.x,
        top: from.y,
        transform: 'translate(-50%, -50%)',
        zIndex: 5,
        ['--dest-x' as string]: `${dx}vw`,
        ['--dest-y' as string]: `${dy}vh`,
        ['--arc-x' as string]: `${dx * 0.4}vw`,
        ['--arc-y' as string]: `${dy * 0.4 - 8}vh`,
      }}
    >
      <svg width="28" height="48" viewBox="0 0 28 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="10" y="2" width="8" height="10" rx="3" fill="#a8d8ea" stroke="#1a1a1a" strokeWidth="2" />
        <rect x="9" y="1" width="10" height="5" rx="2" fill="#2c3e50" stroke="#1a1a1a" strokeWidth="1.5" />
        <path d="M8 12 Q4 16 4 22 L4 40 Q4 44 14 44 Q24 44 24 40 L24 22 Q24 16 20 12 Z" fill="#a8d8ea" stroke="#1a1a1a" strokeWidth="2.5" />
        <path d="M6 30 Q6 42 14 42 Q22 42 22 30 Z" fill="#e74c3c" opacity="0.8" />
        <path d="M8 18 Q7 26 7 32" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      </svg>
    </div>
  );
}

function DogRunOverlay({ from, to }: { from: { x: string; y: string }; to: { x: string; y: string } }) {
  const dx = pct(to.x) - pct(from.x);
  return (
    <div
      className="absolute pointer-events-none anim-dog-run"
      style={{
        left: from.x,
        top: from.y,
        transform: 'translate(-50%, -50%)',
        zIndex: 5,
        ['--run-dist' as string]: `${dx}vw`,
      }}
    >
      {/* Simple dog silhouette */}
      <svg width="56" height="40" viewBox="0 0 56 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        {/* Body */}
        <ellipse cx="28" cy="26" rx="16" ry="9" fill="#c8a97e" stroke="#1a1a1a" strokeWidth="2" />
        {/* Head */}
        <circle cx="44" cy="18" r="9" fill="#c8a97e" stroke="#1a1a1a" strokeWidth="2" />
        {/* Ear */}
        <ellipse cx="48" cy="12" rx="4" ry="6" fill="#b8956a" stroke="#1a1a1a" strokeWidth="1.5" />
        {/* Eye */}
        <circle cx="47" cy="17" r="2" fill="#1a1a1a" />
        {/* Nose */}
        <ellipse cx="52" cy="20" rx="2.5" ry="1.5" fill="#1a1a1a" />
        {/* Tail */}
        <path d="M12 22 Q4 14 8 8" stroke="#c8a97e" strokeWidth="3" strokeLinecap="round" fill="none" />
        {/* Legs */}
        <rect x="18" y="32" width="5" height="8" rx="2" fill="#c8a97e" stroke="#1a1a1a" strokeWidth="1.5" />
        <rect x="26" y="32" width="5" height="8" rx="2" fill="#c8a97e" stroke="#1a1a1a" strokeWidth="1.5" />
        <rect x="34" y="32" width="5" height="8" rx="2" fill="#c8a97e" stroke="#1a1a1a" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function ConnectionAnimationOverlay({ overlay }: { overlay: AnimationOverlay }) {
  switch (overlay.type) {
    case 'key-pass':
      return <KeyPassOverlay from={overlay.fromPos} to={overlay.toPos} />;
    case 'red-string-pull':
      return <RedStringOverlay from={overlay.fromPos} to={overlay.toPos} />;
    case 'bottle-pass':
      return <BottlePassOverlay from={overlay.fromPos} to={overlay.toPos} />;
    case 'dog-interaction':
      return <DogRunOverlay from={overlay.fromPos} to={overlay.toPos} />;
    default:
      return null;
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type CharacterId =
  | 'guitar-girl'
  | 'tree-boy'
  | 'dog'
  | 'software-engineer'
  | 'painter'
  | 'basketball-woman';

export type ClueId = 'red-string' | 'key' | 'letter' | 'bottle';

export type PropId = 'chair' | 'vinyl-record' | 'shoe';

export type AnimationType =
  | 'key-pass'
  | 'red-string-pull'
  | 'bottle-pass'
  | 'dog-interaction';

// ─── Constants ────────────────────────────────────────────────────────────────

export const ANIMATION_DURATION_MS = 3000;
export const THOUGHT_DISMISS_MS = 4000;

// ─── Data Maps ────────────────────────────────────────────────────────────────

export const CHARACTERS: Record<
  CharacterId,
  {
    label: string;
    position: { x: string; y: string };
    animation: AnimationType;
    mobileVisible: boolean;
    ariaLabel: string;
  }
> = {
  'guitar-girl': {
    label: 'Girl playing guitar',
    position: { x: '10%', y: '60%' },
    animation: 'red-string-pull',
    mobileVisible: true,
    ariaLabel: 'Girl playing guitar — click to connect',
  },
  'tree-boy': {
    label: 'Boy planting a tree',
    position: { x: '25%', y: '65%' },
    animation: 'bottle-pass',
    mobileVisible: false,
    ariaLabel: 'Boy planting a tree — click to connect',
  },
  dog: {
    label: 'Dog playing with a ball',
    position: { x: '50%', y: '72%' },
    animation: 'dog-interaction',
    mobileVisible: true,
    ariaLabel: 'Dog playing with a ball — click to connect',
  },
  'software-engineer': {
    label: 'Software engineer coding',
    position: { x: '68%', y: '62%' },
    animation: 'key-pass',
    mobileVisible: true,
    ariaLabel: 'Software engineer coding — click to connect',
  },
  painter: {
    label: 'Painter painting',
    position: { x: '82%', y: '68%' },
    animation: 'red-string-pull',
    mobileVisible: false,
    ariaLabel: 'Painter painting — click to connect',
  },
  'basketball-woman': {
    label: 'Woman playing basketball',
    position: { x: '40%', y: '58%' },
    animation: 'bottle-pass',
    mobileVisible: false,
    ariaLabel: 'Woman playing basketball — click to connect',
  },
};

export const CLUES: Record<
  ClueId,
  {
    position: { x: string; y: string };
    thought: string;
    ariaLabel: string;
  }
> = {
  'red-string': {
    position: { x: '30%', y: '40%' },
    thought: 'I like red coach. What are you listening to?',
    ariaLabel: 'Red string — click to discover',
  },
  key: {
    position: { x: '60%', y: '35%' },
    thought: 'Someone left this. Maybe it opens something.',
    ariaLabel: 'Key — click to discover',
  },
  letter: {
    position: { x: '15%', y: '30%' },
    thought: 'Unsent. Still warm.',
    ariaLabel: 'Letter — click to discover',
  },
  bottle: {
    position: { x: '78%', y: '45%' },
    thought: 'A message, waiting for the right tide.',
    ariaLabel: 'Glass bottle — click to discover',
  },
};

export const PROPS: Record<
  PropId,
  {
    position: { x: string; y: string };
    ariaLabel: string;
  }
> = {
  chair: {
    position: { x: '20%', y: '75%' },
    ariaLabel: 'Chair — click to interact',
  },
  'vinyl-record': {
    position: { x: '55%', y: '50%' },
    ariaLabel: 'Vinyl record — click to interact',
  },
  shoe: {
    position: { x: '88%', y: '78%' },
    ariaLabel: 'Single shoe — click to interact',
  },
};

// ─── useReducedMotion hook ────────────────────────────────────────────────────

function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}

// ─── Scene State ─────────────────────────────────────────────────────────────

type CharacterAnimState = 'idle' | 'animating' | 'paused';

const CHARACTER_IDS = Object.keys(CHARACTERS) as CharacterId[];

function initialCharacterStates(): Record<CharacterId, CharacterAnimState> {
  return CHARACTER_IDS.reduce(
    (acc, id) => ({ ...acc, [id]: 'idle' as CharacterAnimState }),
    {} as Record<CharacterId, CharacterAnimState>
  );
}

// ─── SceneController ─────────────────────────────────────────────────────────

export default function SceneController() {
  const reducedMotion = useReducedMotion();

  const [characterStates, setCharacterStates] = useState<
    Record<CharacterId, CharacterAnimState>
  >(initialCharacterStates);

  const [activeAnimation, setActiveAnimation] = useState<AnimationType | null>(null);
  const [animationQueue, setAnimationQueue] = useState<AnimationType[]>([]);
  const [activeThought, setActiveThought] = useState<{
    clueId: ClueId;
    message: string;
  } | null>(null);
  const [animationOverlay, setAnimationOverlay] = useState<AnimationOverlay | null>(null);

  // Viewport width for responsive behavior (task 7 will refine)
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  // Refs to hold mutable values without triggering re-renders
  const activeAnimationRef = useRef<AnimationType | null>(null);
  const animationQueueRef = useRef<AnimationType[]>([]);
  const thoughtDismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep refs in sync
  useEffect(() => {
    activeAnimationRef.current = activeAnimation;
  }, [activeAnimation]);

  useEffect(() => {
    animationQueueRef.current = animationQueue;
  }, [animationQueue]);

  // ── Viewport resize listener (ResizeObserver on document.body) ───────────
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new ResizeObserver(() => {
      setViewportWidth(document.documentElement.clientWidth);
    });
    observer.observe(document.body);
    return () => observer.disconnect();
  }, []);

  // ── Animation helpers ─────────────────────────────────────────────────────

  /** Returns the character IDs involved in a given animation type */
  function getInvolvedCharacters(animType: AnimationType): CharacterId[] {
    switch (animType) {
      case 'red-string-pull':
        return ['guitar-girl', 'painter'];
      case 'bottle-pass':
        return ['tree-boy', 'basketball-woman'];
      case 'key-pass':
        return ['software-engineer', 'guitar-girl'];
      case 'dog-interaction':
        return ['dog', 'software-engineer'];
      default:
        return [];
    }
  }

  /** Returns the from/to positions for the animation overlay */
  function getOverlayPositions(animType: AnimationType): { fromPos: { x: string; y: string }; toPos: { x: string; y: string } } {
    const [fromId, toId] = getInvolvedCharacters(animType);
    return {
      fromPos: CHARACTERS[fromId].position,
      toPos: CHARACTERS[toId].position,
    };
  }

  const processNextInQueue = useCallback(() => {
    const queue = animationQueueRef.current;
    if (queue.length === 0) return;

    const [next, ...rest] = queue;
    setAnimationQueue(rest);
    animationQueueRef.current = rest;

    const involved = getInvolvedCharacters(next);

    try {
      setCharacterStates((prev) => {
        const updated = { ...prev };
        involved.forEach((id) => { updated[id] = 'paused'; });
        return updated;
      });
      setActiveAnimation(next);
      activeAnimationRef.current = next;
      const { fromPos, toPos } = getOverlayPositions(next);
      setAnimationOverlay({ type: next, fromPos, toPos });

      setTimeout(() => {
        try {
          setCharacterStates((prev) => {
            const updated = { ...prev };
            involved.forEach((id) => { updated[id] = 'idle'; });
            return updated;
          });
          setActiveAnimation(null);
          activeAnimationRef.current = null;
          setAnimationOverlay(null);
          processNextInQueue();
        } catch (err) {
          console.error('[SceneController] Error resuming after animation', next, involved, err);
          setCharacterStates((prev) => {
            const updated = { ...prev };
            involved.forEach((id) => { updated[id] = 'idle'; });
            return updated;
          });
          setActiveAnimation(null);
          activeAnimationRef.current = null;
          setAnimationOverlay(null);
          processNextInQueue();
        }
      }, ANIMATION_DURATION_MS);
    } catch (err) {
      console.error('[SceneController] Error starting animation', next, involved, err);
      setCharacterStates((prev) => {
        const updated = { ...prev };
        involved.forEach((id) => { updated[id] = 'idle'; });
        return updated;
      });
      setActiveAnimation(null);
      activeAnimationRef.current = null;
      setAnimationOverlay(null);
      processNextInQueue();
    }
  }, []);

  // ── handleCharacterClick ──────────────────────────────────────────────────

  const handleCharacterClick = useCallback(
    (id: CharacterId) => {
      try {
        const animType = CHARACTERS[id].animation;

        if (activeAnimationRef.current !== null) {
          // Enqueue
          setAnimationQueue((prev) => {
            const updated = [...prev, animType];
            animationQueueRef.current = updated;
            return updated;
          });
          return;
        }

        const involved = getInvolvedCharacters(animType);

        setCharacterStates((prev) => {
          const updated = { ...prev };
          involved.forEach((cid) => { updated[cid] = 'paused'; });
          return updated;
        });
        setActiveAnimation(animType);
        activeAnimationRef.current = animType;
        const { fromPos, toPos } = getOverlayPositions(animType);
        setAnimationOverlay({ type: animType, fromPos, toPos });

        setTimeout(() => {
          try {
            setCharacterStates((prev) => {
              const updated = { ...prev };
              involved.forEach((cid) => { updated[cid] = 'idle'; });
              return updated;
            });
            setActiveAnimation(null);
            activeAnimationRef.current = null;
            setAnimationOverlay(null);
            processNextInQueue();
          } catch (err) {
            console.error(
              '[SceneController] Error completing animation',
              animType,
              involved,
              err
            );
            setCharacterStates((prev) => {
              const updated = { ...prev };
              involved.forEach((cid) => { updated[cid] = 'idle'; });
              return updated;
            });
            setActiveAnimation(null);
            activeAnimationRef.current = null;
            setAnimationOverlay(null);
            processNextInQueue();
          }
        }, ANIMATION_DURATION_MS);
      } catch (err) {
        console.error('[SceneController] Error in handleCharacterClick', id, err);
        const animType = CHARACTERS[id]?.animation;
        if (animType) {
          const involved = getInvolvedCharacters(animType);
          setCharacterStates((prev) => {
            const updated = { ...prev };
            involved.forEach((cid) => { updated[cid] = 'idle'; });
            return updated;
          });
        }
        setActiveAnimation(null);
        activeAnimationRef.current = null;
        setAnimationOverlay(null);
        processNextInQueue();
      }
    },
    [processNextInQueue]
  );

  // ── handleClueClick ───────────────────────────────────────────────────────

  const handleClueClick = useCallback((id: ClueId) => {
    const clue = CLUES[id];
    if (!clue) return;

    // Clear any existing dismiss timer
    if (thoughtDismissTimer.current !== null) {
      clearTimeout(thoughtDismissTimer.current);
      thoughtDismissTimer.current = null;
    }

    setActiveThought({ clueId: id, message: clue.thought });

    thoughtDismissTimer.current = setTimeout(() => {
      setActiveThought(null);
      thoughtDismissTimer.current = null;
    }, THOUGHT_DISMISS_MS);
  }, []);

  const dismissThought = useCallback(() => {
    if (thoughtDismissTimer.current !== null) {
      clearTimeout(thoughtDismissTimer.current);
      thoughtDismissTimer.current = null;
    }
    setActiveThought(null);
  }, []);

  // ── handlePropClick ───────────────────────────────────────────────────────

  const handlePropClick = useCallback((id: PropId) => {
    const prop = PROPS[id];
    if (!prop) return;

    const propX = parseFloat(prop.position.x);
    const propY = parseFloat(prop.position.y);

    // Find nearest character by Euclidean distance on percentage positions
    let nearestId: CharacterId | null = null;
    let nearestDist = Infinity;

    CHARACTER_IDS.forEach((cid) => {
      const charX = parseFloat(CHARACTERS[cid].position.x);
      const charY = parseFloat(CHARACTERS[cid].position.y);
      const dist = Math.sqrt((charX - propX) ** 2 + (charY - propY) ** 2);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestId = cid;
      }
    });

    if (!nearestId) return;

    const neighbor = nearestId as CharacterId;

    setCharacterStates((prev) => ({ ...prev, [neighbor]: 'animating' }));

    setTimeout(() => {
      setCharacterStates((prev) => ({ ...prev, [neighbor]: 'idle' }));
    }, 1500);
  }, []);

  // ── Cleanup on unmount ────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (thoughtDismissTimer.current !== null) {
        clearTimeout(thoughtDismissTimer.current);
      }
    };
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────

  const isMobile = viewportWidth < 768;

  return (
    <div className="w-full h-screen relative overflow-hidden bg-white">
      {/* Characters */}
      {CHARACTER_IDS.map((id) => (
        <Character
          key={id}
          id={id}
          state={characterStates[id]}
          position={CHARACTERS[id].position}
          size={isMobile ? 64 : 96}
          onClick={handleCharacterClick}
          ariaLabel={CHARACTERS[id].ariaLabel}
          hidden={isMobile && !CHARACTERS[id].mobileVisible}
          reducedMotion={reducedMotion}
        />
      ))}

      {/* Clues */}
      {(Object.keys(CLUES) as ClueId[]).map((id) => (
        <Clue
          key={id}
          id={id}
          state={activeThought?.clueId === id ? 'active' : 'idle'}
          position={CLUES[id].position}
          onClick={handleClueClick}
          ariaLabel={CLUES[id].ariaLabel}
          reducedMotion={reducedMotion}
        />
      ))}

      {/* Props */}
      {(Object.keys(PROPS) as PropId[]).map((id) => (
        <Prop
          key={id}
          id={id}
          state="idle"
          position={PROPS[id].position}
          onClick={handlePropClick}
          ariaLabel={PROPS[id].ariaLabel}
          reducedMotion={reducedMotion}
        />
      ))}

      {/* Connection Animation Overlay */}
      {animationOverlay && !reducedMotion && (
        <ConnectionAnimationOverlay overlay={animationOverlay} />
      )}

      {/* Thought Bubble */}
      {activeThought && (
        <ThoughtBubble
          message={activeThought.message}
          anchorPosition={CLUES[activeThought.clueId].position}
          onDismiss={dismissThought}
        />
      )}
    </div>
  );
}
