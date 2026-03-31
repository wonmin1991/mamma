"use client";

import { useState, useRef, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { Gift, Heart, Flame } from "lucide-react";

export default function DailyReward() {
  const canClaim = useStore((s) => s.canClaimDaily());
  const claimDailyReward = useStore((s) => s.claimDailyReward);
  const dailyStreak = useStore((s) => s.dailyStreak);
  const hearts = useStore((s) => s.hearts);
  const [justClaimed, setJustClaimed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClaim = () => {
    const reward = claimDailyReward();
    if (reward > 0) {
      setJustClaimed(reward);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setJustClaimed(0), 3000);
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-card-border shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
            <Heart size={18} className="text-primary" fill="currentColor" />
          </div>
          <div>
            <p className="text-xs text-muted">보유 하트</p>
            <p className="text-lg font-bold text-primary">{hearts}</p>
          </div>
        </div>

        {dailyStreak > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent-light">
            <Flame size={12} className="text-accent" />
            <span className="text-xs font-bold text-accent">{dailyStreak}일 연속</span>
          </div>
        )}
      </div>

      {justClaimed > 0 ? (
        <div className="mt-3 py-2.5 rounded-xl bg-surface-emerald text-center animate-fade-in-up">
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
            +{justClaimed} 하트 획득! 🎉
          </p>
        </div>
      ) : canClaim ? (
        <button
          onClick={handleClaim}
          className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <Gift size={16} /> 출석 체크 하트 받기
        </button>
      ) : (
        <div className="mt-3 py-2.5 rounded-xl bg-surface text-center">
          <p className="text-xs text-muted">오늘 출석 체크 완료 ✅ 내일 또 만나요!</p>
        </div>
      )}
    </div>
  );
}
