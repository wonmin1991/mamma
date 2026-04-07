"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Send, Check, MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const CATEGORIES = [
  { id: "bug", label: "오류/버그", emoji: "🐛", desc: "앱이 제대로 동작하지 않아요" },
  { id: "feature", label: "기능 요청", emoji: "💡", desc: "이런 기능이 있으면 좋겠어요" },
  { id: "content", label: "정보 오류", emoji: "📝", desc: "의료/혜택 정보가 틀린 것 같아요" },
  { id: "ux", label: "사용성 개선", emoji: "✨", desc: "사용하기 불편한 점이 있어요" },
  { id: "other", label: "기타", emoji: "💬", desc: "그 외 의견이나 응원" },
];

export default function FeedbackPage() {
  const { user } = useAuth();
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [contact, setContact] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!category || !content.trim()) {
      setError("카테고리와 내용을 입력해주세요");
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      const supabase = createClient();
      const deviceInfo = `${navigator.userAgent.slice(0, 100)} | ${window.innerWidth}x${window.innerHeight}`;

      const { error: insertError } = await supabase.from("feedback").insert({
        user_id: user?.id ?? null,
        category,
        content: content.trim(),
        contact: contact.trim() || null,
        page: document.referrer || null,
        device_info: deviceInfo,
      });

      if (insertError) throw insertError;
      setSubmitted(true);
    } catch {
      setError("전송에 실패했어요. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="flex flex-col min-h-screen">
        <header className="px-5 pt-12 pb-3">
          <Link href="/settings" className="p-1 -ml-1 inline-block" aria-label="뒤로가기">
            <ChevronLeft size={22} className="text-foreground" />
          </Link>
        </header>
        <section className="flex-1 flex flex-col items-center justify-center px-5 pb-20">
          <div className="w-20 h-20 rounded-full bg-surface-emerald flex items-center justify-center mb-5">
            <Check size={36} className="text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground">감사합니다!</h2>
          <p className="text-sm text-muted mt-2 text-center leading-relaxed">
            소중한 의견을 보내주셨어요.
            <br />
            더 나은 맘마가 되도록 노력할게요.
          </p>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => { setSubmitted(false); setCategory(""); setContent(""); setContact(""); }}
              className="px-5 py-2.5 rounded-xl bg-surface text-foreground text-sm font-medium border border-card-border"
            >
              추가 의견 보내기
            </button>
            <Link
              href="/settings"
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium"
            >
              돌아가기
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex flex-col">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-5 pt-12 pb-3">
        <div className="flex items-center gap-2">
          <Link href="/settings" className="p-1 -ml-1" aria-label="뒤로가기">
            <ChevronLeft size={22} className="text-foreground" />
          </Link>
          <h1 className="text-lg font-bold text-foreground">의견 보내기</h1>
        </div>
      </header>

      <section className="px-5 pb-28 flex flex-col gap-5">
        {/* Intro */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-4 border border-card-border">
          <div className="flex items-center gap-3">
            <MessageSquare size={22} className="text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-foreground">맘마를 함께 만들어주세요</p>
              <p className="text-xs text-muted mt-0.5">
                불편한 점, 원하는 기능, 틀린 정보 등 어떤 의견이든 환영해요
              </p>
            </div>
          </div>
        </div>

        {/* Category */}
        <div>
          <p className="text-xs text-muted mb-2 font-medium">어떤 종류의 의견인가요?</p>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all ${
                  category === cat.id
                    ? "border-primary bg-primary-light"
                    : "border-card-border bg-card"
                }`}
              >
                <span className="text-lg">{cat.emoji}</span>
                <div>
                  <p className={`text-xs font-semibold ${category === cat.id ? "text-primary" : "text-foreground"}`}>
                    {cat.label}
                  </p>
                  <p className="text-[10px] text-muted mt-0.5">{cat.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div>
          <p className="text-xs text-muted mb-2 font-medium">자세한 내용을 알려주세요</p>
          <textarea
            placeholder="어떤 화면에서, 어떤 상황에서 불편했는지 구체적으로 적어주시면 큰 도움이 돼요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={1000}
            rows={5}
            className="w-full px-4 py-3 rounded-2xl bg-surface border border-card-border text-sm text-foreground focus:outline-none focus:border-primary resize-none"
          />
          <p className="text-[10px] text-muted text-right mt-1">{content.length}/1000</p>
        </div>

        {/* Contact (optional) */}
        <div>
          <p className="text-xs text-muted mb-2 font-medium">답변받을 연락처 (선택)</p>
          <input
            type="text"
            placeholder="이메일 또는 연락처 (답변이 필요하면 입력해주세요)"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            maxLength={100}
            className="w-full px-4 py-3 rounded-2xl bg-surface border border-card-border text-sm text-foreground focus:outline-none focus:border-primary"
          />
        </div>

        {/* Error */}
        {error && <p className="text-xs text-red-500 px-1">{error}</p>}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting || !category || !content.trim()}
          className="w-full py-3.5 rounded-2xl bg-primary text-white font-semibold text-sm disabled:opacity-40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {submitting ? (
            "보내는 중..."
          ) : (
            <>
              <Send size={16} />
              의견 보내기
            </>
          )}
        </button>

        {/* Info */}
        <p className="text-[10px] text-muted text-center leading-relaxed">
          {user
            ? "로그인 상태로 전송되며, 필요 시 답변드릴 수 있어요."
            : "비로그인 상태에서도 의견을 보낼 수 있어요. 답변을 원하시면 연락처를 남겨주세요."}
        </p>
      </section>
    </main>
  );
}
