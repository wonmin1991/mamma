"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { weeklyGuide } from "@/data/mock";
import { ChevronLeft, ChevronRight, Apple, Ban, Sparkles, Camera } from "lucide-react";
import Link from "next/link";
import GuideWeekSync from "@/components/GuideWeekSync";

const trimesterColors = {
  1: { bg: "bg-surface-rose", border: "border-primary-light", text: "text-primary", badge: "bg-primary-light text-primary" },
  2: { bg: "bg-surface-violet", border: "border-secondary-light", text: "text-secondary", badge: "bg-secondary-light text-secondary" },
  3: { bg: "bg-surface-amber", border: "border-accent-light", text: "text-accent", badge: "bg-accent-light text-accent" },
};

const trimesterNames: Record<number, string> = {
  1: "초기 (1~13주)",
  2: "중기 (14~27주)",
  3: "후기 (28~40주)",
};

export default function GuidePage() {
  const searchParams = useSearchParams();
  const weekParam = searchParams.get("week");
  const parsedWeek = weekParam ? Number(weekParam) : NaN;
  const initialIdx = Number.isFinite(parsedWeek) ? Math.max(0, Math.min(39, parsedWeek - 1)) : 15;
  const [selectedIdx, setSelectedIdx] = useState(initialIdx);
  const onWeekReady = useCallback((idx: number) => {
    if (!weekParam) setSelectedIdx(idx);
  }, [weekParam]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const week = weeklyGuide[selectedIdx];
  const colors = trimesterColors[week.trimester as keyof typeof trimesterColors];

  useEffect(() => {
    if (scrollRef.current) {
      const btn = scrollRef.current.children[selectedIdx] as HTMLElement;
      if (btn) {
        btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, [selectedIdx]);

  const goNext = () => {
    if (selectedIdx < weeklyGuide.length - 1) setSelectedIdx(selectedIdx + 1);
  };
  const goPrev = () => {
    if (selectedIdx > 0) setSelectedIdx(selectedIdx - 1);
  };

  return (
    <main className="flex flex-col">
      <GuideWeekSync onWeekReady={onWeekReady} />
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-5 pt-12 pb-3">
        <div className="flex items-center gap-2">
          <Link href="/" className="p-1 -ml-1" aria-label="뒤로가기">
            <ChevronLeft size={22} className="text-foreground" />
          </Link>
          <h1 className="text-lg font-bold text-foreground">주차별 가이드</h1>
          <span className="text-xs text-muted ml-auto">전체 40주</span>
        </div>

        {/* Trimester tabs */}
        <div className="flex gap-2 mt-3 mb-2">
          {[1, 2, 3].map((tri) => {
            const c = trimesterColors[tri as keyof typeof trimesterColors];
            const isActive = week.trimester === tri;
            const triWeeks = weeklyGuide.filter((w) => w.trimester === tri);
            return (
              <button
                key={tri}
                onClick={() => setSelectedIdx(weeklyGuide.findIndex((w) => w.trimester === tri))}
                className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive ? `${c.bg} ${c.text} border ${c.border}` : "bg-card text-muted border border-card-border"
                }`}
              >
                {tri}분기 ({triWeeks[0].week}~{triWeeks[triWeeks.length - 1].week}주)
              </button>
            );
          })}
        </div>
      </header>

      {/* Week selector - grid + scrollable */}
      <section className="px-5">
        <div className="flex items-center gap-2 mb-2">
          <select
            value={selectedIdx}
            onChange={(e) => setSelectedIdx(Number(e.target.value))}
            className="px-3 py-1.5 rounded-xl bg-card border border-card-border text-sm text-foreground font-medium focus:outline-none focus:border-primary"
            aria-label="주차 빠른 이동"
          >
            {weeklyGuide.map((w, i) => (
              <option key={w.week} value={i}>
                {w.week}주차 — {w.babySize}
              </option>
            ))}
          </select>
          <span className="text-xs text-muted">또는 아래에서 선택</span>
        </div>
        <div ref={scrollRef} className="flex gap-1.5 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-3">
          {weeklyGuide.map((w, i) => {
            const c = trimesterColors[w.trimester as keyof typeof trimesterColors];
            return (
              <button
                key={w.week}
                onClick={() => setSelectedIdx(i)}
                className={`flex-shrink-0 w-11 h-11 rounded-xl text-xs font-medium transition-all flex items-center justify-center
                  ${selectedIdx === i
                    ? `${c.bg} ${c.text} border-2 ${c.border} shadow-sm scale-110 font-bold`
                    : "bg-card text-muted border border-card-border hover:border-muted-light"
                  }`}
              >
                {w.week}
              </button>
            );
          })}
        </div>
      </section>

      {/* Week info */}
      <section className="px-5 mt-1 pb-6 animate-fade-in-up" key={selectedIdx}>
        <div className={`${colors.bg} rounded-3xl p-6 border ${colors.border}`}>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goPrev}
              disabled={selectedIdx === 0}
              className="p-2 rounded-full bg-card/60 disabled:opacity-30 transition-opacity"
            >
              <ChevronLeft size={18} className="text-foreground" />
            </button>
            <div className="text-center">
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${colors.badge}`}>
                {trimesterNames[week.trimester]}
              </span>
              <h2 className="text-2xl font-bold mt-2 text-foreground">
                임신 {week.week}주차
              </h2>
            </div>
            <button
              onClick={goNext}
              disabled={selectedIdx === weeklyGuide.length - 1}
              className="p-2 rounded-full bg-card/60 disabled:opacity-30 transition-opacity"
            >
              <ChevronRight size={18} className="text-foreground" />
            </button>
          </div>

          <div className="bg-card/70 backdrop-blur-sm rounded-2xl p-5 text-center">
            <span className="text-6xl block mb-3">{week.babySizeEmoji}</span>
            <p className="text-lg font-bold text-foreground">아기는 {week.babySize} 크기</p>
            <div className="flex justify-center gap-6 mt-3">
              <div>
                <p className="text-xs text-muted">몸무게</p>
                <p className="text-sm font-semibold text-foreground">{week.babyWeight}</p>
              </div>
              <div className="w-px bg-card-border" />
              <div>
                <p className="text-xs text-muted">키</p>
                <p className="text-sm font-semibold text-foreground">{week.babyLength}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Baby development */}
        <div className="mt-5 bg-card rounded-2xl border border-card-border shadow-sm p-5">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2 mb-3">
            <span className="text-lg">👶</span> 아기 발달
          </h3>
          <div className="flex flex-col gap-2">
            {week.babyDevelopment.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-surface-violet text-secondary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-foreground leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ultrasound CTA */}
        <Link
          href={`/ultrasound`}
          className="mt-4 flex items-center gap-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border border-card-border p-4 active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Camera size={20} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{week.week}주 초음파 사진 기록하기</p>
            <p className="text-[11px] text-muted mt-0.5">병원에서 받은 초음파 사진을 앨범에 추가해보세요</p>
          </div>
          <ChevronRight size={16} className="text-muted flex-shrink-0" />
        </Link>

        {/* Mom changes */}
        <div className="mt-4 bg-card rounded-2xl border border-card-border shadow-sm p-5">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2 mb-3">
            <span className="text-lg">🤰</span> 엄마 몸의 변화
          </h3>
          <div className="flex flex-col gap-2">
            {week.momChanges.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                <p className="text-sm text-foreground leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-4 bg-card rounded-2xl border border-card-border shadow-sm p-5">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-accent" /> 이 시기 팁
          </h3>
          <div className="flex flex-col gap-2">
            {week.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-accent flex-shrink-0 mt-0.5">✦</span>
                <p className="text-sm text-foreground leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Foods */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-surface-emerald rounded-2xl p-4 border border-card-border">
            <h3 className="font-bold text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mb-2.5">
              <Apple size={14} /> 추천 음식
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {week.goodFoods.map((food) => (
                <span key={food} className="text-[11px] px-2.5 py-1 rounded-full bg-card/80 text-foreground font-medium">
                  {food}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-surface-red rounded-2xl p-4 border border-card-border">
            <h3 className="font-bold text-xs text-red-500 dark:text-red-400 flex items-center gap-1.5 mb-2.5">
              <Ban size={14} /> 피할 음식
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {week.avoidFoods.map((food) => (
                <span key={food} className="text-[11px] px-2.5 py-1 rounded-full bg-card/80 text-foreground font-medium">
                  {food}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
