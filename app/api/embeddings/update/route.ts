import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { generateEmbedding, summarizeUserSoul } from "@/lib/openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  // Use service role to bypass RLS for background job
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

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
