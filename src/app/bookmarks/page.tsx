"use client";

import { useState } from "react";
import { restaurants, tips } from "@/data/mock";
import { ChevronLeft, Star, Heart, Trash2, BookmarkX, MessageSquare, Check, X } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/store/useStore";

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

  const getRestaurant = (id: string) => restaurants.find((r) => String(r.id) === id);
  const getTip = (id: string) => tips.find((t) => String(t.id) === id);

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
            {filteredBookmarks.map((bookmark, i) => {
              if (bookmark.itemType === "restaurant") {
                const r = getRestaurant(bookmark.itemId);
                if (!r) {
                  return (
                    <div key={bookmark.id} className="bg-card rounded-2xl border border-card-border shadow-sm p-4 flex items-center justify-between">
                      <p className="text-xs text-muted">삭제된 맛집입니다</p>
                      <button onClick={() => removeBookmark(bookmark.id)} className="p-2 text-muted-light hover:text-red-400 transition-colors" aria-label="북마크 삭제">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                }
                return (
                  <div
                    key={bookmark.id}
                    className="bg-card rounded-2xl border border-card-border shadow-sm p-4 animate-fade-in-up"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="flex gap-4 items-start">
                      <Link href={`/restaurants/${r.id}`} className="flex gap-4 items-start flex-1 min-w-0">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-surface-rose to-surface-amber flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">{r.emoji}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-surface-rose text-primary font-medium">맛집</span>
                          <h3 className="font-semibold text-sm text-foreground mt-1">{r.name}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-muted flex items-center gap-0.5">
                              <Star size={10} className="text-amber-400" fill="currentColor" />{r.rating}
                            </span>
                            <span className="text-xs text-muted">{r.area}</span>
                          </div>
                        </div>
                      </Link>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => { setEditingMemo(bookmark.id); setMemoText(bookmark.memo || ""); }}
                          className="p-2 text-muted-light hover:text-primary transition-colors"
                          aria-label="메모 작성"
                        >
                          <MessageSquare size={16} />
                        </button>
                        <button onClick={() => removeBookmark(bookmark.id)} className="p-2 text-muted-light hover:text-red-400 transition-colors" aria-label="북마크 삭제">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    {bookmark.memo && editingMemo !== bookmark.id && (
                      <p className="mt-2 ml-[72px] text-xs text-muted bg-surface rounded-lg px-3 py-2">{bookmark.memo}</p>
                    )}
                    {editingMemo === bookmark.id && (
                      <div className="mt-2 ml-[72px] flex gap-2">
                        <input
                          type="text"
                          value={memoText}
                          onChange={(e) => setMemoText(e.target.value)}
                          placeholder="왜 저장했는지 메모..."
                          className="flex-1 px-3 py-2 rounded-lg bg-surface border border-card-border text-xs text-foreground focus:outline-none focus:border-primary"
                          autoFocus
                        />
                        <button
                          onClick={() => { updateBookmarkMemo(bookmark.id, memoText); setEditingMemo(null); }}
                          className="p-2 text-primary"
                          aria-label="메모 저장"
                        >
                          <Check size={16} />
                        </button>
                        <button onClick={() => setEditingMemo(null)} className="p-2 text-muted" aria-label="메모 취소">
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              } else {
                const t = getTip(bookmark.itemId);
                if (!t) {
                  return (
                    <div key={bookmark.id} className="bg-card rounded-2xl border border-card-border shadow-sm p-4 flex items-center justify-between">
                      <p className="text-xs text-muted">삭제된 꿀팁입니다</p>
                      <button onClick={() => removeBookmark(bookmark.id)} className="p-2 text-muted-light hover:text-red-400 transition-colors" aria-label="북마크 삭제">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                }
                return (
                  <div
                    key={bookmark.id}
                    className="bg-card rounded-2xl border border-card-border shadow-sm p-4 animate-fade-in-up"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="flex gap-4 items-start">
                      <Link href={`/tips/${t.id}`} className="flex gap-4 items-start flex-1 min-w-0">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${t.gradient} flex items-center justify-center flex-shrink-0`}>
                          <span className="text-2xl">{t.emoji}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-surface-violet text-secondary font-medium">꿀팁</span>
                          <h3 className="font-semibold text-sm text-foreground mt-1 line-clamp-2">{t.title}</h3>
                          <span className="text-xs text-muted flex items-center gap-0.5 mt-0.5">
                            <Heart size={10} /> {t.likes.toLocaleString()}
                          </span>
                        </div>
                      </Link>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => { setEditingMemo(bookmark.id); setMemoText(bookmark.memo || ""); }}
                          className="p-2 text-muted-light hover:text-primary transition-colors"
                          aria-label="메모 작성"
                        >
                          <MessageSquare size={16} />
                        </button>
                        <button onClick={() => removeBookmark(bookmark.id)} className="p-2 text-muted-light hover:text-red-400 transition-colors" aria-label="북마크 삭제">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    {bookmark.memo && editingMemo !== bookmark.id && (
                      <p className="mt-2 ml-[72px] text-xs text-muted bg-surface rounded-lg px-3 py-2">{bookmark.memo}</p>
                    )}
                    {editingMemo === bookmark.id && (
                      <div className="mt-2 ml-[72px] flex gap-2">
                        <input
                          type="text"
                          value={memoText}
                          onChange={(e) => setMemoText(e.target.value)}
                          placeholder="왜 저장했는지 메모..."
                          className="flex-1 px-3 py-2 rounded-lg bg-surface border border-card-border text-xs text-foreground focus:outline-none focus:border-primary"
                          autoFocus
                        />
                        <button
                          onClick={() => { updateBookmarkMemo(bookmark.id, memoText); setEditingMemo(null); }}
                          className="p-2 text-primary"
                          aria-label="메모 저장"
                        >
                          <Check size={16} />
                        </button>
                        <button onClick={() => setEditingMemo(null)} className="p-2 text-muted" aria-label="메모 취소">
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              }
            })}
          </div>
        )}
      </section>
    </main>
  );
}
