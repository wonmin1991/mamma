"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  UtensilsCrossed,
  Baby,
  Lightbulb,
  Users,
  ClipboardList,
  TrendingUp,
  Shield,
  Settings2,
  type LucideIcon,
} from "lucide-react";
import { useBabyStore } from "@/store/useBabyStore";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const pregnancyNav: NavItem[] = [
  { href: "/", label: "홈", icon: Home },
  { href: "/restaurants", label: "맛집", icon: UtensilsCrossed },
  { href: "/guide", label: "가이드", icon: Baby },
  { href: "/tips", label: "꿀팁", icon: Lightbulb },
  { href: "/community", label: "나의기록", icon: Users },
];

const postnatalNav: NavItem[] = [
  { href: "/", label: "홈", icon: Home },
  { href: "/care-log", label: "육아기록", icon: ClipboardList },
  { href: "/growth", label: "성장", icon: TrendingUp },
  { href: "/vaccination", label: "접종", icon: Shield },
  { href: "/settings", label: "설정", icon: Settings2 },
];

export default function BottomNav() {
  const pathname = usePathname();
  const mode = useBabyStore((s) => s.mode);

  const navItems = mode === "postnatal" ? postnatalNav : pregnancyNav;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-card-border">
      <div className="mx-auto max-w-lg flex items-center justify-around py-2 px-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200
                ${
                  isActive
                    ? "text-primary scale-105"
                    : "text-muted-light hover:text-muted"
                }`}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.8}
                className="transition-all duration-200"
              />
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-primary" : ""
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
