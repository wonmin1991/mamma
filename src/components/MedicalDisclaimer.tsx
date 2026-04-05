"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";

export default function MedicalDisclaimer() {
  const [dismissed, setDismissed] = useState(
    () => typeof window !== "undefined" && localStorage.getItem("mamma-disclaimer-accepted") !== null
  );

  const accept = () => {
    localStorage.setItem("mamma-disclaimer-accepted", "1");
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-5">
      <div className="bg-card rounded-2xl border border-card-border shadow-xl max-w-md w-full p-6 animate-fade-in-up">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle size={24} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="font-bold text-foreground">의료 면책 고지</h2>
            <p className="text-xs text-muted mt-0.5">Medical Disclaimer</p>
          </div>
        </div>

        <div className="text-sm text-foreground leading-relaxed space-y-3">
          <p>
            맘마 앱에서 제공하는 모든 정보(주차별 가이드, 건강 꿀팁, 이유식 가이드,
            예방접종 일정 등)는 <strong>일반적인 참고 목적</strong>으로만 제공됩니다.
          </p>
          <p>
            이 정보는 의료 전문가의 진단, 치료, 처방을 대체할 수 없으며,
            개인의 건강 상태에 따라 적용이 달라질 수 있습니다.
          </p>
          <p className="text-primary font-medium">
            건강에 관한 결정은 반드시 담당 의료진과 상담 후 진행하시기 바랍니다.
          </p>
        </div>

        <button
          onClick={accept}
          className="w-full mt-5 py-3 rounded-xl bg-primary text-white font-semibold text-sm transition-all active:scale-[0.98]"
        >
          확인했습니다
        </button>
      </div>
    </div>
  );
}
