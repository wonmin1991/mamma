"use client";

import Link from "next/link";
import { Star, Heart, Trash2, MessageSquare, Check, X } from "lucide-react";

interface BookmarkCardProps {
  bookmarkId: string;
  itemType: "restaurant" | "tip";
  index: number;
  memo?: string;
  editingMemo: string | null;
  memoText: string;
  onMemoEdit: (bookmarkId: string, currentMemo: string) => void;
  onMemoSave: (bookmarkId: string, text: string) => void;
  onMemoCancel: () => void;
  onMemoTextChange: (text: string) => void;
  onRemove: (bookmarkId: string) => void;
  item: {
    id: number | string;
    name?: string;
    title?: string;
    emoji: string;
    rating?: number;
    area?: string;
    likes?: number;
    gradient?: string;
  } | null;
}

export default function BookmarkCard({
  bookmarkId,
  itemType,
  index,
  memo,
  editingMemo,
  memoText,
  onMemoEdit,
  onMemoSave,
  onMemoCancel,
  onMemoTextChange,
  onRemove,
  item,
}: BookmarkCardProps) {
  if (!item) {
    return (
      <div className="bg-card rounded-2xl border border-card-border shadow-sm p-4 flex items-center justify-between">
        <p className="text-xs text-muted">삭제된 {itemType === "restaurant" ? "맛집" : "꿀팁"}입니다</p>
        <button onClick={() => onRemove(bookmarkId)} className="p-2 text-muted-light hover:text-red-400 transition-colors" aria-label="북마크 삭제">
          <Trash2 size={16} />
        </button>
      </div>
    );
  }

  const isRestaurant = itemType === "restaurant";
  const href = isRestaurant ? `/restaurants/${item.id}` : `/tips/${item.id}`;
  const label = item.name ?? item.title ?? "";
  const badgeBg = isRestaurant ? "bg-surface-rose" : "bg-surface-violet";
  const badgeText = isRestaurant ? "text-primary" : "text-secondary";
  const badgeLabel = isRestaurant ? "맛집" : "꿀팁";
  const gradientClass = isRestaurant
    ? "bg-gradient-to-br from-surface-rose to-surface-amber"
    : `bg-gradient-to-br ${item.gradient ?? "from-surface-violet to-surface-sky"}`;

  return (
    <div
      className="bg-card rounded-2xl border border-card-border shadow-sm p-4 animate-fade-in-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex gap-4 items-start">
        <Link href={href} className="flex gap-4 items-start flex-1 min-w-0">
          <div className={`w-14 h-14 rounded-xl ${gradientClass} flex items-center justify-center flex-shrink-0`}>
            <span className="text-2xl">{item.emoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className={`text-xs px-2 py-0.5 rounded-full ${badgeBg} ${badgeText} font-medium`}>{badgeLabel}</span>
            <h3 className="font-semibold text-sm text-foreground mt-1 line-clamp-2">{label}</h3>
            {isRestaurant && item.rating != null && (
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted flex items-center gap-0.5">
                  <Star size={10} className="text-amber-400" fill="currentColor" />{item.rating}
                </span>
                {item.area && <span className="text-xs text-muted">{item.area}</span>}
              </div>
            )}
            {!isRestaurant && item.likes != null && (
              <span className="text-xs text-muted flex items-center gap-0.5 mt-0.5">
                <Heart size={10} /> {item.likes.toLocaleString()}
              </span>
            )}
          </div>
        </Link>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => onMemoEdit(bookmarkId, memo || "")}
            className="p-2 text-muted-light hover:text-primary transition-colors"
            aria-label="메모 작성"
          >
            <MessageSquare size={16} />
          </button>
          <button onClick={() => onRemove(bookmarkId)} className="p-2 text-muted-light hover:text-red-400 transition-colors" aria-label="북마크 삭제">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      {memo && editingMemo !== bookmarkId && (
        <p className="mt-2 ml-[72px] text-xs text-muted bg-surface rounded-lg px-3 py-2">{memo}</p>
      )}
      {editingMemo === bookmarkId && (
        <div className="mt-2 ml-[72px] flex gap-2">
          <input
            type="text"
            value={memoText}
            onChange={(e) => onMemoTextChange(e.target.value)}
            placeholder="왜 저장했는지 메모..."
            className="flex-1 px-3 py-2 rounded-lg bg-surface border border-card-border text-xs text-foreground focus:outline-none focus:border-primary"
            autoFocus
          />
          <button
            onClick={() => onMemoSave(bookmarkId, memoText)}
            className="p-2 text-primary"
            aria-label="메모 저장"
          >
            <Check size={16} />
          </button>
          <button onClick={onMemoCancel} className="p-2 text-muted" aria-label="메모 취소">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
