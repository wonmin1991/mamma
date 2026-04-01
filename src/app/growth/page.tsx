"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, Plus, Trash2, TrendingUp, Ruler, X } from "lucide-react";
import { useBabyStore, getBabyAgeMonths } from "@/store/useBabyStore";
import type { GrowthRecord, GrowthPercentile } from "@/data/postnatal";
import {
  WHO_WEIGHT_BOYS,
  WHO_WEIGHT_GIRLS,
  WHO_HEIGHT_BOYS,
  WHO_HEIGHT_GIRLS,
} from "@/data/postnatal";

type Tab = "weight" | "height" | "head";

const TAB_CONFIG: { key: Tab; label: string; unit: string }[] = [
  { key: "weight", label: "체중(kg)", unit: "kg" },
  { key: "height", label: "신장(cm)", unit: "cm" },
  { key: "head", label: "두위(cm)", unit: "cm" },
];

function getRecordValue(record: GrowthRecord, tab: Tab): number | undefined {
  if (tab === "weight") return record.weightKg;
  if (tab === "height") return record.heightCm;
  return record.headCm;
}

function getMonthFromDate(date: string, birthDate: string): number {
  const d = new Date(date);
  const b = new Date(birthDate);
  return Math.max(
    0,
    (d.getFullYear() - b.getFullYear()) * 12 + (d.getMonth() - b.getMonth())
  );
}

function getWhoData(
  tab: Tab,
  gender: "M" | "F" | undefined
): GrowthPercentile[] | null {
  const isBoy = gender !== "F";
  if (tab === "weight") return isBoy ? WHO_WEIGHT_BOYS : WHO_WEIGHT_GIRLS;
  if (tab === "height") return isBoy ? WHO_HEIGHT_BOYS : WHO_HEIGHT_GIRLS;
  return null; // no WHO head circumference data in our dataset
}

