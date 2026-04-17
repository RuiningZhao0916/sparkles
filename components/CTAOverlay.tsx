'use client';

import Link from 'next/link';

export default function CTAOverlay() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-20 pointer-events-none">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-10 py-8 shadow-lg text-center pointer-events-auto">
        {/* Logo */}
        <div className="flex flex-row items-center justify-center gap-3 mb-4">
          <span className="text-4xl">✨</span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            Sparkles
          </h1>
        </div>

        {/* Headline */}
        <p className="text-xl md:text-2xl font-semibold text-gray-800 mt-1">
          ✨ Sparkles: the undefined connections
        </p>

        {/* Tagline */}
        <p className="text-gray-500 text-base mt-2 italic">
          human sparkles human
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-row items-center justify-center gap-4 mt-8">
          <Link
            href="/auth/signup"
            className="bg-gradient-to-r from-orange-500 to-amber-400 text-white rounded-full px-8 py-3 font-semibold"
          >
            Start chatting
          </Link>
          <Link
            href="/auth/login"
            className="border-2 border-gray-900 text-gray-900 rounded-full px-8 py-3 font-semibold"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
