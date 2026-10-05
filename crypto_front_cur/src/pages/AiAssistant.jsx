import { useEffect, useRef, useState } from "react";
import { Bot, Send, Trash2 } from "lucide-react";
import Button from "../components/common/Button";
import { aiService } from "../services/aiService";
import { useToast } from "../context/ToastContext";

const SUGGESTIONS = [
  "What is Bitcoin?",
  "What is the current Bitcoin price?",
  "Which coins are performing well today?",
  "Explain market capitalization.",
  "What is a crypto wallet?",
  "What is the difference between Bitcoin and Ethereum?",
];

export default function AiAssistant() {
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);
  const configured = aiService.isConfigured();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = async (text) => {
    const content = (text || input).trim();
    if (!content) return;
    setInput("");
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", content }]);
    setTyping(true);
    try {
      const reply = await aiService.sendMessage(content);
      const textReply =
        typeof reply === "string"
          ? reply
          : reply?.message || reply?.reply || JSON.stringify(reply);
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: "assistant", content: textReply }]);
    } catch (err) {
      toast.error(err.userMessage || err.message);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content:
            err.code === "AI_NOT_CONFIGURED"
              ? "CryptoX AI is ready on the frontend, but the backend AI route is not available yet. No simulated answers are shown."
              : err.userMessage || "The assistant could not respond.",
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8.5rem)] flex-col fade-in lg:h-[calc(100vh-6rem)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">CryptoX AI</h1>
          <p className="text-sm text-slate-400">Your intelligent crypto market assistant</p>
        </div>
        <Button variant="ghost" onClick={() => setMessages([])} aria-label="Clear conversation">
          <Trash2 size={16} />
        </Button>
      </div>

      {!configured ? (
        <div className="mb-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          AI responses are disabled until the real backend endpoint is set in `src/config/apiConfig.js` (`AI_ENDPOINT`).
        </div>
      ) : null}

      <div className="flex-1 space-y-3 overflow-y-auto rounded-2xl border border-white/8 bg-[#111827] p-4 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="py-8 text-center text-slate-400">
            <Bot className="mx-auto mb-3" />
            <p>Ask about markets, wallets, or crypto concepts.</p>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="min-h-11 rounded-xl border border-white/10 bg-[#151B2B] px-3 py-2 text-left text-sm"
                  onClick={() => send(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm ${
                m.role === "user"
                  ? "ml-auto bg-gradient-to-r from-blue-600 to-violet-600"
                  : "bg-[#151B2B] text-slate-100"
              }`}
            >
              {m.content}
            </div>
          ))
        )}
        {typing ? (
          <div className="w-fit rounded-2xl bg-[#151B2B] px-4 py-3 text-sm text-slate-400" aria-live="polite">
            CryptoX AI is typing...
          </div>
        ) : null}
        <div ref={endRef} />
      </div>

      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <label className="sr-only" htmlFor="ai-input">
          Message
        </label>
        <input
          id="ai-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask CryptoX AI"
          className="h-12 flex-1 rounded-xl border border-white/10 bg-[#151B2B] px-3"
        />
        <Button type="submit" className="px-4" aria-label="Send">
          <Send size={16} />
        </Button>
      </form>
    </div>
  );
}
