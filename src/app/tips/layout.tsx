import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "임산부 꿀팁",
  description: "영양, 운동, 마음건강, 병원, 용품 등 임산부를 위한 건강 꿀팁 모음.",
  openGraph: {
    title: "임산부 꿀팁 — 맘마",
    description: "영양, 운동, 마음건강, 병원, 용품 등 임산부를 위한 건강 꿀팁 모음.",
  },
};

export default function TipsLayout({ children }: { children: ReactNode }) {
  return children;
}
