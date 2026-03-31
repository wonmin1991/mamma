"use client";

import type { MouseEvent } from "react";
import { useStore } from "@/store/useStore";
import { Bookmark } from "lucide-react";

interface BookmarkButtonProps {
  itemId: string;
  itemType: "restaurant" | "tip";
  size?: number;
}

export default function BookmarkButton({
  itemId,
  itemType,
  size = 20,
}: BookmarkButtonProps) {
  const toggleBookmark = useStore((s) => s.toggleBookmark);
  const saved = useStore((s) => s.isBookmarked(itemId, itemType));

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(itemId, itemType);
  };

  return (
    <button
      onClick={handleClick}
      className={`p-1.5 rounded-full transition-all duration-200 ${
        saved
          ? "text-primary bg-primary-light scale-110"
          : "text-muted-light hover:text-primary hover:bg-primary-light"
      }`}
      aria-label={saved ? "북마크 해제" : "북마크"}
    >
      <Bookmark
        size={size}
        fill={saved ? "currentColor" : "none"}
        strokeWidth={1.8}
      />
    </button>
  );
}
