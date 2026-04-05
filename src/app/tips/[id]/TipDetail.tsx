"use client";

import { type Tip, tips } from "@/data/mock";
import { ChevronLeft, Heart, Share2, ExternalLink } from "lucide-react";
import Link from "next/link";
import BookmarkButton from "@/components/BookmarkButton";
import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { trackLink, logClick } from "@/lib/affiliate";

interface Props {
  tip: Tip;
  categoryLabel: string;
}

export default function TipDetail({ tip, categoryLabel }: Props) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(tip.likes);
  const addRecentlyViewed = useStore((s) => s.addRecentlyViewed);

  useEffect(() => {
    addRecentlyViewed({
      id: `tip-${tip.id}`,
      type: "tip",
      title: tip.title,
      emoji: tip.emoji,
      href: `/tips/${tip.id}`,
    });
  }, [tip.id, tip.title, tip.emoji, addRecentlyViewed]);

  const relatedTips = tips
    .filter((t) => t.id !== tip.id && t.category === tip.category)
    .slice(0, 4);

  const handleLike = () => {
    if (liked) {
      setLikeCount((c) => c - 1);
    } else {
      setLikeCount((c) => c + 1);
    }
    setLiked(!liked);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: tip.title, text: tip.summary, url: globalThis.location.href });
      } else {
        await navigator.clipboard.writeText(globalThis.location.href);
        alert("링크가 복사되었습니다!");
      }
    } catch {
      // user cancelled share or permission denied
    }
  };

  return (
    <main className="flex flex-col">
      {/* Header gradient */}
      <div className={`relative h-48 bg-gradient-to-br ${tip.gradient} flex items-center justify-center`}>
        <span className="text-7xl">{tip.emoji}</span>
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-12">
          <Link
            href="/tips"
            className="p-2 rounded-full bg-card/70 backdrop-blur-sm border border-card-border"
            aria-label="뒤로가기"
          >
            <ChevronLeft size={20} className="text-foreground" />
          </Link>
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-card/70 backdrop-blur-sm border border-card-border"
              aria-label="공유하기"
            >
              <Share2 size={18} className="text-foreground" />
            </button>
            <BookmarkButton itemId={String(tip.id)} itemType="tip" size={18} />
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="px-5 -mt-4 relative z-10">
        <div className="bg-card rounded-2xl border border-card-border shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary-light text-secondary font-medium">
              {categoryLabel}
            </span>
            <span className="text-xs text-muted">{tip.source}</span>
          </div>

          <h1 className="text-lg font-bold text-foreground leading-snug">{tip.title}</h1>
          <p className="text-sm text-muted mt-2 leading-relaxed">{tip.summary}</p>

          <div className="mt-4 pt-4 border-t border-card-border">
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{tip.content}</p>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-card-border">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                liked
                  ? "bg-primary-light text-primary"
                  : "bg-surface text-muted border border-card-border hover:text-primary"
              }`}
            >
              <Heart size={16} fill={liked ? "currentColor" : "none"} />
              {likeCount.toLocaleString()}
            </button>
            <span className="text-xs text-muted">출처: {tip.source}</span>
          </div>

          {tip.sourceUrl && (
            <a
              href={trackLink(tip.sourceUrl, "tip", tip.title)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => logClick("tip", tip.sourceUrl!, tip.title)}
              className="flex items-center justify-center gap-2 w-full mt-4 py-3 rounded-xl bg-surface text-foreground text-sm font-medium border border-card-border transition-all hover:bg-primary-light hover:text-primary active:scale-[0.98]"
            >
              <ExternalLink size={14} />
              원문 보기
            </a>
          )}
        </div>
      </section>

      {/* Related tips */}
      {relatedTips.length > 0 && (
        <section className="px-5 mt-5 pb-6">
          <h2 className="font-bold text-sm text-foreground mb-3">관련 꿀팁</h2>
          <div className="flex flex-col gap-3">
            {relatedTips.map((t) => (
              <Link
                key={t.id}
                href={`/tips/${t.id}`}
                className="bg-card rounded-2xl border border-card-border shadow-sm p-4 flex gap-4 items-start"
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${t.gradient} flex items-center justify-center`}>
                  <span className="text-xl">{t.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-2">{t.title}</h3>
                  <p className="text-xs text-muted mt-1 line-clamp-1">{t.summary}</p>
                  <span className="text-xs text-muted flex items-center gap-0.5 mt-1">
                    <Heart size={11} /> {t.likes.toLocaleString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
