import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { BASE_URL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "주차별 가이드",
  description:
    "임신 1주부터 40주까지, 아기 발달과 엄마 몸의 변화, 추천 음식 정보를 주차별로 확인하세요.",
  openGraph: {
    title: "주차별 가이드 — 맘마",
    description: "임신 1주부터 40주까지, 아기 발달과 엄마 몸의 변화, 추천 음식 정보를 주차별로 확인하세요.",
  },
  keywords: [
    "임신 주차별 가이드", "임신 주수별 정보", "태아 발달", "임산부 몸 변화",
    "임신 초기 증상", "임신 중기", "임신 후기", "출산 준비",
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  name: `${SITE_NAME} 임신 주차별 가이드`,
  description: "임신 1주부터 40주까지 주차별 아기 발달, 엄마 몸 변화, 추천 음식 정보",
  url: `${BASE_URL}/guide`,
  mainEntity: [
    {
      "@type": "Question",
      name: "임신 주차별 태아 크기는 어떻게 되나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "임신 4주에는 양귀비 씨앗 크기(0.1cm)로 시작하여, 20주에는 바나나 크기(25cm), 40주에는 수박 크기(약 50cm, 3.3kg)까지 자랍니다.",
      },
    },
    {
      "@type": "Question",
      name: "임신 중 좋은 음식과 피해야 할 음식은?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "엽산이 풍부한 시금치, 브로콜리와 단백질이 풍부한 계란, 닭고기가 좋습니다. 날생선(회), 카페인 음료, 술은 피해야 합니다.",
      },
    },
  ],
};

export default function GuideLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense>{children}</Suspense>
    </>
  );
}
