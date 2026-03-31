import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "검색",
  description: "맛집, 꿀팁, 주차별 가이드를 한번에 검색하세요.",
};

export default function SearchLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <Suspense>{children}</Suspense>;
}
