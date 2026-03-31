"use client";

import Link from "next/link";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { weeklyGuide } from "@/data/mock";
import { ChevronRight, Apple, Sparkles } from "lucide-react";

export default function ThisWeekHighlight() {
  const { currentWeek, isOnboarded } = usePregnancy();

  if (!isOnboarded) return null;

  const weekIdx = Math.max(0, Math.min(39, currentWeek - 1));
  const week = weeklyGuide[weekIdx];

  return (
    <Link href={`/guide?week=${currentWeek}`} className="block">
      <div className="bg-card rounded-2xl border border-card-border shadow-sm p-4 hover:border-primary/40 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <Sparkles size={14} className="text-accent" />
            이번 주 확인하세요
          </h2>
          <span className="text-xs text-primary font-medium flex items-center gap-0.5">
            {currentWeek}주차 가이드 <ChevronRight size={14} />
          </span>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 bg-surface-violet rounded-xl p-3">
            <p className="text-xs font-semibold text-secondary mb-1.5">아기 발달</p>
            <p className="text-xs text-foreground leading-relaxed line-clamp-2">
              {week.babyDevelopment[0]}
            </p>
          </div>
          <div className="flex-1 bg-surface-emerald rounded-xl p-3">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1.5 flex items-center gap-1">
              <Apple size={12} /> 추천 음식
            </p>
            <div className="flex flex-wrap gap-1">
              {week.goodFoods.slice(0, 3).map((food) => (
                <span key={food} className="text-xs text-foreground">
                  {food}
                </span>
              ))}
            </div>
          </div>
        </div>

        {week.tips[0] && (
          <div className="mt-2.5 px-3 py-2 rounded-xl bg-surface-amber">
            <p className="text-xs text-foreground">
              <span className="text-accent font-medium">TIP</span> {week.tips[0]}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}
