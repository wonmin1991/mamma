import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BookmarkItem {
  id: string;
  itemId: string;
  itemType: "restaurant" | "tip";
  savedAt: string;
  memo?: string;
}

interface RecentlyViewedItem {
  id: string;
  type: "restaurant" | "tip" | "guide";
  title: string;
  emoji: string;
  href: string;
  viewedAt: string;
}

interface PartnerProfile {
  name: string;
  role: "mom" | "dad";
  emoji: string;
}

interface CoupleMessage {
  id: number;
  from: "mom" | "dad";
  text: string;
  createdAt: string;
  emoji?: string;
}

interface PlacedItem {
  itemId: string;
  position: number;
}

interface AppState {
  // Hydration
  _hydrated: boolean;

  // Bookmarks
  bookmarks: BookmarkItem[];
  toggleBookmark: (itemId: string, itemType: "restaurant" | "tip") => void;
  isBookmarked: (itemId: string, itemType: "restaurant" | "tip") => boolean;
  removeBookmark: (compositeId: string) => void;
  updateBookmarkMemo: (compositeId: string, memo: string) => void;

  // Recently Viewed
  recentlyViewed: RecentlyViewedItem[];
  addRecentlyViewed: (item: Omit<RecentlyViewedItem, "viewedAt">) => void;

  // Likes
  likedPosts: number[];
  togglePostLike: (postId: number) => void;
  isPostLiked: (postId: number) => boolean;

  // Benefit Checklist
  benefitChecked: string[];
  toggleBenefitCheck: (itemId: string) => void;
  isBenefitChecked: (itemId: string) => boolean;

  // Supplements
  supplementChecks: Record<string, string[]>; // { "2026-04-05": ["folic-acid", "iron"] }
  toggleSupplementCheck: (supplementId: string) => void;
  isSupplementChecked: (supplementId: string) => boolean;
  getTodayCheckedCount: () => number;

  // Widgets
  activeWidgets: string[];
  setActiveWidgets: (widgets: string[]) => void;
  toggleWidget: (widgetId: string) => void;

  // Theme
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;

  // Currency (Hearts)
  hearts: number;
  totalHeartsEarned: number;
  lastDailyReward: string | null;
  dailyStreak: number;
  addHearts: (amount: number, reason: string) => void;
  spendHearts: (amount: number) => boolean;
  claimDailyReward: () => number;
  canClaimDaily: () => boolean;

  // Couple Mode
  coupleEnabled: boolean;
  partners: PartnerProfile[];
  activePartner: "mom" | "dad";
  coupleMessages: CoupleMessage[];
  coupleCode: string | null;
  checkedItems: string[];
  enableCouple: (momName: string, dadName: string) => void;
  switchPartner: () => void;
  addCoupleMessage: (text: string, emoji?: string) => void;
  toggleCheckItem: (itemId: string) => void;

  // Nursery
  ownedItems: string[];
  placedItems: PlacedItem[];
  activeWallpaper: string;
  activeFloor: string;
  activeMobile: string | null;
  purchaseItem: (itemId: string, price: number) => boolean;
  placeItem: (itemId: string, position: number) => void;
  removeItem: (position: number) => void;
  setWallpaper: (itemId: string) => void;
  setFloor: (itemId: string) => void;
  setMobile: (itemId: string | null) => void;
}

function generateCode() {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(36)).join("").substring(0, 6).toUpperCase();
}

function getToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // --- Hydration ---
      _hydrated: false,

      // --- Bookmarks ---
      bookmarks: [],
      toggleBookmark: (itemId, itemType) => {
        const key = `${itemType}-${itemId}`;
        const exists = get().bookmarks.some((b) => b.id === key);
        if (exists) {
          set({ bookmarks: get().bookmarks.filter((b) => b.id !== key) });
        } else {
          set({
            bookmarks: [
              ...get().bookmarks,
              { id: key, itemId, itemType, savedAt: new Date().toISOString() },
            ],
          });
        }
      },
      isBookmarked: (itemId, itemType) => {
        return get().bookmarks.some((b) => b.id === `${itemType}-${itemId}`);
      },
      removeBookmark: (compositeId) => {
        set({ bookmarks: get().bookmarks.filter((b) => b.id !== compositeId) });
      },
      updateBookmarkMemo: (compositeId, memo) => {
        set({
          bookmarks: get().bookmarks.map((b) =>
            b.id === compositeId ? { ...b, memo } : b
          ),
        });
      },

      // --- Recently Viewed ---
      recentlyViewed: [],
      addRecentlyViewed: (item) => {
        const existing = get().recentlyViewed.filter((v) => v.id !== item.id);
        const entry: RecentlyViewedItem = { ...item, viewedAt: new Date().toISOString() };
        set({ recentlyViewed: [entry, ...existing].slice(0, 20) });
      },

      // --- Likes ---
      likedPosts: [],
      togglePostLike: (postId) => {
        const liked = get().likedPosts;
        if (liked.includes(postId)) {
          set({ likedPosts: liked.filter((id) => id !== postId) });
        } else {
          set({ likedPosts: [...liked, postId] });
        }
      },
      isPostLiked: (postId) => get().likedPosts.includes(postId),

      // --- Benefit Checklist ---
      benefitChecked: [],
      toggleBenefitCheck: (itemId) => {
        const checked = get().benefitChecked;
        if (checked.includes(itemId)) {
          set({ benefitChecked: checked.filter((id) => id !== itemId) });
        } else {
          set({
            benefitChecked: [...checked, itemId],
            hearts: get().hearts + 1,
            totalHeartsEarned: get().totalHeartsEarned + 1,
          });
        }
      },
      isBenefitChecked: (itemId) => get().benefitChecked.includes(itemId),

      // --- Supplements ---
      supplementChecks: {},
      toggleSupplementCheck: (supplementId) => {
        const today = getToday();
        const checks = { ...get().supplementChecks };
        const todayChecks = checks[today] ?? [];
        if (todayChecks.includes(supplementId)) {
          checks[today] = todayChecks.filter((id) => id !== supplementId);
        } else {
          checks[today] = [...todayChecks, supplementId];
        }
        set({ supplementChecks: checks });
      },
      isSupplementChecked: (supplementId) => {
        const today = getToday();
        return (get().supplementChecks[today] ?? []).includes(supplementId);
      },
      getTodayCheckedCount: () => {
        const today = getToday();
        return (get().supplementChecks[today] ?? []).length;
      },

      // --- Widgets ---
      activeWidgets: ["todayTodo", "dday", "weekBenefit", "benefitCalc", "supplements", "checkup", "quickTip"],
      setActiveWidgets: (widgets) => set({ activeWidgets: widgets }),
      toggleWidget: (widgetId) => {
        const current = get().activeWidgets;
        if (current.includes(widgetId)) {
          set({ activeWidgets: current.filter((id) => id !== widgetId) });
        } else {
          set({ activeWidgets: [...current, widgetId] });
        }
      },

      // --- Theme ---
      theme: "system",
      setTheme: (theme) => set({ theme }),

      // --- Currency ---
      hearts: 50,
      totalHeartsEarned: 50,
      lastDailyReward: null,
      dailyStreak: 0,
      addHearts: (amount) => {
        set({
          hearts: get().hearts + amount,
          totalHeartsEarned: get().totalHeartsEarned + amount,
        });
      },
      spendHearts: (amount) => {
        if (get().hearts < amount) return false;
        set({ hearts: get().hearts - amount });
        return true;
      },
      claimDailyReward: () => {
        const today = getToday();
        if (get().lastDailyReward === today) return 0;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        const newStreak = get().lastDailyReward === yesterdayStr ? get().dailyStreak + 1 : 1;
        const bonus = Math.min(newStreak, 7) * 2;
        const reward = 5 + bonus;

        set({
          hearts: get().hearts + reward,
          totalHeartsEarned: get().totalHeartsEarned + reward,
          lastDailyReward: today,
          dailyStreak: newStreak,
        });
        return reward;
      },
      canClaimDaily: () => get().lastDailyReward !== getToday(),

      // --- Couple ---
      coupleEnabled: false,
      partners: [],
      activePartner: "mom",
      coupleMessages: [],
      coupleCode: null,
      checkedItems: [],
      enableCouple: (momName, dadName) => {
        set({
          coupleEnabled: true,
          partners: [
            { name: momName, role: "mom", emoji: "🤰" },
            { name: dadName, role: "dad", emoji: "🧑" },
          ],
          coupleCode: generateCode(),
        });
      },
      switchPartner: () => {
        set({ activePartner: get().activePartner === "mom" ? "dad" : "mom" });
      },
      addCoupleMessage: (text, emoji) => {
        const msg: CoupleMessage = {
          id: Date.now(),
          from: get().activePartner,
          text,
          createdAt: new Date().toISOString(),
          emoji,
        };
        set({ coupleMessages: [msg, ...get().coupleMessages].slice(0, 100) });
      },
      toggleCheckItem: (itemId) => {
        const checked = get().checkedItems;
        if (checked.includes(itemId)) {
          set({ checkedItems: checked.filter((id) => id !== itemId) });
        } else {
          set({
            checkedItems: [...checked, itemId],
            hearts: get().hearts + 2,
            totalHeartsEarned: get().totalHeartsEarned + 2,
          });
        }
      },

      // --- Nursery ---
      ownedItems: ["wp-cream", "fl-wood"],
      placedItems: [],
      activeWallpaper: "wp-cream",
      activeFloor: "fl-wood",
      activeMobile: null,
      purchaseItem: (itemId, price) => {
        if (get().hearts < price || get().ownedItems.includes(itemId)) return false;
        set({
          hearts: get().hearts - price,
          ownedItems: [...get().ownedItems, itemId],
        });
        return true;
      },
      placeItem: (itemId, position) => {
        const placed = get().placedItems.filter((p) => p.position !== position);
        placed.push({ itemId, position });
        set({ placedItems: placed });
      },
      removeItem: (position) => {
        set({ placedItems: get().placedItems.filter((p) => p.position !== position) });
      },
      setWallpaper: (itemId) => set({ activeWallpaper: itemId }),
      setFloor: (itemId) => set({ activeFloor: itemId }),
      setMobile: (itemId) => set({ activeMobile: itemId }),
    }),
    {
      name: "mamma-store",
      onRehydrateStorage: () => (state) => {
        if (state) state._hydrated = true;
      },
      partialize: (state) => ({
        bookmarks: state.bookmarks,
        recentlyViewed: state.recentlyViewed,
        likedPosts: state.likedPosts,
        hearts: state.hearts,
        totalHeartsEarned: state.totalHeartsEarned,
        lastDailyReward: state.lastDailyReward,
        dailyStreak: state.dailyStreak,
        coupleEnabled: state.coupleEnabled,
        partners: state.partners,
        activePartner: state.activePartner,
        coupleMessages: state.coupleMessages,
        coupleCode: state.coupleCode,
        checkedItems: state.checkedItems,
        benefitChecked: state.benefitChecked,
        supplementChecks: state.supplementChecks,
        activeWidgets: state.activeWidgets,
        ownedItems: state.ownedItems,
        placedItems: state.placedItems,
        activeWallpaper: state.activeWallpaper,
        activeFloor: state.activeFloor,
        activeMobile: state.activeMobile,
      }),
    }
  )
);
