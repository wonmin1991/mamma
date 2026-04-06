import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CareLogEntry,
  GrowthRecord,
  MilestoneRecord,
  DiaryEntry,
} from "@/data/postnatal";

interface BabyProfile {
  name: string;
  birthDate: string; // ISO date string
  gender?: "M" | "F";
}

export type AppMode = "pregnancy" | "postnatal" | "infertility";

interface BabyState {
  // Hydration
  _hydrated: boolean;

  // Mode
  mode: AppMode;
  setMode: (mode: AppMode) => void;

  // Baby Profile
  baby: BabyProfile | null;
  setBaby: (baby: BabyProfile) => void;
  resetBaby: () => void;

  // Care Logs
  careLogs: CareLogEntry[];
  addCareLog: (log: Omit<CareLogEntry, "id" | "createdAt">) => void;
  deleteCareLog: (id: string) => void;
  getCareLogsByDate: (date: string) => CareLogEntry[];
  getTodaySummary: () => { feeds: number; sleeps: number; diapers: number };

  // Growth Records
  growthRecords: GrowthRecord[];
  addGrowthRecord: (record: Omit<GrowthRecord, "id" | "createdAt">) => void;
  deleteGrowthRecord: (id: string) => void;

  // Milestones
  milestones: MilestoneRecord[];
  addMilestone: (m: Omit<MilestoneRecord, "id" | "createdAt">) => void;
  deleteMilestone: (id: string) => void;

  // Diary
  diaryEntries: DiaryEntry[];
  addDiaryEntry: (entry: Omit<DiaryEntry, "id" | "createdAt">) => void;
  updateDiaryEntry: (id: string, updates: Partial<Pick<DiaryEntry, "title" | "content" | "mood">>) => void;
  deleteDiaryEntry: (id: string) => void;

  // Ultrasound Photos
  ultrasoundPhotos: UltrasoundPhoto[];
  addUltrasoundPhoto: (photo: Omit<UltrasoundPhoto, "id" | "createdAt">) => void;
  deleteUltrasoundPhoto: (id: string) => void;
}

