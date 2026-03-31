"use client";

import { useState, useRef, useEffect } from "react";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { Baby, Calendar, ChevronRight, Sparkles } from "lucide-react";

type Step = "welcome" | "method" | "dueDate" | "weekSelect" | "done";

export default function OnboardingModal() {
  const { isOnboarded, setDueDate, setWeekDirectly } = usePregnancy();
  const [step, setStep] = useState<Step>("welcome");
  const [dateInput, setDateInput] = useState("");
  const [weekInput, setWeekInput] = useState(16);
  const [closing, setClosing] = useState(false);
  const closingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (closingTimerRef.current) clearTimeout(closingTimerRef.current);
    };
  }, []);

  if (isOnboarded) return null;

  const handleDueDateSubmit = () => {
    if (!dateInput) return;
    setDueDate(dateInput);
    setStep("done");
    closingTimerRef.current = setTimeout(() => setClosing(true), 1200);
  };

  const handleWeekSubmit = () => {
    setWeekDirectly(weekInput);
    setStep("done");
    closingTimerRef.current = setTimeout(() => setClosing(true), 1200);
  };

  if (closing) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-5" role="dialog" aria-modal="true" aria-label="온보딩">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative w-full max-w-sm bg-card rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        {step === "welcome" && (
          <div className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-light to-secondary-light flex items-center justify-center mx-auto mb-5">
              <span className="text-4xl">🤰</span>
            </div>
            <h2 className="text-xl font-bold text-foreground">
              맘마에 오신 걸 환영해요!
            </h2>
            <p className="text-sm text-muted mt-2 leading-relaxed">
              맞춤 정보를 제공하기 위해
              <br />
              간단한 정보를 알려주세요.
            </p>
            <button
              onClick={() => setStep("method")}
              className="mt-6 w-full py-3.5 rounded-2xl bg-primary text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              시작하기 <ChevronRight size={16} />
            </button>
            <button
              onClick={() => {
                setWeekDirectly(16);
                setClosing(true);
              }}
              className="mt-3 text-xs text-muted hover:text-foreground transition-colors"
            >
              나중에 설정할게요
            </button>
          </div>
        )}

        {step === "method" && (
          <div className="p-8">
            <h2 className="text-lg font-bold text-foreground text-center mb-2">
              어떤 방법으로 알려줄까요?
            </h2>
            <p className="text-xs text-muted text-center mb-6">
              출산 예정일 또는 현재 임신 주차를 선택해주세요
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setStep("dueDate")}
                className="flex items-center gap-4 p-4 rounded-2xl border border-card-border bg-surface hover:border-primary transition-colors text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                  <Calendar size={22} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">출산 예정일 입력</p>
                  <p className="text-xs text-muted mt-0.5">정확한 주차를 자동 계산해요</p>
                </div>
                <ChevronRight size={16} className="text-muted ml-auto" />
              </button>

              <button
                onClick={() => setStep("weekSelect")}
                className="flex items-center gap-4 p-4 rounded-2xl border border-card-border bg-surface hover:border-secondary transition-colors text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary-light flex items-center justify-center flex-shrink-0">
                  <Baby size={22} className="text-secondary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">현재 주차 직접 선택</p>
                  <p className="text-xs text-muted mt-0.5">대략적인 주차를 선택해주세요</p>
                </div>
                <ChevronRight size={16} className="text-muted ml-auto" />
              </button>
            </div>
          </div>
        )}

        {step === "dueDate" && (
          <div className="p-8">
            <h2 className="text-lg font-bold text-foreground text-center mb-2">
              출산 예정일을 알려주세요
            </h2>
            <p className="text-xs text-muted text-center mb-6">
              산부인과에서 안내받은 예정일을 입력해주세요
            </p>

            <div className="flex flex-col items-center gap-4">
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-surface border border-card-border text-sm text-foreground text-center focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button
                onClick={handleDueDateSubmit}
                disabled={!dateInput}
                className="w-full py-3.5 rounded-2xl bg-primary text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
              >
                확인
              </button>
              <button
                onClick={() => setStep("method")}
                className="text-xs text-muted hover:text-foreground transition-colors"
              >
                돌아가기
              </button>
            </div>
          </div>
        )}

        {step === "weekSelect" && (
          <div className="p-8">
            <h2 className="text-lg font-bold text-foreground text-center mb-2">
              현재 임신 주차를 선택하세요
            </h2>
            <p className="text-xs text-muted text-center mb-6">
              정확하지 않아도 괜찮아요. 나중에 변경할 수 있어요.
            </p>

            <div className="flex flex-col items-center gap-4">
              <div className="text-center">
                <span className="text-5xl font-bold text-primary">{weekInput}</span>
                <span className="text-lg text-muted ml-1">주차</span>
              </div>

              <input
                type="range"
                min={1}
                max={40}
                value={weekInput}
                onChange={(e) => setWeekInput(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between w-full text-[10px] text-muted px-1">
                <span>1주</span>
                <span>초기</span>
                <span>중기</span>
                <span>후기</span>
                <span>40주</span>
              </div>

              <button
                onClick={handleWeekSubmit}
                className="w-full py-3.5 rounded-2xl bg-primary text-white font-semibold text-sm active:scale-[0.98] transition-transform"
              >
                확인
              </button>
              <button
                onClick={() => setStep("method")}
                className="text-xs text-muted hover:text-foreground transition-colors"
              >
                돌아가기
              </button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-surface-emerald to-surface-sky flex items-center justify-center mx-auto mb-5">
              <Sparkles size={32} className="text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              설정 완료!
            </h2>
            <p className="text-sm text-muted mt-2 leading-relaxed">
              맞춤 임신 정보를 준비했어요.
              <br />
              건강한 임신 생활을 응원합니다!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
