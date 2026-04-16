"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, X } from "lucide-react";
import Link from "next/link";

export default function SparkCard({
  reason,
  sparkId,
  isPending = false,
}: {
  reason: string;
  sparkId: string;
  isPending?: boolean;
}) {
  const [responded, setResponded] = useState(false);
  const [accepted, setAccepted] = useState(false);

  async function respond(action: "accept" | "decline") {
    await fetch("/api/spark/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sparkId, action }),
    });
    setResponded(true);
    setAccepted(action === "accept");
  }

  if (responded) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-center text-sm">
        {accepted ? (
          <div className="space-y-2">
            <p className="text-zinc-300">✨ The spark is lit.</p>
            <Link
              href={`/spark/${sparkId}`}
              className="inline-flex items-center gap-1.5 text-orange-400 hover:text-orange-300 text-sm"
            >
              Open thread <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <p className="text-zinc-600">Maybe next time.</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-orange-500/20 rounded-2xl p-5 sparkle-glow">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500/30 to-amber-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4 text-orange-400" />
        </div>
        <div>
          <p className="text-xs text-orange-400/70 mb-1 font-medium uppercase tracking-wide">
            {isPending ? "Someone wants to connect" : "A spark found"}
          </p>
          <p className="text-zinc-200 text-sm leading-relaxed">{reason}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => respond("accept")}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Connect
        </button>
        <button
          onClick={() => respond("decline")}
          className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-400 text-sm hover:bg-zinc-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-zinc-700 text-center mt-3">
        This spark expires in 48 hours
      </p>
    </div>
  );
}
