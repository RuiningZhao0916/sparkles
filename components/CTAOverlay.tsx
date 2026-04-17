'use client';

import Link from 'next/link';

export default function CTAOverlay() {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none p-4">
      <div className="pointer-events-auto max-w-md rounded-3xl border border-amber-200/70 bg-amber-50/90 px-8 py-9 text-center shadow-[0_24px_80px_-12px_rgba(31,41,55,0.10)] backdrop-blur-md md:max-w-lg md:px-12 md:py-11">
        <div className="flex items-center justify-center gap-3">
          <span aria-hidden="true" className="text-xl md:text-2xl">
            ✨
          </span>
          <p className="font-display text-2xl font-normal tracking-tight text-stone-800 md:text-3xl">
            Sparkles
          </p>
        </div>

        <h1 className="font-display mt-3 text-[1.65rem] font-light leading-snug tracking-tight text-stone-800 md:text-3xl md:leading-tight">
          the undefined connections
        </h1>

        <p className="mt-5 font-sans text-sm font-normal leading-relaxed tracking-wide text-stone-500 md:text-[0.95rem]">
          Human sparkles human
        </p>

        <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/auth/signup"
            className="font-display rounded-full bg-[#fff1a8] px-8 py-3 text-center text-sm font-normal tracking-wide text-stone-900 shadow-sm transition hover:bg-[#ffed94] active:scale-[0.99]"
          >
            Start chatting
          </Link>
          <Link
            href="/auth/login"
            className="font-display rounded-full border border-[#ffe58a] bg-[#fff7c9] px-8 py-3 text-center text-sm font-normal tracking-wide text-stone-900 shadow-sm transition hover:bg-[#fff3b4]"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
