"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Send, Sparkles, AlertTriangle } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { useBabyStore, getBabyAgeMonths } from "@/store/useBabyStore";
import { env } from "@/lib/env";
import { isNative } from "@/lib/native";
import { BASE_URL } from "@/lib/constants";
import { canSendChat, consumeChat, getRemainingChats } from "@/lib/chatRateLimit";
import { MAX_USER_MESSAGE_LENGTH } from "@/lib/chatSystemPrompt";
import type { ChatContext } from "@/lib/chatSystemPrompt";

interface Turn {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS: Record<string, string[]> = {
  pregnancy: [
    "입덧이 너무 심한데 어떻게 해야 하나요?",
    "철분제는 언제부터 먹어야 하나요?",
    "이번 주차에 주의할 증상이 있을까요?",
  ],
  postnatal: [
    "신생아 수유 간격은 어느 정도가 좋나요?",
    "황달은 언제 사라지나요?",
    "예방접종 일정을 놓쳤어요. 어떻게 해야 하죠?",
  ],
  infertility: [
    "시험관 시술 전에 준비할 게 있을까요?",
    "난임 시술 정부 지원금 신청은 어디서 하나요?",
    "착상혈과 생리혈은 어떻게 구분하나요?",
  ],
};

export default function ChatPage() {
  const pregnancy = usePregnancy();
  const mode = useBabyStore((s) => s.mode);
  const baby = useBabyStore((s) => s.baby);

  const [messages, setMessages] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRemaining(getRemainingChats());
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    if (trimmed.length > MAX_USER_MESSAGE_LENGTH) {
      setError(`${MAX_USER_MESSAGE_LENGTH}자 이내로 입력해주세요.`);
      return;
    }
    if (!canSendChat()) {
      setError(`오늘 무료 사용량 ${env.chatDailyLimit}회를 모두 사용했어요. 내일 다시 만나요!`);
      return;
    }
    setError(null);

    const newHistory: Turn[] = [...messages, { role: "user", content: trimmed }];
    setMessages([...newHistory, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    const ctx: ChatContext = {
      mode,
      currentWeek: mode === "pregnancy" ? pregnancy.currentWeek : undefined,
      babyAgeMonths: mode === "postnatal" && baby ? getBabyAgeMonths(baby.birthDate) : undefined,
      babyNickname: mode === "postnatal" ? baby?.name : pregnancy.babyNickname,
      childOrder: pregnancy.childOrder,
    };

    try {
      const endpoint = isNative() ? `${BASE_URL.replace(/\/$/, "")}/api/chat` : "/api/chat";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory, context: ctx }),
      });

      if (!res.ok || !res.body) {
        const errBody = await res.json().catch(() => ({ error: "응답을 받지 못했어요." }));
        throw new Error(errBody.error ?? "응답을 받지 못했어요.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistant = "";
      let consumed = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";
        for (const evt of events) {
          const line = evt.split("\n").find((l) => l.startsWith("data: "));
          if (!line) continue;
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data) as { delta?: string; error?: string };
            if (parsed.error) throw new Error(parsed.error);
            if (parsed.delta) {
              if (!consumed) {
                consumeChat();
                consumed = true;
                setRemaining(getRemainingChats());
              }
              assistant += parsed.delta;
              setMessages((prev) => {
                const copy = prev.slice();
                copy[copy.length - 1] = { role: "assistant", content: assistant };
                return copy;
              });
            }
          } catch (e) {
            if (e instanceof Error) throw e;
          }
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "오류가 발생했어요.";
      setMessages((prev) => {
        const copy = prev.slice();
        copy[copy.length - 1] = { role: "assistant", content: `❗ ${msg}` };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  const suggestions = SUGGESTIONS[mode] ?? SUGGESTIONS.pregnancy;

  return (
    <div className="flex flex-col h-screen bg-background">
      <PageHeader title="AI 상담" rightSlot={
        <span className="text-xs text-muted-light">오늘 {remaining}회 남음</span>
      } />

      <div className="px-5 pb-2">
        <div className="flex items-start gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-3 py-2 text-[11px] text-amber-900 dark:text-amber-200">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          <p>AI 응답은 참고용이며, 의학적 진단을 대체하지 않습니다. 응급 상황은 즉시 119에 연락하세요.</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-10 gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles size={22} className="text-primary" />
            </div>
            <p className="text-sm text-muted">임신·출산·육아 관련 질문을 자유롭게 물어보세요</p>
            <div className="flex flex-col gap-2 w-full mt-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => void send(s)}
                  className="text-left text-sm px-3 py-2.5 rounded-xl bg-card border border-card-border hover:bg-card/80 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={`${m.role}-${i}-${m.content.length}`} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-card border border-card-border text-foreground rounded-bl-sm"
              }`}
            >
              {m.content || (loading && i === messages.length - 1 ? "…" : "")}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="px-5 pb-1 text-xs text-red-600 dark:text-red-400">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="px-4 pb-6 pt-2 border-t border-card-border bg-background">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            placeholder="질문을 입력하세요…"
            rows={1}
            disabled={loading}
            maxLength={MAX_USER_MESSAGE_LENGTH}
            className="flex-1 resize-none bg-card border border-card-border rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 max-h-32"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 transition"
            aria-label="전송"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
