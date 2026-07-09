import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, Search, Library, FolderOpen, Sparkles, ArrowRight, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { loadDocs, type SavedDoc } from "@/lib/storage";
import { ResponsibleAI } from "@/components/responsible-ai";
import logo from "@/assets/lizbee-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · LizBee AI Workplace Assistant" },
      { name: "description", content: "Your AI productivity dashboard. Draft emails, summarise meetings, and research with LizBee." },
    ],
  }),
  component: Dashboard,
});

const tools = [
  { title: "Smart Email Generator", to: "/email", desc: "Draft polished emails in Formal, Friendly, or Persuasive tone.", icon: Mail, tint: "from-honey to-honey-deep" },
  { title: "Meeting Summariser", to: "/meetings", desc: "Turn long notes into action items, decisions, and deadlines.", icon: FileText, tint: "from-mint to-honey" },
  { title: "Research Assistant", to: "/research", desc: "Understand topics, summarise articles, sharpen your prompts.", icon: Search, tint: "from-blush to-honey" },
  { title: "Email Template Library", to: "/templates", desc: "Ready-to-use templates for common workplace scenarios.", icon: Library, tint: "from-cream to-honey" },
  { title: "Saved Documents", to: "/documents", desc: "Organise every AI-generated email, summary, and note.", icon: FolderOpen, tint: "from-honey to-blush" },
];

function Dashboard() {
  const [docs, setDocs] = useState<SavedDoc[]>([]);
  useEffect(() => setDocs(loadDocs()), []);
  const score = Math.min(100, 20 + docs.length * 8);

  return (
    <div className="bg-gradient-hero">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 sm:py-10">
        <section className="relative overflow-hidden rounded-3xl border bg-card p-6 shadow-soft sm:p-10">
          <div className="flex flex-col-reverse items-start gap-6 sm:flex-row sm:items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-honey-deep">Welcome back 👋</p>
              <h1 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-5xl">
                Meet <span className="text-honey-deep">LizBee</span> — your AI productivity buddy.
              </h1>
              <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
                Improve your workday with AI-powered workplace tools. Draft emails, summarise meetings, and research faster — the buzzworthy way.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link to="/email" className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-honey px-4 py-2.5 text-sm font-semibold text-charcoal shadow-honey">
                  <Sparkles className="h-4 w-4" /> Start with an email
                </Link>
                <Link to="/meetings" className="inline-flex items-center gap-1.5 rounded-xl border bg-card px-4 py-2.5 text-sm font-medium">
                  Summarise a meeting <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <img src={logo} alt="LizBee mascot" width={160} height={160} className="animate-buzz drop-shadow-xl" />
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Productivity score" value={`${score}`} suffix="/100" hint="Grows as you use LizBee." />
          <StatCard label="Saved documents" value={String(docs.length)} hint="Emails, summaries & research." />
          <StatCard label="LizBee status" value="Buzzing ✨" hint="Always on. Always right." />
        </section>

        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-display text-xl font-semibold">AI tools</h2>
            <span className="text-xs text-muted-foreground">Where cute meets clever.</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((t) => (
              <Link key={t.to} to={t.to} className="group rounded-2xl border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-honey">
                <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${t.tint} text-charcoal`}>
                  <t.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold">{t.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                <span className="mt-4 inline-flex items-center text-sm font-medium text-honey-deep">
                  Open <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border bg-card p-5 shadow-soft lg:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-honey-deep" />
              <h2 className="font-display text-lg font-semibold">Recent activity</h2>
            </div>
            {docs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No documents yet. Generate an email or meeting summary and hit <b>Save</b> to see it here.
              </p>
            ) : (
              <ul className="divide-y">
                {docs.slice(0, 5).map((d) => (
                  <li key={d.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{d.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {d.category} · {new Date(d.updatedAt).toLocaleString()}
                      </p>
                    </div>
                    <Link to="/documents" className="text-xs font-medium text-honey-deep">Open</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <ResponsibleAI />
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, suffix, hint }: { label: string; value: string; suffix?: string; hint: string }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-soft">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold">
        {value}
        {suffix && <span className="text-base text-muted-foreground">{suffix}</span>}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}
