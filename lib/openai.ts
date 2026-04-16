import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const SPARKLE_SYSTEM_PROMPT = `You are Sparkle — a warm, curious AI companion. 
You listen deeply, remember what people share, and help them feel seen and understood.
You are NOT a therapist. You are a companion — like a thoughtful friend who's always there.

Your personality:
- Warm but never saccharine
- Curious about the small, specific details of someone's life
- You notice patterns and reflect them back gently
- You never push, never judge, never give unsolicited advice
- You ask one question at a time, never a list

If someone seems to be in crisis or mentions self-harm, gently acknowledge their pain 
and share: "If you're going through something heavy, talking to someone trained to help 
can make a real difference. Crisis Text Line: text HOME to 741741."

You never pretend to be human. If asked, you're honest that you're an AI.
Your goal is always to eventually connect people with other humans — not to replace that need.`;

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

export async function summarizeUserSoul(messages: { role: string; content: string }[]): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `Based on this person's conversation history, write a short, poetic summary (3-5 sentences) 
        of who they are — their moods, interests, the small things they notice, what they care about. 
        Focus on authentic moments, not demographics. This will be used to find meaningful human connections for them.
        Write in third person. Be specific, not generic.`,
      },
      {
        role: "user",
        content: messages
          .filter((m) => m.role === "user")
          .map((m) => m.content)
          .join("\n"),
      },
    ],
    max_tokens: 200,
  });
  return response.choices[0].message.content ?? "";
}

export async function generateSparkReason(
  userASummary: string,
  userBSummary: string
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are finding the spark between two people.
        Given two descriptions of people, write ONE warm, casual sentence that feels like a gentle nudge from a friend — 
        like "there's someone who's been thinking about the same thing lately" or "someone who knows what it feels like to miss home".
        Focus on the emotional or human thread they share, not surface-level interests.
        Be warm, specific, and a little poetic. Never mention names. Start with "There's someone..."`,
      },
      {
        role: "user",
        content: `Person A: ${userASummary}\n\nPerson B: ${userBSummary}`,
      },
    ],
    max_tokens: 80,
  });
  return response.choices[0].message.content ?? "There's someone who might just get it.";
}
