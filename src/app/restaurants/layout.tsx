import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "임산부 맛집",
  description:
    "서울·경기·인천 임산부 추천 맛집 모음. 저염식, 유기농, 개인실 등 임산부 친화 맛집을 찾아보세요.",
  openGraph: {
    title: "임산부 맛집 — 맘마",
    description: "서울·경기·인천 임산부 추천 맛집 모음. 저염식, 유기농, 개인실 등 임산부 친화 맛집을 찾아보세요.",
  },
};

export default function RestaurantsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
