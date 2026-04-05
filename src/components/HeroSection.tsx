"use client";

import Link from "next/link";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { weeklyGuide } from "@/data/mock";
import { ChevronRight, Settings2, ArrowLeftRight, AlertTriangle } from "lucide-react";
import { formatDueDate } from "@/lib/date";
import { useBabyStore } from "@/store/useBabyStore";

export default function HeroSection() {
  const { currentWeek, currentDay, daysUntilDue, dueDate, isOnboarded } = usePregnancy();

  const weekIdx = Math.max(0, Math.min(39, currentWeek - 1));
  const weekInfo = weeklyGuide[weekIdx];

  const baby = useBabyStore((s) => s.baby);
  const setMode = useBabyStore((s) => s.setMode);
  const trimesterLabel = weekInfo.trimester === 1 ? "초기" : weekInfo.trimester === 2 ? "중기" : "후기";

  return (
    <section className="relative px-5 pt-14 pb-8 bg-gradient-to-br from-hero-from via-hero-via to-hero-to">
      <div className="animate-fade-in-up">
        <div className="flex items-center justify-between">
          <p className="text-sm text-primary font-medium mb-1">오늘도 건강하세요 ✨</p>
          <div className="flex items-center gap-1">
            <Link
              href="/emergency"
              className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              aria-label="응급 상황 가이드"
            >
              <AlertTriangle size={14} className="text-red-400" />
            </Link>
            {baby && (
              <button
                onClick={() => setMode("postnatal")}
                className="p-1.5 rounded-full hover:bg-card/50 transition-colors"
                aria-label="출산 후 모드로 전환"
              >
                <ArrowLeftRight size={14} className="text-muted" />
              </button>
            )}
            <Link
              href="/settings"
              className="p-1.5 rounded-full hover:bg-card/50 transition-colors"
              aria-label="설정"
            >
              <Settings2 size={16} className="text-muted" />
            </Link>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground leading-tight">
          맘마<span className="text-primary">.</span>
        </h1>
        <p className="text-sm text-muted mt-2 leading-relaxed">
          임산부에게 필요한 맛집, 건강 정보,
          <br />
          주차별 가이드를 한곳에서 만나보세요.
        </p>
      </div>

      <Link href="/guide" className="block mt-5">
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 border border-card-border shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{weekInfo.babySizeEmoji}</span>
              <div>
                <p className="text-xs text-muted">이번 주 아기는</p>
                <p className="font-semibold text-foreground">
                  {weekInfo.babySize} 크기
                </p>
                <p className="text-xs text-primary font-medium">
                  임신 {currentWeek}주 {currentDay > 0 ? `${currentDay}일` : ""} · {trimesterLabel}
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-muted" />
          </div>

          {isOnboarded && (
            <div className="mt-3 pt-3 border-t border-card-border/60 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-muted">D-day</p>
                  <p className="text-lg font-bold text-primary">
                    {daysUntilDue > 0 ? `D-${daysUntilDue}` : "D-Day!"}
                  </p>
                </div>
                {dueDate && (
                  <div>
                    <p className="text-xs text-muted">예정일</p>
                    <p className="text-xs font-semibold text-foreground">{formatDueDate(dueDate)}</p>
                  </div>
                )}
              </div>
              <div className="w-16 h-2 rounded-full bg-surface overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                  style={{ width: `${Math.min(100, (currentWeek / 40) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </Link>
    </section>
  );
}
