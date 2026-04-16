"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Zap, LogOut } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn, formatTime } from "@/lib/utils";
import SparkCard from "./SparkCard";

type Message = { id: string; role: string; content: string; created_at: string };
type Spark = { id: string; reason: string; status: string; user_a: string; user_b: string; created_at: string };

export default function ChatInterface({
  userId,
  initialMessages,
  sparks,
}: {
  userId: string;
  initialMessages: Message[];
  sparks: Spark[];
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [findingMatch, setFindingMatch] = useState(false);
  const [matchResult, setMatchResult] = useState<{ reason?: string; error?: string; sparkId?: string; match?: { summary: string; similarity: number; displayName: string } } | null>(null);
  const [activeSparks, setActiveSparks] = useState<Spark[]>(sparks);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();

    if (data.reply) {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: data.reply, created_at: new Date().toISOString() },
      ]);
    }
    setLoading(false);
  }

  async function findMatch() {
    setFindingMatch(true);
    setMatchResult(null);
    const res = await fetch("/api/spark/find", { method: "POST" });
    const data = await res.json();

    if (data.spark) {
      setMatchResult({ reason: data.reason, sparkId: data.spark.id, match: data.match });
      setActiveSparks((prev) => [data.spark, ...prev]);
    } else {
      setMatchResult({ error: data.message });
    }
    setFindingMatch(false);
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto px-4">
      {/* Header */}
      <header className="flex items-center justify-between py-5 border-b border-zinc-900">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-orange-400" />
          <span className="sparkle-text font-semibold">sparkle</span>
        </Link>
        <div className="flex items-center gap-3">
          {activeSparks.length > 0 && (
            <Link
              href={`/spark/${activeSparks[0].id}`}
              className="text-xs text-orange-400 border border-orange-500/30 px-3 py-1.5 rounded-full hover:bg-orange-500/10 transition-colors"
            >
              {activeSparks.length} spark{activeSparks.length > 1 ? "s" : ""}
            </Link>
          )}
          <button onClick={signOut} className="text-zinc-600 hover:text-zinc-400 transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 py-6 space-y-4 overflow-y-auto">
        {isEmpty && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-400/20 flex items-center justify-center mx-auto mb-5">
              <Sparkles className="w-7 h-7 text-orange-400" />
            </div>
            <p className="text-zinc-400 text-base mb-2">Hey, I&apos;m Sparkle.</p>
            <p className="text-zinc-600 text-sm max-w-xs mx-auto">
              Just talk. Tell me what&apos;s on your mind — a song, a feeling, something you noticed today.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn("flex animate-slide-up", msg.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-orange-500/20 text-zinc-100 rounded-br-sm"
                  : "bg-zinc-900 text-zinc-200 rounded-bl-sm border border-zinc-800"
              )}
            >
              <p>{msg.content}</p>
              <p className={cn("text-xs mt-1.5", msg.role === "user" ? "text-orange-300/50" : "text-zinc-600")}>
                {formatTime(msg.created_at)}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-900 border border-zinc-800 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Match result */}
        {matchResult && (
          <div className="animate-slide-up">
            {matchResult.error ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-400 text-center">
                {matchResult.error}
              </div>
            ) : (
              <SparkCard reason={matchResult.reason!} sparkId={matchResult.sparkId!} />
            )}
          </div>
        )}

        {/* Active sparks */}
        {activeSparks.filter(s => s.status === "pending" && s.user_b === userId).map((spark) => (
          <SparkCard key={spark.id} reason={spark.reason} sparkId={spark.id} isPending />
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="py-4 border-t border-zinc-900">
        <form onSubmit={sendMessage} className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e);
              }
            }}
            placeholder="What's on your mind..."
            rows={1}
            className="flex-1 px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 resize-none text-sm leading-relaxed transition-colors"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={findMatch}
              disabled={findingMatch}
              title="Find a spark"
              className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/30 transition-all disabled:opacity-50"
            >
              <Zap className={cn("w-4 h-4", findingMatch && "animate-pulse")} />
            </button>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 text-white hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
        <p className="text-xs text-zinc-700 text-center mt-3">
          Tap <Zap className="w-3 h-3 inline text-orange-500/50" /> when you want to find a human connection
        </p>
      </div>
    </div>
  );
}