export default function GrowthPage() {
  const baby = useBabyStore((s) => s.baby);
  const growthRecords = useBabyStore((s) => s.growthRecords);
  const addGrowthRecord = useBabyStore((s) => s.addGrowthRecord);
  const deleteGrowthRecord = useBabyStore((s) => s.deleteGrowthRecord);

  const [activeTab, setActiveTab] = useState<Tab>("weight");
  const [showDialog, setShowDialog] = useState(false);

  // Form state
  const [formDate, setFormDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [formWeight, setFormWeight] = useState("");
  const [formHeight, setFormHeight] = useState("");
  const [formHead, setFormHead] = useState("");
  const [formNote, setFormNote] = useState("");

  const sortedRecords = useMemo(
    () =>
      [...growthRecords].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [growthRecords]
  );

  const latestRecord = sortedRecords[0] ?? null;

  const ageMonths = baby ? getBabyAgeMonths(baby.birthDate) : 0;

  // WHO data for current tab
  const whoData = getWhoData(activeTab, baby?.gender);

  // Chart data: baby measurements mapped to months
  const chartPoints = useMemo(() => {
    if (!baby) return [];
    return growthRecords
      .map((r) => {
        const val = getRecordValue(r, activeTab);
        if (val === undefined) return null;
        const month = getMonthFromDate(r.date, baby.birthDate);
        return { month, value: val, id: r.id };
      })
      .filter(Boolean) as { month: number; value: number; id: string }[];
  }, [growthRecords, activeTab, baby]);

  // Chart range
  const maxMonth = 24;
  const chartMonths = Array.from({ length: maxMonth + 1 }, (_, i) => i);

  // Y-axis range from WHO data or measurements
  const yRange = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    if (whoData) {
      for (const d of whoData) {
        if (d.p3 < min) min = d.p3;
        if (d.p97 > max) max = d.p97;
      }
    }
    for (const p of chartPoints) {
      if (p.value < min) min = p.value;
      if (p.value > max) max = p.value;
    }
    if (min === Infinity) {
      min = 0;
      max = 10;
    }
    const pad = (max - min) * 0.1;
    return { min: Math.max(0, min - pad), max: max + pad };
  }, [whoData, chartPoints]);

  function handleSubmit() {
    const w = formWeight ? parseFloat(formWeight) : undefined;
    const h = formHeight ? parseFloat(formHeight) : undefined;
    const hd = formHead ? parseFloat(formHead) : undefined;
    if (!w && !h && !hd) return;
    addGrowthRecord({
      date: formDate,
      weightKg: w,
      heightCm: h,
      headCm: hd,
      note: formNote || undefined,
    });
    setShowDialog(false);
    setFormWeight("");
    setFormHeight("");
    setFormHead("");
    setFormNote("");
  }

  function getPercentileAtMonth(month: number, percentile: "p3" | "p15" | "p50" | "p85" | "p97"): number | null {
    if (!whoData) return null;
    const entry = whoData.find((d) => d.month === month);
    return entry ? entry[percentile] : null;
  }

  function toPercent(value: number): number {
    return ((value - yRange.min) / (yRange.max - yRange.min)) * 100;
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-5 pt-12 pb-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-1 -ml-1">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold">성장 기록</h1>
          <div className="flex-1" />
          <button
            onClick={() => setShowDialog(true)}
            className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            기록 추가
          </button>
        </div>
      </header>

      <main className="px-5 space-y-5">
        {/* Latest Measurement Card */}
        <div className="bg-card border border-card-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">최근 측정</h2>
            {baby && (
              <span className="text-sm text-muted ml-auto">
                {baby.name} ({ageMonths}개월)
              </span>
            )}
          </div>
          {latestRecord ? (
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-surface rounded-xl p-3 text-center">
                <p className="text-xs text-muted mb-1">체중</p>
                <p className="text-lg font-bold">
                  {latestRecord.weightKg != null
                    ? `${latestRecord.weightKg}kg`
                    : "-"}
                </p>
              </div>
              <div className="bg-surface rounded-xl p-3 text-center">
                <p className="text-xs text-muted mb-1">신장</p>
                <p className="text-lg font-bold">
                  {latestRecord.heightCm != null
                    ? `${latestRecord.heightCm}cm`
                    : "-"}
                </p>
              </div>
              <div className="bg-surface rounded-xl p-3 text-center">
                <p className="text-xs text-muted mb-1">두위</p>
                <p className="text-lg font-bold">
                  {latestRecord.headCm != null
                    ? `${latestRecord.headCm}cm`
                    : "-"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-muted text-sm text-center py-4">
              아직 기록이 없습니다
            </p>
          )}
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2">
          {TAB_CONFIG.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === t.key
                  ? "bg-primary text-white"
                  : "bg-surface text-muted"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Growth Chart */}
        <div className="bg-card border border-card-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Ruler className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">성장 차트</h2>
            <span className="text-xs text-muted ml-auto">WHO 백분위 기준</span>
          </div>

          {growthRecords.length < 2 ? (
            <p className="text-muted text-sm text-center py-8">
              최소 2개의 기록이 필요합니다
            </p>
          ) : (
            <div className="relative">
              {/* Y-axis labels */}
              <div className="flex">
                <div className="w-10 flex flex-col justify-between text-xs text-muted pr-1 h-52 shrink-0">
                  <span>{yRange.max.toFixed(1)}</span>
                  <span>
                    {((yRange.max + yRange.min) / 2).toFixed(1)}
                  </span>
                  <span>{yRange.min.toFixed(1)}</span>
                </div>

                {/* Chart area */}
                <div className="flex-1 relative h-52 overflow-x-auto">
                  <div
                    className="relative h-full"
                    style={{
                      minWidth: `${(maxMonth + 1) * 28}px`,
                    }}
                  >
                    {/* WHO percentile bands */}
                    {whoData &&
                      chartMonths.map((m) => {
                        const p3 = getPercentileAtMonth(m, "p3");
                        const p15 = getPercentileAtMonth(m, "p15");
                        const p50 = getPercentileAtMonth(m, "p50");
                        const p85 = getPercentileAtMonth(m, "p85");
                        const p97 = getPercentileAtMonth(m, "p97");
                        if (
                          p3 === null ||
                          p15 === null ||
                          p50 === null ||
                          p85 === null ||
                          p97 === null
                        )
                          return null;
                        const left = `${(m / maxMonth) * 100}%`;
                        const width = `${(1 / maxMonth) * 100}%`;
                        return (
                          <div
                            key={`who-${m}`}
                            className="absolute"
                            style={{ left, width, top: 0, bottom: 0 }}
                          >
                            {/* p3-p97 band */}
                            <div
                              className="absolute w-full bg-primary/5"
                              style={{
                                bottom: `${toPercent(p3)}%`,
                                height: `${toPercent(p97) - toPercent(p3)}%`,
                              }}
                            />
                            {/* p15-p85 band */}
                            <div
                              className="absolute w-full bg-primary/10"
                              style={{
                                bottom: `${toPercent(p15)}%`,
                                height: `${toPercent(p85) - toPercent(p15)}%`,
                              }}
                            />
                            {/* p50 line */}
                            <div
                              className="absolute w-full border-t border-primary/30 border-dashed"
                              style={{
                                bottom: `${toPercent(p50)}%`,
                              }}
                            />
                          </div>
                        );
                      })}

                    {/* Baby data points */}
                    {chartPoints.map((point) => {
                      const left = `${(point.month / maxMonth) * 100}%`;
                      const bottom = `${toPercent(point.value)}%`;
                      return (
                        <div
                          key={point.id}
                          className="absolute w-3 h-3 bg-primary rounded-full -translate-x-1.5 translate-y-1.5 z-10 ring-2 ring-white"
                          style={{ left, bottom }}
                          title={`${point.month}개월: ${point.value}`}
                        />
                      );
                    })}

                    {/* X-axis month markers */}
                    {chartMonths
                      .filter((m) => m % 3 === 0)
                      .map((m) => (
                        <div
                          key={`x-${m}`}
                          className="absolute bottom-0 translate-y-full pt-1 text-xs text-muted -translate-x-1/2"
                          style={{ left: `${(m / maxMonth) * 100}%` }}
                        >
                          {m}
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* X-axis label */}
              <p className="text-center text-xs text-muted mt-5">개월</p>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-3 text-xs text-muted justify-center">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-primary/10 rounded-sm inline-block" />
                  p15-p85
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-primary/5 rounded-sm inline-block" />
                  p3-p97
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-primary rounded-full inline-block" />
                  측정값
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Records List */}
        <div className="bg-card border border-card-border rounded-2xl p-5">
          <h2 className="font-semibold mb-3">기록 목록</h2>
          {sortedRecords.length === 0 ? (
            <p className="text-muted text-sm text-center py-4">
              아직 기록이 없습니다
            </p>
          ) : (
            <div className="space-y-3">
              {sortedRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center gap-3 bg-surface rounded-xl p-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{record.date}</p>
                    <div className="flex gap-3 text-xs text-muted mt-1">
                      {record.weightKg != null && (
                        <span>{record.weightKg}kg</span>
                      )}
                      {record.heightCm != null && (
                        <span>{record.heightCm}cm</span>
                      )}
                      {record.headCm != null && (
                        <span>두위 {record.headCm}cm</span>
                      )}
                    </div>
                    {record.note && (
                      <p className="text-xs text-muted mt-1 truncate">
                        {record.note}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteGrowthRecord(record.id)}
                    className="p-2 text-muted hover:text-red-500 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Measurement Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowDialog(false)}
          />
          <div className="relative w-full max-w-lg bg-card rounded-t-2xl p-5 pb-8 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">측정 기록 추가</h2>
              <button
                onClick={() => setShowDialog(false)}
                className="p-1 text-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Date */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">날짜</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full bg-surface border border-card-border rounded-xl px-4 py-3 text-sm"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  체중 (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="예: 3.5"
                  value={formWeight}
                  onChange={(e) => setFormWeight(e.target.value)}
                  className="w-full bg-surface border border-card-border rounded-xl px-4 py-3 text-sm"
                />
              </div>

              {/* Height */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  신장 (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="예: 50.0"
                  value={formHeight}
                  onChange={(e) => setFormHeight(e.target.value)}
                  className="w-full bg-surface border border-card-border rounded-xl px-4 py-3 text-sm"
                />
              </div>

              {/* Head */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  두위 (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="예: 35.0"
                  value={formHead}
                  onChange={(e) => setFormHead(e.target.value)}
                  className="w-full bg-surface border border-card-border rounded-xl px-4 py-3 text-sm"
                />
              </div>

              {/* Note */}
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  메모 (선택)
                </label>
                <input
                  type="text"
                  placeholder="특이사항을 기록하세요"
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  className="w-full bg-surface border border-card-border rounded-xl px-4 py-3 text-sm"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-primary text-white py-3 rounded-xl font-medium text-sm mt-2"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
