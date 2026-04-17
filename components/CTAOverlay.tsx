'use client';

import Link from 'next/link';

export default function CTAOverlay() {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none p-4">
      <div className="pointer-events-auto max-w-md rounded-3xl border border-orange-100/80 bg-white/85 px-8 py-9 text-center shadow-[0_24px_80px_-12px_rgba(251,146,60,0.18)] backdrop-blur-md md:max-w-lg md:px-12 md:py-11">
        <p className="font-display text-[0.7rem] font-medium uppercase tracking-[0.45em] text-orange-950/50 md:text-xs">
          Sparkles
        </p>

        <h1 className="font-display mt-3 text-[1.65rem] font-light leading-snug tracking-tight text-stone-800 md:text-3xl md:leading-tight">
          the undefined connections
        </h1>

        <p className="mt-5 font-sans text-sm font-normal leading-relaxed tracking-wide text-stone-500 md:text-[0.95rem]">
          Human sparkles human — softly, strangely, in plain sight.
        </p>

        <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/auth/signup"
            className="rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-8 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:opacity-[0.96] active:scale-[0.99]"
          >
            Start chatting
          </Link>
          <Link
            href="/auth/login"
            className="rounded-full border border-stone-800/15 bg-white/60 px-8 py-3 text-center text-sm font-semibold text-stone-800 backdrop-blur-sm transition hover:border-stone-800/25 hover:bg-white/90"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
