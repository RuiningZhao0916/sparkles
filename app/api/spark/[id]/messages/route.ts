import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Empty message" }, { status: 400 });

  // Verify user is part of this spark
  const { data: spark } = await supabase
    .from("sparks")
    .select("*")
    .eq("id", params.id)
    .eq("status", "accepted")
    .single();

  if (!spark || (spark.user_a !== user.id && spark.user_b !== user.id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: message } = await supabase
    .from("spark_messages")
    .insert({ spark_id: params.id, sender_id: user.id, content })
    .select()
    .single();

  return NextResponse.json({ message });
}
