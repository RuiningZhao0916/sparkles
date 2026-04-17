'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';

type Figure = {
  src: string;
  alt: string;
  left: string;
  top: string;
  w: number;
  rotationDeg: number;
  opacity: number;
};

type TwinklePlan = {
  activeIds: number[];
  delaysMs: Record<number, number>;
  burst: number;
};

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return reduced;
}

function pickUnique(maxExclusive: number, count: number): number[] {
  const picked = new Set<number>();
  const safeCount = Math.max(0, Math.min(count, maxExclusive));
  while (picked.size < safeCount) {
    picked.add(Math.floor(Math.random() * maxExclusive));
  }
  const out: number[] = [];
  picked.forEach((v) => out.push(v));
  return out;
}

function weightedFigureCount(n: number): number {
  if (n <= 1) return n;
  const r = Math.random();
  // 60%: 1–2, 30%: 3–4, 10%: all (sometimes a “full room” moment)
  if (r < 0.6) return Math.min(n, 1 + (Math.random() < 0.55 ? 1 : 0));
  if (r < 0.9) return Math.min(n, 3 + (Math.random() < 0.45 ? 1 : 0));
  return n;
}

function weightedSparkleCount(): number {
  const r = Math.random();
  // sometimes same time, sometimes different times
  if (r < 0.55) return 1 + (Math.random() < 0.4 ? 1 : 0);
  if (r < 0.9) return 3 + (Math.random() < 0.35 ? 1 : 0);
  return 6;
}

