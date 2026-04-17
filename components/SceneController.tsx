'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { type StarScenePhase, bundleAtSnoopy, bundleWithLydia, floorStarsVisible } from '@/lib/sceneHeroStars';

const HERO_SRC =
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SCENE_HERO_SRC
    ? process.env.NEXT_PUBLIC_SCENE_HERO_SRC
    : '/images/snoopy-lydia-hero.png';

const HERO_IS_REMOTE = /^https?:\/\//i.test(HERO_SRC);

/** Floor star positions (% of scene box) — tune when swapping hero art */
const FLOOR_STARS: { left: string; bottom: string; delayMs: number }[] = [
  { left: '34%', bottom: '14%', delayMs: 0 },
  { left: '42%', bottom: '12%', delayMs: 80 },
  { left: '50%', bottom: '15%', delayMs: 160 },
  { left: '58%', bottom: '13%', delayMs: 240 },
];

const TIMING = {
  floorHoldMs: 900,
  gatherMs: 750,
  handoffMs: 1000,
} as const;

function starBundleStyle(phase: StarScenePhase): CSSProperties {
  if (phase === 'at_snoopy') {
    return { left: '22%', bottom: '28%', transform: 'translateX(-50%) scale(1)', opacity: 1 };
  }
  if (phase === 'to_lydia') {
    return { left: '72%', bottom: '38%', transform: 'translateX(-50%) scale(1.06)', opacity: 1 };
  }
  if (phase === 'complete') {
    return { left: '72%', bottom: '38%', transform: 'translateX(-50%) scale(0.85)', opacity: 0 };
  }
  return { left: '22%', bottom: '28%', transform: 'translateX(-50%) scale(0.65)', opacity: 0 };
}

export default function SceneController() {
  const [phase, setPhase] = useState<StarScenePhase>('rest');
  const [motionOk, setMotionOk] = useState(true);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setMotionOk(!mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, []);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const runSequence = useCallback(() => {
    clearTimers();
    if (!motionOk) {
      setPhase('complete');
      return;
    }
    setPhase('floor_lit');
    timers.current.push(
      setTimeout(() => setPhase('at_snoopy'), TIMING.floorHoldMs),
    );
    timers.current.push(
      setTimeout(() => setPhase('to_lydia'), TIMING.floorHoldMs + TIMING.gatherMs),
    );
    timers.current.push(
      setTimeout(
        () => setPhase('complete'),
        TIMING.floorHoldMs + TIMING.gatherMs + TIMING.handoffMs,
      ),
    );
  }, [clearTimers, motionOk]);

  const handleSnoopyClick = useCallback(() => {
    if (phase !== 'rest') return;
    runSequence();
  }, [phase, runSequence]);

  const showFloor = floorStarsVisible(phase);
  const showTravelBundle = bundleAtSnoopy(phase);
  const showLydiaStars = bundleWithLydia(phase);

  const bundleMotion = motionOk ? 'all 0.85s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';

  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-gradient-to-b from-[#fff9f4] via-[#fff5ef] to-[#ffe8dc]">
      <div className="absolute inset-0 pointer-events-none opacity-[0.35] bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(251,146,60,0.25),transparent)]" />

      <div className="relative z-[5] flex min-h-screen flex-col items-center justify-end pb-6 md:pb-10 pt-24 md:pt-28">
        <div
          className="relative w-full max-w-5xl px-4 md:px-8"
          style={{ height: 'min(52vh, 420px)' }}
        >
          {HERO_IS_REMOTE ? (
            // eslint-disable-next-line @next/next/no-img-element -- optional remote hero via NEXT_PUBLIC_SCENE_HERO_SRC
            <img
              src={HERO_SRC}
              alt="Snoopy plays guitar while Lydia dances beside him"
              className="absolute inset-0 h-full w-full object-contain object-bottom select-none drop-shadow-sm"
            />
          ) : (
            <Image
              src={HERO_SRC}
              alt="Snoopy plays guitar while Lydia dances beside him"
              fill
              priority
              className="object-contain object-bottom select-none drop-shadow-sm"
              sizes="(max-width: 768px) 100vw, 896px"
            />
          )}

          <button
            type="button"
            aria-label="Tap Snoopy: stars appear, then he gathers them for Lydia"
            onClick={handleSnoopyClick}
            disabled={phase !== 'rest'}
            className="absolute left-[4%] bottom-[4%] h-[62%] w-[42%] max-w-[320px] cursor-pointer rounded-3xl bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-400 disabled:cursor-default"
          />

          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            {FLOOR_STARS.map((s, i) => (
              <span
                key={i}
                className={[
                  'absolute -translate-x-1/2 text-[clamp(1.1rem,3.5vw,1.65rem)] transition-all duration-500 ease-out',
                  showFloor
                    ? 'translate-y-0 opacity-100 scale-100'
                    : 'translate-y-3 opacity-0 scale-50',
                ].join(' ')}
                style={{
                  left: s.left,
                  bottom: s.bottom,
                  transitionDelay: showFloor ? `${s.delayMs}ms` : '0ms',
                }}
              >
                🌟
              </span>
            ))}
          </div>

          <div
            className="pointer-events-none absolute flex gap-0.5 text-[clamp(0.95rem,3vw,1.35rem)]"
            style={{
              ...starBundleStyle(phase),
              transition: bundleMotion,
            }}
            aria-hidden="true"
          >
            {showTravelBundle ? (
              <>
                <span>🌟</span>
                <span>🌟</span>
                <span>🌟</span>
              </>
            ) : null}
          </div>

          <div
            className={[
              'pointer-events-none absolute left-[72%] bottom-[40%] flex -translate-x-1/2 gap-0.5 text-[clamp(0.85rem,2.6vw,1.2rem)] transition-all duration-700',
              showLydiaStars ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-90',
            ].join(' ')}
            style={{ transitionDelay: phase === 'complete' ? '120ms' : '0ms' }}
            aria-hidden="true"
          >
            <span className={phase === 'complete' ? 'animate-pulse' : ''}>🌟</span>
            <span className={phase === 'complete' ? 'animate-pulse' : ''} style={{ animationDelay: '0.15s' }}>
              🌟
            </span>
            <span className={phase === 'complete' ? 'animate-pulse' : ''} style={{ animationDelay: '0.3s' }}>
              🌟
            </span>
          </div>
        </div>

        <p className="mt-4 font-sans text-center text-[11px] font-medium uppercase tracking-[0.28em] text-orange-950/40 md:text-xs">
          {phase === 'rest' && 'Tap Snoopy to wake the stars'}
          {phase !== 'rest' && phase !== 'complete' && 'Gathering sparkles'}
          {phase === 'complete' && 'For Lydia, with love'}
        </p>
      </div>
    </div>
  );
}
