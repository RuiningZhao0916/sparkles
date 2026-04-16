"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-orange-400" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">Check your email</h2>
          <p className="text-zinc-400 text-sm">
            We sent a confirmation link to <span className="text-zinc-200">{email}</span>.
            Click it to activate your account.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2 mb-10 justify-center">
          <Sparkles className="w-5 h-5 text-orange-400" />
          <span className="sparkle-text font-semibold text-lg">sparkle</span>
        </Link>

        <h1 className="text-2xl font-bold mb-2 text-center">Create your account</h1>
        <p className="text-zinc-500 text-sm text-center mb-8">No profile needed. Just show up.</p>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-orange-500 transition-colors"
              placeholder="at least 6 characters"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Get started"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-600 mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-orange-400 hover:text-orange-300">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
