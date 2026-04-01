"use client";

import { useState, useMemo } from "react";
import { tips, TIP_CATEGORIES } from "@/data/mock";
import { ChevronLeft, Heart } from "lucide-react";
import Link from "next/link";
import BookmarkButton from "@/components/BookmarkButton";

export default function TipsPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredTips = useMemo(
    () => tips.filter((t) => activeCategory === "all" || t.category === activeCategory),
    [activeCategory]
  );

  return (
    <main className="flex flex-col">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-5 pt-12 pb-3">
        <div className="flex items-center gap-2">
          <Link href="/" className="p-1 -ml-1" aria-label="뒤로가기">
            <ChevronLeft size={22} className="text-foreground" />
          </Link>
          <h1 className="text-lg font-bold text-foreground">임산부 꿀팁</h1>
        </div>

        <div className="flex gap-2 mt-3 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-1">
          {TIP_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all
                ${activeCategory === cat.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-card text-muted border border-card-border"
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      <section className="px-5 mt-3 pb-6">
        <p className="text-xs text-muted mb-3">총 {filteredTips.length}개의 꿀팁</p>

        <div className="flex flex-col gap-4">
          {filteredTips.map((tip, i) => (
            <Link
              key={tip.id}
              href={`/tips/${tip.id}`}
              className="block bg-card rounded-2xl border border-card-border shadow-sm overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className={`h-24 bg-gradient-to-br ${tip.gradient} flex items-center justify-center relative`}>
                <span className="text-4xl">{tip.emoji}</span>
                <div className="absolute top-3 right-3">
                  <BookmarkButton itemId={String(tip.id)} itemType="tip" />
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary-light text-secondary font-medium">
                    {TIP_CATEGORIES.find((c) => c.id === tip.category)?.label}
                  </span>
                  <span className="text-xs text-muted">{tip.source}</span>
                </div>

                <h3 className="font-bold text-base text-foreground leading-snug">{tip.title}</h3>
                <p className="text-sm text-muted mt-2 leading-relaxed line-clamp-2">{tip.summary}</p>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-card-border">
                  <span className="text-xs text-muted flex items-center gap-1">
                    <Heart size={12} className="text-primary" fill="currentColor" />
                    {tip.likes.toLocaleString()}명이 좋아해요
                  </span>
                  <span className="text-xs text-primary font-medium">자세히 보기 →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredTips.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">💡</p>
            <p className="text-sm font-medium text-foreground">해당 카테고리의 팁이 없어요</p>
            <p className="text-xs text-muted mt-1">다른 카테고리를 확인해보세요</p>
          </div>
        )}
      </section>
    </main>
  );
}
