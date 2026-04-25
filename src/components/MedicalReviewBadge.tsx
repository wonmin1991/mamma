import { ShieldCheck } from "lucide-react";

export interface MedicalReview {
  /** 감수자 이름 (예: "김OO 산부인과 전문의") */
  reviewer: string;
  /** 소속 기관 */
  affiliation: string;
  /** 감수일 (YYYY-MM-DD) */
  reviewedOn: string;
  /** 출처 목록 */
  sources?: string[];
}

interface Props {
  review: MedicalReview;
  variant?: "default" | "compact";
}

export default function MedicalReviewBadge({ review, variant = "default" }: Props) {
  if (variant === "compact") {
    return (
      <div className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400">
        <ShieldCheck size={12} />
        <span>의료진 감수 · {review.reviewedOn}</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-3">
      <div className="flex items-start gap-2">
        <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
        <div className="text-xs leading-relaxed">
          <p className="font-semibold text-emerald-900 dark:text-emerald-200">
            {review.reviewer} 감수
          </p>
          <p className="text-emerald-800/80 dark:text-emerald-300/80 mt-0.5">
            {review.affiliation} · 감수일 {review.reviewedOn}
          </p>
          {review.sources && review.sources.length > 0 && (
            <p className="text-emerald-800/70 dark:text-emerald-300/70 mt-1">
              출처: {review.sources.join(", ")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/** 페이지별 기본 감수 정보. 실제 협업 후 데이터를 갱신하세요. */
export const DEFAULT_REVIEWS: Record<string, MedicalReview> = {
  guide: {
    reviewer: "감수 대기",
    affiliation: "산부인과 전문의 협업 예정",
    reviewedOn: "2026-04-08",
    sources: ["ACOG", "Mayo Clinic", "Cleveland Clinic", "NHS"],
  },
  emergency: {
    reviewer: "감수 대기",
    affiliation: "산부인과 전문의 협업 예정",
    reviewedOn: "2026-04-08",
    sources: ["ACOG", "대한산부인과학회", "서울아산병원"],
  },
  supplements: {
    reviewer: "감수 대기",
    affiliation: "산부인과 전문의 협업 예정",
    reviewedOn: "2026-04-08",
    sources: ["ACOG", "WHO", "NIH", "식약처", "한국영양학회"],
  },
  vaccination: {
    reviewer: "감수 대기",
    affiliation: "소아과 전문의 협업 예정",
    reviewedOn: "2026-04-08",
    sources: ["질병관리청", "WHO", "대한소아과학회"],
  },
  infertility: {
    reviewer: "감수 대기",
    affiliation: "난임 전문의 협업 예정",
    reviewedOn: "2026-04-08",
    sources: ["대한산부인과학회", "보건복지부", "ACOG"],
  },
};
