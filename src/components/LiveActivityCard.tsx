"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, Timer, ChevronRight } from "lucide-react";
import { getStore as getKickStore } from "@/lib/kickCounter";

interface LiveTask {
  id: string;
  href: string;
  icon: "kick" | "feed";
  title: string;
  detail: string;
  progress?: number; // 0~100
  cta: string;
}

function readActiveCareTimer(): { type: string; startedAt: number } | null {
  // care-log uses local component state, not persisted. We watch a possible global signal
  // via custom localStorage key (set by care-log when timer is active).
  try {
    const raw = localStorage.getItem("mamma-active-care-timer");
    if (!raw) return null;
    return JSON.parse(raw) as { type: string; startedAt: number };
  } catch {
    return null;
  }
}

export default function LiveActivityCard() {
  const [tasks, setTasks] = useState<LiveTask[]>([]);
  const [, setTick] = useState(0);

  useEffect(() => {
    const refresh = () => {
      const list: LiveTask[] = [];

      // Kick counter active session
      const kickStore = getKickStore();
      if (kickStore.active) {
        const elapsedMin = Math.floor((Date.now() - new Date(kickStore.active.startedAt).getTime()) / 60000);
        const count = kickStore.active.count;
        list.push({
          id: "kick",
          href: "/prenatal-care",
          icon: "kick",
          title: "태동 측정 중",
          detail: `${count}/10회 · ${elapsedMin}분 경과`,
          progress: Math.min(100, (count / 10) * 100),
          cta: "기록하기",
        });
      }

      // Care timer active session
      const careTimer = readActiveCareTimer();
      if (careTimer) {
        const elapsedSec = Math.floor((Date.now() - careTimer.startedAt) / 1000);
        const m = Math.floor(elapsedSec / 60);
        const s = elapsedSec % 60;
        const typeLabel: Record<string, string> = {
          breast_feed: "모유 수유",
          bottle_feed: "분유 수유",
          sleep: "수면",
        };
        list.push({
          id: "care",
          href: "/care-log",
          icon: "feed",
          title: `${typeLabel[careTimer.type] ?? "기록"} 진행 중`,
          detail: `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")} 경과`,
          cta: "종료하기",
        });
      }

      setTasks(list);
    };

    refresh();
    const t = setInterval(() => {
      refresh();
      setTick((x) => x + 1);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  if (tasks.length === 0) return null;

  return (
    <section className="px-5 mt-3">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
        </span>
        <p className="text-xs font-semibold text-primary">진행 중</p>
      </div>

      <div className="flex flex-col gap-2">
        {tasks.map((t) => {
          const Icon = t.icon === "kick" ? Activity : Timer;
          return (
            <Link
              key={t.id}
              href={t.href}
              className="block rounded-2xl bg-card border border-card-border shadow-sm px-4 py-3 active:scale-[0.99] transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{t.title}</p>
                  <p className="text-xs text-muted">{t.detail}</p>
                  {typeof t.progress === "number" && (
                    <div className="mt-1.5 h-1 rounded-full bg-surface overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${t.progress}%` }}
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-0.5 text-xs font-medium text-primary shrink-0">
                  {t.cta} <ChevronRight size={12} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
