"use client";

import { useState } from "react";
import { useBabyStore } from "@/store/useBabyStore";
import { Baby, ChevronRight, Sparkles } from "lucide-react";
import { useFocusTrap } from "@/lib/useFocusTrap";

export default function BabyOnboarding() {
  const baby = useBabyStore((s) => s.baby);
  const mode = useBabyStore((s) => s.mode);
  const setBaby = useBabyStore((s) => s.setBaby);
  const [show, setShow] = useState(false);

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<"M" | "F" | "">("");
  const [step, setStep] = useState<"info" | "done">("info");

  const focusRef = useFocusTrap(show);

  if (mode === "postnatal" && baby) return null;
  if (!show) return null;

  const handleSubmit = () => {
    if (!name.trim() || !birthDate) return;
    setBaby({
      name: name.trim(),
      birthDate,
      gender: gender === "" ? undefined : gender,
    });
    setStep("done");
    setTimeout(() => setShow(false), 1500);
  };

  return (
    <div ref={focusRef} className="fixed inset-0 z-[100] flex items-center justify-center p-5" role="dialog" aria-modal="true" aria-labelledby="baby-onboard-title">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm bg-card rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        {step === "info" && (
          <div className="p-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-light to-secondary-light flex items-center justify-center mx-auto mb-5">
              <Baby size={28} className="text-primary" />
            </div>
            <h2 id="baby-onboard-title" className="text-lg font-bold text-foreground text-center mb-2">
              아기가 태어났나요?
            </h2>
            <p className="text-xs text-muted text-center mb-6">
              아기 정보를 입력하면 출산 후 모드로 전환됩니다.
            </p>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="아기 이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface border border-card-border text-sm text-foreground focus:outline-none focus:border-primary"
              />
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface border border-card-border text-sm text-foreground focus:outline-none focus:border-primary"
              />
              <div className="flex gap-2">
                {([
                  { value: "M" as const, label: "남아", emoji: "👦" },
                  { value: "F" as const, label: "여아", emoji: "👧" },
                ]).map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setGender(gender === g.value ? "" : g.value)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2
                      ${gender === g.value
                        ? "bg-primary text-white"
                        : "bg-surface text-muted border border-card-border"
                      }`}
                  >
                    <span>{g.emoji}</span> {g.label}
                  </button>
                ))}
              </div>
              <button
                onClick={handleSubmit}
                disabled={!name.trim() || !birthDate}
                className="w-full py-3.5 mt-2 rounded-2xl bg-primary text-white font-semibold text-sm disabled:opacity-40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                시작하기 <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setShow(false)}
                className="text-xs text-muted hover:text-foreground transition-colors text-center"
              >
                나중에 할게요
              </button>
            </div>
          </div>
        )}
        {step === "done" && (
          <div className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-surface-emerald to-surface-sky flex items-center justify-center mx-auto mb-5">
              <Sparkles size={32} className="text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-foreground">환영합니다!</h2>
            <p className="text-sm text-muted mt-2">
              {name}의 성장을 함께 기록해요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function BabyOnboardingTrigger() {
  const baby = useBabyStore((s) => s.baby);
  const mode = useBabyStore((s) => s.mode);
  const [show, setShow] = useState(false);
  const setBaby = useBabyStore((s) => s.setBaby);

  if (mode === "postnatal" && baby) return null;

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
      >
        <Baby size={16} /> 아기가 태어났어요!
      </button>
      {show && <BabyOnboardingModal onClose={() => setShow(false)} setBaby={setBaby} />}
    </>
  );
}

function BabyOnboardingModal({ onClose, setBaby }: { onClose: () => void; setBaby: (baby: { name: string; birthDate: string; gender?: "M" | "F" }) => void }) {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<"M" | "F" | "">("");
  const [step, setStep] = useState<"info" | "done">("info");

  const focusRef = useFocusTrap(true);

  const handleSubmit = () => {
    if (!name.trim() || !birthDate) return;
    setBaby({
      name: name.trim(),
      birthDate,
      gender: gender === "" ? undefined : gender,
    });
    setStep("done");
    setTimeout(onClose, 1500);
  };

  return (
    <div ref={focusRef} className="fixed inset-0 z-[100] flex items-center justify-center p-5" role="dialog" aria-modal="true" aria-labelledby="baby-reg-title">
      <button type="button" className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-label="닫기" />
      <div className="relative w-full max-w-sm bg-card rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        {step === "info" && (
          <div className="p-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-light to-secondary-light flex items-center justify-center mx-auto mb-5">
              <Baby size={28} className="text-primary" />
            </div>
            <h2 id="baby-reg-title" className="text-lg font-bold text-foreground text-center mb-2">아기 정보 등록</h2>
            <p className="text-xs text-muted text-center mb-6">출산 후 모드에서 육아 기록을 시작해요.</p>
            <div className="flex flex-col gap-3">
              <input type="text" placeholder="아기 이름" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-surface border border-card-border text-sm text-foreground focus:outline-none focus:border-primary" />
              <div>
                <label className="text-xs text-muted block mb-1">생년월일</label>
                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-card-border text-sm text-foreground focus:outline-none focus:border-primary" />
              </div>
              <div className="flex gap-2">
                {([{ value: "M" as const, label: "남아", emoji: "👦" }, { value: "F" as const, label: "여아", emoji: "👧" }]).map((g) => (
                  <button key={g.value} onClick={() => setGender(gender === g.value ? "" : g.value)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${gender === g.value ? "bg-primary text-white" : "bg-surface text-muted border border-card-border"}`}>
                    <span>{g.emoji}</span> {g.label}
                  </button>
                ))}
              </div>
              <button onClick={handleSubmit} disabled={!name.trim() || !birthDate}
                className="w-full py-3.5 mt-2 rounded-2xl bg-primary text-white font-semibold text-sm disabled:opacity-40 active:scale-[0.98] transition-all">
                등록하기
              </button>
            </div>
          </div>
        )}
        {step === "done" && (
          <div className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-surface-emerald to-surface-sky flex items-center justify-center mx-auto mb-5">
              <Sparkles size={32} className="text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-foreground">등록 완료!</h2>
            <p className="text-sm text-muted mt-2">{name}의 성장을 함께 기록해요.</p>
          </div>
        )}
      </div>
    </div>
  );
}
