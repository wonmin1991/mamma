"use client";

import { useState, useRef, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { usePregnancy } from "@/contexts/PregnancyContext";
import { nurseryItems, NURSERY_CATEGORIES, type NurseryItem } from "@/data/nurseryItems";
import { weeklyGuide } from "@/data/mock";
import {
  ChevronLeft,
  Heart,
  Paintbrush,
  Lock,
  Check,
  X,
  Sparkles,
  Play,
} from "lucide-react";
import Link from "next/link";
import { showRewardAd, logAdEvent, getAdStats } from "@/lib/adProvider";

type Mode = "view" | "shop" | "decorate";

const ROOM_SLOTS = [
  { id: 0, label: "왼쪽 벽", area: "col-start-1 row-start-1", size: "w-14 h-14" },
  { id: 1, label: "중앙 벽", area: "col-start-2 row-start-1", size: "w-14 h-14" },
  { id: 2, label: "오른쪽 벽", area: "col-start-3 row-start-1", size: "w-14 h-14" },
  { id: 3, label: "왼쪽 바닥", area: "col-start-1 row-start-2", size: "w-14 h-14" },
  { id: 4, label: "중앙 바닥", area: "col-start-2 row-start-2", size: "w-14 h-14" },
  { id: 5, label: "오른쪽 바닥", area: "col-start-3 row-start-2", size: "w-14 h-14" },
];

export default function NurseryPage() {
  const {
    hearts, ownedItems, placedItems, activeWallpaper, activeFloor, activeMobile,
    purchaseItem, placeItem, removeItem, setWallpaper, setFloor, setMobile, addHearts,
  } = useStore();
  const { currentWeek } = usePregnancy();

  const [mode, setMode] = useState<Mode>("view");
  const [shopCategory, setShopCategory] = useState("furniture");
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [adTimer, setAdTimer] = useState(0);
  const [adActive, setAdActive] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const weekIdx = Math.max(0, Math.min(39, currentWeek - 1));
  const babyInfo = weeklyGuide[weekIdx];

  const wallpaper = nurseryItems.find((i) => i.id === activeWallpaper);
  const floor = nurseryItems.find((i) => i.id === activeFloor);
  const mobile = activeMobile ? nurseryItems.find((i) => i.id === activeMobile) : null;

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 2000);
  };

  const handlePurchase = (item: NurseryItem) => {
    if (ownedItems.includes(item.id)) {
      showToast("이미 보유 중이에요!");
      return;
    }
    if (item.unlockWeek && currentWeek < item.unlockWeek) {
      showToast(`${item.unlockWeek}주차 이후에 열려요!`);
      return;
    }
    if (purchaseItem(item.id, item.price)) {
      showToast(`${item.name} 구매 완료! 🎉`);
    } else {
      showToast("하트가 부족해요 💔");
    }
  };

  const handlePlaceItem = (itemId: string) => {
    if (selectedSlot === null) return;
    const item = nurseryItems.find((i) => i.id === itemId);
    if (!item) return;

    if (item.category === "wallpaper") {
      setWallpaper(itemId);
      showToast("벽지를 변경했어요!");
    } else if (item.category === "floor") {
      setFloor(itemId);
      showToast("바닥을 변경했어요!");
    } else if (item.category === "mobile") {
      setMobile(itemId);
      showToast("모빌을 설치했어요!");
    } else {
      placeItem(itemId, selectedSlot);
      showToast(`${item.name}을(를) 배치했어요!`);
    }
    setSelectedSlot(null);
  };

  const adCleanupRef = useRef<(() => void) | null>(null);
  const [todayAdCount, setTodayAdCount] = useState(0);
  const maxDailyAds = 10;

  useEffect(() => {
    setTodayAdCount(getAdStats().todayCount);
    return () => {
      adCleanupRef.current?.();
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const watchAd = () => {
    if (adActive || todayAdCount >= maxDailyAds) return;
    setAdActive(true);

    adCleanupRef.current = showRewardAd(
      (secondsLeft) => setAdTimer(secondsLeft),
      (result) => {
        setAdActive(false);
        setAdTimer(0);
        logAdEvent(result);
        if (result.success) {
          addHearts(result.reward, "ad");
          setTodayAdCount((c) => c + 1);
          showToast(`+${result.reward} 하트 획득! 🎉`);
        }
      }
    );
  };

  const ownedPlaceableItems = nurseryItems.filter(
    (item) =>
      ownedItems.includes(item.id) &&
      !["wallpaper", "floor"].includes(item.category)
  );

  const babyScale = Math.min(1, 0.3 + (currentWeek / 40) * 0.7);

  return (
    <main className="flex flex-col">
      {/* Toast */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[60] bg-card border border-card-border shadow-lg rounded-2xl px-5 py-3 text-sm font-medium text-foreground animate-fade-in-up">
          {toast}
        </div>
      )}

      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-5 pt-12 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="p-1 -ml-1" aria-label="뒤로가기">
              <ChevronLeft size={22} className="text-foreground" />
            </Link>
            <h1 className="text-lg font-bold text-foreground">아기방 꾸미기</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-primary flex items-center gap-0.5">
              <Heart size={12} fill="currentColor" /> {hearts}
            </span>
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          {([
            { id: "view" as const, label: "구경", icon: "👀" },
            { id: "shop" as const, label: "상점", icon: "🛍️" },
            { id: "decorate" as const, label: "꾸미기", icon: "✨" },
          ]).map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1
                ${mode === m.id ? "bg-primary text-white" : "bg-card text-muted border border-card-border"}`}
            >
              <span>{m.icon}</span> {m.label}
            </button>
          ))}
        </div>
      </header>

      {/* Room visualization */}
      <section className="px-5 mt-3">
        <div
          className={`relative rounded-3xl overflow-hidden border-2 border-card-border shadow-lg ${wallpaper?.cssClass || "bg-[#FFF9F0]"}`}
          style={{ minHeight: 280 }}
        >
          {/* Mobile (hanging from top) */}
          {mobile && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 text-center animate-pulse z-10">
              <div className="text-xs text-muted-light">|</div>
              <span className="text-3xl">{mobile.emoji}</span>
            </div>
          )}

          {/* Wall area */}
          <div className="h-[55%] flex items-center justify-center relative px-4">
            {/* Wall decorations */}
            <div className="grid grid-cols-3 gap-4 w-full max-w-[280px]">
              {ROOM_SLOTS.slice(0, 3).map((slot) => {
                const placed = placedItems.find((p) => p.position === slot.id);
                const item = placed ? nurseryItems.find((i) => i.id === placed.itemId) : null;
                const isDecorating = mode === "decorate";
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => isDecorating && setSelectedSlot(slot.id)}
                    className={`${slot.size} rounded-xl flex items-center justify-center transition-all ${
                      isDecorating
                        ? "border-2 border-dashed border-primary/40 cursor-pointer hover:border-primary hover:bg-primary/5"
                        : "border-0 bg-transparent"
                    }`}
                    disabled={!isDecorating}
                  >
                    {item ? (
                      <span className="text-3xl">{item.emoji}</span>
                    ) : isDecorating ? (
                      <span className="text-xs text-muted">+</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Floor area */}
          <div className={`h-[45%] ${floor?.cssClass || "bg-[#DEB887]"} relative rounded-b-3xl`}>
            {/* Baby in center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <div
                className="transition-all duration-700"
                style={{ transform: `scale(${babyScale})` }}
              >
                <span className="text-5xl block">{babyInfo.babySizeEmoji}</span>
                <p className="text-xs mt-1 font-semibold text-foreground/80 bg-card/60 backdrop-blur-sm rounded-full px-2 py-0.5 whitespace-nowrap">
                  {currentWeek}주 · {babyInfo.babySize}
                </p>
              </div>
            </div>

            {/* Floor items */}
            <div className="grid grid-cols-3 gap-4 w-full max-w-[280px] mx-auto pt-2 px-4">
              {ROOM_SLOTS.slice(3).map((slot) => {
                const placed = placedItems.find((p) => p.position === slot.id);
                const item = placed ? nurseryItems.find((i) => i.id === placed.itemId) : null;
                const isDecorating = mode === "decorate";
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => {
                      if (isDecorating) {
                        if (item) {
                          removeItem(slot.id);
                          showToast("아이템을 치웠어요");
                        } else {
                          setSelectedSlot(slot.id);
                        }
                      }
                    }}
                    disabled={!isDecorating}
                    className={`${slot.size} rounded-xl flex items-center justify-center transition-all ${
                      isDecorating
                        ? "border-2 border-dashed border-primary/40 cursor-pointer hover:border-primary"
                        : "border-0 bg-transparent"
                    }`}
                  >
                    {item ? (
                      <span className="text-3xl">{item.emoji}</span>
                    ) : isDecorating ? (
                      <span className="text-xs text-foreground/50">+</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Week info badge */}
        <div className="flex items-center justify-center gap-2 mt-3 mb-1">
          <span className="text-xs bg-card border border-card-border rounded-full px-3 py-1 text-foreground font-medium">
            임신 {currentWeek}주차 · 아기는 {babyInfo.babySize} 크기 {babyInfo.babySizeEmoji}
          </span>
        </div>
      </section>

      {/* Ad reward */}
      <section className="px-5 mt-3">
        <button
          onClick={watchAd}
          disabled={adActive || todayAdCount >= maxDailyAds}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl border text-sm font-medium transition-all ${
            adActive || todayAdCount >= maxDailyAds
              ? "bg-surface border-card-border text-muted"
              : "bg-gradient-to-r from-amber-50 to-primary-lighter border-primary-light text-primary active:scale-[0.98]"
          }`}
        >
          {adActive ? (
            <>⏱️ 광고 시청 중... {adTimer}초</>
          ) : todayAdCount >= maxDailyAds ? (
            <>오늘 광고 보기를 모두 사용했어요</>
          ) : (
            <>
              <Play size={14} /> 광고 보고 +10 하트 받기
              <span className="text-xs opacity-60">({todayAdCount}/{maxDailyAds})</span>
            </>
          )}
        </button>
      </section>

      {/* Shop mode */}
      {mode === "shop" && (
        <section className="px-5 mt-4 pb-6">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-2">
            {NURSERY_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setShopCategory(cat.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1
                  ${shopCategory === cat.id
                    ? "bg-primary text-white shadow-sm"
                    : "bg-card text-muted border border-card-border"
                  }`}
              >
                <span>{cat.emoji}</span> {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            {nurseryItems
              .filter((item) => item.category === shopCategory)
              .map((item) => {
                const owned = ownedItems.includes(item.id);
                const locked = item.unlockWeek ? currentWeek < item.unlockWeek : false;
                return (
                  <div
                    key={item.id}
                    className={`bg-card rounded-2xl border border-card-border shadow-sm p-4 text-center ${locked ? "opacity-60" : ""}`}
                  >
                    <span className="text-4xl block mb-2">{item.emoji}</span>
                    <p className="text-xs font-bold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted mt-0.5 line-clamp-1">{item.description}</p>
                    {owned ? (
                      <div className="mt-2 flex items-center justify-center gap-1 text-xs text-emerald-500 font-medium">
                        <Check size={12} /> 보유 중
                      </div>
                    ) : locked ? (
                      <div className="mt-2 flex items-center justify-center gap-1 text-xs text-muted font-medium">
                        <Lock size={12} /> {item.unlockWeek}주 잠금
                      </div>
                    ) : (
                      <button
                        onClick={() => handlePurchase(item)}
                        className="mt-2 w-full py-1.5 rounded-xl bg-primary text-white text-xs font-medium flex items-center justify-center gap-1 active:scale-[0.96] transition-transform"
                      >
                        <Heart size={10} fill="currentColor" /> {item.price}
                      </button>
                    )}
                  </div>
                );
              })}
          </div>
        </section>
      )}

      {/* Decorate mode - item palette */}
      {mode === "decorate" && selectedSlot !== null && (
        <section className="px-5 mt-4 pb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-foreground">
              배치할 아이템 선택
            </p>
            <button onClick={() => setSelectedSlot(null)} className="p-1 text-muted" aria-label="닫기">
              <X size={16} />
            </button>
          </div>
          {ownedPlaceableItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-2xl mb-2">🛍️</p>
              <p className="text-xs text-muted">보유한 아이템이 없어요. 상점에서 구매해보세요!</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {ownedPlaceableItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handlePlaceItem(item.id)}
                  className="bg-card rounded-xl border border-card-border p-3 text-center active:scale-[0.95] transition-transform"
                >
                  <span className="text-2xl block">{item.emoji}</span>
                  <p className="text-[11px] text-muted mt-1 line-clamp-1">{item.name}</p>
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Decorate mode - wallpaper/floor selector */}
      {mode === "decorate" && selectedSlot === null && (
        <section className="px-5 mt-4 pb-6">
          <p className="text-sm font-bold text-foreground mb-3">
            <Paintbrush size={14} className="inline text-primary mr-1" />
            방 위의 빈 자리를 터치해서 아이템을 배치하세요
          </p>

          <p className="text-xs font-bold text-foreground mt-4 mb-2">벽지 변경</p>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-2">
            {nurseryItems
              .filter((i) => i.category === "wallpaper" && ownedItems.includes(i.id))
              .map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setWallpaper(item.id); showToast("벽지 변경!"); }}
                  className={`flex-shrink-0 w-14 h-14 rounded-xl border-2 ${item.cssClass} flex items-center justify-center transition-all ${
                    activeWallpaper === item.id ? "border-primary shadow-sm" : "border-card-border"
                  }`}
                >
                  {activeWallpaper === item.id && <Check size={16} className="text-primary" />}
                </button>
              ))}
          </div>

          <p className="text-xs font-bold text-foreground mt-4 mb-2">바닥 변경</p>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-2">
            {nurseryItems
              .filter((i) => i.category === "floor" && ownedItems.includes(i.id))
              .map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setFloor(item.id); showToast("바닥 변경!"); }}
                  className={`flex-shrink-0 w-14 h-14 rounded-xl border-2 ${item.cssClass} flex items-center justify-center transition-all ${
                    activeFloor === item.id ? "border-primary shadow-sm" : "border-card-border"
                  }`}
                >
                  {activeFloor === item.id && <Check size={16} className="text-primary" />}
                </button>
              ))}
          </div>

          <p className="text-xs font-bold text-foreground mt-4 mb-2">모빌</p>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-2">
            <button
              onClick={() => { setMobile(null); showToast("모빌 제거"); }}
              className={`flex-shrink-0 w-14 h-14 rounded-xl border-2 bg-surface flex items-center justify-center transition-all ${
                !activeMobile ? "border-primary" : "border-card-border"
              }`}
            >
              <X size={16} className="text-muted" />
            </button>
            {nurseryItems
              .filter((i) => i.category === "mobile" && ownedItems.includes(i.id))
              .map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setMobile(item.id); showToast(`${item.name} 설치!`); }}
                  className={`flex-shrink-0 w-14 h-14 rounded-xl border-2 bg-card flex items-center justify-center transition-all ${
                    activeMobile === item.id ? "border-primary shadow-sm" : "border-card-border"
                  }`}
                >
                  <span className="text-2xl">{item.emoji}</span>
                </button>
              ))}
          </div>
        </section>
      )}

      {/* View mode info */}
      {mode === "view" && (
        <section className="px-5 mt-4 pb-6">
          <div className="bg-card rounded-2xl border border-card-border shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-accent" />
              <p className="text-sm font-bold text-foreground">아기방 꾸미기 팁</p>
            </div>
            <div className="flex flex-col gap-2 text-xs text-muted">
              <p>🛍️ <span className="text-foreground font-medium">상점</span>에서 하트로 아이템을 구매하세요</p>
              <p>✨ <span className="text-foreground font-medium">꾸미기</span>에서 벽지, 바닥, 가구를 배치하세요</p>
              <p>📺 <span className="text-foreground font-medium">광고 시청</span>으로 하트를 모을 수 있어요</p>
              <p>✅ <span className="text-foreground font-medium">출산 체크리스트</span> 완료 시 +2 하트</p>
              <p>👶 아기는 <span className="text-foreground font-medium">주차가 지날수록 성장</span>해요</p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
