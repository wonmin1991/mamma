import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BASE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "임산부/육아 혜택",
  description:
    "지역별 임산부·출산·육아 정부 지원금, 바우처, 의료비 혜택과 육아 패키지 할인 정보를 한눈에 확인하세요.",
  openGraph: {
    title: "임산부/육아 혜택 — 맘마",
    description:
      "첫만남이용권, 부모급여, 출산축하금 등 놓치기 쉬운 혜택을 지역별로 정리했습니다.",
  },
  keywords: [
    "임산부 혜택", "출산 지원금", "육아 혜택", "첫만남이용권",
    "부모급여", "출산축하금", "아동수당", "육아 패키지",
    "임산부 바우처", "지역별 출산 혜택",
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: `${SITE_NAME} 임산부/육아 혜택`,
  description: "임산부·출산·육아 정부 혜택 및 육아 패키지 할인 정보",
  url: `${BASE_URL}/benefits`,
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    url: BASE_URL,
  },
};

export default function BenefitsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
