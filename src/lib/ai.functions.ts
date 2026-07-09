import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";

async function callAI(system: string, user: string): Promise<string> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("LizBee is buzzing too fast — rate limit reached. Try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please add credits in your workspace billing to keep buzzing.");
    throw new Error(`AI request failed (${res.status}): ${txt.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

const EmailInput = z.object({
  purpose: z.string().min(3),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
  recipient: z.string().optional().default(""),
  mode: z.enum(["generate", "shorten", "expand", "rewrite"]).optional().default("generate"),
  existing: z.string().optional().default(""),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => EmailInput.parse(d))
  .handler(async ({ data }) => {
    const system = `You are LizBee 🐝, a professional workplace communication assistant. Write clear, polite, concise professional emails. Always include: Subject line (prefixed "Subject: "), a greeting, a well-structured body, and a closing signature placeholder. Match the requested tone exactly. Never invent private facts; use bracketed placeholders like [Your Name] where needed.`;
    let user = `Tone: ${data.tone}\nRecipient: ${data.recipient || "(unspecified)"}\nPurpose / key points: ${data.purpose}`;
    if (data.mode !== "generate" && data.existing) {
      user = `Take this existing email and ${data.mode} it while keeping the ${data.tone} tone.\n\nEXISTING EMAIL:\n${data.existing}\n\nContext / instructions: ${data.purpose}`;
    }
    const content = await callAI(system, user);
    return { content };
  });

const MeetingInput = z.object({
  notes: z.string().min(10),
});

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => MeetingInput.parse(d))
  .handler(async ({ data }) => {
    const system = `You are LizBee 🐝, an expert meeting assistant. Analyze the provided meeting notes/transcript and produce a clean structured summary using Markdown with these exact H2 sections in this order:\n\n## Meeting Summary\nA short 2-4 sentence overview.\n\n## Action Items\nBullet list. Format each as: **[Owner]** — task (due: date if mentioned).\n\n## Decisions Made\nBullet list of concrete decisions/agreements.\n\n## Deadlines\nBullet list of dates and what they relate to.\n\nIf a section has no items, write "_None identified._" under it. Be faithful — do not invent facts.`;
    const content = await callAI(system, data.notes);
    return { content };
  });

const ResearchInput = z.object({
  query: z.string().min(2),
  mode: z.enum(["summary", "article", "followup", "improvePrompt"]).default("summary"),
  context: z.string().optional().default(""),
});

export const researchAssist = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ResearchInput.parse(d))
  .handler(async ({ data }) => {
    const systems: Record<string, string> = {
      summary: `You are LizBee 🐝, an AI research assistant. Explain the topic clearly and accurately using Markdown. Structure: brief intro, **Key Points** bullet list, **Important Concepts** bullet list, and a short conclusion. Keep it simple and factual. Note when information may be outdated.`,
      article: `You are LizBee 🐝, an AI research assistant. Summarize the article the user pastes. Return Markdown with sections: ## Main Ideas, ## Important Findings, ## Key Conclusions. Bullet points, faithful to source.`,
      followup: `You are LizBee 🐝, an AI research assistant. Answer the follow-up question in context of the previous topic. Be clear, concise, and cite general reasoning.`,
      improvePrompt: `You are LizBee 🐝, a prompt engineering coach. Given a user's rough prompt, return a single improved research prompt (one paragraph) that is specific, scoped, and requests structure. Return ONLY the improved prompt, no preamble.`,
    };
    const user = data.context
      ? `Previous context:\n${data.context}\n\nUser: ${data.query}`
      : data.query;
    const content = await callAI(systems[data.mode], user);
    return { content };
  });

const ChatInput = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string(),
  })).min(1),
});

export const chatLizBee = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ChatInput.parse(d))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const system = `You are LizBee 🐝 — the AI Learning & Intelligence Assistant for the "AI Workplace Productivity Assistant" app. Your personality: warm, clever, slightly playful, encouraging, professional-friendly. You occasionally use 🐝 and ✨. Taglines you embody: "Small name. Big brains.", "Where cute meets clever.", "Always buzzing. Always right."

Signature phrases to sprinkle in naturally (don't overuse):
- "Let LizBee handle that."
- "Buzzing right on it…"
- "Here's the sweet answer:"
- "No worries — LizBee's got you."
- "Let's break it down, nice and easy."

You help users navigate the platform which has these tools:
1. **Smart Email Generator** (/email) — generate professional emails with Formal, Friendly, or Persuasive tone. Also has an Email Template Library.
2. **Meeting Notes Summariser** (/meetings) — extracts summary, action items, decisions, deadlines from meeting notes.
3. **AI Research Assistant** (/research) — topic summaries, article summarization, prompt improvement, follow-up questions.
4. **Documents** (/documents) — saved AI-generated content (emails, summaries, research) stored in-browser.
5. **Templates** (/templates) — pre-built email templates.

Guide users, suggest better prompts when theirs are vague, and always encourage responsible AI use — remind them AI output may contain errors and should be reviewed before important decisions. Keep replies concise (usually under 120 words) unless the user asks for depth. Use Markdown.`;

    const res = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: system }, ...data.messages],
      }),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      if (res.status === 429) throw new Error("Buzzing too fast — try again in a moment. 🐝");
      if (res.status === 402) throw new Error("AI credits exhausted. Please top up in workspace billing.");
      throw new Error(`LizBee request failed (${res.status}): ${txt.slice(0, 200)}`);
    }
    const json = await res.json();
    return { content: json.choices?.[0]?.message?.content ?? "" };
  });
