import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AIOutput } from "@/components/ai-output";
import { VoiceButton } from "@/components/voice-button";
import { ResponsibleAI } from "@/components/responsible-ai";
import { generateEmail } from "@/lib/ai.functions";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator · LizBee" },
      { name: "description", content: "Generate professional emails in Formal, Friendly, or Persuasive tone with LizBee AI." },
    ],
  }),
  component: EmailPage,
});

type Tone = "Formal" | "Friendly" | "Persuasive";

function EmailPage() {
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function run(mode: "generate" | "shorten" | "expand" | "rewrite" = "generate") {
    if (!purpose.trim()) {
      toast.error("Tell LizBee what the email is about first 🐝");
      return;
    }
    setLoading(true);
    try {
      const res = await generateEmail({
        data: { purpose, recipient, tone, mode, existing: output },
      });
      setOutput(res.content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate email");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
      <header className="flex items-start gap-3">
        <div className="rounded-2xl bg-gradient-honey p-3 shadow-honey">
          <Mail className="h-6 w-6 text-charcoal" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-semibold">Smart Email Generator</h1>
          <p className="text-sm text-muted-foreground">Describe your purpose — LizBee drafts a polished email.</p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border bg-card p-5 shadow-soft">
          <div className="grid gap-2">
            <Label>Recipient (optional)</Label>
            <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="e.g. My manager, Client at Acme" />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>What is the email about?</Label>
              <VoiceButton onTranscript={(t) => setPurpose((p) => (p ? p + " " + t : t))} />
            </div>
            <Textarea
              rows={6}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Request a meeting with my manager to discuss Q3 project progress and blockers."
            />
          </div>
          <div className="grid gap-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Formal">Formal — business & official</SelectItem>
                <SelectItem value="Friendly">Friendly — colleagues & team</SelectItem>
                <SelectItem value="Persuasive">Persuasive — proposals & sales</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => run("generate")} disabled={loading} className="w-full bg-gradient-honey text-charcoal hover:opacity-90">
            {loading ? "Buzzing…" : "Generate email"}
          </Button>
          {output && (
            <div className="flex flex-wrap gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => run("shorten")} disabled={loading}>Shorten</Button>
              <Button variant="outline" size="sm" onClick={() => run("expand")} disabled={loading}>Expand</Button>
              <Button variant="outline" size="sm" onClick={() => run("rewrite")} disabled={loading}>Rewrite</Button>
            </div>
          )}
          <ResponsibleAI compact />
        </div>

        <div>
          <AIOutput
            content={output}
            loading={loading}
            onRegenerate={() => run("generate")}
            category="email"
            suggestedTitle={`Email — ${purpose.slice(0, 40) || "draft"}`}
            emptyLabel="Your AI-drafted email will appear here."
          />
        </div>
      </div>
    </div>
  );
}
