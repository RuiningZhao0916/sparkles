import { openai, SPARKLE_SYSTEM_PROMPT } from "@/lib/openai";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { message } = await req.json();
  if (!message?.trim()) return NextResponse.json({ error: "Empty message" }, { status: 400 });

  // Save user message
  await supabase.from("messages").insert({
    user_id: user.id,
    role: "user",
    content: message,
  });

  // Load recent history for context (last 20 messages)
  const { data: history } = await supabase
    .from("messages")
    .select("role, content")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const contextMessages = (history ?? []).reverse().map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  // Call OpenAI
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: SPARKLE_SYSTEM_PROMPT },
      ...contextMessages,
    ],
    max_tokens: 500,
  });

  const reply = completion.choices[0].message.content ?? "I'm here.";

  // Save assistant reply
  await supabase.from("messages").insert({
    user_id: user.id,
    role: "assistant",
    content: reply,
  });

  // Every 5 user messages, update the embedding in the background
  const { count } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("role", "user");

  if (count && count % 5 === 0) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || `https://${process.env.VERCEL_URL}`;
    fetch(`${appUrl}/api/embeddings/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    }).catch(() => {});
  }

  return NextResponse.json({ reply });
}
