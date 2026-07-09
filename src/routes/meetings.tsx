import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AIOutput } from "@/components/ai-output";
import { VoiceButton } from "@/components/voice-button";
import { ResponsibleAI } from "@/components/responsible-ai";
import { summarizeMeeting } from "@/lib/ai.functions";
import { toast } from "sonner";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summariser · LizBee" },
      { name: "description", content: "Turn long meeting notes into clean summaries with action items, decisions, and deadlines." },
    ],
  }),
  component: MeetingsPage,
});

const SAMPLE = `John: We need to finalise the marketing plan. Sarah, can you contact the client before Monday?
Sarah: Sure, I'll email them today.
John: I'll prepare the project report by Friday.
Team decided to launch the product in August. Final submission deadline is 15 August.`;

function MeetingsPage() {
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    if (notes.trim().length < 10) {
      toast.error("Paste meeting notes so LizBee can help 🐝");
      return;
    }
    setLoading(true);
    try {
      const res = await summarizeMeeting({ data: { notes } });
      setOutput(res.content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to summarise");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
      <header className="flex items-start gap-3">
        <div className="rounded-2xl bg-gradient-honey p-3 shadow-honey">
          <FileText className="h-6 w-6 text-charcoal" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-semibold">Meeting Notes Summariser</h1>
          <p className="text-sm text-muted-foreground">Paste your notes — LizBee extracts summary, action items, decisions, and deadlines.</p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border bg-card p-5 shadow-soft">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Meeting notes or transcript</Label>
              <VoiceButton onTranscript={(t) => setNotes((p) => (p ? p + "\n" + t : t))} />
            </div>
            <Textarea rows={14} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Paste your meeting transcript or notes here…" />
            <button type="button" onClick={() => setNotes(SAMPLE)} className="text-left text-xs text-honey-deep hover:underline">
              Try a sample →
            </button>
          </div>
          <Button onClick={run} disabled={loading} className="w-full bg-gradient-honey text-charcoal hover:opacity-90">
            {loading ? "Buzzing…" : "Summarise meeting"}
          </Button>
          <ResponsibleAI compact />
        </div>

        <AIOutput
          content={output}
          loading={loading}
          onRegenerate={run}
          category="meeting"
          suggestedTitle={`Meeting — ${new Date().toLocaleDateString()}`}
          emptyLabel="Your structured meeting summary will appear here."
        />
      </div>
    </div>
  );
}
