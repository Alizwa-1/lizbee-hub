import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AIOutput } from "@/components/ai-output";
import { VoiceButton } from "@/components/voice-button";
import { ResponsibleAI } from "@/components/responsible-ai";
import { researchAssist } from "@/lib/ai.functions";
import { toast } from "sonner";
import { Search, Wand2 } from "lucide-react";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant · LizBee" },
      { name: "description", content: "Understand topics, summarise articles, and improve your prompts with LizBee AI research." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const [tab, setTab] = useState<"summary" | "article" | "followup">("summary");
  const [query, setQuery] = useState("");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [improving, setImproving] = useState(false);

  async function run() {
    if (query.trim().length < 2) {
      toast.error("Give LizBee something to research 🐝");
      return;
    }
    setLoading(true);
    try {
      const res = await researchAssist({ data: { query, mode: tab, context } });
      setOutput(res.content);
      if (tab === "followup") setContext((c) => c + "\n\nQ: " + query + "\nA: " + res.content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to research");
    } finally {
      setLoading(false);
    }
  }

  async function improvePrompt() {
    if (!query.trim()) return;
    setImproving(true);
    try {
      const res = await researchAssist({ data: { query, mode: "improvePrompt" } });
      setQuery(res.content.trim().replace(/^["']|["']$/g, ""));
      toast.success("LizBee sharpened your prompt ✨");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setImproving(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
      <header className="flex items-start gap-3">
        <div className="rounded-2xl bg-gradient-honey p-3 shadow-honey">
          <Search className="h-6 w-6 text-charcoal" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-semibold">AI Research Assistant</h1>
          <p className="text-sm text-muted-foreground">Summaries, article breakdowns, follow-ups, and prompt polish.</p>
        </div>
      </header>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList>
          <TabsTrigger value="summary">Topic summary</TabsTrigger>
          <TabsTrigger value="article">Article summariser</TabsTrigger>
          <TabsTrigger value="followup">Follow-up chat</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="mt-4 grid gap-6 lg:grid-cols-2">
          <InputCard label="Topic or question" placeholder="e.g. Explain Artificial Intelligence in healthcare." {...{ query, setQuery, run, loading, improvePrompt, improving }} rows={5} />
          <AIOutput content={output} loading={loading} onRegenerate={run} category="research" suggestedTitle={`Research — ${query.slice(0, 40) || "topic"}`} />
        </TabsContent>

        <TabsContent value="article" className="mt-4 grid gap-6 lg:grid-cols-2">
          <InputCard label="Paste an article" placeholder="Paste the full article text here…" {...{ query, setQuery, run, loading, improvePrompt, improving }} rows={14} showImprove={false} />
          <AIOutput content={output} loading={loading} onRegenerate={run} category="research" suggestedTitle="Article summary" />
        </TabsContent>

        <TabsContent value="followup" className="mt-4 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-2xl border bg-card p-5 shadow-soft">
            <div className="grid gap-2">
              <Label>Prior context (optional)</Label>
              <Textarea rows={5} value={context} onChange={(e) => setContext(e.target.value)} placeholder="LizBee remembers this while you ask follow-ups." />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Your follow-up question</Label>
                <VoiceButton onTranscript={(t) => setQuery((p) => (p ? p + " " + t : t))} />
              </div>
              <Textarea rows={3} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ask a deeper question…" />
            </div>
            <Button onClick={run} disabled={loading} className="w-full bg-gradient-honey text-charcoal hover:opacity-90">
              {loading ? "Buzzing…" : "Ask LizBee"}
            </Button>
            <ResponsibleAI compact />
          </div>
          <AIOutput content={output} loading={loading} onRegenerate={run} category="research" suggestedTitle="Follow-up answer" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InputCard({ label, placeholder, query, setQuery, run, loading, improvePrompt, improving, rows = 6, showImprove = true }: {
  label: string; placeholder: string; query: string; setQuery: (v: string) => void; run: () => void; loading: boolean; improvePrompt: () => void; improving: boolean; rows?: number; showImprove?: boolean;
}) {
  return (
    <div className="space-y-4 rounded-2xl border bg-card p-5 shadow-soft">
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label>{label}</Label>
          <VoiceButton onTranscript={(t) => setQuery(query ? query + " " + t : t)} />
        </div>
        <Textarea rows={rows} value={query} onChange={(e) => setQuery(e.target.value)} placeholder={placeholder} />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={run} disabled={loading} className="flex-1 bg-gradient-honey text-charcoal hover:opacity-90">
          {loading ? "Buzzing…" : "Ask LizBee"}
        </Button>
        {showImprove && (
          <Button variant="outline" onClick={improvePrompt} disabled={improving || !query.trim()}>
            <Wand2 className="mr-1.5 h-4 w-4" /> {improving ? "Polishing…" : "Improve prompt"}
          </Button>
        )}
      </div>
      <ResponsibleAI compact />
    </div>
  );
}
