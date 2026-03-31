import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "설정",
  description: "앱 설정, 데이터 관리, 출산예정일 변경 등.",
};

export default function SettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
