"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Phone,
  AlertTriangle,
  ChevronDown,
  Shield,
} from "lucide-react";
import { emergencyGuide, SEVERITY_CONFIG } from "@/data/emergency";

export default function EmergencyPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "danger" | "warning" | "caution">("all");

  const filtered = filter === "all"
    ? emergencyGuide
    : emergencyGuide.filter((e) => e.severity === filter);

  return (
    <main className="flex flex-col">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-5 pt-12 pb-3">
        <div className="flex items-center gap-2">
          <Link href="/" className="p-1 -ml-1" aria-label="뒤로가기">
            <ChevronLeft size={22} className="text-foreground" />
          </Link>
          <h1 className="text-lg font-bold text-foreground">응급 상황 가이드</h1>
        </div>
      </header>

      <section className="px-5 pb-8 flex flex-col gap-4">
        {/* Emergency call */}
        <a
          href="tel:119"
          className="flex items-center gap-3 p-4 rounded-2xl bg-red-500 text-white active:scale-[0.98] transition-transform"
        >
          <Phone size={24} />
          <div>
            <p className="font-bold text-base">119 응급 전화</p>
            <p className="text-xs text-red-100">위급한 상황에서 즉시 전화하세요</p>
          </div>
        </a>

        {/* Disclaimer */}
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-900/50 p-3 flex items-start gap-2">
          <Shield size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
            본 가이드는 일반적인 참고 목적입니다. 실제 응급 상황에서는 반드시 119에 전화하거나 가까운 응급실을 방문하세요.
            의료 전문가의 진단을 대체하지 않습니다.
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {(["all", "danger", "warning", "caution"] as const).map((f) => {
            const config = f === "all"
              ? { label: "전체", color: "text-foreground", bg: "bg-card" }
              : SEVERITY_CONFIG[f];
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                  filter === f
                    ? "bg-primary text-white"
                    : `${config.bg} ${config.color} border border-card-border`
                }`}
              >
                {f === "all" ? "전체" : config.label}
              </button>
            );
          })}
        </div>

        {/* Symptoms */}
        <div className="flex flex-col gap-2">
          {filtered.map((item) => {
            const config = SEVERITY_CONFIG[item.severity];
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className={`rounded-2xl border ${config.border} overflow-hidden`}
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className={`w-full p-4 text-left flex items-start gap-3 ${config.bg}`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${config.color} ${config.bg} border ${config.border}`}>
                        {config.label}
                      </span>
                      {item.relatedWeeks && (
                        <span className="text-[10px] text-muted">{item.relatedWeeks}</span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-foreground">{item.symptom}</h3>
                    <p className="text-xs text-muted mt-0.5 line-clamp-2">{item.description}</p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-muted flex-shrink-0 mt-1 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  />
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-card-border bg-card">
                    <div className="mt-3">
                      <h4 className="text-xs font-bold text-foreground mb-1 flex items-center gap-1">
                        <AlertTriangle size={12} className={config.color} />
                        어떻게 해야 하나요?
                      </h4>
                      <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                        {item.action}
                      </p>
                    </div>
                    {item.callNumber && (
                      <a
                        href={`tel:${item.callNumber}`}
                        className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium active:scale-[0.98] transition-transform"
                      >
                        <Phone size={14} />
                        {item.callNumber} 전화하기
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Hospital info */}
        <div className="bg-card rounded-2xl border border-card-border shadow-sm p-4 text-center">
          <p className="text-xs text-muted">가까운 응급실 찾기</p>
          <a
            href="https://www.e-gen.or.kr/eg/main.do"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-sm text-primary font-medium"
          >
            응급의료포털 바로가기 →
          </a>
        </div>
      </section>
    </main>
  );
}
