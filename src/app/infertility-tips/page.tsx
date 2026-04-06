"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import {
  infertilityTips,
  infertilityCategories,
  type InfertilityTip,
} from "@/data/infertility";

const categories: { id: InfertilityTip["category"] | "all"; label: string }[] = [
  { id: "all", label: "전체" },
  ...Object.entries(infertilityCategories).map(([key, { label, emoji }]) => ({
    id: key as InfertilityTip["category"],
    label: `${emoji} ${label}`,
  })),
];

export default function InfertilityTipsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredTips = useMemo(
    () =>
      infertilityTips.filter(
        (t) => activeCategory === "all" || t.category === activeCategory
      ),
    [activeCategory]
  );

  return (
    <main className="flex flex-col">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-5 pt-12 pb-3">
        <div className="flex items-center gap-2">
          <Link href="/" className="p-1 -ml-1" aria-label="뒤로가기">
            <ChevronLeft size={22} className="text-foreground" />
          </Link>
          <h1 className="text-lg font-bold text-foreground">난임 꿀팁</h1>
        </div>

        <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all
                ${
                  activeCategory === cat.id
                    ? "bg-primary text-white shadow-sm"
                    : "bg-card text-muted border border-card-border"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      <section className="px-5 mt-3 pb-28">
        <p className="text-xs text-muted mb-3">총 {filteredTips.length}개의 꿀팁</p>

        <div className="flex flex-col gap-4">
          {filteredTips.map((tip, i) => (
            <Link
              key={tip.id}
              href={`/infertility-tips/${tip.id}`}
              className="block bg-card rounded-2xl border border-card-border shadow-sm overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div
                className={`h-24 bg-gradient-to-br ${tip.gradient} flex items-center justify-center`}
              >
                <span className="text-4xl">{tip.emoji}</span>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary-light text-secondary font-medium">
                    {infertilityCategories[tip.category].label}
                  </span>
                </div>

                <h3 className="font-bold text-base text-foreground leading-snug">
                  {tip.title}
                </h3>
                <p className="text-sm text-muted mt-2 leading-relaxed line-clamp-2">
                  {tip.summary}
                </p>

                <div className="flex items-center justify-end mt-3 pt-3 border-t border-card-border">
                  <span className="text-xs text-primary font-medium">
                    자세히 보기 →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
