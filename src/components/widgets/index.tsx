"use client";

import type { ReactElement } from "react";
import Link from "next/link";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { weeklyGuide, tips } from "@/data/mock";
import { benefitChecklist, getBenefitsForWeek, getUrgentBenefits } from "@/data/benefits";
import { getSupplementsForWeek } from "@/data/supplements";
import { getCheckupsForWeek, getUpcomingCheckups } from "@/data/checkups";
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
  AlertTriangle,
  Stethoscope,
  Calculator,
  ClipboardList,
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
  { id: "weekBenefit", name: "이번 주 혜택", description: "지금 신청해야 할 혜택 알림", emoji: "⚡" },
  { id: "todayTodo", name: "오늘의 할 일", description: "검진, 영양제, 혜택을 한눈에", emoji: "📋" },
  { id: "checkup", name: "검진 일정", description: "이번 주차 필수 검진 안내", emoji: "🩺" },
  { id: "benefitCalc", name: "혜택 계산기", description: "총 받을 수 있는 금액 계산", emoji: "💰" },
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

// 주차별 우선 추천 카테고리
function getRecommendedCategories(week: number): string[] {
  if (week <= 4) return ["nutrition", "hospital", "mental"];       // 임신 극초기: 엽산, 병원, 마음
  if (week <= 13) return ["nutrition", "exercise", "hospital"];    // 초기: 영양제, 가벼운 운동, 검진
  if (week <= 20) return ["exercise", "nutrition", "mental"];      // 중기 전반: 운동, 영양, 태교
  if (week <= 27) return ["product", "exercise", "nutrition"];     // 중기 후반: 출산 준비물, 운동
  if (week <= 35) return ["product", "postpartum", "hospital"];    // 후기 전반: 준비물, 산후조리원
  return ["postpartum", "product", "hospital"];                     // 후기 후반: 산후조리, 출산 준비
}

