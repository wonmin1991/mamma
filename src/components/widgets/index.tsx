"use client";

import type { ReactElement } from "react";
import Link from "next/link";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { weeklyGuide, tips } from "@/data/mock";
import { benefitChecklist } from "@/data/benefits";
import { getSupplementsForWeek } from "@/data/supplements";
import { useStore } from "@/store/useStore";
import { formatDueDate } from "@/lib/date";
import {
  Calendar,
  Sparkles,
  CheckCircle2,
  Circle,
  Lightbulb,
  Heart,
  ChevronRight,
  Apple,
  Baby,
  Pill,
} from "lucide-react";

// ─── Widget Registry ─────────────────────────────────────

export interface WidgetDef {
  id: string;
  name: string;
  description: string;
  emoji: string;
}

export const WIDGET_REGISTRY: WidgetDef[] = [
  { id: "dday", name: "D-Day 카운트다운", description: "출산까지 남은 일수", emoji: "📅" },
  { id: "weekHighlight", name: "이번 주 하이라이트", description: "아기 발달 + 추천 음식", emoji: "✨" },
  { id: "checklist", name: "혜택 체크리스트", description: "다음 신청할 혜택", emoji: "✅" },
  { id: "quickTip", name: "오늘의 꿀팁", description: "매일 바뀌는 임신 팁", emoji: "💡" },
  { id: "babySize", name: "아기 크기", description: "이번 주 아기 크기 비교", emoji: "👶" },
  { id: "hearts", name: "하트 현황", description: "보유 하트 및 연속 출석", emoji: "💖" },
  { id: "supplements", name: "오늘의 영양제", description: "주차별 필수 영양제 복용 체크", emoji: "💊" },
];

// ─── D-Day Widget ────────────────────────────────────────

