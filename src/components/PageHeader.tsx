"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface Props {
  title: string;
  backHref?: string;
  rightSlot?: ReactNode;
  children?: ReactNode;
}

export default function PageHeader({ title, backHref = "/", rightSlot, children }: Props) {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-5 pt-12 pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={backHref} className="p-1 -ml-1" aria-label="뒤로가기">
            <ChevronLeft size={22} className="text-foreground" />
          </Link>
          <h1 className="text-lg font-bold text-foreground">{title}</h1>
        </div>
        {rightSlot}
      </div>
      {children}
    </header>
  );
}
