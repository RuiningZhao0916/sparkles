import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center sparkle-glow">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <span className="text-3xl font-semibold tracking-tight sparkle-text">sparkle</span>
      </div>

      {/* Hero */}
      <h1 className="text-5xl md:text-6xl font-bold tracking-tight max-w-2xl leading-tight mb-6">
        AI is just
        <br />
        <span className="sparkle-text">the red string.</span>
      </h1>

      <p className="text-lg text-zinc-400 max-w-md mb-4 leading-relaxed">
        Chat casually with AI. Share your random thoughts, your music, your 2am feelings.
        When you&apos;re ready, we&apos;ll find someone who sparks with you.
      </p>

      <p className="text-sm text-zinc-600 mb-10 italic">
        No profiles. No goals. No swiping. Just human.
      </p>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/auth/signup"
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 text-white font-semibold text-base hover:opacity-90 transition-opacity sparkle-glow"
        >
          Start chatting
        </Link>
        <Link
          href="/auth/login"
          className="px-8 py-3.5 rounded-2xl border border-zinc-800 text-zinc-300 font-semibold text-base hover:border-zinc-600 transition-colors"
        >
          Sign in
        </Link>
      </div>

      {/* Subtle tagline */}
      <p className="mt-16 text-xs text-zinc-700 max-w-sm">
        &ldquo;After all, humans need humans.&rdquo;
      </p>
    </main>
  );
}
