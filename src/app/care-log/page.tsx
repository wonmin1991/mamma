"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Clock,
  X,
} from "lucide-react";
import { useBabyStore } from "@/store/useBabyStore";
import {
  CARE_LOG_TYPES,
  CARE_LOG_TABS,
  type CareLogType,
} from "@/data/postnatal";

/* ── helpers ────────────────────────────────────────────── */

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDate(d: Date) {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  return `${y}년 ${m}월 ${day}일 (${weekdays[d.getDay()]})`;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function nowTimeStr() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function isToday(d: Date) {
  const t = new Date();
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
}

/* ── tab filter mapping ─────────────────────────────────── */

const TAB_TYPE_MAP: Record<string, CareLogType[]> = {
  all: ["breast_feed", "bottle_feed", "sleep", "diaper_wet", "diaper_dirty", "diaper_both"],
  feed: ["breast_feed", "bottle_feed"],
  sleep: ["sleep"],
  diaper: ["diaper_wet", "diaper_dirty", "diaper_both"],
};

/* ── main component ─────────────────────────────────────── */

export default function CareLogPage() {
  const careLogs = useBabyStore((s) => s.careLogs);
  const addCareLog = useBabyStore((s) => s.addCareLog);
  const deleteCareLog = useBabyStore((s) => s.deleteCareLog);

  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [activeTab, setActiveTab] = useState("all");
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState<CareLogType>("breast_feed");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // form state
  const [formTime, setFormTime] = useState(nowTimeStr);
  const [formEndTime, setFormEndTime] = useState(nowTimeStr);
  const [formAmount, setFormAmount] = useState("");
  const [formSide, setFormSide] = useState<"left" | "right" | "both">("left");
  const [formNote, setFormNote] = useState("");

  // timer state
  const [timerActive, setTimerActive] = useState(false);
  const [timerType, setTimerType] = useState<CareLogType | null>(null);
  const [timerStart, setTimerStart] = useState<Date | null>(null);
  const [timerElapsed, setTimerElapsed] = useState(0);

  const dateStr = toDateStr(selectedDate);

  /* filtered & sorted logs */
  const filteredLogs = useMemo(() => {
    const types = TAB_TYPE_MAP[activeTab] ?? TAB_TYPE_MAP.all;
    return careLogs
      .filter((l) => l.startTime.startsWith(dateStr) && types.includes(l.type))
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  }, [careLogs, dateStr, activeTab]);

  /* daily summary */
  const summary = useMemo(() => {
    const dayLogs = careLogs.filter((l) => l.startTime.startsWith(dateStr));
    return {
      feeds: dayLogs.filter((l) => l.type === "breast_feed" || l.type === "bottle_feed").length,
      sleeps: dayLogs.filter((l) => l.type === "sleep").length,
      diapers: dayLogs.filter((l) => l.type.startsWith("diaper")).length,
    };
  }, [careLogs, dateStr]);

  /* timer tick */
  useEffect(() => {
    if (!timerActive || !timerStart) return;
    const id = setInterval(() => {
      setTimerElapsed(Math.floor((Date.now() - timerStart.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [timerActive, timerStart]);

  const startTimer = (type: CareLogType) => {
    setTimerType(type);
    setTimerStart(new Date());
    setTimerElapsed(0);
    setTimerActive(true);
  };

  const stopTimer = () => {
    if (!timerStart || !timerType) return;
    const end = new Date();
    const entry: {
      type: CareLogType;
      startTime: string;
      endTime?: string;
      side?: "left" | "right" | "both";
      note?: string;
    } = {
      type: timerType,
      startTime: timerStart.toISOString(),
    };
    if (timerType === "sleep" || timerType === "breast_feed") {
      entry.endTime = end.toISOString();
    }
    addCareLog(entry);
    setTimerActive(false);
    setTimerType(null);
    setTimerStart(null);
    setTimerElapsed(0);
  };

  const formatElapsed = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  /* date nav */
  const goPrev = () => setSelectedDate((d) => { const n = new Date(d); n.setDate(n.getDate() - 1); return n; });
  const goNext = () => setSelectedDate((d) => { const n = new Date(d); n.setDate(n.getDate() + 1); return n; });

  /* open add dialog */
  const openDialog = (type: CareLogType) => {
    setDialogType(type);
    const now = nowTimeStr();
    setFormTime(now);
    setFormEndTime(now);
    setFormAmount("");
    setFormSide("left");
    setFormNote("");
    setShowDialog(true);
  };

  /* submit log */
  const handleSubmit = () => {
    const [h, m] = formTime.split(":").map(Number);
    const start = new Date(selectedDate);
    start.setHours(h, m, 0, 0);

    const entry: {
      type: CareLogType;
      startTime: string;
      endTime?: string;
      amount?: number;
      side?: "left" | "right" | "both";
      note?: string;
    } = {
      type: dialogType,
      startTime: start.toISOString(),
    };

    if (dialogType === "bottle_feed" && formAmount) {
      entry.amount = Number(formAmount);
    }
    if (dialogType === "breast_feed") {
      entry.side = formSide;
    }
    if (dialogType === "sleep" && formEndTime) {
      const [eh, em] = formEndTime.split(":").map(Number);
      const end = new Date(selectedDate);
      end.setHours(eh, em, 0, 0);
      entry.endTime = end.toISOString();
    }
    if (formNote.trim()) {
      entry.note = formNote.trim();
    }

    addCareLog(entry);
    setShowDialog(false);
  };

  /* confirm delete */
  const confirmDelete = (id: string) => setDeleteTarget(id);
  const handleDelete = () => {
    if (deleteTarget) {
      deleteCareLog(deleteTarget);
      setDeleteTarget(null);
    }
  };

  /* get log type info */
  const getTypeInfo = (type: CareLogType) =>
    CARE_LOG_TYPES.find((t) => t.id === type) ?? { label: type, emoji: "", color: "text-foreground" };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-5 pt-12 pb-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-1 -ml-1 rounded-lg hover:bg-surface transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold">육아 기록</h1>
        </div>
      </header>

      <div className="px-5 space-y-4">
        {/* ── Date Navigation ── */}
        <div className="flex items-center justify-between bg-card rounded-2xl border border-card-border p-3">
          <button onClick={goPrev} className="p-2 rounded-xl hover:bg-surface transition-colors">
            <ChevronLeft className="w-5 h-5 text-muted" />
          </button>
          <span className="font-semibold text-sm">
            {isToday(selectedDate) ? "오늘 " : ""}
            {formatDate(selectedDate)}
          </span>
          <button onClick={goNext} className="p-2 rounded-xl hover:bg-surface transition-colors">
            <ChevronRight className="w-5 h-5 text-muted" />
          </button>
        </div>

        {/* ── Daily Summary ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "수유", count: summary.feeds, emoji: "🍼", bg: "bg-surface-rose" },
            { label: "수면", count: summary.sleeps, emoji: "😴", bg: "bg-surface-violet" },
            { label: "기저귀", count: summary.diapers, emoji: "👶", bg: "bg-surface-amber" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-3 text-center`}>
              <div className="text-xl">{s.emoji}</div>
              <div className="text-lg font-bold">{s.count}회</div>
              <div className="text-xs text-muted">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Timer ── */}
        {timerActive && timerType ? (
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border-2 border-primary/30 p-5">
            <div className="text-center">
              <p className="text-xs text-muted mb-1">
                {CARE_LOG_TYPES.find((t) => t.id === timerType)?.emoji}{" "}
                {CARE_LOG_TYPES.find((t) => t.id === timerType)?.label} 진행 중
              </p>
              <p className="text-4xl font-bold text-primary font-mono tabular-nums">
                {formatElapsed(timerElapsed)}
              </p>
              <p className="text-xs text-muted mt-1">
                시작: {timerStart ? formatTime(timerStart.toISOString()) : ""}
              </p>
            </div>
            <button
              onClick={stopTimer}
              className="w-full mt-4 py-3 rounded-xl bg-red-500 text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <X className="w-4 h-4" /> 종료 및 저장
            </button>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-card-border p-4">
            <h2 className="text-sm font-semibold text-muted mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> 타이머로 기록
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {(["breast_feed", "sleep"] as CareLogType[]).map((type) => {
                const info = CARE_LOG_TYPES.find((t) => t.id === type);
                return (
                  <button
                    key={type}
                    onClick={() => startTimer(type)}
                    className="flex items-center gap-2 p-3 rounded-xl bg-surface hover:bg-surface/80 transition-colors border border-card-border"
                  >
                    <span className="text-xl">{info?.emoji}</span>
                    <span className="text-xs font-medium">{info?.label} 시작</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Quick Action Buttons ── */}
        <div className="bg-card rounded-2xl border border-card-border p-4">
          <h2 className="text-sm font-semibold text-muted mb-3">빠른 기록</h2>
          <div className="grid grid-cols-3 gap-2">
            {CARE_LOG_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => openDialog(t.id)}
                className="flex flex-col items-center gap-1 p-3 rounded-xl bg-surface hover:bg-surface/80 transition-colors"
              >
                <span className="text-2xl">{t.emoji}</span>
                <span className="text-xs font-medium">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab Filter ── */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {CARE_LOG_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "bg-surface text-muted hover:bg-surface/80"
              }`}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── Log List ── */}
        <div className="space-y-2">
          {filteredLogs.length === 0 ? (
            <div className="bg-card rounded-2xl border border-card-border p-8 text-center">
              <p className="text-3xl mb-2">📝</p>
              <p className="text-muted text-sm">기록이 없습니다</p>
              <p className="text-muted text-xs mt-1">위 버튼으로 기록을 추가해보세요</p>
            </div>
          ) : (
            filteredLogs.map((log) => {
              const info = getTypeInfo(log.type);
              return (
                <div
                  key={log.id}
                  className="bg-card rounded-2xl border border-card-border p-4 flex items-center gap-3"
                >
                  <div className="text-2xl">{info.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold text-sm ${info.color}`}>{info.label}</span>
                      {log.amount != null && (
                        <span className="text-xs text-muted">{log.amount}ml</span>
                      )}
                      {log.side && (
                        <span className="text-xs text-muted">
                          {log.side === "left" ? "왼쪽" : log.side === "right" ? "오른쪽" : "양쪽"}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(log.startTime)}</span>
                      {log.endTime && <span>~ {formatTime(log.endTime)}</span>}
                    </div>
                    {log.note && (
                      <p className="text-xs text-muted mt-1 truncate">{log.note}</p>
                    )}
                  </div>
                  <button
                    onClick={() => confirmDelete(log.id)}
                    className="p-2 rounded-xl hover:bg-surface-red transition-colors text-muted hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Add Dialog Modal ── */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <div className="w-full max-w-lg bg-card rounded-t-3xl p-5 pb-8 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">
                {getTypeInfo(dialogType).emoji} {getTypeInfo(dialogType).label} 기록
              </h2>
              <button onClick={() => setShowDialog(false)} className="p-2 rounded-xl hover:bg-surface">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Time */}
              <div>
                <label className="text-sm font-medium text-muted block mb-1">시작 시간</label>
                <input
                  type="time"
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  className="w-full bg-surface rounded-xl px-4 py-3 text-sm border border-card-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {/* Sleep: end time */}
              {dialogType === "sleep" && (
                <div>
                  <label className="text-sm font-medium text-muted block mb-1">종료 시간</label>
                  <input
                    type="time"
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    className="w-full bg-surface rounded-xl px-4 py-3 text-sm border border-card-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              )}

              {/* Bottle feed: amount */}
              {dialogType === "bottle_feed" && (
                <div>
                  <label className="text-sm font-medium text-muted block mb-1">수유량 (ml)</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="예: 120"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="w-full bg-surface rounded-xl px-4 py-3 text-sm border border-card-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              )}

              {/* Breast feed: side */}
              {dialogType === "breast_feed" && (
                <div>
                  <label className="text-sm font-medium text-muted block mb-1">수유 방향</label>
                  <div className="flex gap-2">
                    {([["left", "왼쪽"], ["right", "오른쪽"], ["both", "양쪽"]] as const).map(
                      ([val, label]) => (
                        <button
                          key={val}
                          onClick={() => setFormSide(val)}
                          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                            formSide === val
                              ? "bg-primary text-white"
                              : "bg-surface text-muted border border-card-border"
                          }`}
                        >
                          {label}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Note */}
              <div>
                <label className="text-sm font-medium text-muted block mb-1">메모 (선택)</label>
                <textarea
                  placeholder="추가 메모를 입력하세요"
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  rows={2}
                  className="w-full bg-surface rounded-xl px-4 py-3 text-sm border border-card-border focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                className="w-full bg-primary text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Plus className="w-5 h-5" />
                기록 추가
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card rounded-2xl p-6 mx-5 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold mb-2">기록 삭제</h3>
            <p className="text-sm text-muted mb-5">이 기록을 삭제하시겠습니까? 삭제 후 복구할 수 없습니다.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-surface text-muted border border-card-border hover:bg-surface/80 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
