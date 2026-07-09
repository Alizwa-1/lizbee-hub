import { Copy, Download, RefreshCw, Save, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addDoc, type DocCategory } from "@/lib/storage";
import { ResponsibleAI } from "./responsible-ai";

interface Props {
  content: string;
  loading?: boolean;
  onRegenerate?: () => void;
  category: DocCategory;
  suggestedTitle: string;
  emptyLabel?: string;
}

export function AIOutput({ content, loading, onRegenerate, category, suggestedTitle, emptyLabel }: Props) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Copied to clipboard 🐝");
    setTimeout(() => setCopied(false), 1500);
  }

  function download() {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${suggestedTitle.replace(/[^\w\d-]+/g, "_")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function save() {
    addDoc({ title: suggestedTitle, category, content });
    setSaved(true);
    toast.success("Saved to your documents ✨");
    setTimeout(() => setSaved(false), 1500);
  }

  if (loading) {
    return (
      <div className="rounded-2xl border bg-card p-8 text-center shadow-soft">
        <div className="mx-auto mb-3 h-8 w-8 animate-buzz text-3xl">🐝</div>
        <p className="text-sm font-medium">Buzzing right on it…</p>
        <p className="mt-1 text-xs text-muted-foreground">LizBee is generating your response.</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="rounded-2xl border border-dashed bg-card/50 p-10 text-center text-sm text-muted-foreground">
        {emptyLabel ?? "Your AI-generated output will appear here."}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ResponsibleAI compact />
      <div className="rounded-2xl border bg-card p-5 shadow-soft">
        <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-foreground">
          {content}
        </pre>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" onClick={copy}>
          {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
          Copy
        </Button>
        {onRegenerate && (
          <Button size="sm" variant="secondary" onClick={onRegenerate}>
            <RefreshCw className="mr-1.5 h-4 w-4" /> Regenerate
          </Button>
        )}
        <Button size="sm" variant="secondary" onClick={download}>
          <Download className="mr-1.5 h-4 w-4" /> Download
        </Button>
        <Button size="sm" onClick={save} className="bg-gradient-honey text-charcoal hover:opacity-90">
          {saved ? <Check className="mr-1.5 h-4 w-4" /> : <Save className="mr-1.5 h-4 w-4" />}
          Save
        </Button>
      </div>
    </div>
  );
}
