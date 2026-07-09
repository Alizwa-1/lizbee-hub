import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Library } from "lucide-react";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Email Template Library · LizBee" },
      { name: "description", content: "Pre-built professional email templates: meetings, HR, business, and more." },
    ],
  }),
  component: TemplatesPage,
});

interface Tpl { title: string; category: string; tone: "Formal" | "Friendly" | "Persuasive"; purpose: string }

const TEMPLATES: Tpl[] = [
  { title: "Meeting request", category: "Workplace", tone: "Formal", purpose: "Request a meeting with my manager to discuss project progress and blockers." },
  { title: "Follow-up email", category: "Workplace", tone: "Friendly", purpose: "Follow up on a previous email about the marketing plan; check on next steps." },
  { title: "Professional introduction", category: "Workplace", tone: "Formal", purpose: "Introduce myself to a new team member and offer to help onboard them." },
  { title: "Project update", category: "Workplace", tone: "Formal", purpose: "Weekly project status update to stakeholders — progress, risks, next steps." },
  { title: "Thank-you email", category: "Workplace", tone: "Friendly", purpose: "Thank a colleague for their help on a project." },
  { title: "Leave request", category: "HR", tone: "Formal", purpose: "Request annual leave from [date] to [date] and mention handover plan." },
  { title: "Job application", category: "HR", tone: "Formal", purpose: "Apply for a role — highlight relevant experience and interest in the company." },
  { title: "Resignation letter", category: "HR", tone: "Formal", purpose: "Give notice of resignation with two weeks and thank the team." },
  { title: "Performance review response", category: "HR", tone: "Formal", purpose: "Respond to a performance review — acknowledge feedback and outline growth plan." },
  { title: "Client check-in", category: "Business", tone: "Friendly", purpose: "Check in with a client to see how things are going and offer support." },
  { title: "Proposal email", category: "Business", tone: "Persuasive", purpose: "Send a project proposal outlining value, timeline, and pricing." },
  { title: "Partnership request", category: "Business", tone: "Persuasive", purpose: "Propose a partnership — mutual benefits and next steps." },
];

function TemplatesPage() {
  const navigate = useNavigate();
  const cats = Array.from(new Set(TEMPLATES.map((t) => t.category)));

  function use(t: Tpl) {
    sessionStorage.setItem("lizbee.emailTemplate", JSON.stringify(t));
    navigate({ to: "/email" });
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <header className="flex items-start gap-3">
        <div className="rounded-2xl bg-gradient-honey p-3 shadow-honey">
          <Library className="h-6 w-6 text-charcoal" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-semibold">Email Template Library</h1>
          <p className="text-sm text-muted-foreground">Pick a template — LizBee will generate a polished version.</p>
        </div>
      </header>

      {cats.map((cat) => (
        <section key={cat}>
          <h2 className="mb-3 font-display text-lg font-semibold">{cat}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.filter((t) => t.category === cat).map((t) => (
              <button
                key={t.title}
                onClick={() => use(t)}
                className="group rounded-2xl border bg-card p-4 text-left shadow-soft transition hover:-translate-y-0.5 hover:shadow-honey"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-semibold">{t.title}</h3>
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent-foreground">{t.tone}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{t.purpose}</p>
                <span className="mt-3 inline-block text-xs font-medium text-honey-deep">Use template →</span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
