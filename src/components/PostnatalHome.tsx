"use client";

import Link from "next/link";
import {
  Baby,
  ClipboardList,
  TrendingUp,
  Award,
  BookOpen,
  Shield,
  Utensils,
  Settings2,
  ChevronRight,
  ArrowLeftRight,
} from "lucide-react";
import { useBabyStore, getBabyAgeLabel, generateInsights, type Insight } from "@/store/useBabyStore";
import { CARE_LOG_TYPES } from "@/data/postnatal";
import { useMemo } from "react";

const quickLinks = [
  { href: "/care-log", label: "육아기록", emoji: "📋", bg: "bg-surface-rose", icon: ClipboardList },
  { href: "/growth", label: "성장기록", emoji: "📈", bg: "bg-surface-violet", icon: TrendingUp },
  { href: "/milestones", label: "마일스톤", emoji: "🏆", bg: "bg-surface-amber", icon: Award },
  { href: "/diary", label: "성장일기", emoji: "📖", bg: "bg-surface-sky", icon: BookOpen },
];

const guideLinks = [
  { href: "/vaccination", label: "예방접종", emoji: "💉", icon: Shield },
  { href: "/baby-food", label: "이유식 가이드", emoji: "🍼", icon: Utensils },
  { href: "/tips", label: "육아 꿀팁", emoji: "💡", icon: BookOpen },
  { href: "/restaurants", label: "맛집", emoji: "🍽️", icon: Utensils },
];

const insightColors: Record<Insight["priority"], string> = {
  low: "border-emerald-200 dark:border-emerald-800 bg-surface-emerald",
  medium: "border-amber-200 dark:border-amber-800 bg-surface-amber",
  high: "border-primary-light bg-surface-rose",
};

export default function PostnatalHome() {
  const baby = useBabyStore((s) => s.baby);
  const careLogs = useBabyStore((s) => s.careLogs);
  const setMode = useBabyStore((s) => s.setMode);

  const summary = useBabyStore((s) => s.getTodaySummary());
  const insights = useMemo(() => generateInsights(careLogs), [careLogs]);

  if (!baby) return null;

  const ageLabel = getBabyAgeLabel(baby.birthDate);

  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="relative px-5 pt-14 pb-8 bg-gradient-to-br from-hero-from via-hero-via to-hero-to">
        <div className="animate-fade-in-up">
          <div className="flex items-center justify-between">
            <p className="text-sm text-primary font-medium mb-1">오늘도 화이팅! 💪</p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMode("pregnancy")}
                className="p-1.5 rounded-full hover:bg-card/50 transition-colors"
                aria-label="임신 모드로 전환"
              >
                <ArrowLeftRight size={14} className="text-muted" />
              </button>
              <Link href="/settings" className="p-1.5 rounded-full hover:bg-card/50 transition-colors" aria-label="설정">
                <Settings2 size={16} className="text-muted" />
              </Link>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground leading-tight">
            맘마<span className="text-primary">.</span>
          </h1>
        </div>

        {/* Baby card */}
        <div className="mt-5 bg-card/80 backdrop-blur-sm rounded-2xl p-4 border border-card-border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-light to-secondary-light flex items-center justify-center">
              <span className="text-2xl">👶</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-foreground text-lg">{baby.name}</p>
              <p className="text-sm text-primary font-medium">{ageLabel}</p>
            </div>
          </div>

          {/* Today summary */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="bg-surface-rose rounded-xl p-2.5 text-center">
              <p className="text-lg font-bold text-primary">{summary.feeds}</p>
              <p className="text-[10px] text-muted">수유</p>
            </div>
            <div className="bg-surface-violet rounded-xl p-2.5 text-center">
              <p className="text-lg font-bold text-secondary">{summary.sleeps}</p>
              <p className="text-[10px] text-muted">수면</p>
            </div>
            <div className="bg-surface-amber rounded-xl p-2.5 text-center">
              <p className="text-lg font-bold text-amber-600">{summary.diapers}</p>
              <p className="text-[10px] text-muted">기저귀</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="px-5 -mt-1">
        <div className="grid grid-cols-4 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-2 py-4 rounded-2xl ${link.bg} border border-card-border transition-transform active:scale-95`}
            >
              <span className="text-2xl">{link.emoji}</span>
              <span className="text-xs font-medium text-foreground">{link.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick care log buttons */}
      <section className="px-5 mt-5">
        <h2 className="text-sm font-bold text-foreground mb-3">빠른 기록</h2>
        <div className="grid grid-cols-3 gap-2">
          {CARE_LOG_TYPES.slice(0, 3).map((t) => (
            <Link
              key={t.id}
              href="/care-log"
              className="flex items-center gap-2 px-3 py-3 rounded-xl bg-card border border-card-border active:scale-[0.98] transition-transform"
            >
              <span className="text-lg">{t.emoji}</span>
              <span className="text-xs font-medium text-foreground">{t.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* AI Insights */}
      {insights.length > 0 && (
        <section className="px-5 mt-5">
          <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-1.5">
            <Baby size={14} className="text-primary" /> AI 인사이트
          </h2>
          <div className="flex flex-col gap-2">
            {insights.map((insight, i) => (
              <div
                key={i}
                className={`rounded-xl border p-3.5 ${insightColors[insight.priority]}`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg">{insight.emoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{insight.title}</p>
                    <p className="text-xs text-muted mt-0.5 leading-relaxed">{insight.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Guide links */}
      <section className="mt-5 px-5">
        <h2 className="text-sm font-bold text-foreground mb-3">가이드</h2>
        <div className="grid grid-cols-2 gap-3">
          {guideLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 p-4 bg-card rounded-2xl border border-card-border active:scale-[0.98] transition-transform"
            >
              <span className="text-xl">{link.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{link.label}</p>
              </div>
              <ChevronRight size={14} className="text-muted" />
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-10 px-5 pb-8">
        <div className="bg-gradient-to-r from-surface-rose to-surface-violet rounded-2xl p-5 text-center">
          <p className="text-2xl mb-2">👶</p>
          <p className="text-sm font-semibold text-foreground">{baby.name}의 건강한 성장을 응원합니다</p>
          <p className="text-xs text-muted mt-1">맘마와 함께하는 육아</p>
        </div>
      </footer>
    </main>
  );
}
