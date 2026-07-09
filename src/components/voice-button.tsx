import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoice } from "@/hooks/use-voice";
import { toast } from "sonner";

export function VoiceButton({ onTranscript }: { onTranscript: (text: string) => void }) {
  const { listening, supported, start, stop } = useVoice(onTranscript);
  if (!supported) return null;
  return (
    <Button
      type="button"
      size="icon"
      variant={listening ? "default" : "outline"}
      className={listening ? "bg-honey text-charcoal animate-pulse" : ""}
      onClick={() => {
        if (listening) stop();
        else {
          start();
          toast("Listening… speak your prompt 🐝");
        }
      }}
      aria-label={listening ? "Stop voice input" : "Start voice input"}
    >
      {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  );
}
