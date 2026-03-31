"use client";

import { useState } from "react";
import { restaurants, CATEGORIES, AREA_GROUPS } from "@/data/mock";
import { Star, MapPin, ChevronLeft, Search, X } from "lucide-react";
import Link from "next/link";
import BookmarkButton from "@/components/BookmarkButton";

export default function RestaurantsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeArea, setActiveArea] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const filteredRestaurants = restaurants.filter((r) => {
    const matchCategory = activeCategory === "all" || r.category === activeCategory;
    const matchArea = activeArea === "all" || r.region === activeArea;
    const matchSearch =
      !searchQuery ||
      r.name.includes(searchQuery) ||
      r.area.includes(searchQuery) ||
      r.tags.some((t) => t.includes(searchQuery));
    return matchCategory && matchArea && matchSearch;
  });

  return (
    <main className="flex flex-col">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-5 pt-12 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="p-1 -ml-1" aria-label="뒤로가기">
              <ChevronLeft size={22} className="text-foreground" />
            </Link>
            <h1 className="text-lg font-bold text-foreground">임산부 맛집</h1>
          </div>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 rounded-full hover:bg-surface transition-colors"
            aria-label={showSearch ? "검색 닫기" : "검색 열기"}
          >
            {showSearch ? <X size={20} className="text-foreground" /> : <Search size={20} className="text-foreground" />}
          </button>
        </div>

        {showSearch && (
          <div className="mt-3 animate-fade-in-up">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="맛집, 지역, 태그로 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-card border border-card-border text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Area filter */}
        <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-1">
          {AREA_GROUPS.map((area) => (
            <button
              key={area.id}
              onClick={() => setActiveArea(area.id)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all
                ${activeArea === area.id
                  ? "bg-secondary text-white shadow-sm"
                  : "bg-card text-muted border border-card-border"
                }`}
            >
              {area.label}
              {area.id !== "all" && (
                <span className="ml-1 opacity-70">
                  {restaurants.filter((r) => r.region === area.id).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex gap-2 mt-2 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-1">
          <button
            onClick={() => setActiveCategory("all")}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all
              ${activeCategory === "all"
                ? "bg-primary text-white shadow-sm"
                : "bg-card text-muted border border-card-border"
              }`}
          >
            전체
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1
                ${activeCategory === cat.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-card text-muted border border-card-border"
                }`}
            >
              <span>{cat.emoji}</span>{cat.label}
            </button>
          ))}
        </div>
      </header>

      <section className="px-5 mt-2 pb-4">
        <p className="text-xs text-muted mb-3">총 {filteredRestaurants.length}개의 맛집</p>

        <div className="flex flex-col gap-4">
          {filteredRestaurants.map((r, i) => (
            <Link
              key={r.id}
              href={`/restaurants/${r.id}`}
              className="block bg-card rounded-2xl border border-card-border shadow-sm overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="h-36 bg-gradient-to-br from-surface-rose to-surface-amber flex items-center justify-center relative">
                <span className="text-6xl">{r.emoji}</span>
                <div className="absolute top-3 right-3">
                  <BookmarkButton itemId={String(r.id)} itemType="restaurant" />
                </div>
                <div className="absolute top-3 left-3">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-card/80 backdrop-blur-sm text-foreground font-medium">
                    {r.region === "seoul" ? "서울" : r.region === "gyeonggi" ? "경기" : "인천"}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-base text-foreground">{r.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-0.5 text-xs">
                        <Star size={12} className="text-amber-400" fill="currentColor" />
                        <span className="font-semibold">{r.rating}</span>
                      </span>
                      <span className="text-xs text-muted flex items-center gap-0.5">
                        <MapPin size={11} />{r.area}
                      </span>
                      <span className="text-xs text-muted">{r.priceRange}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted mt-2.5 leading-relaxed line-clamp-2">{r.description}</p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {r.tags.map((tag) => (
                    <span key={tag} className="text-[11px] px-2.5 py-1 rounded-full bg-primary-light text-primary font-medium">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-card-border flex items-center justify-between">
                  <p className="text-xs font-semibold text-secondary">🤰 임산부 포인트 {r.pregnancyPerks.length}개</p>
                  <span className="text-xs text-primary font-medium">자세히 보기 →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm font-medium text-foreground">검색 결과가 없어요</p>
            <p className="text-xs text-muted mt-1">다른 카테고리나 키워드로 검색해보세요</p>
          </div>
        )}
      </section>
    </main>
  );
}
