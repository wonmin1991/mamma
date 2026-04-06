"use client";

import Link from "next/link";
import {
  Settings2,
  ChevronRight,
  ArrowLeftRight,
  Heart,
  BookOpen,
  Gift,
  Phone,
} from "lucide-react";
import { useBabyStore } from "@/store/useBabyStore";
import {
  infertilityTips,
  infertilityGuide,
  infertilityBenefits,
  infertilityCategories,
  type InfertilityTip,
} from "@/data/infertility";
import { useState } from "react";

const quickLinks = [
  { href: "/infertility-guide", label: "시술 가이드", emoji: "📋", icon: BookOpen },
  { href: "/benefits?tab=infertility", label: "지원금 혜택", emoji: "💰", icon: Gift },
  { href: "/infertility-tips", label: "난임 꿀팁", emoji: "💡", icon: Heart },
];

const hotline = [
  { label: "난임 상담", number: "1566-0196", emoji: "📞" },
  { label: "복지 상담", number: "129", emoji: "☎️" },
  { label: "정신건강", number: "1577-0199", emoji: "💜" },
];

export default function InfertilityHome() {
  const setMode = useBabyStore((s) => s.setMode);
  const [selectedCategory, setSelectedCategory] = useState<InfertilityTip["category"] | "all">("all");

  const filteredTips =
    selectedCategory === "all"
      ? infertilityTips.slice(0, 4)
      : infertilityTips.filter((t) => t.category === selectedCategory).slice(0, 4);

  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="relative px-5 pt-14 pb-8 bg-gradient-to-br from-hero-from via-hero-via to-hero-to">
        <div className="animate-fade-in-up">
          <div className="flex items-center justify-between">
            <p className="text-sm text-secondary font-medium mb-1">
              함께 응원할게요 🌱
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMode("pregnancy")}
                className="p-1.5 rounded-full hover:bg-card/50 transition-colors"
                aria-label="임신 모드로 전환"
              >
                <ArrowLeftRight size={14} className="text-muted" />
              </button>
              <Link
                href="/settings"
                className="p-1.5 rounded-full hover:bg-card/50 transition-colors"
                aria-label="설정"
              >
                <Settings2 size={16} className="text-muted" />
              </Link>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground leading-tight">
            맘마<span className="text-secondary">.</span>
            <span className="text-base font-medium text-muted ml-2">난임 지원</span>
          </h1>
          <p className="text-sm text-muted mt-2 leading-relaxed">
            난임 시술 정보, 정부 지원금, 멘탈 관리까지
            <br />
            필요한 모든 정보를 한곳에서 만나보세요.
          </p>
        </div>

        {/* 시술 단계 프리뷰 */}
        <Link href="/infertility-guide" className="block mt-5">
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 border border-card-border shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🔬</span>
                <div>
                  <p className="text-xs text-muted">난임 시술 과정</p>
                  <p className="font-semibold text-foreground">
                    단계별 가이드 보기
                  </p>
                  <p className="text-xs text-secondary font-medium">
                    검사 → 진단 → 시술 → 임신확인
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className="text-muted" />
            </div>
          </div>
        </Link>
      </section>

      <section className="px-5 py-6 flex flex-col gap-6 pb-28">
        {/* 빠른 메뉴 */}
        <div className="grid grid-cols-3 gap-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center gap-2 py-4 bg-card rounded-2xl border border-card-border shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-2xl">{link.emoji}</span>
                <span className="text-xs font-medium text-foreground">{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* 지원금 요약 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Gift size={16} className="text-secondary" />
              받을 수 있는 지원
            </h2>
            <Link href="/benefits?tab=infertility" className="text-xs text-secondary font-medium flex items-center gap-0.5">
              전체보기 <ChevronRight size={12} />
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {infertilityBenefits.slice(0, 3).map((benefit) => (
              <div
                key={benefit.id}
                className="bg-card rounded-xl border border-card-border p-3.5"
              >
                <p className="text-sm font-semibold text-foreground">{benefit.name}</p>
                <p className="text-xs text-muted mt-1">{benefit.summary}</p>
                <p className="text-[11px] text-secondary mt-1.5">{benefit.organization}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 난임 팁 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Heart size={16} className="text-primary" />
              난임 꿀팁
            </h2>
            <Link href="/infertility-tips" className="text-xs text-primary font-medium flex items-center gap-0.5">
              전체보기 <ChevronRight size={12} />
            </Link>
          </div>

          {/* 카테고리 필터 */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide mb-3">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === "all"
                  ? "bg-primary text-white"
                  : "bg-surface text-muted border border-card-border"
              }`}
            >
              전체
            </button>
            {(Object.entries(infertilityCategories) as [InfertilityTip["category"], { label: string; emoji: string }][]).map(
              ([key, { label, emoji }]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === key
                      ? "bg-primary text-white"
                      : "bg-surface text-muted border border-card-border"
                  }`}
                >
                  {emoji} {label}
                </button>
              )
            )}
          </div>

          <div className="flex flex-col gap-2">
            {filteredTips.map((tip) => (
              <Link
                key={tip.id}
                href={`/infertility-tips/${tip.id}`}
                className={`bg-gradient-to-r ${tip.gradient} rounded-xl border border-card-border p-3.5`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{tip.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{tip.title}</p>
                    <p className="text-xs text-muted mt-1 line-clamp-2">{tip.summary}</p>
                    <span className="inline-block mt-1.5 text-[10px] text-secondary bg-secondary-light px-2 py-0.5 rounded-full">
                      {infertilityCategories[tip.category].label}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 상담 전화 */}
        <div>
          <h2 className="font-bold text-sm text-foreground flex items-center gap-2 mb-3">
            <Phone size={16} className="text-secondary" />
            도움이 필요할 때
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {hotline.map((h) => (
              <a
                key={h.number}
                href={`tel:${h.number}`}
                className="flex flex-col items-center gap-1.5 py-3 bg-card rounded-xl border border-card-border"
              >
                <span className="text-lg">{h.emoji}</span>
                <span className="text-[11px] font-medium text-foreground">{h.label}</span>
                <span className="text-[10px] text-secondary">{h.number}</span>
              </a>
            ))}
          </div>
        </div>

        {/* 시술 단계 미니 타임라인 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-sm text-foreground flex items-center gap-2">
              <BookOpen size={16} className="text-secondary" />
              난임 시술 로드맵
            </h2>
            <Link href="/infertility-guide" className="text-xs text-secondary font-medium flex items-center gap-0.5">
              자세히 <ChevronRight size={12} />
            </Link>
          </div>
          <div className="relative pl-6">
            <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-card-border" />
            {infertilityGuide.map((step, i) => (
              <Link
                key={step.id}
                href={`/infertility-guide#step-${step.id}`}
                className="relative flex items-start gap-3 pb-4 last:pb-0"
              >
                <div className="absolute -left-3.5 w-5 h-5 rounded-full bg-secondary text-white flex items-center justify-center text-[10px] font-bold">
                  {i + 1}
                </div>
                <div className="flex-1 bg-card rounded-xl border border-card-border p-3">
                  <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <span>{step.emoji}</span> {step.title}
                  </p>
                  <p className="text-[11px] text-muted mt-0.5">{step.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
