"use client";

import { useState, useMemo, useEffect } from "react";
import { useDebounce } from "@/lib/useDebounce";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  restaurants,
  tips,
  weeklyGuide,
  sampleCommunityPosts,
  TIP_CATEGORIES,
  type CommunityPost,
} from "@/data/mock";
import { STORAGE_KEYS } from "@/lib/storage";
import {
  Search,
  X,
  UtensilsCrossed,
  Lightbulb,
  Baby,
  MessageCircle,
  ChevronLeft,
  TrendingUp,
} from "lucide-react";

type ResultType = "restaurant" | "tip" | "guide" | "community";

interface SearchResult {
  type: ResultType;
  id: number;
  title: string;
  subtitle: string;
  emoji: string;
  href: string;
}

const POPULAR_KEYWORDS = ["저염식", "엽산", "입덧", "디카페인", "출산 가방", "요가"];

const typeIcons: Record<ResultType, { icon: typeof UtensilsCrossed; label: string; color: string }> = {
  restaurant: { icon: UtensilsCrossed, label: "맛집", color: "text-primary" },
  tip: { icon: Lightbulb, label: "꿀팁", color: "text-amber-500" },
  guide: { icon: Baby, label: "가이드", color: "text-secondary" },
  community: { icon: MessageCircle, label: "커뮤니티", color: "text-emerald-500" },
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState<"all" | ResultType>("all");
  const [userPosts, setUserPosts] = useState<CommunityPost[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.COMMUNITY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only localStorage hydration
      if (raw) setUserPosts(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const debouncedQuery = useDebounce(query, 250);

  const allCommunityPosts = useMemo(
    () => [...userPosts, ...sampleCommunityPosts],
    [userPosts]
  );

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.toLowerCase();
    const items: SearchResult[] = [];

    restaurants.forEach((r) => {
      const searchable = `${r.name} ${r.category} ${r.area} ${r.description} ${r.tags.join(" ")} ${r.pregnancyPerks.join(" ")}`.toLowerCase();
      if (searchable.includes(q)) {
        items.push({
          type: "restaurant",
          id: r.id,
          title: r.name,
          subtitle: `${r.area} · ★${r.rating}`,
          emoji: r.emoji,
          href: `/restaurants/${r.id}`,
        });
      }
    });

    tips.forEach((t) => {
      const searchable = `${t.title} ${t.summary} ${t.content} ${t.category} ${t.source}`.toLowerCase();
      if (searchable.includes(q)) {
        items.push({
          type: "tip",
          id: t.id,
          title: t.title,
          subtitle: TIP_CATEGORIES.find((c) => c.id === t.category)?.label ?? t.category,
          emoji: t.emoji,
          href: `/tips/${t.id}`,
        });
      }
    });

    weeklyGuide.forEach((w) => {
      const searchable = `${w.week}주 ${w.babySize} ${w.babyDevelopment.join(" ")} ${w.momChanges.join(" ")} ${w.tips.join(" ")} ${w.goodFoods.join(" ")}`.toLowerCase();
      if (searchable.includes(q)) {
        items.push({
          type: "guide",
          id: w.week,
          title: `임신 ${w.week}주차 가이드`,
          subtitle: `아기 크기: ${w.babySize}`,
          emoji: w.babySizeEmoji,
          href: `/guide?week=${w.week}`,
        });
      }
    });

    allCommunityPosts.forEach((p) => {
      const searchable = `${p.title} ${p.content} ${p.author}`.toLowerCase();
      if (searchable.includes(q)) {
        items.push({
          type: "community",
          id: p.id,
          title: p.title,
          subtitle: `${p.author} · ${p.category}`,
          emoji: p.emoji,
          href: `/community/${p.id}`,
        });
      }
    });

    return items;
  }, [debouncedQuery, allCommunityPosts]);

  const filteredResults = activeFilter === "all"
    ? results
    : results.filter((r) => r.type === activeFilter);

  const resultCounts = useMemo(() => {
    const counts: Record<string, number> = { all: results.length };
    results.forEach((r) => {
      counts[r.type] = (counts[r.type] || 0) + 1;
    });
    return counts;
  }, [results]);

  return (
    <main className="flex flex-col">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-5 pt-12 pb-3">
        <div className="flex items-center gap-2">
          <Link href="/" className="p-1 -ml-1" aria-label="뒤로가기">
            <ChevronLeft size={22} className="text-foreground" />
          </Link>
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="맛집, 꿀팁, 가이드, 커뮤니티 검색"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-card border border-card-border text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              autoFocus
            />
            {query && (
              <button
                onClick={() => { setQuery(""); setActiveFilter("all"); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                aria-label="검색어 지우기"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {results.length > 0 && (
          <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-1">
            {(["all", "restaurant", "tip", "guide", "community"] as const).map((f) => {
              const count = resultCounts[f] || 0;
              if (f !== "all" && count === 0) return null;
              const label = f === "all" ? "전체" : typeIcons[f].label;
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all
                    ${activeFilter === f
                      ? "bg-primary text-white shadow-sm"
                      : "bg-card text-muted border border-card-border"
                    }`}
                >
                  {label} {count}
                </button>
              );
            })}
          </div>
        )}
      </header>

      <section className="px-5 mt-3 pb-6">
        {!query.trim() && (
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <TrendingUp size={14} className="text-primary" />
              <p className="text-sm font-semibold text-foreground">인기 검색어</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_KEYWORDS.map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => setQuery(keyword)}
                  className="px-4 py-2 rounded-full bg-card border border-card-border text-xs text-foreground hover:border-primary transition-colors"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        )}

        {query.trim() && filteredResults.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm font-medium text-foreground">검색 결과가 없어요</p>
            <p className="text-xs text-muted mt-1">다른 키워드로 검색해보세요</p>
          </div>
        )}

        {filteredResults.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-muted">{filteredResults.length}개의 검색 결과</p>
            {filteredResults.map((result) => {
              const typeInfo = typeIcons[result.type];
              const Icon = typeInfo.icon;
              return (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={result.href}
                  className="bg-card rounded-2xl border border-card-border shadow-sm p-4 flex gap-3.5 items-center animate-fade-in-up"
                >
                  <div className="w-11 h-11 rounded-xl bg-surface flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">{result.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-1">{result.title}</h3>
                    <p className="text-xs text-muted mt-0.5">{result.subtitle}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full bg-surface font-medium ${typeInfo.color} flex items-center gap-0.5`}>
                    <Icon size={10} />
                    {typeInfo.label}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
