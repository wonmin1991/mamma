import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "커뮤니티",
  description: "임산부들의 맛집 추천, 꿀팁 공유, 질문과 후기를 나누는 커뮤니티.",
  openGraph: {
    title: "커뮤니티 — 맘마",
    description: "임산부들의 맛집 추천, 꿀팁 공유, 질문과 후기를 나누는 커뮤니티.",
  },
};

export default function CommunityLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
