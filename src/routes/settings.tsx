import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Settings as SettingsIcon, Moon, Sun, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { clearChat } from "@/lib/storage";
import { toast } from "sonner";
import { ResponsibleAI } from "@/components/responsible-ai";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings · LizBee" },
      { name: "description", content: "Personalise LizBee — theme, chat history, and data." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const v = localStorage.getItem("lizbee.theme") === "dark";
    setDark(v);
    document.documentElement.classList.toggle("dark", v);
  }, []);
  function toggle(v: boolean) {
    setDark(v);
    document.documentElement.classList.toggle("dark", v);
    localStorage.setItem("lizbee.theme", v ? "dark" : "light");
  }
  function wipeChat() { clearChat(); toast.success("LizBee chat cleared"); }
  function wipeAll() {
    localStorage.removeItem("lizbee.docs.v1");
    localStorage.removeItem("lizbee.chat.v1");
    localStorage.removeItem("lizbee.onboarded.v1");
    toast.success("All local LizBee data cleared");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
      <header className="flex items-start gap-3">
        <div className="rounded-2xl bg-gradient-honey p-3 shadow-honey">
          <SettingsIcon className="h-6 w-6 text-charcoal" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-semibold">Settings</h1>
          <p className="text-sm text-muted-foreground">Personalise your LizBee workspace.</p>
        </div>
      </header>

      <div className="rounded-2xl border bg-card p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {dark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            <div>
              <Label className="text-base">Dark mode</Label>
              <p className="text-xs text-muted-foreground">Softer on the eyes for late-night buzzing.</p>
            </div>
          </div>
          <Switch checked={dark} onCheckedChange={toggle} />
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-5 shadow-soft space-y-3">
        <h2 className="font-display text-lg font-semibold">Data & privacy</h2>
        <p className="text-sm text-muted-foreground">
          Your chat history and documents are stored locally in this browser. LizBee never sends them anywhere except to generate responses.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={wipeChat}><Trash2 className="mr-1.5 h-4 w-4" /> Clear chat</Button>
          <Button variant="destructive" onClick={wipeAll}><Trash2 className="mr-1.5 h-4 w-4" /> Clear all LizBee data</Button>
        </div>
      </div>

      <ResponsibleAI />
    </div>
  );
}
