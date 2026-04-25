"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

export default function AIChatFab() {
  const pathname = usePathname();
  if (pathname?.startsWith("/chat") || pathname === "/login") return null;

  return (
    <Link
      href="/chat"
      aria-label="AI 상담"
      className="fixed bottom-20 right-4 z-40 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition"
    >
      <Sparkles size={20} />
    </Link>
  );
}
