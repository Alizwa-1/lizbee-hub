import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export function ResponsibleAI({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border border-honey/40 bg-accent/50 p-3 text-xs text-muted-foreground",
        className,
      )}
      role="note"
    >
      <AlertTriangle className="h-4 w-4 shrink-0 text-honey-deep" />
      <p className="leading-relaxed">
        <span className="font-semibold text-foreground">Responsible AI:</span>{" "}
        {compact
          ? "Review AI output before using it for important decisions."
          : "AI-generated content may contain mistakes or inaccuracies. Always review and verify results before using them for professional, academic, or important decisions. LizBee assists — it doesn't replace human judgment."}
      </p>
    </div>
  );
}
