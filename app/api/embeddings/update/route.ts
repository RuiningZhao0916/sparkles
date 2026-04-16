import { createClient } from "@/lib/supabase/server";
import { generateEmbedding, summarizeUserSoul } from "@/lib/openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const supabase = await createClient();

  // Get all user messages
  const { data: messages } = await supabase
    .from("messages")
    .select("role, content")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  const userMessages = (messages ?? []).filter((m) => m.role === "user");
  if (userMessages.length < 1) {
    return NextResponse.json({ skipped: true });
  }

  // Generate soul summary
  const summary = await summarizeUserSoul(userMessages);

  // Generate embedding from summary
  const embedding = await generateEmbedding(summary);

  // Upsert embedding
  await supabase.from("user_embeddings").upsert({
    user_id: userId,
    embedding: JSON.stringify(embedding),
    summary,
    updated_at: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}
