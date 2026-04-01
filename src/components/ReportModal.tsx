"use client";

import { useState } from "react";
import { X, AlertTriangle, Check } from "lucide-react";
import { STORAGE_KEYS } from "@/lib/storage";

const REPORT_REASONS = [
  { id: "spam", label: "스팸/광고" },
  { id: "inappropriate", label: "부적절한 내용" },
  { id: "misinformation", label: "잘못된 의료 정보" },
  { id: "harassment", label: "괴롭힘/비방" },
  { id: "other", label: "기타" },
];

const REPORTS_KEY = STORAGE_KEYS.REPORTS;

interface Props {
  readonly targetId: number;
  readonly targetType: "post" | "comment";
  readonly onClose: () => void;
}

export default function ReportModal({ targetId, targetType, onClose }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selected) return;

    try {
      const parsed = JSON.parse(localStorage.getItem(REPORTS_KEY) || "[]");
      const reports = Array.isArray(parsed) ? parsed : [];
      reports.push({
        targetId,
        targetType,
        reason: selected,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
    } catch {
      // quota exceeded — silently skip
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-label="신고 완료">
        <button type="button" className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="닫기" />
        <div className="relative bg-card rounded-2xl border border-card-border shadow-lg p-6 mx-5 max-w-sm w-full text-center animate-fade-in-up">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3">
            <Check size={24} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="font-bold text-foreground">신고가 접수되었습니다</h3>
          <p className="text-xs text-muted mt-2 leading-relaxed">
            검토 후 조치하겠습니다.
            <br />
            건강한 커뮤니티를 만들어주셔서 감사합니다.
          </p>
          <button
            onClick={onClose}
            className="mt-4 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-medium"
          >
            확인
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true" aria-label="신고하기">
      <button type="button" className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="닫기" />
      <div className="relative w-full max-w-lg bg-card rounded-t-3xl p-5 pb-8 animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" />
            {targetType === "post" ? "게시글" : "댓글"} 신고
          </h2>
          <button onClick={onClose} className="p-1 text-muted" aria-label="닫기">
            <X size={20} />
          </button>
        </div>

        <p className="text-xs text-muted mb-4">신고 사유를 선택해주세요.</p>

        <div className="flex flex-col gap-2 mb-5">
          {REPORT_REASONS.map((reason) => (
            <button
              key={reason.id}
              onClick={() => setSelected(reason.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                selected === reason.id
                  ? "bg-primary-light text-primary border-2 border-primary"
                  : "bg-surface text-foreground border border-card-border"
              }`}
            >
              {reason.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selected}
          className="w-full py-3 rounded-xl bg-red-500 text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          신고하기
        </button>
      </div>
    </div>
  );
}