function QuickTipWidget() {
  const { currentWeek } = usePregnancy();
  const categories = getRecommendedCategories(currentWeek);
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);

  // 우선 카테고리 순서대로 팁 찾기, 같은 카테고리 내에서는 날짜로 로테이션
  let tip = tips[0];
  for (const cat of categories) {
    const catTips = tips.filter((t) => t.category === cat);
    if (catTips.length > 0) {
      tip = catTips[dayOfYear % catTips.length];
      break;
    }
  }

  const categoryLabel = categories[0] === "nutrition" ? "영양"
    : categories[0] === "exercise" ? "운동"
    : categories[0] === "mental" ? "마음건강"
    : categories[0] === "hospital" ? "병원"
    : categories[0] === "product" ? "출산준비"
    : categories[0] === "postpartum" ? "산후조리" : "꿀팁";

  return (
    <Link href={`/tips/${tip.id}`} className="block">
      <div className="bg-card rounded-2xl border border-card-border shadow-sm p-4">
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${tip.gradient} flex items-center justify-center`}>
            <span className="text-lg">{tip.emoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-muted flex items-center gap-1 mb-0.5">
              <Lightbulb size={10} /> {currentWeek}주차 추천 · {categoryLabel}
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
  const { currentWeek, babyNickname } = usePregnancy();
  const weekIdx = Math.max(0, Math.min(39, currentWeek - 1));
  const week = weeklyGuide[weekIdx];

  return (
    <Link href={`/guide?week=${currentWeek}`} className="block">
      <div className="bg-gradient-to-br from-surface-violet to-surface-rose rounded-2xl border border-card-border p-4">
        <div className="flex items-center gap-4">
          <span className="text-5xl">{week.babySizeEmoji}</span>
          <div>
            <p className="text-xs text-muted">{currentWeek}주차 {babyNickname}</p>
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

// ─── Week Benefit Widget ─────────────────────────────────

function WeekBenefitWidget() {
  const { currentWeek } = usePregnancy();
  const benefitChecked = useStore((s) => s.benefitChecked);

  const available = getBenefitsForWeek(currentWeek).filter(
    (b) => !benefitChecked.includes(b.id)
  );
  const urgent = getUrgentBenefits(currentWeek).filter(
    (b) => !benefitChecked.includes(b.id)
  );

  if (available.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-card-border shadow-sm p-4">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <CheckCircle2 size={14} className="text-emerald-500" />
          이번 주 혜택 완료!
        </h3>
        <p className="text-xs text-muted mt-1">현재 주차에 신청할 혜택을 모두 처리했어요.</p>
      </div>
    );
  }

  const top = urgent.length > 0 ? urgent[0] : available[0];
  const isUrgent = urgent.length > 0;
  const remainWeeks = top.deadlineWeek > 0 ? top.deadlineWeek - currentWeek : null;

  return (
    <Link href="/benefits" className="block">
      <div className={`rounded-2xl border shadow-sm p-4 ${
        isUrgent
          ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50"
          : "bg-card border-card-border"
      }`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className={`text-sm font-bold flex items-center gap-1.5 ${isUrgent ? "text-red-500" : "text-foreground"}`}>
            {isUrgent ? "⚡" : "🎁"} {currentWeek}주차 혜택
          </h3>
          <span className="text-xs text-muted">{available.length}건 대기</span>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground leading-snug line-clamp-1">
              {top.name}
            </p>
            {top.amount && (
              <p className="text-primary font-bold text-sm mt-0.5">{top.amount}</p>
            )}
            <p className="text-xs text-muted mt-1 line-clamp-1">{top.description}</p>
          </div>
          {remainWeeks !== null && remainWeeks <= 3 && (
            <span className="flex-shrink-0 text-xs px-2 py-1 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-500 font-bold">
              D-{remainWeeks * 7}
            </span>
          )}
        </div>

        {available.length > 1 && (
          <p className="text-[11px] text-primary font-medium mt-2 flex items-center gap-0.5">
            +{available.length - 1}건 더 보기 <ChevronRight size={11} />
          </p>
        )}
      </div>
    </Link>
  );
}

// ─── Today Todo Widget (대시보드) ─────────────────────────

function TodayTodoWidget() {
  const { currentWeek } = usePregnancy();
  const benefitChecked = useStore((s) => s.benefitChecked);
  const isSupplementChecked = useStore((s) => s.isSupplementChecked);

  const currentCheckups = getCheckupsForWeek(currentWeek);
  const upcomingCheckups = getUpcomingCheckups(currentWeek);
  const urgentBenefits = getUrgentBenefits(currentWeek).filter((b) => !benefitChecked.includes(b.id));
  const todaySupplements = getSupplementsForWeek(currentWeek);
  const uncheckedSupplements = todaySupplements.filter((s) => s.priority === "essential" && !isSupplementChecked(s.id));

  const todos: { icon: string; text: string; href: string; urgent?: boolean }[] = [];

  if (uncheckedSupplements.length > 0) {
    todos.push({ icon: "💊", text: `영양제 ${uncheckedSupplements.length}종 복용`, href: "/supplements" });
  }
  if (currentCheckups.length > 0) {
    todos.push({ icon: "🩺", text: `${currentCheckups[0].name}`, href: "/guide", urgent: currentCheckups[0].priority === "essential" });
  }
  if (upcomingCheckups.length > 0) {
    todos.push({ icon: "📅", text: `${upcomingCheckups[0].name} (곧 시작)`, href: "/guide" });
  }
  if (urgentBenefits.length > 0) {
    const b = urgentBenefits[0];
    todos.push({ icon: "⚡", text: `${b.name} 신청${b.amount ? ` (${b.amount})` : ""}`, href: "/benefits", urgent: true });
  }

  if (todos.length === 0) {
    return (
      <div className="bg-gradient-to-br from-surface-emerald to-surface-sky rounded-2xl border border-card-border p-4">
        <p className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <CheckCircle2 size={14} className="text-emerald-500" />
          오늘 할 일을 모두 완료했어요!
        </p>
        <p className="text-xs text-muted mt-1">잘하고 있어요. 편안한 하루 보내세요.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-card-border shadow-sm p-4">
      <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5 mb-3">
        <ClipboardList size={14} className="text-primary" />
        {currentWeek}주차 오늘의 할 일
      </h3>
      <div className="flex flex-col gap-2">
        {todos.map((todo, i) => (
          <Link key={i} href={todo.href} className="flex items-center gap-2.5 group">
            <span className="text-base">{todo.icon}</span>
            <span className={`text-xs flex-1 ${todo.urgent ? "text-red-500 font-semibold" : "text-foreground"}`}>
              {todo.text}
            </span>
            <ChevronRight size={12} className="text-muted group-hover:text-primary transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Checkup Widget ──────────────────────────────────────

function CheckupWidget() {
  const { currentWeek } = usePregnancy();
  const current = getCheckupsForWeek(currentWeek);
  const upcoming = getUpcomingCheckups(currentWeek);

  const item = current[0] || upcoming[0];
  if (!item) {
    return (
      <div className="bg-card rounded-2xl border border-card-border shadow-sm p-4">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <Stethoscope size={14} className="text-emerald-500" />
          검진 일정 없음
        </h3>
        <p className="text-xs text-muted mt-1">이번 주차에는 예정된 검진이 없어요.</p>
      </div>
    );
  }

  const isCurrent = current.includes(item);

  return (
    <Link href="/guide" className="block">
      <div className={`rounded-2xl border shadow-sm p-4 ${
        isCurrent && item.priority === "essential"
          ? "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-900/50"
          : "bg-card border-card-border"
      }`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <span className="text-base">{item.emoji}</span>
            {isCurrent ? "이번 주 검진" : "다음 검진"}
          </h3>
          <span className="text-[10px] text-muted">{item.weekStart}~{item.weekEnd}주</span>
        </div>
        <p className="text-sm font-semibold text-foreground">{item.name}</p>
        <p className="text-xs text-muted mt-1 line-clamp-2">{item.description}</p>
        {item.cost && (
          <p className="text-xs text-primary font-medium mt-1.5">예상 비용: {item.cost}</p>
        )}
      </div>
    </Link>
  );
}

// ─── Benefit Calculator Widget ───────────────────────────

function BenefitCalcWidget() {
  const { currentWeek } = usePregnancy();

  let savedRegion = "";
  try { savedRegion = localStorage.getItem("mamma-benefit-region") || ""; } catch {}

  // 전국 공통 혜택 총액 (부부 모두 육아휴직 사용 가정)
  const totalOneTime = 200 + 100; // 첫만남 + 국민행복카드
  const totalYearly = 1200 + 600 + 120; // 부모급여0세 + 1세 + 아동수당
  const sixSixBonus = (250 * 2 + 300 * 2 + 350 * 2); // 6+6 부모육아휴직 6개월 상한
  const totalEstimate = totalOneTime + totalYearly + sixSixBonus;

  return (
    <Link href="/benefits" className="block">
      <div className="bg-gradient-to-br from-emerald-50 to-sky-50 dark:from-emerald-900/20 dark:to-sky-900/20 rounded-2xl border border-card-border p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <Calculator size={14} className="text-emerald-500" />
            혜택 계산기
          </h3>
          <ChevronRight size={14} className="text-muted" />
        </div>

        <p className="text-xs text-muted">전국 공통 혜택 기준 예상 수령액</p>
        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
          약 {totalEstimate.toLocaleString()}만원+
        </p>
        <div className="flex gap-3 mt-2 flex-wrap">
          <div className="text-[11px] text-muted">
            일시금 <span className="text-foreground font-medium">{totalOneTime}만원</span>
          </div>
          <div className="text-[11px] text-muted">
            연간 <span className="text-foreground font-medium">{totalYearly}만원</span>
          </div>
          <div className="text-[11px] text-muted">
            6+6 육아휴직 <span className="text-foreground font-medium">{sixSixBonus}만원</span>
          </div>
        </div>
        <p className="text-[10px] text-muted mt-2">
          * 지자체 출산축하금 별도{savedRegion ? ` — ${savedRegion} 혜택 보기 →` : " (지역 설정 시 상세 확인)"}
        </p>
      </div>
    </Link>
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
  weekBenefit: WeekBenefitWidget,
  todayTodo: TodayTodoWidget,
  checkup: CheckupWidget,
  benefitCalc: BenefitCalcWidget,
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
