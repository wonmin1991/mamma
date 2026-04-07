// ─── 임신 주차별 영양제 참고 데이터 ─────────────────────
// 출처: ACOG(미국산부인과학회), WHO, NIH(미국국립보건원), 식품의약품안전처, 한국영양학회
// 검증일: 2026-04-08
// ⚠️ 개인 건강 상태에 따라 반드시 의료 전문가와 상담 후 복용하세요.

export interface Supplement {
  id: string;
  name: string;
  emoji: string;
  dosage: string;
  purpose: string;
  startWeek: number;
  endWeek: number;
  priority: "essential" | "recommended" | "optional";
  caution?: string;
}

export interface SupplementPhase {
  id: string;
  label: string;
  weekRange: string;
  color: string;
  bg: string;
}

export const SUPPLEMENT_PHASES: SupplementPhase[] = [
  { id: "preconception", label: "임신 준비기", weekRange: "임신 전~4주", color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-900/20" },
  { id: "first", label: "초기 (1~13주)", weekRange: "1~13주", color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/20" },
  { id: "second", label: "중기 (14~27주)", weekRange: "14~27주", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
  { id: "third", label: "후기 (28~40주)", weekRange: "28~40주", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
];

export const supplements: Supplement[] = [
  // ─── 임신 전체 기간 ────────────────────────────────────
  {
    id: "folic-acid",
    name: "엽산 (Folic Acid)",
    emoji: "💊",
    dosage: "400~800μg/일 (ACOG), 600μg/일 (한국 식약처)",
    purpose: "태아 신경관 결손 예방. 임신 전 최소 1개월~임신 12주까지 필수. 신경관결손 고위험군은 4mg/일.",
    startWeek: 0,
    endWeek: 12,
    priority: "essential",
    caution: "12주 이후에도 종합비타민에 포함된 엽산(400μg)으로 출산까지 보충 권장 (ACOG)",
  },
  {
    id: "iron",
    name: "철분 (Iron)",
    emoji: "🔴",
    dosage: "27mg/일 (ACOG), 30~60mg/일 (WHO)",
    purpose: "임산부 빈혈 예방, 태아 성장에 필수. 보건소에서 무료 수령 가능.",
    startWeek: 16,
    endWeek: 40,
    priority: "essential",
    caution: "공복 또는 비타민C와 함께 복용. 유제품·커피와 2시간 간격 유지. 상한 45mg/일 (식약처)",
  },
  {
    id: "vitamin-d",
    name: "비타민D",
    emoji: "☀️",
    dosage: "600~2000IU/일 (NIH)",
    purpose: "칼슘 흡수 촉진, 태아 뼈 형성, 전자간증 위험 감소. 혈중 농도 30ng/mL 이상 유지 권장.",
    startWeek: 0,
    endWeek: 40,
    priority: "essential",
  },
  {
    id: "omega3",
    name: "오메가3 (DHA)",
    emoji: "🐟",
    dosage: "≥200mg DHA/일 (NIH/식약처)",
    purpose: "태아 뇌 발달 및 시력 형성에 필수. 임신 말기 태아는 하루 50~70mg DHA 필요. EPA보다 DHA 함량이 높은 제품 권장.",
    startWeek: 12,
    endWeek: 40,
    priority: "recommended",
    caution: "중금속 검사 완료된 해양 유래 제품 선택. 출혈 위험이 있으면 출산 4주 전 중단",
  },
  {
    id: "calcium",
    name: "칼슘 (Calcium)",
    emoji: "🦴",
    dosage: "1000mg/일 (ACOG), 1.5~2.0g/일 저섭취 인구 (WHO)",
    purpose: "태아 뼈·치아 형성, 산모 골밀도 유지, 전자간증 위험 24% 감소 (WHO). 유제품 섭취 부족 시 보충 필요.",
    startWeek: 20,
    endWeek: 40,
    priority: "recommended",
    caution: "철분제와 동시 복용 금지 (2시간 간격). 1회 500mg 이하로 나눠 복용",
  },
  {
    id: "magnesium",
    name: "마그네슘",
    emoji: "⚡",
    dosage: "350~360mg/일 (NIH RDA)",
    purpose: "다리 경련 완화, 수면 개선, 자궁 근육 이완.",
    startWeek: 20,
    endWeek: 40,
    priority: "recommended",
    caution: "과다 복용 시 설사 가능. 취침 전 복용이 효과적",
  },
  {
    id: "prenatal-multi",
    name: "임산부 종합비타민",
    emoji: "💎",
    dosage: "1정/일 (제품별 상이)",
    purpose: "엽산·철분·비타민 등 필수 영양소를 한 번에 보충. 개별 보충이 어려울 때 추천.",
    startWeek: 0,
    endWeek: 40,
    priority: "recommended",
    caution: "개별 영양제와 중복 성분 확인 필수 (특히 비타민A 과다 주의)",
  },
  {
    id: "probiotics",
    name: "유산균 (프로바이오틱스)",
    emoji: "🦠",
    dosage: "100억 CFU 이상/일",
    purpose: "장 건강 개선, 변비 완화, 임신성 당뇨 예방에 도움.",
    startWeek: 0,
    endWeek: 40,
    priority: "optional",
  },
  {
    id: "vitamin-c",
    name: "비타민C",
    emoji: "🍊",
    dosage: "85mg/일",
    purpose: "면역력 강화, 철분 흡수 촉진. 철분제와 함께 복용하면 효과적.",
    startWeek: 0,
    endWeek: 40,
    priority: "optional",
    caution: "과일·채소 충분히 섭취한다면 별도 보충 불필요",
  },
  {
    id: "zinc",
    name: "아연 (Zinc)",
    emoji: "🔬",
    dosage: "11mg/일",
    purpose: "태아 세포 분열 및 면역 체계 발달.",
    startWeek: 0,
    endWeek: 40,
    priority: "optional",
    caution: "종합비타민에 포함된 경우가 많으므로 중복 확인",
  },
];

/** 현재 주차에 복용해야 할 영양제 목록 반환 */
export function getSupplementsForWeek(week: number): Supplement[] {
  return supplements.filter((s) => week >= s.startWeek && week <= s.endWeek);
}

/** 현재 주차의 phase 반환 */
export function getCurrentPhase(week: number): SupplementPhase {
  if (week <= 0) return SUPPLEMENT_PHASES[0];
  if (week <= 13) return SUPPLEMENT_PHASES[1];
  if (week <= 27) return SUPPLEMENT_PHASES[2];
  return SUPPLEMENT_PHASES[3];
}