export interface UltrasoundPhoto {
  id: string;
  week: number;
  imageData: string; // base64 data URI
  memo?: string;
  hospital?: string;
  date: string; // ISO date string
  createdAt: string;
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function toDateStr(iso: string) {
  return iso.split("T")[0];
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export const useBabyStore = create<BabyState>()(
  persist(
    (set, get) => ({
      // ─── Hydration ───
      _hydrated: false,

      // ─── Mode ───
      mode: "pregnancy",
      setMode: (mode) => set({ mode }),

      // ─── Baby Profile ───
      baby: null,
      setBaby: (baby) => set({ baby, mode: "postnatal" }),
      resetBaby: () => set({ baby: null, mode: "pregnancy" }),

      // ─── Care Logs ───
      careLogs: [],
      addCareLog: (log) => {
        const entry: CareLogEntry = {
          ...log,
          id: uid(),
          createdAt: new Date().toISOString(),
        };
        set({ careLogs: [entry, ...get().careLogs] });
      },
      deleteCareLog: (id) => {
        set({ careLogs: get().careLogs.filter((l) => l.id !== id) });
      },
      getCareLogsByDate: (date) => {
        return get().careLogs.filter((l) => toDateStr(l.startTime) === date);
      },
      getTodaySummary: () => {
        const today = todayStr();
        const logs = get().careLogs.filter((l) => toDateStr(l.startTime) === today);
        return {
          feeds: logs.filter((l) => l.type === "breast_feed" || l.type === "bottle_feed").length,
          sleeps: logs.filter((l) => l.type === "sleep").length,
          diapers: logs.filter((l) => l.type.startsWith("diaper")).length,
        };
      },

      // ─── Growth Records ───
      growthRecords: [],
      addGrowthRecord: (record) => {
        const entry: GrowthRecord = {
          ...record,
          id: uid(),
          createdAt: new Date().toISOString(),
        };
        set({ growthRecords: [entry, ...get().growthRecords] });
      },
      deleteGrowthRecord: (id) => {
        set({ growthRecords: get().growthRecords.filter((r) => r.id !== id) });
      },

      // ─── Milestones ───
      milestones: [],
      addMilestone: (m) => {
        const entry: MilestoneRecord = {
          ...m,
          id: uid(),
          createdAt: new Date().toISOString(),
        };
        set({ milestones: [entry, ...get().milestones] });
      },
      deleteMilestone: (id) => {
        set({ milestones: get().milestones.filter((m) => m.id !== id) });
      },

      // ─── Diary ───
      diaryEntries: [],
      addDiaryEntry: (entry) => {
        const e: DiaryEntry = {
          ...entry,
          id: uid(),
          createdAt: new Date().toISOString(),
        };
        set({ diaryEntries: [e, ...get().diaryEntries] });
      },
      updateDiaryEntry: (id, updates) => {
        set({
          diaryEntries: get().diaryEntries.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        });
      },
      deleteDiaryEntry: (id) => {
        set({ diaryEntries: get().diaryEntries.filter((e) => e.id !== id) });
      },

      // ─── Ultrasound Photos ───
      ultrasoundPhotos: [],
      addUltrasoundPhoto: (photo) => {
        const entry: UltrasoundPhoto = {
          ...photo,
          id: uid(),
          createdAt: new Date().toISOString(),
        };
        set({ ultrasoundPhotos: [entry, ...get().ultrasoundPhotos] });
      },
      deleteUltrasoundPhoto: (id) => {
        set({ ultrasoundPhotos: get().ultrasoundPhotos.filter((p) => p.id !== id) });
      },
    }),
    {
      name: "mamma-baby",
      onRehydrateStorage: () => (state) => {
        if (state) state._hydrated = true;
      },
      partialize: (state) => ({
        mode: state.mode,
        baby: state.baby,
        careLogs: state.careLogs,
        growthRecords: state.growthRecords,
        milestones: state.milestones,
        diaryEntries: state.diaryEntries,
        ultrasoundPhotos: state.ultrasoundPhotos,
      }),
    }
  )
);

// ─── Derived Helpers ─────────────────────────────────────

export function getBabyAgeMonths(birthDate: string): number {
  const birth = new Date(birthDate);
  const now = new Date();
  return Math.max(0, (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth()));
}

export function getBabyAgeDays(birthDate: string): number {
  const birth = new Date(birthDate);
  birth.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)));
}

export function getBabyAgeLabel(birthDate: string): string {
  const days = getBabyAgeDays(birthDate);
  if (days < 30) return `태어난 지 ${days}일`;
  const months = getBabyAgeMonths(birthDate);
  if (months < 12) return `${months}개월`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return rem > 0 ? `${years}년 ${rem}개월` : `${years}년`;
}

// ─── AI Insights ─────────────────────────────────────────

export interface Insight {
  type: "feeding" | "sleep" | "diaper" | "prediction" | "trend";
  title: string;
  message: string;
  priority: "low" | "medium" | "high";
  emoji: string;
}

