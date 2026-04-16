"use client";

import { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { cn, formatTime } from "@/lib/utils";

type SparkMessage = { id: string; sender_id: string; content: string; created_at: string };
type Spark = { id: string; reason: string; status: string; user_a: string; user_b: string };

export default function SparkThread({
  spark,
  userId,
  initialMessages,
}: {
  spark: Spark;
  userId: string;
  initialMessages: SparkMessage[];
}) {
  const [messages, setMessages] = useState<SparkMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Realtime subscription
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`spark:${spark.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "spark_messages", filter: `spark_id=eq.${spark.id}` },
        (payload) => {
          const newMsg = payload.new as SparkMessage;
          if (newMsg.sender_id !== userId) {
            setMessages((prev) => [...prev, newMsg]);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [spark.id, userId]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const optimistic: SparkMessage = {
      id: crypto.randomUUID(),
      sender_id: userId,
      content: input,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setInput("");
    setSending(true);

    await fetch(`/api/spark/${spark.id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: optimistic.content }),
    });

    setSending(false);
  }

  const isPending = spark.status === "pending";

  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto px-4">
      {/* Header */}
      <header className="flex items-center gap-4 py-5 border-b border-zinc-900">
        <Link href="/chat" className="text-zinc-600 hover:text-zinc-400 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-medium text-zinc-200">Spark thread</span>
          </div>
          <p className="text-xs text-zinc-600 mt-0.5 line-clamp-1">{spark.reason}</p>
        </div>
      </header>

      {/* Spark reason banner */}
      <div className="py-4 px-4 my-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl text-center">
        <p className="text-xs text-orange-400/70 mb-1">Why you connected</p>
        <p className="text-sm text-zinc-300 italic">&ldquo;{spark.reason}&rdquo;</p>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto pb-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-600 text-sm">Say hello. The spark is yours now.</p>
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.sender_id === userId;
          return (
            <div key={msg.id} className={cn("flex animate-slide-up", isMe ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed",
                  isMe
                    ? "bg-orange-500/20 text-zinc-100 rounded-br-sm"
                    : "bg-zinc-900 text-zinc-200 rounded-bl-sm border border-zinc-800"
                )}
              >
                <p>{msg.content}</p>
                <p className={cn("text-xs mt-1.5", isMe ? "text-orange-300/50" : "text-zinc-600")}>
                  {formatTime(msg.created_at)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="py-4 border-t border-zinc-900">
        {isPending ? (
          <div className="text-center text-sm text-zinc-600 py-3">
            Waiting for the other person to accept the spark...
          </div>
        ) : (
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
              placeholder="Say something..."
              rows={1}
              className="flex-1 px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 resize-none text-sm leading-relaxed transition-colors"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 text-white hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
