"use client";

import { useEffect, useState } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { useBabyStore, getBabyAgeMonths } from "@/store/useBabyStore";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { useStore } from "@/store/useStore";
import { getSupplementsForWeek } from "@/data/supplements";
import { getUpcomingCheckups } from "@/data/checkups";
import { getUrgentBenefits } from "@/data/benefits";
import { isNative } from "@/lib/native";
import { BASE_URL } from "@/lib/constants";

const CACHE_KEY = "mamma-daily-brief";

interface CachedBrief {
  date: string; // YYYY-MM-DD
  brief: string;
  mode: string;
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function readCache(): CachedBrief | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CachedBrief;
  } catch {
    return null;
  }
}

function writeCache(c: CachedBrief) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(c));
  } catch { /* ignore */ }
}

export default function DailyBrief() {
  const mode = useBabyStore((s) => s.mode);
  const baby = useBabyStore((s) => s.baby);
  const hydrated = useBabyStore((s) => s._hydrated);
  const { currentWeek, babyNickname } = usePregnancy();
  const supplementChecks = useStore((s) => s.supplementChecks);
  const benefitChecked = useStore((s) => s.benefitChecked);

  const [brief, setBrief] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function fetchBrief(force = false) {
    setLoading(true);
    setError(false);
    try {
      const region = (typeof window !== "undefined" && localStorage.getItem("mamma-benefit-region")) || undefined;
      const today = todayStr();

      // 컨텍스트 수집
      let suppPending: number | undefined;
      if (mode === "pregnancy") {
        const list = getSupplementsForWeek(currentWeek).filter((s) => s.priority === "essential");
        const checks = supplementChecks[today] ?? [];
        suppPending = list.filter((s) => !checks.includes(s.id)).length;
      }
      let upcomingCheckup: string | undefined;
      if (mode === "pregnancy") {
        const next = getUpcomingCheckups(currentWeek)[0];
        upcomingCheckup = next?.name;
      }
      let urgentBenefit: string | undefined;
      if (mode === "pregnancy") {
        const urgent = getUrgentBenefits(currentWeek, region ?? null).filter((b) => !benefitChecked.includes(b.id))[0];
        urgentBenefit = urgent?.name;
      }

      const endpoint = isNative() ? `${BASE_URL.replace(/\/$/, "")}/api/daily-brief` : "/api/daily-brief";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          currentWeek: mode === "pregnancy" ? currentWeek : undefined,
          babyAgeMonths: mode === "postnatal" && baby ? getBabyAgeMonths(baby.birthDate) : undefined,
          babyNickname: mode === "postnatal" ? baby?.name : babyNickname,
          region,
          todayContext: { suppPending, upcomingCheckup, urgentBenefit },
        }),
      });

      if (!res.ok) throw new Error("brief fetch failed");
      const data = (await res.json()) as { brief: string };
      const next: CachedBrief = { date: today, brief: data.brief, mode };
      writeCache(next);
      setBrief(data.brief);
      void force; // suppress unused
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  // 초기 로드: 오늘 캐시 있으면 사용, 없으면 패치
  useEffect(() => {
    if (!hydrated) return;
    const cached = readCache();
    if (cached && cached.date === todayStr() && cached.mode === mode) {
      setBrief(cached.brief);
      return;
    }
    void fetchBrief();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, mode]);

  if (!brief && !loading && !error) return null;

  return (
    <section className="px-5 mt-3">
      <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-primary/20 p-4">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <Sparkles size={14} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-primary mb-0.5">AI 오늘의 한 줄</p>
            {loading ? (
              <p className="text-xs text-muted">잠시만요…</p>
            ) : error ? (
              <p className="text-xs text-muted">잠시 후 다시 시도해주세요.</p>
            ) : (
              <p className="text-sm text-foreground leading-relaxed">{brief}</p>
            )}
          </div>
          <button
            onClick={() => void fetchBrief(true)}
            disabled={loading}
            className="shrink-0 p-1.5 rounded-lg hover:bg-primary/10 transition disabled:opacity-40"
            aria-label="새로 받기"
          >
            <RefreshCw size={12} className={`text-primary ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>
    </section>
  );
}
