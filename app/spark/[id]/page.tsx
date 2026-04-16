import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SparkThread from "@/components/SparkThread";

export default async function SparkPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: spark } = await supabase
    .from("sparks")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!spark) redirect("/chat");
  if (spark.user_a !== user.id && spark.user_b !== user.id) redirect("/chat");

  const { data: messages } = await supabase
    .from("spark_messages")
    .select("*")
    .eq("spark_id", params.id)
    .order("created_at", { ascending: true });

  return (
    <SparkThread
      spark={spark}
      userId={user.id}
      initialMessages={messages ?? []}
    />
  );
}
