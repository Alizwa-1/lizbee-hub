import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { chatLizBee } from "@/lib/ai.functions";
import { loadChat, saveChat, clearChat, isOnboarded, markOnboarded, type ChatMsg } from "@/lib/storage";
import { toast } from "sonner";
import logo from "@/assets/lizbee-logo.png";

const WELCOME: ChatMsg = {
  role: "assistant",
  ts: Date.now(),
  content:
    "Hi! I'm **LizBee** 🐝 — your AI productivity buddy. I can help you draft professional emails, summarise meetings, and research topics faster.\n\nTry asking:\n- *How do I create an email?*\n- *Summarise my meeting notes*\n- *Improve my prompt about climate change*\n\n_Small name. Big brains._ ✨",
};

function renderMarkdown(text: string) {
  // ultra-minimal markdown: bold, italics, line breaks, bullets
  const escaped = text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code class='rounded bg-muted px-1 py-0.5 text-xs'>$1</code>")
    .replace(/^- (.*)$/gm, "• $1")
    .replace(/\n/g, "<br/>");
}

export function LizBeeWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = loadChat();
    if (stored.length === 0) {
      setMessages([WELCOME]);
      if (!isOnboarded()) {
        setTimeout(() => {
          setOpen(true);
          markOnboarded();
        }, 800);
      }
    } else {
      setMessages(stored);
    }
  }, []);

  useEffect(() => {
    if (messages.length) saveChat(messages);
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next: ChatMsg[] = [...messages, { role: "user", content: text, ts: Date.now() }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const payload = next.slice(-16).map((m) => ({ role: m.role, content: m.content }));
      const res = await chatLizBee({ data: { messages: payload } });
      setMessages((cur) => [...cur, { role: "assistant", content: res.content, ts: Date.now() }]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      toast.error(msg);
      setMessages((cur) => [
        ...cur,
        { role: "assistant", content: `Oops — ${msg}`, ts: Date.now() },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    clearChat();
    setMessages([WELCOME]);
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open LizBee chat"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-gradient-honey px-4 py-3 text-sm font-semibold text-charcoal shadow-honey transition hover:scale-105"
        >
          <img src={logo} alt="" width={28} height={28} className="animate-buzz" />
          Ask LizBee
        </button>
      )}
      {open && (
        <div className="fixed inset-x-3 bottom-3 z-50 flex h-[min(78vh,640px)] flex-col overflow-hidden rounded-3xl border bg-card shadow-honey sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[400px]">
          <div className="flex items-center gap-3 border-b bg-gradient-honey px-4 py-3">
            <img src={logo} alt="LizBee" width={40} height={40} className="rounded-xl bg-cream" />
            <div className="flex-1">
              <div className="font-display text-base font-semibold leading-none text-charcoal">LizBee 🐝</div>
              <div className="text-[11px] text-charcoal/70">Always buzzing. Always right.</div>
            </div>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-charcoal hover:bg-charcoal/10" onClick={reset} aria-label="Clear chat">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-charcoal hover:bg-charcoal/10" onClick={() => setOpen(false)} aria-label="Close">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-background/60 p-4">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start gap-2"}>
                {m.role === "assistant" && (
                  <img src={logo} alt="" width={28} height={28} className="mt-1 h-7 w-7 shrink-0 rounded-lg bg-cream" />
                )}
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-sm bg-charcoal px-3 py-2 text-sm text-background"
                      : "max-w-[85%] rounded-2xl rounded-bl-sm bg-cream px-3 py-2 text-sm text-charcoal"
                  }
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content) }}
                />
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="animate-buzz">🐝</span> Buzzing right on it…
              </div>
            )}
          </div>
          <div className="border-t p-3">
            <div className="flex items-end gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Ask LizBee anything…"
                rows={2}
                className="min-h-[44px] resize-none rounded-xl text-sm"
              />
              <Button
                size="icon"
                onClick={send}
                disabled={loading || !input.trim()}
                className="h-10 w-10 shrink-0 bg-gradient-honey text-charcoal hover:opacity-90"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-[10px] leading-snug text-muted-foreground">
              ⚠️ LizBee can make mistakes. Verify important info.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
