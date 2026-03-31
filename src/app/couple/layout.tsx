import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "부부 모드",
  description: "함께 출산을 준비하세요. 메시지, 체크리스트로 부부가 함께하는 임신 생활.",
};

export default function CoupleLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
