import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "아기방 꾸미기",
  description: "하트를 모아 아기방을 꾸며보세요. 벽지, 바닥, 가구, 모빌까지 나만의 공간을 만들어요.",
};

export default function NurseryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
