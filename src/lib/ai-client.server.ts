const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
export const MODEL = "google/gemini-3-flash-preview";

export async function callAI(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
): Promise<string> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: MODEL, messages }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("Buzzing too fast — rate limit reached. Try again in a moment. 🐝");
    if (res.status === 402) throw new Error("AI credits exhausted. Please add credits in your workspace billing.");
    throw new Error(`AI request failed (${res.status}): ${txt.slice(0, 200)}`);
  }
  const data = await res.json();
  return (data?.choices?.[0]?.message?.content as string) ?? "";
}
