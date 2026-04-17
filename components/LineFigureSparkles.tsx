'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

type Figure = {
  src: string;
  alt: string;
  left: string;
  top: string;
  w: number;
  rotationDeg: number;
  opacity: number;
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

export default function LineFigureSparkles() {
  const reducedMotion = usePrefersReducedMotion();

  const figures = useMemo<Figure[]>(
    () => [
      {
        src: '/line/image-2f88f7d1-6e91-4a6a-83fe-818875d76ea6.png',
        alt: 'Line figure dancing',
        left: '8%',
        top: '14%',
        w: 170,
        rotationDeg: -6,
        opacity: 0.85,
      },
      {
        src: '/line/image-2a379e11-8b12-462c-9d73-a2f29aa227e2.png',
        alt: 'Line figure dancing with ribbon',
        left: '74%',
        top: '10%',
        w: 190,
        rotationDeg: 4,
        opacity: 0.8,
      },
      {
        src: '/line/image-68fb7021-37f4-4580-8266-c7bdcbfdb373.png',
        alt: 'Line figure ballet pose',
        left: '78%',
        top: '56%',
        w: 150,
        rotationDeg: 2,
        opacity: 0.82,
      },
      {
        src: '/line/image-62bbceab-c74e-41a3-80ff-d58a41f3cba1.png',
        alt: 'Line figures mirrored dance',
        left: '10%',
        top: '62%',
        w: 210,
        rotationDeg: -2,
        opacity: 0.75,
      },
      {
        src: '/line/image-b3eb3bfc-3008-4885-91bc-d9a089040ec1.png',
        alt: 'Line figure gesture',
        left: '44%',
        top: '8%',
        w: 120,
        rotationDeg: 0,
        opacity: 0.75,
      },
      {
        src: '/line/image-75975573-7b62-4467-923a-9a9a0e53473f.png',
        alt: 'Line figure backbend',
        left: '46%',
        top: '66%',
        w: 170,
        rotationDeg: 1,
        opacity: 0.78,
      },
      {
        src: '/line/image-9459f3f7-e1bc-4449-9940-86c6d8434c60.png',
        alt: 'Line dog figure',
        left: '84%',
        top: '78%',
        w: 130,
        rotationDeg: 6,
        opacity: 0.72,
      },
    ],
    []
  );

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const ms = 1600;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % figures.length);
    }, ms);
    return () => window.clearInterval(id);
  }, [figures.length, reducedMotion]);

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
      {figures.map((f, i) => (
        <div
          key={f.src}
          className={i === active ? 'line-figure line-figure--active' : 'line-figure'}
          style={{
            left: f.left,
            top: f.top,
            width: f.w,
            // rotation is handled by CSS var so the sparkle keyframes keep it.
            ['--rot' as any]: `${f.rotationDeg}deg`,
            // only the active one animates; keep others fully invisible.
            opacity: i === active ? f.opacity : 0,
          }}
        >
          <Image src={f.src} alt={f.alt} width={f.w} height={f.w} className="h-auto w-full select-none" />
        </div>
      ))}
    </div>
  );
}

