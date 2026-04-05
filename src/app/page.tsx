import Link from "next/link";
import HomeRouter from "@/components/HomeRouter";
import { restaurants, tips, curatedFeed } from "@/data/mock";
import {
  Heart,
  ChevronRight,
  Star,
  TrendingUp,
  Camera,
  BookOpen,
  MessageCircle,
  Bookmark,
  ExternalLink,
} from "lucide-react";
import BookmarkButton from "@/components/BookmarkButton";
import { BabyOnboardingTrigger } from "@/components/BabyOnboarding";
import HeroSection from "@/components/HeroSection";
import DailyReward from "@/components/DailyReward";
import HomeWidgets from "@/components/HomeWidgets";
import RecentlyViewedSection from "@/components/RecentlyViewedSection";

const sourceIcons = {
  instagram: { icon: Camera, label: "Instagram", color: "text-pink-500" },
  blog: { icon: BookOpen, label: "블로그", color: "text-emerald-500" },
  cafe: { icon: MessageCircle, label: "카페", color: "text-amber-500" },
};

export default function Home() {
  const featuredRestaurants = restaurants.slice(0, 5);
  const popularTips = [...tips].sort((a, b) => b.likes - a.likes).slice(0, 3);

  return (
    <HomeRouter pregnancyHome={
    <main className="flex flex-col">
      {/* Hero — personalized pregnancy info */}
      <HeroSection />

      {/* Widgets */}
      <section className="px-5 mt-5">
        <HomeWidgets />
      </section>

      {/* Recently Viewed */}
      <RecentlyViewedSection />

      {/* Daily Reward + Feature Links */}
      <section className="px-5 mt-5">
        <DailyReward />
      </section>

      <section className="px-5 mt-4">
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/nursery"
            className="bg-gradient-to-br from-surface-violet to-surface-rose rounded-2xl border border-card-border p-4 active:scale-[0.98] transition-transform"
          >
            <span className="text-2xl block mb-2">🏠</span>
            <p className="text-sm font-bold text-foreground">아기방 꾸미기</p>
            <p className="text-xs text-muted mt-0.5">하트로 아기방을 꾸며보세요</p>
          </Link>
          <Link
            href="/couple"
            className="bg-gradient-to-br from-surface-rose to-surface-amber rounded-2xl border border-card-border p-4 active:scale-[0.98] transition-transform"
          >
            <span className="text-2xl block mb-2">👫</span>
            <p className="text-sm font-bold text-foreground">부부 모드</p>
            <p className="text-xs text-muted mt-0.5">함께 출산을 준비하세요</p>
          </Link>
        </div>
      </section>

      {/* Curated Feed */}
      <section className="mt-8 px-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">SNS 인기 정보</h2>
            <p className="text-xs text-muted mt-0.5">Instagram·블로그·카페에서 모은 최신 정보</p>
          </div>
        </div>

        <div className="scroll-fade">
          <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-2">
            {curatedFeed.slice(0, 6).map((post) => {
              const src = sourceIcons[post.source];
              const SrcIcon = src.icon;
              const isExternal = !!post.sourceUrl;
              const href = post.sourceUrl || `/search?q=${encodeURIComponent(post.tags[0]?.replace("#", "") || post.title)}`;
              const Wrapper = isExternal ? "a" : Link;
              const extraProps = isExternal
                ? { target: "_blank" as const, rel: "noopener noreferrer" }
                : {};
              return (
                <Wrapper
                  key={post.id}
                  href={href}
                  {...extraProps}
                  className="flex-shrink-0 w-64 bg-card rounded-2xl border border-card-border shadow-sm overflow-hidden hover:border-primary/40 transition-colors"
                >
                  <div className={`h-20 bg-gradient-to-br ${post.gradient} flex items-center justify-center`}>
                    <span className="text-3xl">{post.emoji}</span>
                  </div>
                  <div className="p-3.5">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <SrcIcon size={12} className={src.color} />
                      <span className="text-xs text-muted">{post.sourceAccount}</span>
                      {isExternal && (
                        <ExternalLink size={10} className="text-muted ml-auto" />
                      )}
                    </div>
                    <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-muted mt-1 line-clamp-1">{post.summary}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted flex items-center gap-0.5">
                        <Heart size={11} /> {post.likes.toLocaleString()}
                      </span>
                      <div className="flex gap-1">
                        {post.tags.slice(0, 1).map((tag) => (
                          <span key={tag} className="text-xs text-primary">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Wrapper>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="mt-8 px-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">임산부 추천 맛집</h2>
            <p className="text-xs text-muted mt-0.5">서울·경기·인천 안심 맛집</p>
          </div>
          <Link href="/restaurants" className="text-xs text-primary font-medium flex items-center gap-0.5">
            전체보기 <ChevronRight size={14} />
          </Link>
        </div>

        <div className="scroll-fade">
          <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-2">
            {featuredRestaurants.map((r) => (
            <Link
              key={r.id}
              href={`/restaurants/${r.id}`}
              className="flex-shrink-0 w-56 bg-card rounded-2xl border border-card-border shadow-sm overflow-hidden"
            >
              <div className="h-28 bg-gradient-to-br from-hero-from to-hero-to flex items-center justify-center overflow-hidden">
                {r.imageUrl ? (
                  <img src={r.imageUrl} alt={r.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <span className="text-5xl">{r.emoji}</span>
                )}
              </div>
              <div className="p-3.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-foreground">{r.name}</h3>
                    <p className="text-xs text-muted mt-0.5">{r.area} · {r.region === "seoul" ? "서울" : r.region === "gyeonggi" ? "경기" : "인천"}</p>
                  </div>
                  <BookmarkButton itemId={String(r.id)} itemType="restaurant" size={16} />
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <Star size={12} className="text-amber-400" fill="currentColor" />
                  <span className="text-xs font-medium">{r.rating}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {r.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-primary-light text-primary font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tips */}
      <section className="mt-8 px-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-1.5">
              <TrendingUp size={18} className="text-primary" />
              인기 꿀팁
            </h2>
            <p className="text-xs text-muted mt-0.5">많은 맘들이 저장한 정보예요</p>
          </div>
          <Link href="/tips" className="text-xs text-primary font-medium flex items-center gap-0.5">
            전체보기 <ChevronRight size={14} />
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {popularTips.map((tip) => (
            <Link
              key={tip.id}
              href={`/tips/${tip.id}`}
              className="bg-card rounded-2xl border border-card-border shadow-sm p-4 flex gap-4 items-start"
            >
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${tip.gradient} flex items-center justify-center`}>
                <span className="text-xl">{tip.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-2">{tip.title}</h3>
                <p className="text-xs text-muted mt-1 line-clamp-1">{tip.summary}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-muted flex items-center gap-0.5">
                    <Heart size={11} /> {tip.likes.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted">{tip.source}</span>
                </div>
              </div>
              <BookmarkButton itemId={String(tip.id)} itemType="tip" size={16} />
            </Link>
          ))}
        </div>
      </section>

      {/* Baby born CTA */}
      <section className="mt-5 px-5">
        <BabyOnboardingTrigger />
      </section>

      {/* Bookmarks shortcut */}
      <section className="mt-8 px-5">
        <Link
          href="/bookmarks"
          className="flex items-center justify-between bg-card rounded-2xl border border-card-border shadow-sm p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
              <Bookmark size={18} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">저장한 정보</p>
              <p className="text-xs text-muted">북마크한 맛집과 꿀팁 모아보기</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-muted" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="mt-10 px-5 pb-8">
        <div className="bg-gradient-to-r from-surface-rose to-surface-violet rounded-2xl p-5 text-center">
          <p className="text-2xl mb-2">🤰</p>
          <p className="text-sm font-semibold text-foreground">건강한 임신 생활을 응원합니다</p>
          <p className="text-xs text-muted mt-1">맘마와 함께 행복한 40주를 보내세요</p>
          <Link
            href="/settings"
            className="inline-block mt-3 text-[11px] text-muted underline underline-offset-2"
          >
            설정 · 데이터 관리
          </Link>
        </div>
      </footer>
    </main>
    } />
  );
}
