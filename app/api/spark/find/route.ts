import { createClient } from "@/lib/supabase/server";
import { generateEmbedding, generateSparkReason } from "@/lib/openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get current user's embedding
  const { data: myEmbedding } = await supabase
    .from("user_embeddings")
    .select("embedding, summary")
    .eq("user_id", user.id)
    .single();

  if (!myEmbedding?.embedding) {
    return NextResponse.json({
      error: "not_enough_data",
      message: "Chat a bit more with Sparkle first — the more you share, the better the match.",
    }, { status: 422 });
  }

  // Find similar users via pgvector
  const { data: candidates } = await supabase.rpc("match_users", {
    query_embedding: myEmbedding.embedding,
    exclude_user_id: user.id,
    match_count: 3,
  });

  if (!candidates || candidates.length === 0) {
    return NextResponse.json({
      error: "no_matches",
      message: "No matches yet — you're early! Check back soon as more people join.",
    }, { status: 404 });
  }

  // Pick the best candidate
  const best = candidates[0];

  // Check if a spark already exists between these two
  const { data: existing } = await supabase
    .from("sparks")
    .select("id")
    .or(
      `and(user_a.eq.${user.id},user_b.eq.${best.user_id}),and(user_a.eq.${best.user_id},user_b.eq.${user.id})`
    )
    .in("status", ["pending", "accepted"])
    .single();

  if (existing) {
    return NextResponse.json({
      error: "already_matched",
      message: "You already have an active spark with this person.",
    }, { status: 409 });
  }

  // Generate the spark reason
  const reason = await generateSparkReason(myEmbedding.summary, best.summary);

  // Create the spark
  const { data: spark } = await supabase
    .from("sparks")
    .insert({
      user_a: user.id,
      user_b: best.user_id,
      reason,
    })
    .select()
    .single();

  return NextResponse.json({ spark, reason });
}
