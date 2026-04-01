"use client";

import { useState, useCallback } from "react";
import { restaurants, tips } from "@/data/mock";
import { ChevronLeft, BookmarkX } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import BookmarkCard from "@/components/BookmarkCard";

export default function BookmarksPage() {
  const bookmarks = useStore((s) => s.bookmarks);
  const removeBookmark = useStore((s) => s.removeBookmark);
  const updateBookmarkMemo = useStore((s) => s.updateBookmarkMemo);
  const [activeTab, setActiveTab] = useState<"all" | "restaurant" | "tip">("all");
  const [editingMemo, setEditingMemo] = useState<string | null>(null);
  const [memoText, setMemoText] = useState("");

  const filteredBookmarks = bookmarks.filter(
    (b) => activeTab === "all" || b.itemType === activeTab
  );

  const getItem = useCallback((itemId: string, itemType: "restaurant" | "tip") => {
    if (itemType === "restaurant") {
      const r = restaurants.find((r) => String(r.id) === itemId);
      if (!r) return null;
      return { id: r.id, name: r.name, emoji: r.emoji, rating: r.rating, area: r.area };
    }
    const t = tips.find((t) => String(t.id) === itemId);
    if (!t) return null;
    return { id: t.id, title: t.title, emoji: t.emoji, likes: t.likes, gradient: t.gradient };
  }, []);

  const handleMemoEdit = useCallback((bookmarkId: string, currentMemo: string) => {
    setEditingMemo(bookmarkId);
    setMemoText(currentMemo);
  }, []);

  const handleMemoSave = useCallback((bookmarkId: string, text: string) => {
    updateBookmarkMemo(bookmarkId, text);
    setEditingMemo(null);
  }, [updateBookmarkMemo]);

  const handleMemoCancel = useCallback(() => setEditingMemo(null), []);

  return (
    <main className="flex flex-col">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-5 pt-12 pb-3">
        <div className="flex items-center gap-2">
          <Link href="/" className="p-1 -ml-1" aria-label="뒤로가기">
            <ChevronLeft size={22} className="text-foreground" />
          </Link>
          <h1 className="text-lg font-bold text-foreground">저장한 정보</h1>
        </div>

        <div className="flex gap-2 mt-3">
          {([
            { id: "all" as const, label: "전체" },
            { id: "restaurant" as const, label: "맛집" },
            { id: "tip" as const, label: "꿀팁" },
          ]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all
                ${activeTab === tab.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-card text-muted border border-card-border"
                }`}
            >
              {tab.label}
              {tab.id !== "all" && (
                <span className="ml-1">{bookmarks.filter((b) => b.itemType === tab.id).length}</span>
              )}
            </button>
          ))}
        </div>
      </header>

      <section className="px-5 mt-3 pb-6">
        {filteredBookmarks.length === 0 ? (
          <div className="text-center py-20">
            <BookmarkX size={48} className="text-muted-light mx-auto mb-4" />
            <p className="text-sm font-medium text-foreground">저장한 정보가 없어요</p>
            <p className="text-xs text-muted mt-1 mb-4">맛집이나 꿀팁에서 북마크 아이콘을 눌러보세요</p>
            <Link href="/" className="inline-flex px-5 py-2.5 rounded-full bg-primary text-white text-sm font-medium">
              둘러보기
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredBookmarks.map((bookmark, i) => (
              <BookmarkCard
                key={bookmark.id}
                bookmarkId={bookmark.id}
                itemType={bookmark.itemType}
                index={i}
                memo={bookmark.memo}
                editingMemo={editingMemo}
                memoText={memoText}
                onMemoEdit={handleMemoEdit}
                onMemoSave={handleMemoSave}
                onMemoCancel={handleMemoCancel}
                onMemoTextChange={setMemoText}
                onRemove={removeBookmark}
                item={getItem(bookmark.itemId, bookmark.itemType)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
