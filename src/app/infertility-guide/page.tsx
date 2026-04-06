"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { infertilityGuide } from "@/data/infertility";

export default function InfertilityGuidePage() {
  return (
    <main className="flex flex-col">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-5 pt-12 pb-3">
        <div className="flex items-center gap-2">
          <Link href="/" className="p-1 -ml-1" aria-label="뒤로가기">
            <ChevronLeft size={22} className="text-foreground" />
          </Link>
          <h1 className="text-lg font-bold text-foreground">난임 시술 가이드</h1>
        </div>
      </header>

      <section className="px-5 mt-3 pb-28">
        <p className="text-sm text-muted mb-6 leading-relaxed">
          난임 검사부터 임신 확인까지, 단계별로 알아야 할 정보를 정리했어요.
        </p>

        <div className="relative pl-8">
          {/* 타임라인 선 */}
          <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-gradient-to-b from-secondary via-primary to-emerald-400" />

          <div className="flex flex-col gap-6">
            {infertilityGuide.map((step, i) => (
              <div
                key={step.id}
                id={`step-${step.id}`}
                className="relative animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* 타임라인 원 */}
                <div className="absolute -left-5 w-7 h-7 rounded-full bg-gradient-to-br from-secondary to-primary text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  {i + 1}
                </div>

                <div className="bg-card rounded-2xl border border-card-border shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-secondary/10 to-primary/10 px-4 py-3 border-b border-card-border">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{step.emoji}</span>
                      <div>
                        <p className="text-[10px] text-secondary font-medium uppercase tracking-wider">
                          STEP {i + 1}
                        </p>
                        <h3 className="font-bold text-foreground">{step.title}</h3>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-sm text-muted mb-3 font-medium">{step.summary}</p>
                    <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                      {step.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-2xl p-5 border border-card-border text-center">
          <p className="text-2xl mb-2">🌈</p>
          <p className="font-bold text-foreground">포기하지 마세요</p>
          <p className="text-sm text-muted mt-1 leading-relaxed">
            난임은 질병이 아니라 과정입니다.
            <br />
            전문의와 함께 최선의 방법을 찾아가세요.
          </p>
          <div className="flex gap-2 justify-center mt-4">
            <a
              href="tel:1566-0196"
              className="px-4 py-2 rounded-xl bg-secondary text-white text-sm font-medium"
            >
              난임 상담 1566-0196
            </a>
            <Link
              href="/benefits?tab=infertility"
              className="px-4 py-2 rounded-xl bg-card text-foreground text-sm font-medium border border-card-border"
            >
              지원금 확인
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
