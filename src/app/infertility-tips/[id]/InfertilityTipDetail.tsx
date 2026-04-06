"use client";

import Link from "next/link";
import { ChevronLeft, Share2 } from "lucide-react";
import {
  infertilityTips,
  infertilityCategories,
  type InfertilityTip,
} from "@/data/infertility";

export default function InfertilityTipDetail({ tip }: { tip: InfertilityTip }) {
  const categoryInfo = infertilityCategories[tip.category];
  const relatedTips = infertilityTips
    .filter((t) => t.id !== tip.id && t.category === tip.category)
    .slice(0, 4);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: tip.title, text: tip.summary, url: globalThis.location.href });
      } else {
        await navigator.clipboard.writeText(globalThis.location.href);
        alert("링크가 복사되었습니다!");
      }
    } catch {
      // user cancelled
    }
  };

  return (
    <main className="flex flex-col">
      <div className={`relative h-48 bg-gradient-to-br ${tip.gradient} flex items-center justify-center`}>
        <span className="text-7xl">{tip.emoji}</span>
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-12">
          <Link
            href="/infertility-tips"
            className="p-2 rounded-full bg-card/70 backdrop-blur-sm border border-card-border"
            aria-label="뒤로가기"
          >
            <ChevronLeft size={20} className="text-foreground" />
          </Link>
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-card/70 backdrop-blur-sm border border-card-border"
            aria-label="공유하기"
          >
            <Share2 size={18} className="text-foreground" />
          </button>
        </div>
      </div>

      <section className="px-5 -mt-4 relative z-10">
        <div className="bg-card rounded-2xl border border-card-border shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary-light text-secondary font-medium">
              {categoryInfo.emoji} {categoryInfo.label}
            </span>
          </div>

          <h1 className="text-lg font-bold text-foreground leading-snug">{tip.title}</h1>
          <p className="text-sm text-muted mt-2 leading-relaxed">{tip.summary}</p>

          <div className="mt-4 pt-4 border-t border-card-border">
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{tip.content}</p>
          </div>
        </div>
      </section>

      {relatedTips.length > 0 && (
        <section className="px-5 mt-5 pb-28">
          <h2 className="font-bold text-sm text-foreground mb-3">관련 꿀팁</h2>
          <div className="flex flex-col gap-3">
            {relatedTips.map((t) => (
              <Link
                key={t.id}
                href={`/infertility-tips/${t.id}`}
                className="bg-card rounded-2xl border border-card-border shadow-sm p-4 flex gap-4 items-start"
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${t.gradient} flex items-center justify-center`}>
                  <span className="text-xl">{t.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-2">{t.title}</h3>
                  <p className="text-xs text-muted mt-1 line-clamp-1">{t.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
