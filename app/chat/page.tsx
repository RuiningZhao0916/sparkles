import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ChatInterface from "@/components/ChatInterface";

export default async function ChatPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Load chat history
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(50);

  // Load active sparks
  const { data: sparks } = await supabase
    .from("sparks")
    .select("*")
    .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
    .in("status", ["pending", "accepted"])
    .order("created_at", { ascending: false });

  return (
    <ChatInterface
      userId={user.id}
      initialMessages={messages ?? []}
      sparks={sparks ?? []}
    />
  );
}
