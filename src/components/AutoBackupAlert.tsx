"use client";

import { useState } from "react";
import { Download, X, Clock } from "lucide-react";
import { exportAllData } from "@/lib/storage";

const BACKUP_KEY = "mamma-last-backup";
const DISMISS_KEY = "mamma-backup-dismissed";

function daysSinceLastBackup(): number | null {
  try {
    const last = localStorage.getItem(BACKUP_KEY);
    if (!last) return null;
    const diff = Date.now() - new Date(last).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  } catch {
    return null;
  }
}

function getAutoBackupDays(): number {
  try {
    const val = process.env.NEXT_PUBLIC_AUTO_BACKUP_DAYS;
    return val ? Number(val) : 7;
  } catch {
    return 7;
  }
}

function computeInitial(): { show: boolean; days: number | null } {
  try {
    const interval = getAutoBackupDays();
    if (interval === 0) return { show: false, days: null };

    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed) {
      const hoursSinceDismiss = (Date.now() - new Date(dismissed).getTime()) / (1000 * 60 * 60);
      if (hoursSinceDismiss < 24) return { show: false, days: null };
    }

    const d = daysSinceLastBackup();
    if (d === null || d >= interval) return { show: true, days: d };
    return { show: false, days: null };
  } catch {
    return { show: false, days: null };
  }
}

export default function AutoBackupAlert() {
  const [show, setShow] = useState(() => computeInitial().show);
  const [days] = useState(() => computeInitial().days);

  const handleBackup = () => {
    const data = exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = globalThis.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mamma-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    globalThis.URL.revokeObjectURL(url);

    localStorage.setItem(BACKUP_KEY, new Date().toISOString());
    setShow(false);
  };

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, new Date().toISOString());
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2.5rem)] max-w-lg animate-fade-in-up">
      <div className="bg-card rounded-2xl border border-amber-200 dark:border-amber-800 shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-amber flex items-center justify-center flex-shrink-0">
            <Clock size={20} className="text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-foreground">데이터 백업을 권장합니다</p>
            <p className="text-xs text-muted mt-0.5">
              {days === null
                ? "아직 백업한 적이 없어요. 소중한 데이터를 보호하세요!"
                : `마지막 백업이 ${days}일 전이에요. 정기 백업을 권장합니다.`}
            </p>
          </div>
          <button onClick={dismiss} className="p-1 rounded-lg hover:bg-surface text-muted" aria-label="닫기">
            <X size={16} />
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={dismiss}
            className="flex-1 py-2 rounded-xl text-xs font-medium bg-surface text-muted border border-card-border"
          >
            나중에
          </button>
          <button
            onClick={handleBackup}
            className="flex-1 py-2 rounded-xl text-xs font-medium bg-primary text-white flex items-center justify-center gap-1"
          >
            <Download size={14} /> 지금 백업
          </button>
        </div>
      </div>
    </div>
  );
}
