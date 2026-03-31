"use client";

import { usePregnancy } from "@/contexts/PregnancyContext";
import { useEffect, useRef } from "react";

interface Props {
  onWeekReady: (weekIdx: number) => void;
}

export default function GuideWeekSync({ onWeekReady }: Props) {
  const { currentWeek } = usePregnancy();
  const prevWeek = useRef<number | null>(null);

  useEffect(() => {
    const weekIdx = Math.max(0, Math.min(39, currentWeek - 1));
    if (prevWeek.current !== currentWeek) {
      prevWeek.current = currentWeek;
      onWeekReady(weekIdx);
    }
  }, [currentWeek, onWeekReady]);

  return null;
}