function DDayWidget() {
  const { currentWeek, currentDay, daysUntilDue, dueDate } = usePregnancy();
  const progress = Math.min(100, (currentWeek / 40) * 100);

  return (
    <Link href="/guide" className="block">
      <div className="bg-gradient-to-br from-primary-light to-secondary-light rounded-2xl p-4 border border-card-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted flex items-center gap-1">
              <Calendar size={12} /> 출산까지
            </p>
            <p className="text-3xl font-bold text-primary mt-1">
              {daysUntilDue > 0 ? `D-${daysUntilDue}` : "D-Day!"}
            </p>
            <p className="text-xs text-foreground font-medium mt-1">
              임신 {currentWeek}주 {currentDay > 0 ? `${currentDay}일` : ""}
            </p>
          </div>
          <div className="text-right">
            {dueDate && (
              <p className="text-xs text-muted">예정일 {formatDueDate(dueDate)}</p>
            )}
            <div className="w-20 h-2 rounded-full bg-card/60 overflow-hidden mt-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] text-muted mt-1">{Math.round(progress)}% 진행</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Week Highlight Widget ───────────────────────────────

function WeekHighlightWidget() {
  const { currentWeek } = usePregnancy();
  const weekIdx = Math.max(0, Math.min(39, currentWeek - 1));
  const week = weeklyGuide[weekIdx];

  return (
    <Link href={`/guide?week=${currentWeek}`} className="block">
      <div className="bg-card rounded-2xl border border-card-border shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <Sparkles size={14} className="text-accent" />
            {currentWeek}주차 하이라이트
          </h3>
          <ChevronRight size={14} className="text-muted" />
        </div>
        <div className="flex gap-3">
          <div className="flex-1 bg-surface-violet rounded-xl p-3">
            <p className="text-xs font-semibold text-secondary mb-1">
              <Baby size={11} className="inline -mt-0.5" /> 아기 발달
            </p>
            <p className="text-xs text-foreground leading-relaxed line-clamp-2">
              {week.babyDevelopment[0]}
            </p>
          </div>
          <div className="flex-1 bg-surface-emerald rounded-xl p-3">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
              <Apple size={11} className="inline -mt-0.5" /> 추천 음식
            </p>
            <p className="text-xs text-foreground">
              {week.goodFoods.slice(0, 3).join(", ")}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Checklist Widget ────────────────────────────────────

function ChecklistWidget() {
  const benefitChecked = useStore((s) => s.benefitChecked);
  const toggleBenefitCheck = useStore((s) => s.toggleBenefitCheck);

  const unchecked = benefitChecklist.filter(
    (item) => !benefitChecked.includes(item.id) && item.priority === "high"
  );
  const nextItems = unchecked.slice(0, 3);
  const total = benefitChecklist.length;
  const done = benefitChecked.length;

  return (
    <div className="bg-card rounded-2xl border border-card-border shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <CheckCircle2 size={14} className="text-primary" />
          신청할 혜택
        </h3>
        <Link href="/benefits" className="text-xs text-primary font-medium flex items-center gap-0.5">
          전체보기 <ChevronRight size={12} />
        </Link>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }}
          />
        </div>
        <span className="text-[11px] text-muted">{done}/{total}</span>
      </div>

      {nextItems.length > 0 ? (
        <div className="flex flex-col gap-2">
          {nextItems.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleBenefitCheck(item.id)}
              className="flex items-center gap-2.5 text-left"
            >
              <Circle size={16} className="text-muted flex-shrink-0" />
              <span className="text-xs text-foreground line-clamp-1">{item.name}</span>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted text-center py-2">필수 혜택을 모두 신청했어요!</p>
      )}
    </div>
  );
}

// ─── Quick Tip Widget ────────────────────────────────────

function QuickTipWidget() {
  const dayIndex = new Date().getDate() % tips.length;
  const tip = tips[dayIndex];

  return (
    <Link href={`/tips/${tip.id}`} className="block">
      <div className="bg-card rounded-2xl border border-card-border shadow-sm p-4">
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${tip.gradient} flex items-center justify-center`}>
            <span className="text-lg">{tip.emoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-muted flex items-center gap-1 mb-0.5">
              <Lightbulb size={10} /> 오늘의 꿀팁
            </p>
            <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2">
              {tip.title}
            </p>
            <p className="text-xs text-muted mt-1 line-clamp-1">{tip.summary}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Baby Size Widget ────────────────────────────────────

function BabySizeWidget() {
  const { currentWeek } = usePregnancy();
  const weekIdx = Math.max(0, Math.min(39, currentWeek - 1));
  const week = weeklyGuide[weekIdx];

  return (
    <Link href={`/guide?week=${currentWeek}`} className="block">
      <div className="bg-gradient-to-br from-surface-violet to-surface-rose rounded-2xl border border-card-border p-4">
        <div className="flex items-center gap-4">
          <span className="text-5xl">{week.babySizeEmoji}</span>
          <div>
            <p className="text-xs text-muted">{currentWeek}주차 아기 크기</p>
            <p className="text-base font-bold text-foreground">{week.babySize}</p>
            <div className="flex gap-3 mt-1">
              <p className="text-[11px] text-muted">몸무게 <span className="text-foreground font-medium">{week.babyWeight}</span></p>
              <p className="text-[11px] text-muted">키 <span className="text-foreground font-medium">{week.babyLength}</span></p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Hearts Widget ───────────────────────────────────────

function HeartsWidget() {
  const hearts = useStore((s) => s.hearts);
  const dailyStreak = useStore((s) => s.dailyStreak);
  const canClaimDaily = useStore((s) => s.canClaimDaily);

  return (
    <Link href="/nursery" className="block">
      <div className="bg-card rounded-2xl border border-card-border shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
              <Heart size={20} className="text-primary" fill="currentColor" />
            </div>
            <div>
              <p className="text-xs text-muted">보유 하트</p>
              <p className="text-lg font-bold text-foreground">{hearts}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted">연속 출석 {dailyStreak}일</p>
            {canClaimDaily() && (
              <p className="text-[11px] text-primary font-medium mt-0.5">보상 받기 가능!</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Widget Renderer ─────────────────────────────────────

// ─── Supplements Widget ──────────────────────────────────

function SupplementsWidget() {
  const { currentWeek } = usePregnancy();
  const isSupplementChecked = useStore((s) => s.isSupplementChecked);
  const toggleSupplementCheck = useStore((s) => s.toggleSupplementCheck);

  const current = getSupplementsForWeek(currentWeek);
  const essential = current.filter((s) => s.priority === "essential");
  const checkedCount = essential.filter((s) => isSupplementChecked(s.id)).length;

  return (
    <div className="bg-card rounded-2xl border border-card-border shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <Pill size={14} className="text-primary" />
          오늘의 영양제
        </h3>
        <Link href="/supplements" className="text-xs text-primary font-medium flex items-center gap-0.5">
          전체보기 <ChevronRight size={12} />
        </Link>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-1.5 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${essential.length > 0 ? (checkedCount / essential.length) * 100 : 0}%` }}
          />
        </div>
        <span className="text-[11px] text-muted">{checkedCount}/{essential.length} 필수</span>
      </div>

      <div className="flex flex-col gap-1.5">
        {essential.map((s) => {
          const checked = isSupplementChecked(s.id);
          return (
            <button
              key={s.id}
              onClick={() => toggleSupplementCheck(s.id)}
              className="flex items-center gap-2.5 text-left"
            >
              {checked ? (
                <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
              ) : (
                <Circle size={16} className="text-muted flex-shrink-0" />
              )}
              <span className="text-lg">{s.emoji}</span>
              <span className={`text-xs ${checked ? "text-muted line-through" : "text-foreground"}`}>
                {s.name.split(" (")[0]}
              </span>
              <span className="text-[10px] text-muted ml-auto">{s.dosage}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const WIDGET_COMPONENTS: Record<string, () => ReactElement> = {
  dday: DDayWidget,
  weekHighlight: WeekHighlightWidget,
  checklist: ChecklistWidget,
  quickTip: QuickTipWidget,
  babySize: BabySizeWidget,
  hearts: HeartsWidget,
  supplements: SupplementsWidget,
};

export function WidgetArea() {
  const activeWidgets = useStore((s) => s.activeWidgets);

  return (
    <div className="flex flex-col gap-3">
      {activeWidgets.map((id) => {
        const Component = WIDGET_COMPONENTS[id];
        if (!Component) return null;
        return <Component key={id} />;
      })}
    </div>
  );
}
