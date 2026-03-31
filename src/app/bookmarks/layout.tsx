import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "저장한 정보",
  description: "북마크한 맛집과 꿀팁을 모아보세요.",
};

export default function BookmarksLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