export default function LineFigureSparkles() {
  const reducedMotion = usePrefersReducedMotion();

  const figures = useMemo<Figure[]>(
    () => [
      {
        src: '/line/image-2a379e11-8b12-462c-9d73-a2f29aa227e2.png',
        alt: 'Line dancer',
        left: '74%',
        top: '10%',
        w: 190,
        rotationDeg: 4,
        opacity: 0.8,
      },
      {
        src: '/line/image-68fb7021-37f4-4580-8266-c7bdcbfdb373.png',
        alt: 'Line dancer',
        left: '78%',
        top: '56%',
        w: 150,
        rotationDeg: 2,
        opacity: 0.82,
      },
      {
        src: '/line/image-62bbceab-c74e-41a3-80ff-d58a41f3cba1.png',
        alt: 'Line dancers',
        left: '10%',
        top: '62%',
        w: 210,
        rotationDeg: -2,
        opacity: 0.75,
      },
      {
        src: '/line/image-b3eb3bfc-3008-4885-91bc-d9a089040ec1.png',
        alt: 'Line dancer',
        left: '44%',
        top: '8%',
        w: 120,
        rotationDeg: 0,
        opacity: 0.75,
      },
      {
        src: '/line/image-75975573-7b62-4467-923a-9a9a0e53473f.png',
        alt: 'Line dancer',
        left: '46%',
        top: '66%',
        w: 170,
        rotationDeg: 1,
        opacity: 0.78,
      },
      {
        src: '/line/image-9459f3f7-e1bc-4449-9940-86c6d8434c60.png',
        alt: 'Line dog',
        left: '84%',
        top: '78%',
        w: 130,
        rotationDeg: 6,
        opacity: 0.72,
      },
      {
        src: '/line/240_F_301134342_vvFqdoaVcaiFZgxrjk2R2CG9wGgXQNHC.jpg',
        alt: 'Line dancer',
        left: '12%',
        top: '18%',
        w: 150,
        rotationDeg: -3,
        opacity: 0.8,
      },
      {
        src: '/line/240_F_301351292_fBTlImb4g93oRlTPOLocpDAODFFQgIlC.jpg',
        alt: 'Line dancer',
        left: '18%',
        top: '78%',
        w: 170,
        rotationDeg: 2,
        opacity: 0.76,
      },
      {
        src: '/line/240_F_453815494_0BOFO9BMEcBAcrNbcAxVIbsXPdzAnq6N.jpg',
        alt: 'Line dog',
        left: '76%',
        top: '30%',
        w: 150,
        rotationDeg: 4,
        opacity: 0.74,
      },
    ],
    []
  );

  const [plan, setPlan] = useState<TwinklePlan>(() => ({
    activeIds: [],
    delaysMs: {},
    burst: 0,
  }));

  const [sparkPlan, setSparkPlan] = useState<TwinklePlan>(() => ({
    activeIds: [],
    delaysMs: {},
    burst: 0,
  }));

  const timers = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const schedule = () => {
      const count = weightedFigureCount(figures.length);
      const activeIds = pickUnique(figures.length, count);
      const delaysMs: Record<number, number> = {};
      activeIds.forEach((id) => {
        // within-burst staggering: sometimes aligned, sometimes spread
        const base = Math.random() < 0.45 ? 0 : Math.floor(Math.random() * 420);
        delaysMs[id] = base;
      });
      setPlan((p) => ({ activeIds, delaysMs, burst: p.burst + 1 }));

      const nextIn = 950 + Math.floor(Math.random() * 900);
      timers.current.push(window.setTimeout(schedule, nextIn));
    };

    schedule();
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    };
  }, [figures.length, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    const schedule = () => {
      const count = weightedSparkleCount();
      const activeIds = pickUnique(6, count);
      const delaysMs: Record<number, number> = {};
      activeIds.forEach((id) => {
        delaysMs[id] = Math.random() < 0.4 ? 0 : Math.floor(Math.random() * 520);
      });
      setSparkPlan((p) => ({ activeIds, delaysMs, burst: p.burst + 1 }));

      const nextIn = 700 + Math.floor(Math.random() * 900);
      timers.current.push(window.setTimeout(schedule, nextIn));
    };

    schedule();
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    };
  }, [reducedMotion]);

  // Reduced motion: show a few lightly, static.
  if (reducedMotion) {
    return (
      <div className="pointer-events-none fixed inset-0 z-[2]" aria-hidden="true">
        {figures.slice(0, 3).map((f) => (
          <div
            key={f.src}
            className="absolute"
            style={{
              left: f.left,
              top: f.top,
              width: f.w,
              transform: `rotate(${f.rotationDeg}deg)`,
              opacity: 0.22,
              filter: 'drop-shadow(0 10px 22px rgba(15, 23, 42, 0.08))',
            }}
          >
            <Image src={f.src} alt={f.alt} width={f.w} height={f.w} className="h-auto w-full select-none" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[2]" aria-hidden="true">
      {/* 6 ✨ scattered and twinkling */}
      {[
        { left: '6%', top: '10%', size: 18 },
        { left: '88%', top: '14%', size: 22 },
        { left: '12%', top: '72%', size: 20 },
        { left: '80%', top: '66%', size: 18 },
        { left: '48%', top: '6%', size: 16 },
        { left: '54%', top: '84%', size: 22 },
      ].map((s, i) => {
        const isOn = sparkPlan.activeIds.includes(i);
        const delay = sparkPlan.delaysMs[i] ?? 0;
        return (
          <span
            key={`${i}-${isOn ? sparkPlan.burst : 'off'}`}
            className={isOn ? 'ui-twinkle ui-twinkle--active' : 'ui-twinkle'}
            style={{
              left: s.left,
              top: s.top,
              fontSize: s.size,
              opacity: 0,
              animationDelay: `${delay}ms`,
            }}
          >
            ✨
          </span>
        );
      })}

      {figures.map((f, i) => {
        const isOn = plan.activeIds.includes(i);
        const delay = plan.delaysMs[i] ?? 0;
        return (
        <div
          key={`${f.src}-${isOn ? plan.burst : 'off'}`}
          className={isOn ? 'line-figure line-figure--active' : 'line-figure'}
          style={{
            left: f.left,
            top: f.top,
            width: f.w,
            // rotation is handled by CSS var so the sparkle keyframes keep it.
            ['--rot' as any]: `${f.rotationDeg}deg`,
            // only the active one animates; keep others fully invisible.
            opacity: isOn ? f.opacity : 0,
            animationDelay: `${delay}ms`,
          }}
        >
          <Image src={f.src} alt={f.alt} width={f.w} height={f.w} className="h-auto w-full select-none" />
        </div>
      );
      })}
    </div>
  );
}

