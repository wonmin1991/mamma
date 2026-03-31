"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { birthChecklist, CHECKLIST_CATEGORIES } from "@/data/nurseryItems";
import {
  ChevronLeft,
  Heart,
  Send,
  Users,
  CheckCircle2,
  Circle,
  ArrowLeftRight,
  Copy,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const MESSAGE_EMOJIS = ["❤️", "🥰", "💪", "🤗", "👶", "🍼", "✨", "🌙"];

export default function CouplePage() {
  const {
    coupleEnabled, partners, activePartner, coupleMessages, coupleCode, checkedItems,
    enableCouple, switchPartner, addCoupleMessage, toggleCheckItem, hearts,
  } = useStore();
  const { currentWeek } = usePregnancy();

  const [tab, setTab] = useState<"message" | "checklist">("message");
  const [msgText, setMsgText] = useState("");
  const [msgEmoji, setMsgEmoji] = useState<string | undefined>();
  const [momName, setMomName] = useState("");
  const [dadName, setDadName] = useState("");
  const [checkFilter, setCheckFilter] = useState("all");

  const currentPartner = partners.find((p) => p.role === activePartner);
  const otherPartner = partners.find((p) => p.role !== activePartner);

  const handleSendMessage = () => {
    if (!msgText.trim()) return;
    addCoupleMessage(msgText.trim(), msgEmoji);
    setMsgText("");
    setMsgEmoji(undefined);
  };

  const handleSetup = () => {
    if (!momName.trim() || !dadName.trim()) return;
    enableCouple(momName.trim(), dadName.trim());
  };

  const copyCode = async () => {
    if (coupleCode) {
      try {
        await navigator.clipboard.writeText(coupleCode);
        alert("커플 코드가 복사되었어요!");
      } catch {
        alert("복사에 실패했어요. 코드: " + coupleCode);
      }
    }
  };

  const filteredChecklist = birthChecklist
    .filter((item) => checkFilter === "all" || item.category === checkFilter)
    .sort((a, b) => a.recommendedWeek - b.recommendedWeek);

  const checkProgress = checkedItems.length;
  const checkTotal = birthChecklist.length;

  if (!coupleEnabled) {
    return (
      <main className="flex flex-col">
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-5 pt-12 pb-3">
          <div className="flex items-center gap-2">
            <Link href="/" className="p-1 -ml-1" aria-label="뒤로가기">
              <ChevronLeft size={22} className="text-foreground" />
            </Link>
            <h1 className="text-lg font-bold text-foreground">부부 모드</h1>
          </div>
        </header>

        <section className="px-5 mt-4">
          <div className="text-center py-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-light to-secondary-light flex items-center justify-center mx-auto mb-5">
              <span className="text-5xl">👫</span>
            </div>
            <h2 className="text-xl font-bold text-foreground">함께하는 임신 생활</h2>
            <p className="text-sm text-muted mt-2 leading-relaxed">
              부부가 함께 메시지를 나누고,
              <br />
              출산 준비를 체크하며 D-day를 기다려요.
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-card-border shadow-sm p-5 mt-4">
            <h3 className="font-bold text-sm text-foreground mb-4">프로필 설정</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🤰</span>
                <input
                  type="text"
                  placeholder="엄마 이름 (닉네임)"
                  value={momName}
                  onChange={(e) => setMomName(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-surface border border-card-border text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🧑</span>
                <input
                  type="text"
                  placeholder="아빠 이름 (닉네임)"
                  value={dadName}
                  onChange={(e) => setDadName(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-surface border border-card-border text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <button
                onClick={handleSetup}
                disabled={!momName.trim() || !dadName.trim()}
                className="w-full py-3 mt-2 rounded-2xl bg-primary text-white font-semibold text-sm disabled:opacity-40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Users size={16} /> 부부 모드 시작하기
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex flex-col">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-5 pt-12 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="p-1 -ml-1" aria-label="뒤로가기">
              <ChevronLeft size={22} className="text-foreground" />
            </Link>
            <h1 className="text-lg font-bold text-foreground">부부 모드</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-primary font-medium flex items-center gap-0.5">
              <Heart size={12} fill="currentColor" /> {hearts}
            </span>
          </div>
        </div>

        {/* Partner switcher */}
        <div className="flex items-center gap-3 mt-3 bg-card rounded-2xl border border-card-border p-3">
          <div className="flex-1 flex items-center gap-2">
            <span className="text-xl">{currentPartner?.emoji}</span>
            <div>
              <p className="text-xs font-bold text-foreground">{currentPartner?.name}</p>
              <p className="text-xs text-primary">{activePartner === "mom" ? "엄마" : "아빠"} 모드</p>
            </div>
          </div>
          <button
            onClick={switchPartner}
            className="p-2 rounded-xl bg-surface border border-card-border"
            aria-label="파트너 전환"
          >
            <ArrowLeftRight size={16} className="text-muted" />
          </button>
          <div className="flex-1 flex items-center gap-2 justify-end">
            <div className="text-right">
              <p className="text-xs font-bold text-foreground">{otherPartner?.name}</p>
              <p className="text-xs text-muted">{activePartner === "mom" ? "아빠" : "엄마"}</p>
            </div>
            <span className="text-xl">{otherPartner?.emoji}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setTab("message")}
            className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
              tab === "message" ? "bg-primary text-white" : "bg-card text-muted border border-card-border"
            }`}
          >
            💌 메시지
          </button>
          <button
            onClick={() => setTab("checklist")}
            className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
              tab === "checklist" ? "bg-primary text-white" : "bg-card text-muted border border-card-border"
            }`}
          >
            ✅ 출산 준비 ({checkProgress}/{checkTotal})
          </button>
        </div>
      </header>

      {tab === "message" && (
        <section className="px-5 mt-3 pb-6 flex flex-col">
          {coupleCode && (
            <button
              onClick={copyCode}
              className="flex items-center justify-center gap-2 mb-3 py-2 rounded-xl bg-surface-violet border border-card-border text-xs text-secondary"
            >
              <Copy size={12} /> 커플 코드: <span className="font-bold">{coupleCode}</span>
            </button>
          )}

          {coupleMessages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">💌</p>
              <p className="text-sm font-medium text-foreground">첫 메시지를 보내보세요!</p>
              <p className="text-xs text-muted mt-1">서로에게 응원의 메시지를 전해요</p>
            </div>
          )}

          <div className="flex flex-col gap-2 mb-4">
            {coupleMessages.map((msg) => {
              const isMine = msg.from === activePartner;
              const partner = partners.find((p) => p.role === msg.from);
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[75%] ${isMine ? "order-1" : "order-2"}`}>
                    {!isMine && (
                      <p className="text-xs text-muted mb-0.5 ml-1">
                        {partner?.emoji} {partner?.name}
                      </p>
                    )}
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm ${
                        isMine
                          ? "bg-primary text-white rounded-br-md"
                          : "bg-card border border-card-border text-foreground rounded-bl-md"
                      }`}
                    >
                      {msg.emoji && <span className="mr-1">{msg.emoji}</span>}
                      {msg.text}
                    </div>
                    <p className={`text-[11px] text-muted mt-0.5 ${isMine ? "text-right mr-1" : "ml-1"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Emoji selector */}
          <div className="flex gap-1.5 mb-2 overflow-x-auto hide-scrollbar">
            {MESSAGE_EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => setMsgEmoji(msgEmoji === e ? undefined : e)}
                className={`flex-shrink-0 w-8 h-8 rounded-full text-base flex items-center justify-center transition-all ${
                  msgEmoji === e ? "bg-primary-light scale-110" : "bg-surface"
                }`}
              >
                {e}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder={`${currentPartner?.name}(${activePartner === "mom" ? "엄마" : "아빠"})의 메시지...`}
              value={msgText}
              onChange={(e) => setMsgText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 px-4 py-2.5 rounded-xl bg-card border border-card-border text-sm text-foreground focus:outline-none focus:border-primary"
            />
            <button
              onClick={handleSendMessage}
              disabled={!msgText.trim()}
              className="px-4 py-2.5 rounded-xl bg-primary text-white disabled:opacity-40 transition-opacity"
              aria-label="메시지 보내기"
            >
              <Send size={16} />
            </button>
          </div>
        </section>
      )}

      {tab === "checklist" && (
        <section className="px-5 mt-3 pb-6">
          {/* Progress bar */}
          <div className="bg-card rounded-2xl border border-card-border shadow-sm p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-foreground">출산 준비 진행률</p>
              <p className="text-sm font-bold text-primary">{Math.round((checkProgress / checkTotal) * 100)}%</p>
            </div>
            <div className="w-full h-3 rounded-full bg-surface overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                style={{ width: `${(checkProgress / checkTotal) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted mt-2">
              <Sparkles size={11} className="inline text-accent" /> 체크 완료 시 +2 하트
            </p>
          </div>

          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-2 mb-3">
            {CHECKLIST_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCheckFilter(cat.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1
                  ${checkFilter === cat.id
                    ? "bg-primary text-white shadow-sm"
                    : "bg-card text-muted border border-card-border"
                  }`}
              >
                <span>{cat.emoji}</span> {cat.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {filteredChecklist.map((item) => {
              const isChecked = checkedItems.includes(item.id);
              const isPast = item.recommendedWeek <= currentWeek;
              const isCurrent = Math.abs(item.recommendedWeek - currentWeek) <= 2;
              return (
                <button
                  key={item.id}
                  onClick={() => toggleCheckItem(item.id)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                    isChecked
                      ? "bg-surface-emerald border-emerald-200 dark:border-emerald-800"
                      : isCurrent
                        ? "bg-primary-lighter border-primary-light"
                        : "bg-card border-card-border"
                  }`}
                >
                  {isChecked ? (
                    <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Circle size={20} className="text-muted-light flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isChecked ? "text-muted line-through" : "text-foreground"}`}>
                      {item.label}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      추천 시기: {item.recommendedWeek}주
                      {isPast && !isChecked && " ⚡ 지금 해야 해요!"}
                      {isCurrent && !isChecked && !isPast && " 📌 곧 해야 해요"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
