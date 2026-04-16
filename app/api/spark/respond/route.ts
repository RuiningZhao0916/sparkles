import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sparkId, action } = await req.json(); // action: 'accept' | 'decline'

  const { data: spark } = await supabase
    .from("sparks")
    .select("*")
    .eq("id", sparkId)
    .single();

  if (!spark) return NextResponse.json({ error: "Spark not found" }, { status: 404 });
  if (spark.user_a !== user.id && spark.user_b !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const status = action === "accept" ? "accepted" : "declined";
  await supabase.from("sparks").update({ status }).eq("id", sparkId);

  return NextResponse.json({ success: true, status });
}