export function generateInsights(careLogs: CareLogEntry[]): Insight[] {
  const insights: Insight[] = [];
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const todayLogs = careLogs.filter((l) => toDateStr(l.startTime) === todayStr);
  const last7Days = careLogs.filter((l) => {
    const d = new Date(l.startTime);
    return now.getTime() - d.getTime() < 7 * 24 * 60 * 60 * 1000;
  });

  // Feeding analysis
  const todayFeeds = todayLogs.filter((l) => l.type === "breast_feed" || l.type === "bottle_feed").length;
  const weekFeeds = last7Days.filter((l) => l.type === "breast_feed" || l.type === "bottle_feed");
  if (weekFeeds.length > 0) {
    const dailyMap = new Map<string, number>();
    weekFeeds.forEach((l) => {
      const d = toDateStr(l.startTime);
      dailyMap.set(d, (dailyMap.get(d) || 0) + 1);
    });
    const avg = Array.from(dailyMap.values()).reduce((a, b) => a + b, 0) / Math.max(dailyMap.size, 1);

    if (todayFeeds === 0 && now.getHours() >= 10) {
      insights.push({ type: "feeding", title: "수유 기록 없음", message: "오늘 아직 수유 기록이 없어요. 기록을 남겨보세요!", priority: "medium", emoji: "🍼" });
    } else if (todayFeeds > avg * 1.5 && todayFeeds > 2) {
      insights.push({ type: "feeding", title: "수유 횟수 증가", message: `오늘 수유 ${todayFeeds}회로 평소(${Math.round(avg)}회)보다 많아요. 성장 급등기일 수 있어요!`, priority: "low", emoji: "📈" });
    }
  }

  // Sleep analysis
  const todaySleeps = todayLogs.filter((l) => l.type === "sleep").length;
  const weekSleeps = last7Days.filter((l) => l.type === "sleep");
  if (weekSleeps.length >= 3) {
    const dailyMap = new Map<string, number>();
    weekSleeps.forEach((l) => {
      const d = toDateStr(l.startTime);
      dailyMap.set(d, (dailyMap.get(d) || 0) + 1);
    });
    const avg = Array.from(dailyMap.values()).reduce((a, b) => a + b, 0) / Math.max(dailyMap.size, 1);
    if (todaySleeps > avg * 1.5 && todaySleeps >= 2) {
      insights.push({ type: "sleep", title: "수면 증가", message: "오늘 평소보다 더 많이 자고 있어요. 성장 수면일 수 있어요!", priority: "low", emoji: "😴" });
    }
  }

  // Diaper analysis
  const todayDiapers = todayLogs.filter((l) => l.type.startsWith("diaper")).length;
  const weekDiapers = last7Days.filter((l) => l.type.startsWith("diaper"));
  if (weekDiapers.length >= 5) {
    const dailyMap = new Map<string, number>();
    weekDiapers.forEach((l) => {
      const d = toDateStr(l.startTime);
      dailyMap.set(d, (dailyMap.get(d) || 0) + 1);
    });
    const avg = Array.from(dailyMap.values()).reduce((a, b) => a + b, 0) / Math.max(dailyMap.size, 1);
    if (todayDiapers > avg * 1.5 && todayDiapers >= 3) {
      insights.push({ type: "diaper", title: "기저귀 교체 증가", message: `오늘 기저귀 교체 ${todayDiapers}회로 평소보다 많아요. 수분 섭취를 확인해주세요.`, priority: "medium", emoji: "👶" });
    }
  }

  // Next feeding prediction
  const recentFeeds = last7Days
    .filter((l) => l.type === "breast_feed" || l.type === "bottle_feed")
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  if (recentFeeds.length >= 4) {
    const intervals: number[] = [];
    for (let i = 1; i < recentFeeds.length; i++) {
      const diff = new Date(recentFeeds[i].startTime).getTime() - new Date(recentFeeds[i - 1].startTime).getTime();
      const hours = diff / (1000 * 60 * 60);
      if (hours >= 1 && hours <= 12) intervals.push(diff);
    }
    if (intervals.length >= 3) {
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const lastFeed = new Date(recentFeeds[recentFeeds.length - 1].startTime);
      const next = new Date(lastFeed.getTime() + avgInterval);
      const minutesUntil = Math.round((next.getTime() - now.getTime()) / 60000);
      if (minutesUntil > 0 && minutesUntil < 180) {
        insights.push({
          type: "prediction",
          title: "다음 수유 예측",
          message: `패턴 분석 결과, 약 ${minutesUntil}분 후 수유가 필요할 것 같아요.`,
          priority: "high",
          emoji: "⏰",
        });
      }
    }
  }

  return insights.slice(0, 5);
}
