"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, Plus, Trash2, Sparkles, X } from "lucide-react";
import { useBabyStore, getBabyAgeMonths } from "@/store/useBabyStore";
import {
  MILESTONE_CATEGORIES,
  MILESTONE_SUGGESTIONS,
  type MilestoneCategory,
} from "@/data/postnatal";

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function MilestonesPage() {
  const baby = useBabyStore((s) => s.baby);
  const milestones = useBabyStore((s) => s.milestones);
  const addMilestone = useBabyStore((s) => s.addMilestone);
  const deleteMilestone = useBabyStore((s) => s.deleteMilestone);

  const [filterCategory, setFilterCategory] = useState<MilestoneCategory | "all">("all");
  const [showDialog, setShowDialog] = useState(false);

  // Dialog form state
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<MilestoneCategory>("motor");
  const [formDate, setFormDate] = useState(todayStr());
  const [formDescription, setFormDescription] = useState("");

  const ageMonths = baby ? getBabyAgeMonths(baby.birthDate) : 0;

  // Age-appropriate suggestions excluding already recorded
  const suggestions = useMemo(() => {
    const recordedTitles = new Set(milestones.map((m) => m.title));
    return MILESTONE_SUGGESTIONS.filter(
      (s) =>
        s.monthStart <= ageMonths + 2 &&
        s.monthEnd >= ageMonths - 2 &&
        !recordedTitles.has(s.title)
    ).slice(0, 5);
  }, [milestones, ageMonths]);

  // Filtered milestones sorted by date desc
  const filteredMilestones = useMemo(() => {
    const list =
      filterCategory === "all"
        ? milestones
        : milestones.filter((m) => m.category === filterCategory);
    return [...list].sort((a, b) => b.date.localeCompare(a.date));
  }, [milestones, filterCategory]);

  const categoryEmoji = (cat: MilestoneCategory) =>
    MILESTONE_CATEGORIES.find((c) => c.id === cat)?.emoji ?? "⭐";

  const categoryLabel = (cat: MilestoneCategory) =>
    MILESTONE_CATEGORIES.find((c) => c.id === cat)?.label ?? cat;

  function openDialog(title?: string, category?: MilestoneCategory) {
    setFormTitle(title ?? "");
    setFormCategory(category ?? "motor");
    setFormDate(todayStr());
    setFormDescription("");
    setShowDialog(true);
  }

  function handleSubmit() {
    if (!formTitle.trim()) return;
    addMilestone({
      title: formTitle.trim(),
      category: formCategory,
      date: formDate,
      description: formDescription.trim() || undefined,
    });
    setShowDialog(false);
  }

  function quickRecord(title: string, category: MilestoneCategory) {
    addMilestone({
      title,
      category,
      date: todayStr(),
    });
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-5 pt-12 pb-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-1 -ml-1">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold flex-1">성장 마일스톤</h1>
          <button
            onClick={() => openDialog()}
            className="bg-primary text-white rounded-full p-2"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Category filter chips */}
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
          {MILESTONE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterCategory === cat.id
                  ? "bg-primary text-white"
                  : "bg-surface text-muted"
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </header>

      <main className="px-5 mt-4 space-y-6">
        {/* Suggestions section */}
        {baby && suggestions.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-muted">
                {baby.name}에게 추천하는 마일스톤
              </h2>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {suggestions.map((s) => (
                <div
                  key={s.title}
                  className="flex-shrink-0 bg-card border border-card-border rounded-2xl px-4 py-3 flex items-center gap-3 min-w-[180px]"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{s.title}</p>
                    <p className="text-xs text-muted">
                      {categoryEmoji(s.category)} {s.monthStart}~{s.monthEnd}개월
                    </p>
                  </div>
                  <button
                    onClick={() => quickRecord(s.title, s.category)}
                    className="bg-primary text-white rounded-full p-1.5 flex-shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recorded milestones */}
        {filteredMilestones.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">🌱</div>
            <p className="text-lg font-semibold mb-1">아직 기록된 마일스톤이 없어요</p>
            <p className="text-sm text-muted">
              아기의 첫 성장 순간을 기록해보세요!
            </p>
            <button
              onClick={() => openDialog()}
              className="mt-4 bg-primary text-white px-5 py-2.5 rounded-full text-sm font-medium"
            >
              <Plus className="w-4 h-4 inline mr-1" />
              마일스톤 추가
            </button>
          </div>
        ) : (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-muted">
              기록된 마일스톤 ({filteredMilestones.length})
            </h2>
            {filteredMilestones.map((m) => (
              <div
                key={m.id}
                className="bg-card border border-card-border rounded-2xl px-4 py-3 flex items-start gap-3"
              >
                <span className="text-2xl mt-0.5">{categoryEmoji(m.category)}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{m.title}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {m.date} · {categoryLabel(m.category)}
                  </p>
                  {m.description && (
                    <p className="text-sm text-muted mt-1">{m.description}</p>
                  )}
                </div>
                <button
                  onClick={() => deleteMilestone(m.id)}
                  className="text-muted p-1.5 hover:text-red-500 transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </section>
        )}
      </main>

      {/* Add milestone dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowDialog(false)}
          />
          <div className="relative w-full max-w-lg bg-card rounded-t-3xl p-5 pb-8 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">마일스톤 추가</h2>
              <button
                onClick={() => setShowDialog(false)}
                className="p-1 text-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="text-sm font-medium text-muted block mb-1">
                  제목
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="예: 첫 걸음마"
                  className="w-full bg-surface border border-card-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-sm font-medium text-muted block mb-1">
                  카테고리
                </label>
                <div className="flex flex-wrap gap-2">
                  {MILESTONE_CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setFormCategory(cat.id as MilestoneCategory)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        formCategory === cat.id
                          ? "bg-primary text-white"
                          : "bg-surface text-muted"
                      }`}
                    >
                      {cat.emoji} {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="text-sm font-medium text-muted block mb-1">
                  날짜
                </label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full bg-surface border border-card-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-muted block mb-1">
                  설명 (선택)
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="특별한 순간을 기록해보세요"
                  rows={3}
                  className="w-full bg-surface border border-card-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!formTitle.trim()}
                className="w-full bg-primary text-white rounded-xl py-3 font-semibold text-sm disabled:opacity-40 transition-opacity"
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
