"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Search,
  X,
  Utensils,
} from "lucide-react";
import { useBabyStore, getBabyAgeMonths } from "@/store/useBabyStore";
import { BABY_FOOD_STAGES } from "@/data/postnatal";
import type { BabyFoodStage } from "@/data/postnatal";

function HighlightText({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 dark:bg-yellow-700/50 rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function BabyFoodPage() {
  const baby = useBabyStore((s) => s.baby);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<number | null>(null);
  const [expandedStages, setExpandedStages] = useState<Set<number>>(new Set());

  const babyAgeMonths = baby ? getBabyAgeMonths(baby.birthDate) : null;

  const recommendedStage = useMemo(() => {
    if (babyAgeMonths === null) return null;
    return (
      BABY_FOOD_STAGES.find(
        (s) => babyAgeMonths >= s.monthStart && babyAgeMonths <= s.monthEnd
      ) ?? null
    );
  }, [babyAgeMonths]);

  const filteredStages = useMemo(() => {
    let stages = BABY_FOOD_STAGES;

    if (stageFilter !== null) {
      stages = stages.filter((s) => s.stage === stageFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      stages = stages.filter(
        (s) =>
          s.allowedFoods.some((f) => f.toLowerCase().includes(q)) ||
          s.avoidFoods.some((f) => f.toLowerCase().includes(q)) ||
          s.title.toLowerCase().includes(q) ||
          s.sampleMenu.some((m) => m.toLowerCase().includes(q))
      );
    }

    return stages;
  }, [stageFilter, searchQuery]);

  const toggleExpand = (stage: number) => {
    setExpandedStages((prev) => {
      const next = new Set(prev);
      if (next.has(stage)) {
        next.delete(stage);
      } else {
        next.add(stage);
      }
      return next;
    });
  };

  return (
    <main className="flex flex-col min-h-screen bg-surface">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-5 pt-12 pb-3">
        <div className="flex items-center gap-2">
          <Link href="/" className="p-1 -ml-1" aria-label="뒤로가기">
            <ChevronLeft size={22} className="text-foreground" />
          </Link>
          <Utensils size={20} className="text-primary" />
          <h1 className="text-lg font-bold text-foreground">이유식 가이드</h1>
          {baby && (
            <span className="text-xs text-muted ml-auto">
              {baby.name} · {babyAgeMonths}개월
            </span>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative mt-3">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="식재료 또는 음식 검색..."
            className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-card border border-card-border text-foreground text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Stage Filter Chips */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setStageFilter(null)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              stageFilter === null
                ? "bg-primary text-white"
                : "bg-card border border-card-border text-muted"
            }`}
          >
            전체
          </button>
          {BABY_FOOD_STAGES.map((s) => (
            <button
              key={s.stage}
              onClick={() =>
                setStageFilter(stageFilter === s.stage ? null : s.stage)
              }
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                stageFilter === s.stage
                  ? "bg-primary text-white"
                  : "bg-card border border-card-border text-muted"
              }`}
            >
              {s.stage}단계
            </button>
          ))}
        </div>
      </header>

      <div className="px-5 pb-28 space-y-4 mt-4">
        {/* Recommended Stage Card */}
        {recommendedStage && !searchQuery && stageFilter === null && (
          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold text-primary">
                추천 단계
              </span>
              <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                {baby?.name} 맞춤
              </span>
            </div>
            <p className="text-xs text-muted">
              현재 {babyAgeMonths}개월인 {baby?.name}에게는{" "}
              <strong className="text-foreground">
                {recommendedStage.stage}단계 · {recommendedStage.title}
              </strong>
              이 적합해요.
            </p>
          </div>
        )}

        {/* Search Results Info */}
        {searchQuery.trim() && (
          <p className="text-xs text-muted">
            &quot;{searchQuery}&quot; 검색 결과: {filteredStages.length}개 단계
          </p>
        )}

        {/* Stage Cards */}
        {filteredStages.length === 0 ? (
          <div className="text-center py-12">
            <Utensils size={40} className="mx-auto text-muted mb-3 opacity-40" />
            <p className="text-sm text-muted">
              검색 결과가 없습니다.
            </p>
          </div>
        ) : (
          filteredStages.map((stage) => (
            <StageCard
              key={stage.stage}
              stage={stage}
              isExpanded={expandedStages.has(stage.stage)}
              isRecommended={recommendedStage?.stage === stage.stage}
              searchQuery={searchQuery.trim()}
              onToggle={() => toggleExpand(stage.stage)}
            />
          ))
        )}
      </div>
    </main>
  );
}

function StageCard({
  stage,
  isExpanded,
  isRecommended,
  searchQuery,
  onToggle,
}: {
  stage: BabyFoodStage;
  isExpanded: boolean;
  isRecommended: boolean;
  searchQuery: string;
  onToggle: () => void;
}) {
  return (
    <div
      className={`bg-card border rounded-2xl overflow-hidden transition-colors ${
        isRecommended
          ? "border-primary/40 ring-1 ring-primary/20"
          : "border-card-border"
      }`}
    >
      {/* Header - Clickable */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        <div
          className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
            isRecommended
              ? "bg-primary text-white"
              : "bg-surface text-foreground"
          }`}
        >
          {stage.stage}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground truncate">
              {stage.title}
            </h3>
            {isRecommended && (
              <span className="shrink-0 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
                추천
              </span>
            )}
          </div>
          <p className="text-xs text-muted mt-0.5">
            {stage.monthStart}~{stage.monthEnd}개월
          </p>
        </div>
        {isExpanded ? (
          <ChevronUp size={18} className="shrink-0 text-muted" />
        ) : (
          <ChevronDown size={18} className="shrink-0 text-muted" />
        )}
      </button>

      {/* Description always visible */}
      <div className="px-4 pb-3 -mt-1">
        <p className="text-xs text-muted leading-relaxed">
          {stage.description}
        </p>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-card-border pt-4">
          {/* Allowed Foods */}
          <div>
            <h4 className="text-xs font-semibold text-foreground mb-2">
              먹을 수 있는 식재료
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {stage.allowedFoods.map((food) => (
                <span
                  key={food}
                  className="inline-flex px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                >
                  <HighlightText text={food} query={searchQuery} />
                </span>
              ))}
            </div>
          </div>

          {/* Avoid Foods */}
          <div>
            <h4 className="text-xs font-semibold text-foreground mb-2">
              피해야 할 식품
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {stage.avoidFoods.map((food) => (
                <span
                  key={food}
                  className="inline-flex px-2.5 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                >
                  <HighlightText text={food} query={searchQuery} />
                </span>
              ))}
            </div>
          </div>

          {/* Sample Menus */}
          <div>
            <h4 className="text-xs font-semibold text-foreground mb-2">
              추천 메뉴
            </h4>
            <ul className="space-y-1">
              {stage.sampleMenu.map((menu) => (
                <li
                  key={menu}
                  className="text-xs text-muted flex items-start gap-1.5"
                >
                  <span className="shrink-0 mt-0.5 w-1 h-1 rounded-full bg-muted" />
                  <HighlightText text={menu} query={searchQuery} />
                </li>
              ))}
            </ul>
          </div>

          {/* Tips */}
          <div>
            <h4 className="text-xs font-semibold text-foreground mb-2">
              이유식 팁
            </h4>
            <ul className="space-y-1.5">
              {stage.tips.map((tip) => (
                <li
                  key={tip}
                  className="text-xs text-muted flex items-start gap-1.5"
                >
                  <span className="shrink-0">💡</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
