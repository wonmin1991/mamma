"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  MapPin,
  Gift,
  Search,
  ChevronDown,
  ExternalLink,
  Baby,
  Banknote,
  GraduationCap,
  Home,
  Stethoscope,
  Phone,
  Filter,
  Package,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { regions, getDistrictsByRegion } from "@/data/regions";
import { benefits, benefitsMeta, babyPackages, benefitChecklist, CHECKLIST_STAGES, type BenefitItem } from "@/data/benefits";
import { trackLink, logClick } from "@/lib/affiliate";
import { useStore } from "@/store/useStore";
import { CheckCircle2, Circle, ClipboardCheck, Heart } from "lucide-react";

const CATEGORY_CONFIG: Record<string, { icon: LucideIcon; label: string; color: string; bg: string }> = {
  money: { icon: Banknote, label: "지원금/수당", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  medical: { icon: Stethoscope, label: "의료/건강", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  childcare: { icon: Baby, label: "보육/돌봄", color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-900/20" },
  housing: { icon: Home, label: "주거", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
  education: { icon: GraduationCap, label: "교육", color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-900/20" },
  other: { icon: Gift, label: "기타", color: "text-primary", bg: "bg-primary-light" },
};

const REGION_SHORT_NAMES: Record<string, string[]> = {
  "서울특별시": ["서울", "서울특별시"],
  "부산광역시": ["부산", "부산광역시"],
  "대구광역시": ["대구", "대구광역시"],
  "인천광역시": ["인천", "인천광역시"],
  "광주광역시": ["광주", "광주광역시"],
  "대전광역시": ["대전", "대전광역시"],
  "울산광역시": ["울산", "울산광역시"],
  "세종특별자치시": ["세종", "세종특별자치시"],
  "경기도": ["경기", "경기도"],
  "강원특별자치도": ["강원", "강원특별자치도"],
  "충청북도": ["충북", "충청북도"],
  "충청남도": ["충남", "충청남도"],
  "전북특별자치도": ["전북", "전북특별자치도"],
  "전라남도": ["전남", "전라남도"],
  "경상북도": ["경북", "경상북도"],
  "경상남도": ["경남", "경상남도"],
  "제주특별자치도": ["제주", "제주특별자치도"],
};

const STORAGE_KEY = "mamma-benefit-region";

function loadSavedRegion(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

function matchesRegion(benefit: BenefitItem, regionName: string): boolean {
  if (benefit.region === "전국") return true;
  if (!regionName) return true;
  const aliases = REGION_SHORT_NAMES[regionName];
  if (!aliases) return benefit.region.includes(regionName);
  return aliases.some((alias) => benefit.region.includes(alias));
}

export default function BenefitsPage() {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setSelectedRegion(loadSavedRegion());
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    localStorage.setItem(STORAGE_KEY, selectedRegion);
  }, [selectedRegion, initialized]);

  const districts = selectedRegion ? getDistrictsByRegion(selectedRegion) : [];

  const filteredBenefits = useMemo(() => {
    return benefits.filter((b) => {
      // 지역 필터
      if (selectedRegion && !matchesRegion(b, selectedRegion)) return false;

      // 카테고리 필터
      if (selectedCategory && b.category !== selectedCategory) return false;

      // 검색어 필터
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const text = `${b.name} ${b.summary} ${b.content} ${b.organization}`.toLowerCase();
        if (!text.includes(q)) return false;
      }

      return true;
    });
  }, [selectedRegion, selectedCategory, searchQuery]);

  // 카테고리별 건수
  const categoryCounts = useMemo(() => {
    const regionFiltered = benefits.filter((b) =>
      selectedRegion ? matchesRegion(b, selectedRegion) : true
    );
    const counts = new Map<string, number>();
    for (const b of regionFiltered) {
      counts.set(b.category, (counts.get(b.category) ?? 0) + 1);
    }
    return counts;
  }, [selectedRegion]);

  return (
    <main className="flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-5 pt-12 pb-3">
        <div className="flex items-center gap-2">
          <Link href="/" className="p-1 -ml-1" aria-label="뒤로가기">
            <ChevronLeft size={22} className="text-foreground" />
          </Link>
          <h1 className="text-lg font-bold text-foreground">임산부/육아 혜택</h1>
        </div>
      </header>

      <section className="px-5 pb-8 flex flex-col gap-4">
        {/* Region Selector */}
        <div className="bg-card rounded-2xl border border-card-border shadow-sm p-5">
          <h2 className="font-bold text-sm text-foreground flex items-center gap-2 mb-4">
            <MapPin size={16} className="text-primary" />
            내 지역 설정
          </h2>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <select
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.target.value);
                  setSelectedDistrict("");
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-surface border border-card-border text-sm text-foreground focus:outline-none focus:border-primary appearance-none"
              >
                <option value="">전체 지역</option>
                {regions.map((r) => (
                  <option key={r.code} value={r.name}>{r.name}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            </div>

            {districts.length > 1 && (
              <div className="relative flex-1">
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface border border-card-border text-sm text-foreground focus:outline-none focus:border-primary appearance-none"
                >
                  <option value="">전체 구/군</option>
                  {districts.map((d) => (
                    <option key={d.code} value={d.name}>{d.name}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              </div>
            )}
          </div>

          {selectedRegion && (
            <p className="text-xs text-muted mt-3 flex items-center gap-1">
              <MapPin size={11} />
              {selectedRegion}{selectedDistrict ? ` ${selectedDistrict}` : ""} + 전국 공통 혜택을 표시합니다
            </p>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-1">
          <button
            onClick={() => setSelectedCategory("")}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !selectedCategory
                ? "bg-primary text-white"
                : "bg-card border border-card-border text-muted"
            }`}
          >
            <Filter size={12} className="inline mr-1 -mt-0.5" />
            전체 ({selectedRegion ? filteredBenefits.length : benefits.length})
          </button>
          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
            const count = categoryCounts.get(key) ?? 0;
            if (count === 0) return null;
            const Icon = config.icon;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(selectedCategory === key ? "" : key)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === key
                    ? "bg-primary text-white"
                    : "bg-card border border-card-border text-muted"
                }`}
              >
                <Icon size={12} className="inline mr-1 -mt-0.5" />
                {config.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="혜택 검색 (예: 출산축하금, 보육료, 난임)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-card border border-card-border text-sm text-foreground focus:outline-none focus:border-primary"
          />
        </div>

        {/* Results count */}
        <p className="text-xs text-muted">
          총 <span className="font-semibold text-foreground">{filteredBenefits.length}</span>건의 혜택
          {searchQuery && ` (검색: "${searchQuery}")`}
        </p>

        {/* Empty state */}
        {filteredBenefits.length === 0 && (
          <div className="flex flex-col items-center py-12 gap-3">
            <Gift size={40} className="text-muted" />
            <p className="text-sm text-muted">조건에 맞는 혜택이 없습니다</p>
            <p className="text-xs text-muted text-center">
              검색어나 필터를 변경해보세요
            </p>
          </div>
        )}

        {/* Benefit Cards */}
        <div className="flex flex-col gap-3">
          {filteredBenefits.map((benefit) => {
            const cat = CATEGORY_CONFIG[benefit.category] ?? CATEGORY_CONFIG.other;
            const CatIcon = cat.icon;
            const isExpanded = expandedId === benefit.id;

            return (
              <div
                key={benefit.id}
                className="bg-card rounded-2xl border border-card-border shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : benefit.id)}
                  className="w-full p-4 text-left flex items-start gap-3"
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${cat.bg} flex items-center justify-center ${cat.color}`}>
                    <CatIcon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${cat.bg} font-medium ${cat.color}`}>
                        {cat.label}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface text-muted font-medium">
                        {benefit.region}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-2">
                      {benefit.name}
                    </h3>
                    <p className="text-xs text-muted mt-1 line-clamp-2">
                      {benefit.summary}
                    </p>
                    {benefit.organization && (
                      <p className="text-[11px] text-muted mt-1.5">{benefit.organization}</p>
                    )}
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-muted flex-shrink-0 mt-1 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  />
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-card-border">
                    {benefit.content && (
                      <div className="mt-3">
                        <h4 className="text-xs font-semibold text-foreground mb-1">지원 내용</h4>
                        <p className="text-xs text-muted leading-relaxed whitespace-pre-wrap">{benefit.content}</p>
                      </div>
                    )}

                    {benefit.criteria && (
                      <div className="mt-3">
                        <h4 className="text-xs font-semibold text-foreground mb-1">선정 기준</h4>
                        <p className="text-xs text-muted leading-relaxed whitespace-pre-wrap">{benefit.criteria}</p>
                      </div>
                    )}

                    {benefit.howToApply && (
                      <div className="mt-3">
                        <h4 className="text-xs font-semibold text-foreground mb-1">신청 방법</h4>
                        <p className="text-xs text-muted leading-relaxed whitespace-pre-wrap">{benefit.howToApply}</p>
                      </div>
                    )}

                    <div className="flex gap-2 mt-3">
                      {benefit.applyUrl && (
                        <a
                          href={trackLink(benefit.applyUrl, "benefit", benefit.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => logClick("benefit", benefit.applyUrl, benefit.name)}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-sm font-medium transition-all active:scale-[0.98]"
                        >
                          <ExternalLink size={14} />
                          신청 바로가기
                        </a>
                      )}
                      {benefit.contact && (
                        <a
                          href={`tel:${benefit.contact.replace(/[^0-9-]/g, "")}`}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-card-border text-sm font-medium text-foreground transition-all active:scale-[0.98]"
                        >
                          <Phone size={14} />
                          문의
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Benefits Checklist */}
        <BenefitChecklistSection />

        {/* Baby Packages / Welcome Kits */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-3">
            <Package size={18} className="text-secondary" />
            <h2 className="text-base font-bold text-foreground">육아 패키지 / 웰컴키트</h2>
          </div>
          <p className="text-xs text-muted mb-4">
            출산 준비에 필요한 용품을 저렴하게 체험할 수 있는 패키지 모음
            <span className="block mt-1 text-[10px] text-amber-500">* 일부 링크에는 제휴 수수료가 포함되어 있습니다. 가격은 변동될 수 있습니다.</span>
          </p>

          <div className="flex flex-col gap-3">
            {babyPackages.map((pkg) => {
              const isExpanded = expandedId === pkg.id + 10000;

              return (
                <div
                  key={`pkg-${pkg.id}`}
                  className="bg-card rounded-2xl border border-card-border shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : pkg.id + 10000)}
                    className="w-full p-4 text-left flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-xl">
                      {pkg.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-900/20 font-medium text-rose-500">
                          {pkg.discount} 할인
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface text-muted font-medium">
                          {pkg.brand}
                        </span>
                      </div>
                      <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-2">
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-muted mt-1 line-clamp-1">
                        {pkg.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-sm font-bold text-primary">{pkg.price}</span>
                        <span className="text-[11px] text-muted line-through">{pkg.originalPrice}</span>
                      </div>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-muted flex-shrink-0 mt-1 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 border-t border-card-border">
                      <div className="mt-3">
                        <h4 className="text-xs font-semibold text-foreground mb-1.5">구성품</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {pkg.items.map((item) => (
                            <span
                              key={item}
                              className="text-[11px] px-2 py-1 rounded-lg bg-surface text-muted"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3">
                        <h4 className="text-xs font-semibold text-foreground mb-1">대상</h4>
                        <p className="text-xs text-muted">{pkg.target}</p>
                      </div>

                      <div className="mt-3">
                        <h4 className="text-xs font-semibold text-foreground mb-1">구매 방법</h4>
                        <p className="text-xs text-muted">{pkg.howToGet}</p>
                      </div>

                      <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                        {pkg.tags.map((tag) => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-primary-light text-primary font-medium flex items-center gap-0.5">
                            <Tag size={9} />
                            {tag}
                          </span>
                        ))}
                      </div>

                      {pkg.url && (
                        <>
                          <a
                            href={trackLink(pkg.url, "package", pkg.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => logClick("package", pkg.url, pkg.name)}
                            className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary text-white text-sm font-medium transition-all active:scale-[0.98]"
                          >
                            <ExternalLink size={14} />
                            구매하러 가기
                          </a>
                          <p className="text-[10px] text-muted text-center mt-1">제휴 링크가 포함되어 있습니다</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Info footer */}
        <div className="bg-surface rounded-2xl p-4 mt-2">
          <p className="text-xs text-muted leading-relaxed">
            공공데이터포털(data.go.kr) 행정안전부 공공서비스 혜택 정보 기반.
            실제 혜택 내용은 해당 기관에 직접 확인해주세요.
            육아 패키지 정보는 각 브랜드 공식몰 기준이며, 가격/구성은 변동될 수 있습니다.
          </p>
          <p className="text-[11px] text-muted mt-1">
            마지막 업데이트: {benefitsMeta.fetchedAt.slice(0, 10)}
          </p>
        </div>
      </section>
    </main>
  );
}

// ─── 혜택 체크리스트 섹션 ────────────────────────────────

const PRIORITY_STYLE = {
  high: { label: "필수", color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
  medium: { label: "권장", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
  low: { label: "선택", color: "text-muted", bg: "bg-surface" },
};

function BenefitChecklistSection() {
  const benefitChecked = useStore((s) => s.benefitChecked);
  const toggleBenefitCheck = useStore((s) => s.toggleBenefitCheck);
  const [stageFilter, setStageFilter] = useState("all");

  const filtered = useMemo(
    () => benefitChecklist.filter((item) => stageFilter === "all" || item.stage === stageFilter),
    [stageFilter]
  );

  const checkedCount = benefitChecked.length;
  const totalCount = benefitChecklist.length;
  const progress = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <ClipboardCheck size={18} className="text-primary" />
        <h2 className="text-base font-bold text-foreground">혜택 신청 체크리스트</h2>
      </div>
      <p className="text-xs text-muted mb-4">
        시기별로 신청해야 할 혜택을 정리했어요. 하나씩 체크해보세요!
      </p>

      {/* Progress */}
      <div className="bg-card rounded-2xl border border-card-border shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-primary">{progress}%</span>
          <span className="text-xs text-muted">{checkedCount}/{totalCount}건 완료</span>
        </div>
        <div className="h-2 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {checkedCount > 0 && (
          <p className="text-[11px] text-muted mt-2 flex items-center gap-1">
            <Heart size={10} className="text-primary" />
            체크할 때마다 +1 하트 획득!
          </p>
        )}
      </div>

      {/* Stage filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-2 mb-3">
        {CHECKLIST_STAGES.map((stage) => {
          const count = stage.id === "all"
            ? totalCount
            : benefitChecklist.filter((i) => i.stage === stage.id).length;
          return (
            <button
              key={stage.id}
              onClick={() => setStageFilter(stage.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                stageFilter === stage.id
                  ? "bg-primary text-white"
                  : "bg-card border border-card-border text-muted"
              }`}
            >
              {stage.emoji} {stage.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Checklist items */}
      <div className="flex flex-col gap-2">
        {filtered.map((item) => {
          const isChecked = benefitChecked.includes(item.id);
          const priority = PRIORITY_STYLE[item.priority];

          return (
            <button
              key={item.id}
              onClick={() => toggleBenefitCheck(item.id)}
              className={`w-full text-left p-4 rounded-2xl border transition-all active:scale-[0.99] ${
                isChecked
                  ? "bg-surface border-card-border opacity-70"
                  : "bg-card border-card-border shadow-sm"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {isChecked ? (
                    <CheckCircle2 size={20} className="text-primary" />
                  ) : (
                    <Circle size={20} className="text-muted" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priority.bg} ${priority.color}`}>
                      {priority.label}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface text-muted font-medium">
                      {item.region}
                    </span>
                  </div>
                  <p className={`text-sm font-semibold leading-snug ${isChecked ? "line-through text-muted" : "text-foreground"}`}>
                    {item.name}
                  </p>
                  <p className={`text-xs mt-1 leading-relaxed ${isChecked ? "text-muted/60" : "text-muted"}`}>
                    {item.description}
                  </p>
                  <p className="text-[11px] text-muted mt-1.5">
                    {item.deadline}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
