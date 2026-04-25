import Link from "next/link";
import HomeRouter from "@/components/HomeRouter";
import { ChevronRight, Bookmark } from "lucide-react";
import { BabyOnboardingTrigger } from "@/components/BabyOnboarding";
import HeroSection from "@/components/HeroSection";
import DailyReward from "@/components/DailyReward";
import HomeWidgets from "@/components/HomeWidgets";
import LiveActivityCard from "@/components/LiveActivityCard";
import DailyBrief from "@/components/DailyBrief";
import RecentlyViewedSection from "@/components/RecentlyViewedSection";

export default function Home() {
  return (
    <HomeRouter pregnancyHome={
    <main className="flex flex-col">
      {/* Hero — personalized pregnancy info */}
      <HeroSection />

      {/* 진행 중 활동 (태동 측정/수유 타이머 등) */}
      <LiveActivityCard />

      {/* AI 오늘의 한 줄 (Claude Haiku, 일 1회) */}
      <DailyBrief />

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
        <div className="grid grid-cols-3 gap-3">
          <Link
            href="/ultrasound"
            className="bg-gradient-to-br from-surface-sky to-surface-violet rounded-2xl border border-card-border p-4 active:scale-[0.98] transition-transform"
          >
            <span className="text-2xl block mb-2">📸</span>
            <p className="text-sm font-bold text-foreground">초음파 앨범</p>
            <p className="text-xs text-muted mt-0.5">주차별 사진 기록</p>
          </Link>
          <Link
            href="/nursery"
            className="bg-gradient-to-br from-surface-violet to-surface-rose rounded-2xl border border-card-border p-4 active:scale-[0.98] transition-transform"
          >
            <span className="text-2xl block mb-2">🏠</span>
            <p className="text-sm font-bold text-foreground">아기방 꾸미기</p>
            <p className="text-xs text-muted mt-0.5">하트로 꾸미기</p>
          </Link>
          <Link
            href="/couple"
            className="bg-gradient-to-br from-surface-rose to-surface-amber rounded-2xl border border-card-border p-4 active:scale-[0.98] transition-transform"
          >
            <span className="text-2xl block mb-2">👫</span>
            <p className="text-sm font-bold text-foreground">부부 모드</p>
            <p className="text-xs text-muted mt-0.5">함께 준비하기</p>
          </Link>
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
