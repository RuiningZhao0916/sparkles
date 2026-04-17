'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function CTAOverlay() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-20 pointer-events-none">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-10 py-8 shadow-lg text-center pointer-events-auto">
        {/* Logo */}
        <div className="flex flex-row items-center justify-center gap-2 mb-6">
          <Sparkles className="text-orange-500" size={28} />
          <span className="sparkle-text text-xl font-bold">sparkle</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          AI is just the red string.
        </h1>

        {/* Tagline */}
        <p className="text-gray-600 text-lg mt-2">
          No profiles. No goals. No swiping. Just human.
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
