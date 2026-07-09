import { createFileRoute, Link } from "@tanstack/react-router";
import { HelpCircle, Mail, FileText, Search, Mic, Save } from "lucide-react";
import { ResponsibleAI } from "@/components/responsible-ai";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & Support · LizBee" },
      { name: "description", content: "Learn how to get the most out of LizBee — your AI workplace productivity assistant." },
    ],
  }),
  component: HelpPage,
});

const FAQ = [
  { q: "How do I create an email?", a: "Go to Email Generator, enter the purpose, pick a tone (Formal, Friendly, or Persuasive), and click Generate. You can then Shorten, Expand, Rewrite, or Save it." },
  { q: "How does the meeting summariser work?", a: "Paste your meeting notes or transcript. LizBee extracts a summary, action items, decisions, and deadlines — all organised in Markdown." },
  { q: "Can I speak instead of type?", a: "Yes 🐝 — tap the microphone button on any input to dictate. (Chrome-based browsers work best.)" },
  { q: "Where are my saved documents kept?", a: "Right in your browser (localStorage). They stay on this device and are not sent anywhere." },
  { q: "Is the AI always right?", a: "No. AI-generated content can contain mistakes. Always review important results before using them." },
];

function HelpPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
      <header className="flex items-start gap-3">
        <div className="rounded-2xl bg-gradient-honey p-3 shadow-honey">
          <HelpCircle className="h-6 w-6 text-charcoal" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-semibold">Help & Support</h1>
          <p className="text-sm text-muted-foreground">Get the most out of LizBee.</p>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Tip icon={Mail} title="Write great emails" to="/email">Be specific about recipient, goal, and tone.</Tip>
        <Tip icon={FileText} title="Summarise meetings" to="/meetings">Paste raw notes — LizBee organises them.</Tip>
        <Tip icon={Search} title="Research faster" to="/research">Use "Improve prompt" to sharpen your questions.</Tip>
        <Tip icon={Mic} title="Voice input" to="/email">Tap the mic on any input to dictate.</Tip>
        <Tip icon={Save} title="Save your work" to="/documents">Everything you save lives in the Documents tab.</Tip>
      </section>

      <section className="rounded-2xl border bg-card p-5 shadow-soft">
        <h2 className="font-display text-xl font-semibold">FAQ</h2>
        <div className="mt-4 divide-y">
          {FAQ.map((f) => (
            <details key={f.q} className="group py-3">
              <summary className="cursor-pointer list-none font-medium">
                <span className="mr-2 text-honey-deep">🐝</span>{f.q}
              </summary>
              <p className="mt-2 pl-6 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <ResponsibleAI />
    </div>
  );
}

function Tip({ icon: Icon, title, to, children }: { icon: React.ComponentType<{ className?: string }>; title: string; to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="rounded-2xl border bg-card p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-honey">
      <Icon className="mb-2 h-5 w-5 text-honey-deep" />
      <h3 className="font-display text-base font-semibold">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{children}</p>
    </Link>
  );
}
