"use client";

import { type Restaurant, restaurants } from "@/data/mock";
import {
  ChevronLeft,
  Star,
  MapPin,
  Navigation,
  ExternalLink,
  Share2,
  Heart,
} from "lucide-react";
import Link from "next/link";
import BookmarkButton from "@/components/BookmarkButton";
import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";

interface Props {
  restaurant: Restaurant;
}

export default function RestaurantDetail({ restaurant: r }: Props) {
  const [liked, setLiked] = useState(false);
  const addRecentlyViewed = useStore((s) => s.addRecentlyViewed);

  useEffect(() => {
    addRecentlyViewed({
      id: `restaurant-${r.id}`,
      type: "restaurant",
      title: r.name,
      emoji: r.emoji,
      href: `/restaurants/${r.id}`,
    });
  }, [r.id, r.name, r.emoji, addRecentlyViewed]);
  const regionMap: Record<string, string> = { seoul: "서울", gyeonggi: "경기", incheon: "인천" };
  const regionLabel = regionMap[r.region] ?? r.region;

  const similar = restaurants
    .filter((rest) => rest.id !== r.id && (rest.category === r.category || rest.region === r.region))
    .slice(0, 4);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: r.name, text: r.description, url: globalThis.location.href });
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
      {/* Header image area */}
      <div className="relative h-56 bg-gradient-to-br from-surface-rose via-surface-violet to-surface-amber flex items-center justify-center">
        <span className="text-8xl">{r.emoji}</span>
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-12">
          <Link
            href="/restaurants"
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
            <BookmarkButton itemId={String(r.id)} itemType="restaurant" size={18} />
          </div>
        </div>
        <div className="absolute bottom-3 left-4">
          <span className="text-xs px-2.5 py-1 rounded-full bg-card/80 backdrop-blur-sm text-foreground font-medium">
            {regionLabel}
          </span>
        </div>
      </div>

      {/* Info */}
      <section className="px-5 -mt-4 relative z-10">
        <div className="bg-card rounded-2xl border border-card-border shadow-sm p-5">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">{r.name}</h1>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="flex items-center gap-0.5 text-sm">
                  <Star size={14} className="text-amber-400" fill="currentColor" />
                  <span className="font-semibold">{r.rating}</span>
                </span>
                <span className="text-xs text-muted flex items-center gap-0.5">
                  <MapPin size={12} />
                  {r.area}
                </span>
              </div>
            </div>
            <button
              onClick={() => setLiked(!liked)}
              className={`p-2 rounded-full transition-all ${liked ? "text-red-500 bg-red-50 dark:bg-red-500/10" : "text-muted hover:text-red-500"}`}
              aria-label={liked ? "좋아요 취소" : "좋아요"}
            >
              <Heart size={20} fill={liked ? "currentColor" : "none"} />
            </button>
          </div>

          <p className="text-sm text-muted mt-3 leading-relaxed">{r.description}</p>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {r.tags.map((tag) => (
              <span key={tag} className="text-[11px] px-2.5 py-1 rounded-full bg-primary-light text-primary font-medium">
                {tag}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-surface rounded-xl p-3 text-center">
              <p className="text-xs text-muted">가격대</p>
              <p className="text-xs font-semibold text-foreground mt-0.5">{r.priceRange}</p>
            </div>
            <div className="bg-surface rounded-xl p-3 text-center">
              <p className="text-xs text-muted">저장</p>
              <p className="text-xs font-semibold text-foreground mt-0.5">{r.savedCount.toLocaleString()}명</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pregnancy perks */}
      <section className="px-5 mt-4">
        <div className="bg-card rounded-2xl border border-card-border shadow-sm p-5">
          <h2 className="font-bold text-sm text-foreground flex items-center gap-2 mb-3">
            <span className="text-lg">🤰</span> 임산부 포인트
          </h2>
          <div className="flex flex-col gap-2.5">
            {r.pregnancyPerks.map((perk, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary-light text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-foreground leading-relaxed">{perk}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="px-5 mt-4">
        <div className="bg-card rounded-2xl border border-card-border shadow-sm p-5">
          <h2 className="font-bold text-sm text-foreground flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-secondary" /> 위치 정보
          </h2>
          <p className="text-sm text-muted mb-4">{r.address}</p>
          <div className="flex flex-col gap-2">
            <a
              href={`https://map.naver.com/v5/search/${encodeURIComponent(r.name + " " + r.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-500 dark:bg-emerald-600 text-white text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98]"
            >
              <Navigation size={16} />
              네이버 지도에서 보기
              <ExternalLink size={12} className="opacity-60" />
            </a>
            {r.sourceUrl && (
              <a
                href={r.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-surface text-foreground text-sm font-medium border border-card-border transition-all hover:bg-surface-rose active:scale-[0.98]"
              >
                <ExternalLink size={14} />
                상세 정보 보기
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Similar restaurants */}
      {similar.length > 0 && (
        <section className="px-5 mt-4 pb-6">
          <h2 className="font-bold text-sm text-foreground mb-3">비슷한 맛집</h2>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-2">
            {similar.map((s) => (
              <Link
                key={s.id}
                href={`/restaurants/${s.id}`}
                className="flex-shrink-0 w-44 bg-card rounded-2xl border border-card-border shadow-sm overflow-hidden"
              >
                <div className="h-20 bg-gradient-to-br from-surface-rose to-surface-amber flex items-center justify-center">
                  <span className="text-3xl">{s.emoji}</span>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-xs text-foreground">{s.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={10} className="text-amber-400" fill="currentColor" />
                    <span className="text-xs font-medium">{s.rating}</span>
                    <span className="text-xs text-muted ml-1">{s.area}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
