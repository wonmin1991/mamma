"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react";
import { STORAGE_KEYS } from "@/lib/storage";

interface PregnancyData {
  dueDate: string | null;
  currentWeek: number;
  currentDay: number;
  daysUntilDue: number;
  isOnboarded: boolean;
}

interface PregnancyContextValue extends PregnancyData {
  setDueDate: (date: string) => void;
  setWeekDirectly: (week: number) => void;
  reset: () => void;
}

const STORAGE_KEY = STORAGE_KEYS.PREGNANCY;

function calculateFromDueDate(dueDate: string): { week: number; day: number; daysUntilDue: number } {
  const due = new Date(dueDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diffMs = due.getTime() - now.getTime();
  const daysUntilDue = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const totalDays = 280 - daysUntilDue;
  const week = Math.max(0, Math.min(40, Math.floor(totalDays / 7)));
  const day = Math.max(0, totalDays % 7);

  return { week, day, daysUntilDue: Math.max(0, daysUntilDue) };
}

const PregnancyContext = createContext<PregnancyContextValue | null>(null);

export function PregnancyProvider({ children }: { children: ReactNode }) {
  const [dueDate, setDueDateState] = useState<string | null>(null);
  const [currentWeek, setCurrentWeek] = useState(16);
  const [currentDay, setCurrentDay] = useState(0);
  const [daysUntilDue, setDaysUntilDue] = useState(0);
  const [isOnboarded, setIsOnboarded] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.dueDate) {
          const calc = calculateFromDueDate(saved.dueDate);
          /* eslint-disable react-hooks/set-state-in-effect -- client-only localStorage hydration */
          setDueDateState(saved.dueDate);
          setCurrentWeek(calc.week);
          setCurrentDay(calc.day);
          setDaysUntilDue(calc.daysUntilDue);
          setIsOnboarded(true);
        } else if (saved.manualWeek) {
          setCurrentWeek(saved.manualWeek);
          setCurrentDay(0);
          setDaysUntilDue((40 - saved.manualWeek) * 7);
          setIsOnboarded(true);
        }
      } else {
        setIsOnboarded(false);
      }
    } catch {
      setIsOnboarded(false);
    }
    setLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const setDueDate = useCallback((date: string) => {
    const calc = calculateFromDueDate(date);
    setDueDateState(date);
    setCurrentWeek(calc.week);
    setCurrentDay(calc.day);
    setDaysUntilDue(calc.daysUntilDue);
    setIsOnboarded(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ dueDate: date }));
  }, []);

  const setWeekDirectly = useCallback((week: number) => {
    setDueDateState(null);
    setCurrentWeek(week);
    setCurrentDay(0);
    const remaining = (40 - week) * 7;
    setDaysUntilDue(remaining);
    setIsOnboarded(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ manualWeek: week }));
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setDueDateState(null);
    setCurrentWeek(16);
    setCurrentDay(0);
    setDaysUntilDue(0);
    setIsOnboarded(false);
  }, []);

  const value = useMemo(
    () => ({ dueDate, currentWeek, currentDay, daysUntilDue, isOnboarded, setDueDate, setWeekDirectly, reset }),
    [dueDate, currentWeek, currentDay, daysUntilDue, isOnboarded, setDueDate, setWeekDirectly, reset]
  );

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <PregnancyContext.Provider value={value}>
      {children}
    </PregnancyContext.Provider>
  );
}

export function usePregnancy() {
  const ctx = useContext(PregnancyContext);
  if (!ctx) throw new Error("usePregnancy must be used within PregnancyProvider");
  return ctx;
}
