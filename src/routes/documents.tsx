import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { deleteDoc, loadDocs, updateDoc, type DocCategory, type SavedDoc } from "@/lib/storage";
import { FolderOpen, Search, Trash2, Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";
import { ResponsibleAI } from "@/components/responsible-ai";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Saved Documents · LizBee" },
      { name: "description", content: "All your AI-generated emails, meeting summaries, and research notes — saved in your browser." },
    ],
  }),
  component: DocsPage,
});

const CATS: { key: DocCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "email", label: "Emails" },
  { key: "meeting", label: "Meetings" },
  { key: "research", label: "Research" },
  { key: "note", label: "Notes" },
];

function DocsPage() {
  const [docs, setDocs] = useState<SavedDoc[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<DocCategory | "all">("all");
  const [selected, setSelected] = useState<SavedDoc | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ title: "", content: "" });

  function refresh() { setDocs(loadDocs()); }
  useEffect(refresh, []);

  const filtered = docs
    .filter((d) => cat === "all" || d.category === cat)
    .filter((d) => (q ? (d.title + d.content).toLowerCase().includes(q.toLowerCase()) : true));

  function open(d: SavedDoc) {
    setSelected(d); setEditing(false); setDraft({ title: d.title, content: d.content });
  }
  function save() {
    if (!selected) return;
    updateDoc(selected.id, { title: draft.title, content: draft.content });
    toast.success("Saved ✨");
    refresh();
    setSelected({ ...selected, title: draft.title, content: draft.content });
    setEditing(false);
  }
  function remove(id: string) {
    deleteDoc(id); refresh();
    if (selected?.id === id) setSelected(null);
    toast("Deleted");
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <header className="flex items-start gap-3">
        <div className="rounded-2xl bg-gradient-honey p-3 shadow-honey">
          <FolderOpen className="h-6 w-6 text-charcoal" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-semibold">Saved Documents</h1>
          <p className="text-sm text-muted-foreground">Your AI-generated content, organised in your browser.</p>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search documents…" className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-1 rounded-xl bg-muted p-1">
          {CATS.map((c) => (
            <button
              key={c.key}
              onClick={() => setCat(c.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${cat === c.key ? "bg-card shadow-soft" : "text-muted-foreground hover:text-foreground"}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_2fr]">
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              No documents yet. Generate content and hit <b>Save</b>.
            </div>
          ) : (
            filtered.map((d) => (
              <div
                key={d.id}
                onClick={() => open(d)}
                className={`cursor-pointer rounded-xl border bg-card p-3 shadow-soft transition hover:shadow-honey ${selected?.id === d.id ? "ring-2 ring-honey" : ""}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{d.title}</p>
                    <p className="mt-0.5 text-[11px] uppercase tracking-wide text-honey-deep">{d.category}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{new Date(d.updatedAt).toLocaleString()}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); remove(d.id); }} className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-3">
          {selected ? (
            <>
              <ResponsibleAI compact />
              <div className="rounded-2xl border bg-card p-5 shadow-soft">
                <div className="mb-3 flex items-center gap-2">
                  {editing ? (
                    <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
                  ) : (
                    <h2 className="flex-1 font-display text-xl font-semibold">{selected.title}</h2>
                  )}
                  {editing ? (
                    <>
                      <Button size="sm" onClick={save} className="bg-gradient-honey text-charcoal"><Check className="mr-1 h-4 w-4" />Save</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditing(false)}><X className="h-4 w-4" /></Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setEditing(true)}><Pencil className="mr-1 h-4 w-4" />Edit</Button>
                  )}
                </div>
                {editing ? (
                  <textarea
                    className="min-h-[400px] w-full rounded-xl border bg-background p-3 text-sm"
                    value={draft.content}
                    onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                  />
                ) : (
                  <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed">{selected.content}</pre>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
              Select a document to view or edit it.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
