"use client";

import { useEffect, useState } from "react";
import { Activity, CalendarCheck, Clock, RotateCcw, AlertTriangle } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { checkups, getCheckupsForWeek, getUpcomingCheckups } from "@/data/checkups";
import {
  startSession,
  recordKick,
  cancelSession,
  endSessionEarly,
  getStore,
  getRecentSessions,
  type KickSession,
} from "@/lib/kickCounter";
import { generateICS, downloadICS } from "@/lib/calendar";

function fmtTime(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function PrenatalCarePage() {
  const { currentWeek, dueDate } = usePregnancy();
  const [active, setActive] = useState<KickSession | null>(null);
  const [recent, setRecent] = useState<KickSession[]>([]);
  const [now, setNow] = useState(0);

  useEffect(() => {
    const s = getStore();
    /* eslint-disable react-hooks/set-state-in-effect -- localStorage hydration on mount */
    setActive(s.active);
    setRecent(getRecentSessions(7));
    setNow(Date.now());
    /* eslint-enable react-hooks/set-state-in-effect */
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  function onStart() {
    const s = startSession();
    setActive(s);
  }

  function onKick() {
    const updated = recordKick();
    if (updated) {
      if (updated.endedAt) {
        setActive(null);
        setRecent(getRecentSessions(7));
      } else {
        setActive(updated);
      }
    }
  }

  function onEnd() {
    endSessionEarly();
    setActive(null);
    setRecent(getRecentSessions(7));
  }

  function onCancel() {
    cancelSession();
    setActive(null);
  }

  const elapsedMin = active
    ? Math.floor((now - new Date(active.startedAt).getTime()) / 60000)
    : 0;

  const currentCheckups = getCheckupsForWeek(currentWeek);
  const upcomingCheckups = getUpcomingCheckups(currentWeek);
  const showKick = currentWeek >= 28; // 후기 임신 권장

  function exportCheckupsToCalendar() {
    if (!dueDate) return;
    const dueMs = new Date(dueDate).getTime();
    const minWeek = Math.max(0, currentWeek - 1);
    const events = checkups
      .filter((c) => c.weekStart >= minWeek)
      .map((c) => {
        const date = new Date(dueMs - (40 - c.weekStart) * 86400000);
        return {
          title: `[검진] ${c.name}`,
          description: c.description,
          startDate: date,
          endDate: new Date(date.getTime() + 60 * 60 * 1000),
        };
      });
    const ics = generateICS(events, "맘마 산전검사 일정");
    downloadICS(ics, "mamma-prenatal-checkups.ics");
  }

  return (
    <main className="flex flex-col pb-24">
      <PageHeader title="산전 케어" />

      {/* Kick Counter */}
      {showKick && (
        <section className="px-5 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-primary" />
            <h2 className="font-semibold text-sm">태동 카운터</h2>
            <span className="ml-auto text-[10px] text-muted">하루 10회 / 2시간 이내 권장</span>
          </div>

          {!active ? (
            <button
              onClick={onStart}
              className="w-full rounded-2xl bg-primary text-primary-foreground py-4 font-semibold text-sm shadow-sm active:scale-[0.99]"
            >
              태동 측정 시작
            </button>
          ) : (
            <div className="rounded-2xl bg-card border border-card-border p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-muted">
                <span className="flex items-center gap-1"><Clock size={12} /> {elapsedMin}분 경과</span>
                <span>{active.count} / 10</span>
              </div>
              <button
                onClick={onKick}
                className="w-full rounded-xl bg-primary/90 text-primary-foreground py-6 text-2xl font-bold active:scale-95 transition"
                aria-label="태동 기록"
              >
                👶 탭
              </button>
              <div className="h-2 rounded-full bg-surface overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${Math.min(100, (active.count / 10) * 100)}%` }}
                />
              </div>
              <div className="flex gap-2">
                <button onClick={onEnd} className="flex-1 text-xs py-2 rounded-lg bg-surface border border-card-border">
                  종료
                </button>
                <button onClick={onCancel} className="px-3 text-xs py-2 rounded-lg text-muted">
                  취소
                </button>
              </div>
              {elapsedMin >= 120 && active.count < 10 && (
                <div className="flex items-start gap-2 text-xs rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-2">
                  <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-amber-900 dark:text-amber-200">
                    2시간 동안 태동 10회 미만이면 담당 산부인과에 즉시 연락하세요.
                  </p>
                </div>
              )}
            </div>
          )}

          {recent.length > 0 && (
            <div className="mt-3 rounded-2xl bg-surface p-3 space-y-1.5">
              <div className="flex items-center gap-1 text-[11px] text-muted mb-1">
                <RotateCcw size={11} />
                최근 7일 기록
              </div>
              {recent.slice(0, 5).map((s) => (
                <div key={s.id} className="flex items-center justify-between text-xs">
                  <span>{fmtDate(s.startedAt)} {fmtTime(s.startedAt)}</span>
                  <span className={s.durationMin && s.durationMin > 120 ? "text-amber-600" : "text-foreground"}>
                    {s.count}회 · {s.durationMin ?? "-"}분
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Checkup Timeline */}
      <section className="px-5 mt-6">
        <div className="flex items-center gap-2 mb-2">
          <CalendarCheck size={16} className="text-primary" />
          <h2 className="font-semibold text-sm">산전검사 일정</h2>
          {dueDate && (
            <button
              onClick={exportCheckupsToCalendar}
              className="ml-auto text-[11px] text-primary font-medium"
            >
              캘린더 내보내기
            </button>
          )}
        </div>

        {currentCheckups.length > 0 && (
          <div className="rounded-2xl bg-primary/5 border border-primary/20 p-3 mb-2">
            <p className="text-[11px] text-primary font-semibold mb-1.5">이번 주 ({currentWeek}주차) 권장</p>
            {currentCheckups.map((c) => (
              <div key={c.id} className="flex items-start gap-2 py-1">
                <span>{c.emoji}</span>
                <div className="flex-1 text-xs">
                  <p className="font-medium">{c.name}</p>
                  <p className="text-muted">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {upcomingCheckups.length > 0 && (
          <div className="rounded-2xl bg-card border border-card-border p-3 mb-2">
            <p className="text-[11px] text-muted font-semibold mb-1.5">다가오는 검진 (2주 이내)</p>
            {upcomingCheckups.map((c) => (
              <div key={c.id} className="flex items-start gap-2 py-1">
                <span>{c.emoji}</span>
                <div className="flex-1 text-xs">
                  <p className="font-medium">
                    {c.name} <span className="text-muted">· {c.weekStart}~{c.weekEnd}주</span>
                  </p>
                  <p className="text-muted">{c.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <details className="rounded-2xl bg-surface p-3">
          <summary className="text-xs font-semibold cursor-pointer">전체 산전검사 일정 보기</summary>
          <div className="mt-2 space-y-1.5">
            {checkups.map((c) => (
              <div key={c.id} className="flex items-start gap-2 text-xs py-1 border-b border-card-border last:border-0">
                <span>{c.emoji}</span>
                <div className="flex-1">
                  <p className="font-medium">{c.name} <span className="text-muted text-[10px]">· {c.weekStart}~{c.weekEnd}주</span></p>
                  <p className="text-muted">{c.description}{c.cost ? ` · 비용 ${c.cost}` : ""}</p>
                </div>
              </div>
            ))}
          </div>
        </details>
      </section>
    </main>
  );
}
