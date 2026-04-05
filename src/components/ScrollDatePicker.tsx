"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface ScrollDatePickerProps {
  value: string; // "YYYY-MM-DD"
  onChange: (date: string) => void;
  minYear?: number;
  maxYear?: number;
}

const ITEM_HEIGHT = 40;
const VISIBLE_COUNT = 5;
const CENTER_INDEX = Math.floor(VISIBLE_COUNT / 2);

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

// ─── Single Column Wheel ────────────────────────────────

interface WheelColumnProps {
  items: { value: number; label: string }[];
  selected: number;
  onSelect: (value: number) => void;
}

function WheelColumn({ items, selected, onSelect }: WheelColumnProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedIdx = items.findIndex((i) => i.value === selected);

  // Scroll to selected item on mount / change
  useEffect(() => {
    if (isScrollingRef.current) return;
    const el = containerRef.current;
    if (!el) return;
    const target = selectedIdx * ITEM_HEIGHT;
    el.scrollTo({ top: target, behavior: "smooth" });
  }, [selectedIdx]);

  const handleScroll = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    isScrollingRef.current = true;

    timeoutRef.current = setTimeout(() => {
      const el = containerRef.current;
      if (!el) return;

      // Snap to closest item
      const idx = Math.round(el.scrollTop / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(items.length - 1, idx));
      el.scrollTo({ top: clamped * ITEM_HEIGHT, behavior: "smooth" });

      if (items[clamped] && items[clamped].value !== selected) {
        onSelect(items[clamped].value);
      }

      setTimeout(() => {
        isScrollingRef.current = false;
      }, 100);
    }, 80);
  }, [items, selected, onSelect]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const paddingHeight = CENTER_INDEX * ITEM_HEIGHT;

  return (
    <div className="relative flex-1 overflow-hidden" style={{ height: VISIBLE_COUNT * ITEM_HEIGHT }}>
      {/* Selection highlight */}
      <div
        className="absolute left-0 right-0 bg-primary/10 rounded-xl pointer-events-none z-10 border-y border-primary/20"
        style={{ top: CENTER_INDEX * ITEM_HEIGHT, height: ITEM_HEIGHT }}
      />

      {/* Fade masks */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-card to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent z-20 pointer-events-none" />

      {/* Scrollable list */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto hide-scrollbar snap-y snap-mandatory"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {/* Top padding */}
        <div style={{ height: paddingHeight }} />

        {items.map((item) => {
          const isSelected = item.value === selected;
          return (
            <div
              key={item.value}
              className={`flex items-center justify-center transition-all duration-150 snap-center ${
                isSelected
                  ? "text-foreground font-bold text-lg"
                  : "text-muted text-sm"
              }`}
              style={{ height: ITEM_HEIGHT }}
            >
              {item.label}
            </div>
          );
        })}

        {/* Bottom padding */}
        <div style={{ height: paddingHeight }} />
      </div>
    </div>
  );
}

// ─── Date Picker ────────────────────────────────────────

export default function ScrollDatePicker({
  value,
  onChange,
  minYear = new Date().getFullYear(),
  maxYear = new Date().getFullYear() + 2,
}: ScrollDatePickerProps) {
  const parsed = value ? new Date(value) : new Date();
  const initYear = parsed.getFullYear();
  const initMonth = parsed.getMonth() + 1;
  const initDay = parsed.getDate();

  const [year, setYear] = useState(initYear >= minYear && initYear <= maxYear ? initYear : new Date().getFullYear());
  const [month, setMonth] = useState(initMonth);
  const [day, setDay] = useState(initDay);

  const daysInMonth = getDaysInMonth(year, month);

  // Clamp day when month/year changes
  useEffect(() => {
    if (day > daysInMonth) {
      setDay(daysInMonth);
    }
  }, [day, daysInMonth]);

  // Emit change
  useEffect(() => {
    const clampedDay = Math.min(day, daysInMonth);
    const dateStr = `${year}-${pad(month)}-${pad(clampedDay)}`;
    onChange(dateStr);
  }, [year, month, day, daysInMonth, onChange]);

  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => ({ value: minYear + i, label: `${minYear + i}년` })
  );

  const months = Array.from(
    { length: 12 },
    (_, i) => ({ value: i + 1, label: `${i + 1}월` })
  );

  const days = Array.from(
    { length: daysInMonth },
    (_, i) => ({ value: i + 1, label: `${i + 1}일` })
  );

  return (
    <div className="flex gap-1 w-full bg-card rounded-2xl border border-card-border p-2">
      <WheelColumn items={years} selected={year} onSelect={setYear} />
      <WheelColumn items={months} selected={month} onSelect={setMonth} />
      <WheelColumn items={days} selected={day} onSelect={setDay} />
    </div>
  );
}
