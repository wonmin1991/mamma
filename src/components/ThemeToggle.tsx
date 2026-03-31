"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const setTheme = useStore((s) => s.setTheme);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading DOM state after hydration
    setMounted(true);
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
    setTheme(isDark ? "dark" : "light");
  }, [setTheme]);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("mamma-theme", next ? "dark" : "light");
    } catch { /* quota exceeded */ }
    setTheme(next ? "dark" : "light");
  };

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-full bg-card border border-card-border shadow-sm transition-all hover:scale-105 active:scale-95"
      aria-label={dark ? "라이트 모드" : "다크 모드"}
    >
      {dark ? (
        <Sun size={18} className="text-amber-400" />
      ) : (
        <Moon size={18} className="text-secondary" />
      )}
    </button>
  );
}
