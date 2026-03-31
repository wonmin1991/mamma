import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "주차별 가이드",
  description:
    "임신 1주부터 40주까지, 아기 발달과 엄마 몸의 변화, 추천 음식 정보를 주차별로 확인하세요.",
  openGraph: {
    title: "주차별 가이드 — 맘마",
    description: "임신 1주부터 40주까지, 아기 발달과 엄마 몸의 변화, 추천 음식 정보를 주차별로 확인하세요.",
  },
};

export default function GuideLayout({ children }: { children: ReactNode }) {
  return <Suspense>{children}</Suspense>;
}
