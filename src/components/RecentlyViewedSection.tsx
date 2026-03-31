"use client";

import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Clock } from "lucide-react";

const TYPE_LABELS: Record<string, string> = {
  restaurant: "맛집",
  tip: "꿀팁",
  guide: "가이드",
};

function typeLabel(type: string) {
  return TYPE_LABELS[type] ?? type;
}

export default function RecentlyViewedSection() {
  const recentlyViewed = useStore((s) => s.recentlyViewed);

  if (recentlyViewed.length === 0) return null;

  const items = recentlyViewed.slice(0, 6);

  return (
    <section className="mt-5 px-5">
      <div className="flex items-center gap-1.5 mb-3">
        <Clock size={14} className="text-muted" />
        <h2 className="text-sm font-bold text-foreground">최근 본 항목</h2>
      </div>

      <div className="scroll-fade">
        <div className="flex gap-2.5 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-2">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex-shrink-0 flex items-center gap-2.5 bg-card rounded-xl border border-card-border px-3 py-2.5 hover:border-primary/40 transition-colors"
            >
              <span className="text-lg">{item.emoji}</span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground line-clamp-1 max-w-[120px]">
                  {item.title}
                </p>
                <p className="text-xs text-muted">
                  {typeLabel(item.type)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
