"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Info,
  Pill,
} from "lucide-react";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { useStore } from "@/store/useStore";
import {
  supplements,
  getSupplementsForWeek,
  getCurrentPhase,
  SUPPLEMENT_PHASES,
  type Supplement,
} from "@/data/supplements";

const PRIORITY_STYLE = {
  essential: { label: "일반 권장", color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/20" },
  recommended: { label: "참고", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
  optional: { label: "선택 참고", color: "text-muted", bg: "bg-surface" },
};

export default function SupplementsPage() {
  const { currentWeek } = usePregnancy();
  const supplementChecks = useStore((s) => s.supplementChecks);
  const toggleSupplementCheck = useStore((s) => s.toggleSupplementCheck);
  const isSupplementChecked = useStore((s) => s.isSupplementChecked);

  const currentSupplements = useMemo(
    () => getSupplementsForWeek(currentWeek),
    [currentWeek]
  );
  const phase = getCurrentPhase(currentWeek);

  const today = new Date().toISOString().slice(0, 10);
  const todayChecks = supplementChecks[today] ?? [];
  const checkedCount = currentSupplements.filter((s) =>
    todayChecks.includes(s.id)
  ).length;
  const totalCount = currentSupplements.length;
  const progress = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  // 7일간 복용 기록
  const weeklyHistory = useMemo(() => {
    const days: { date: string; label: string; count: number; total: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayLabel = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
      const checks = supplementChecks[dateStr] ?? [];
      const weekForDay = currentWeek; // 근사치 (같은 주차로 가정)
      const total = getSupplementsForWeek(weekForDay).length;
      days.push({ date: dateStr, label: dayLabel, count: checks.length, total });
    }
    return days;
  }, [supplementChecks, currentWeek]);

  // 전체 주차별 영양제 타임라인
  const notCurrentSupplements = supplements.filter(
    (s) => currentWeek < s.startWeek || currentWeek > s.endWeek
  );

  return (
    <main className="flex flex-col">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-5 pt-12 pb-3">
        <div className="flex items-center gap-2">
          <Link href="/" className="p-1 -ml-1" aria-label="뒤로가기">
            <ChevronLeft size={22} className="text-foreground" />
          </Link>
          <h1 className="text-lg font-bold text-foreground">영양제 체크</h1>
          <span className={`ml-auto text-xs px-2.5 py-0.5 rounded-full ${phase.bg} ${phase.color} font-medium`}>
            {currentWeek}주 · {phase.label}
          </span>
        </div>
      </header>

      <section className="px-5 pb-8 flex flex-col gap-4">
        {/* Medical disclaimer */}
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-900/50 p-3 flex items-start gap-2">
          <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
            아래 정보는 일반적인 참고 목적이며, 의학적 처방을 대체하지 않습니다.
            복용량은 개인 건강 상태에 따라 다를 수 있으므로 반드시 담당 의사와 상담하세요.
          </p>
        </div>

        {/* Today's progress */}
        <div className="bg-gradient-to-br from-primary-light to-secondary-light rounded-2xl p-5 border border-card-border">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-muted">오늘의 영양제</p>
              <p className="text-2xl font-bold text-foreground">
                {checkedCount}/{totalCount}
              </p>
            </div>
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="var(--card-border)" strokeWidth="4" />
                <circle
                  cx="32" cy="32" r="28" fill="none" stroke="var(--primary)" strokeWidth="4"
                  strokeDasharray={`${progress * 1.76} 176`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-primary">
                {progress}%
              </span>
            </div>
          </div>
          {checkedCount === totalCount && totalCount > 0 && (
            <p className="text-xs text-primary font-medium mt-1">오늘의 영양제를 모두 복용했어요!</p>
          )}
        </div>

        {/* Weekly history */}
        <div className="bg-card rounded-2xl border border-card-border shadow-sm p-4">
          <p className="text-xs font-semibold text-foreground mb-3">최근 7일 복용 기록</p>
          <div className="flex justify-between">
            {weeklyHistory.map((day) => {
              const isToday = day.date === today;
              const allDone = day.count > 0 && day.count >= day.total;
              const partial = day.count > 0 && day.count < day.total;
              return (
                <div key={day.date} className="flex flex-col items-center gap-1.5">
                  <span className={`text-[10px] font-medium ${isToday ? "text-primary" : "text-muted"}`}>
                    {day.label}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    allDone
                      ? "bg-primary text-white"
                      : partial
                        ? "bg-primary-light text-primary"
                        : isToday
                          ? "bg-surface border-2 border-primary text-primary"
                          : "bg-surface text-muted"
                  }`}>
                    {allDone ? "✓" : day.count > 0 ? day.count : "·"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current supplements checklist */}
        <div>
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
            <Pill size={16} className="text-primary" />
            {currentWeek}주차 복용 영양제
          </h2>

          <div className="flex flex-col gap-2">
            {currentSupplements.map((supplement) => (
              <SupplementCard
                key={supplement.id}
                supplement={supplement}
                checked={isSupplementChecked(supplement.id)}
                onToggle={() => toggleSupplementCheck(supplement.id)}
              />
            ))}
          </div>
        </div>

        {/* Not current but upcoming/past */}
        {notCurrentSupplements.length > 0 && (
          <div className="mt-2">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
              <Info size={16} className="text-muted" />
              다른 시기의 영양제
            </h2>

            <div className="flex flex-col gap-2">
              {notCurrentSupplements.map((supplement) => {
                const isFuture = currentWeek < supplement.startWeek;
                return (
                  <div
                    key={supplement.id}
                    className="bg-surface rounded-2xl border border-card-border p-4 opacity-60"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl">{supplement.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{supplement.name}</p>
                        <p className="text-xs text-muted mt-0.5">
                          {isFuture
                            ? `${supplement.startWeek}주부터 복용 시작`
                            : `${supplement.endWeek}주까지 복용 (완료)`}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Supplement timeline */}
        <div className="bg-card rounded-2xl border border-card-border shadow-sm p-4 mt-2">
          <h3 className="text-xs font-semibold text-foreground mb-3">주차별 영양제 타임라인</h3>
          <div className="flex flex-col gap-2">
            {SUPPLEMENT_PHASES.map((p) => {
              const phaseSupplements = supplements.filter((s) => {
                const phaseStart = p.id === "preconception" ? 0 : p.id === "first" ? 1 : p.id === "second" ? 14 : 28;
                const phaseEnd = p.id === "preconception" ? 4 : p.id === "first" ? 13 : p.id === "second" ? 27 : 40;
                return s.startWeek <= phaseEnd && s.endWeek >= phaseStart;
              });
              const isActive = p.id === phase.id;
              return (
                <div key={p.id} className={`p-3 rounded-xl border ${isActive ? `${p.bg} border-current ${p.color}` : "border-card-border"}`}>
                  <p className={`text-xs font-semibold ${isActive ? p.color : "text-muted"}`}>
                    {isActive && "▸ "}{p.label} ({p.weekRange})
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {phaseSupplements.map((s) => (
                      <span key={s.id} className="text-[10px] px-2 py-0.5 rounded-full bg-card/80 text-foreground">
                        {s.emoji} {s.name.split(" (")[0]}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-surface rounded-2xl p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted leading-relaxed">
              영양제 복용은 반드시 담당 의사와 상의하세요.
              개인의 건강 상태, 혈액 검사 결과에 따라 복용량이 달라질 수 있습니다.
              본 정보는 일반적인 권장 사항이며 의학적 처방을 대체하지 않습니다.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function SupplementCard({
  supplement,
  checked,
  onToggle,
}: {
  supplement: Supplement;
  checked: boolean;
  onToggle: () => void;
}) {
  const priority = PRIORITY_STYLE[supplement.priority];

  return (
    <button
      onClick={onToggle}
      className={`w-full text-left p-4 rounded-2xl border transition-all active:scale-[0.99] ${
        checked
          ? "bg-primary-light/50 border-primary/20"
          : "bg-card border-card-border shadow-sm"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {checked ? (
            <CheckCircle2 size={22} className="text-primary" />
          ) : (
            <Circle size={22} className="text-muted" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-lg">{supplement.emoji}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priority.bg} ${priority.color}`}>
              {priority.label}
            </span>
          </div>
          <p className={`text-sm font-semibold leading-snug ${checked ? "text-primary" : "text-foreground"}`}>
            {supplement.name}
          </p>
          <p className="text-xs text-muted mt-1">{supplement.dosage}</p>
          <p className={`text-xs mt-1 leading-relaxed ${checked ? "text-muted/60" : "text-muted"}`}>
            {supplement.purpose}
          </p>
          {supplement.caution && !checked && (
            <p className="text-[11px] text-amber-500 mt-1.5 flex items-start gap-1">
              <AlertTriangle size={10} className="flex-shrink-0 mt-0.5" />
              {supplement.caution}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
