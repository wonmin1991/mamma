"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronDown, ChevronUp, Shield, AlertCircle } from "lucide-react";
import { useBabyStore, getBabyAgeMonths } from "@/store/useBabyStore";
import { VACCINATIONS } from "@/data/postnatal";

type DoseStatus = "upcoming" | "current" | "past";

function getDoseStatus(
  ageMonths: number | null,
  monthStart: number,
  monthEnd: number
): DoseStatus {
  if (ageMonths === null) return "upcoming";
  if (ageMonths > monthEnd) return "past";
  if (ageMonths >= monthStart && ageMonths <= monthEnd) return "current";
  return "upcoming";
}

function formatMonthRange(monthStart: number, monthEnd: number): string {
  if (monthStart === monthEnd) {
    if (monthStart === 0) return "출생 직후";
    if (monthStart >= 12) {
      const years = Math.floor(monthStart / 12);
      const rem = monthStart % 12;
      return rem > 0 ? `${years}년 ${rem}개월` : `만 ${years}세`;
    }
    return `${monthStart}개월`;
  }
  const startLabel = monthStart === 0 ? "출생" : `${monthStart}개월`;
  const endLabel = monthEnd >= 12 && monthEnd !== monthStart
    ? monthEnd % 12 === 0
      ? `만 ${monthEnd / 12}세`
      : `${monthEnd}개월`
    : `${monthEnd}개월`;
  return `${startLabel}~${endLabel}`;
}

export default function VaccinationPage() {
  const baby = useBabyStore((s) => s.baby);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const ageMonths = baby ? getBabyAgeMonths(baby.birthDate) : null;

  function toggleExpand(index: number) {
    setExpandedIndex((prev) => (prev === index ? null : index));
  }

  function getVaccineOverallStatus(
    doses: { monthStart: number; monthEnd: number }[]
  ): DoseStatus {
    if (ageMonths === null) return "upcoming";
    const hasCurrentDose = doses.some(
      (d) => ageMonths >= d.monthStart && ageMonths <= d.monthEnd
    );
    if (hasCurrentDose) return "current";
    const hasUpcoming = doses.some((d) => ageMonths < d.monthStart);
    if (hasUpcoming) return "upcoming";
    return "past";
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-5 pt-12 pb-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-1 -ml-1">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold flex-1">예방접종 일정</h1>
          <Shield className="w-5 h-5 text-primary" />
        </div>
      </header>

      <main className="px-5 mt-4 space-y-4">
        {/* Info card */}
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h2 className="font-semibold text-sm">
                대한민국 국가예방접종 일정표
              </h2>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                질병관리청 권장 국가예방접종 일정입니다. 접종 시기는 아이의 건강
                상태에 따라 달라질 수 있으므로 소아과 전문의와 상담하세요.
              </p>
            </div>
          </div>
        </div>

        {/* Baby age indicator */}
        {baby && ageMonths !== null && (
          <div className="bg-card border border-card-border rounded-2xl px-4 py-3 flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-primary flex-shrink-0" />
            <p className="text-sm">
              <span className="font-semibold">{baby.name}</span>
              <span className="text-muted">
                {" "}
                현재 {ageMonths}개월 — 해당 시기 접종이 강조됩니다.
              </span>
            </p>
          </div>
        )}

        {/* Vaccine cards */}
        <div className="space-y-3">
          {VACCINATIONS.map((vaccine, index) => {
            const isExpanded = expandedIndex === index;
            const overallStatus = getVaccineOverallStatus(vaccine.doses);

            const borderClass =
              overallStatus === "current"
                ? "border-primary/50"
                : overallStatus === "past"
                ? "border-card-border opacity-60"
                : "border-card-border";

            return (
              <div
                key={vaccine.name}
                className={`bg-card border rounded-2xl overflow-hidden transition-all ${borderClass}`}
              >
                {/* Card header */}
                <button
                  onClick={() => toggleExpand(index)}
                  className="w-full px-4 py-3.5 flex items-center gap-3 text-left"
                >
                  {/* Status indicator dot */}
                  <div
                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      overallStatus === "current"
                        ? "bg-primary"
                        : overallStatus === "past"
                        ? "bg-muted/40"
                        : "bg-card-border"
                    }`}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-sm">
                        {vaccine.name}
                      </span>
                      <span className="text-xs text-muted">
                        {vaccine.koreanName}
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-0.5 line-clamp-1">
                      {vaccine.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {overallStatus === "current" && (
                      <span className="text-[10px] font-semibold bg-primary text-white px-2 py-0.5 rounded-full">
                        접종 시기
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted" />
                    )}
                  </div>
                </button>

                {/* Expanded dose list */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 space-y-2">
                    <div className="border-t border-card-border mb-3" />
                    {vaccine.doses.map((dose) => {
                      const status = getDoseStatus(
                        ageMonths,
                        dose.monthStart,
                        dose.monthEnd
                      );

                      return (
                        <div
                          key={`${vaccine.name}-${dose.doseNumber}`}
                          className={`rounded-xl px-3.5 py-2.5 flex items-center gap-3 ${
                            status === "current"
                              ? "bg-primary/10 border border-primary/30"
                              : status === "past"
                              ? "bg-surface/50 opacity-50"
                              : "bg-surface"
                          }`}
                        >
                          {/* Dose number */}
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                              status === "current"
                                ? "bg-primary text-white"
                                : status === "past"
                                ? "bg-muted/20 text-muted"
                                : "bg-card-border/50 text-muted"
                            }`}
                          >
                            {dose.doseNumber}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium ${
                                status === "current"
                                  ? "text-foreground"
                                  : status === "past"
                                  ? "text-muted"
                                  : "text-foreground"
                              }`}
                            >
                              {dose.doseNumber}차 접종
                            </p>
                            <p className="text-xs text-muted mt-0.5">
                              {dose.description}
                            </p>
                          </div>

                          {/* Age range badge */}
                          <span
                            className={`text-[11px] font-medium px-2 py-1 rounded-lg flex-shrink-0 ${
                              status === "current"
                                ? "bg-primary/20 text-primary"
                                : status === "past"
                                ? "bg-muted/10 text-muted"
                                : "bg-surface text-muted"
                            }`}
                          >
                            {formatMonthRange(dose.monthStart, dose.monthEnd)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
