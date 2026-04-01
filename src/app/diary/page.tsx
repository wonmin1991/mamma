"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, Plus, Edit3, Trash2, X, BookOpen } from "lucide-react";
import { useBabyStore } from "@/store/useBabyStore";
import { DIARY_MOODS, type DiaryEntry } from "@/data/postnatal";
import { formatRelativeDate } from "@/lib/date";

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function DiaryPage() {
  const baby = useBabyStore((s) => s.baby);
  const diaryEntries = useBabyStore((s) => s.diaryEntries);
  const addDiaryEntry = useBabyStore((s) => s.addDiaryEntry);
  const updateDiaryEntry = useBabyStore((s) => s.updateDiaryEntry);
  const deleteDiaryEntry = useBabyStore((s) => s.deleteDiaryEntry);

  const [showDialog, setShowDialog] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formDate, setFormDate] = useState(todayStr());
  const [formMoods, setFormMoods] = useState<string[]>([]);

  const sortedEntries = useMemo(
    () => [...diaryEntries].sort((a, b) => b.date.localeCompare(a.date)),
    [diaryEntries]
  );

  function openAddDialog() {
    setEditingEntry(null);
    setFormTitle("");
    setFormContent("");
    setFormDate(todayStr());
    setFormMoods([]);
    setShowDialog(true);
  }

  function openEditDialog(entry: DiaryEntry) {
    setEditingEntry(entry);
    setFormTitle(entry.title);
    setFormContent(entry.content);
    setFormDate(entry.date);
    setFormMoods(entry.mood ? [...entry.mood] : []);
    setShowDialog(true);
  }

  function toggleMood(mood: string) {
    setFormMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    );
  }

  function handleSubmit() {
    if (!formTitle.trim() || !formContent.trim()) return;

    const moodStr = formMoods.length > 0 ? formMoods.join("") : undefined;

    if (editingEntry) {
      updateDiaryEntry(editingEntry.id, {
        title: formTitle.trim(),
        content: formContent.trim(),
        mood: moodStr,
      });
    } else {
      addDiaryEntry({
        date: formDate,
        title: formTitle.trim(),
        content: formContent.trim(),
        mood: moodStr,
      });
    }

    setShowDialog(false);
  }

  function handleDelete(id: string) {
    deleteDiaryEntry(id);
    setDeleteConfirmId(null);
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-5 pt-12 pb-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-1 -ml-1">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold flex-1">
            {baby ? `${baby.name}의 성장 일기` : "성장 일기"}
          </h1>
        </div>
      </header>

      <main className="px-5 mt-4 space-y-3">
        {/* Empty state */}
        {sortedEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">
              <BookOpen className="w-14 h-14 text-muted mx-auto" />
            </div>
            <p className="text-lg font-semibold mb-1">아직 일기가 없어요</p>
            <p className="text-sm text-muted">
              아기와의 소중한 하루를 기록해보세요!
            </p>
            <button
              onClick={openAddDialog}
              className="mt-4 bg-primary text-white px-5 py-2.5 rounded-full text-sm font-medium"
            >
              <Plus className="w-4 h-4 inline mr-1" />
              일기 쓰기
            </button>
          </div>
        ) : (
          /* Diary entries list */
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-muted">
              일기 목록 ({sortedEntries.length})
            </h2>
            {sortedEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-card border border-card-border rounded-2xl px-4 py-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    {entry.mood && (
                      <p className="text-lg mb-1">{entry.mood}</p>
                    )}
                    <p className="text-xs text-muted mb-1">
                      {formatRelativeDate(entry.date)}
                    </p>
                    <p className="font-medium">{entry.title}</p>
                    <p className="text-sm text-muted mt-1 line-clamp-3">
                      {entry.content}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => openEditDialog(entry)}
                      className="text-muted p-1.5 hover:text-primary transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {deleteConfirmId === entry.id ? (
                      <div className="flex gap-1 items-center">
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="text-xs text-white bg-red-500 rounded-full px-2 py-1"
                        >
                          삭제
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="text-xs text-muted bg-surface rounded-full px-2 py-1"
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(entry.id)}
                        className="text-muted p-1.5 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>

      {/* Floating add button */}
      {sortedEntries.length > 0 && (
        <button
          onClick={openAddDialog}
          className="fixed bottom-8 right-6 z-30 bg-primary text-white rounded-full p-4 shadow-lg"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* Add/Edit dialog (bottom sheet) */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowDialog(false)}
          />
          <div className="relative w-full max-w-lg bg-card rounded-t-3xl p-5 pb-8 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">
                {editingEntry ? "일기 수정" : "일기 쓰기"}
              </h2>
              <button
                onClick={() => setShowDialog(false)}
                className="p-1 text-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Mood selector */}
              <div>
                <label className="text-sm font-medium text-muted block mb-2">
                  오늘의 기분
                </label>
                <div className="flex flex-wrap gap-2">
                  {DIARY_MOODS.map((mood) => (
                    <button
                      key={mood}
                      onClick={() => toggleMood(mood)}
                      className={`text-2xl p-1.5 rounded-xl transition-colors ${
                        formMoods.includes(mood)
                          ? "bg-primary/20 ring-2 ring-primary"
                          : "bg-surface"
                      }`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-sm font-medium text-muted block mb-1">
                  제목
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="오늘의 제목을 입력하세요"
                  className="w-full bg-surface border border-card-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Content */}
              <div>
                <label className="text-sm font-medium text-muted block mb-1">
                  내용
                </label>
                <textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="오늘 아기와의 하루를 기록해보세요"
                  rows={4}
                  className="w-full bg-surface border border-card-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {/* Date picker */}
              {!editingEntry && (
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
              )}

              {/* Save button */}
              <button
                onClick={handleSubmit}
                disabled={!formTitle.trim() || !formContent.trim()}
                className="w-full bg-primary text-white rounded-xl py-3 font-semibold text-sm disabled:opacity-40 transition-opacity"
              >
                {editingEntry ? "수정하기" : "저장하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
