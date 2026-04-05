// ─── 주차별 필수 검진 일정 ────────────────────────────────
// 대한산부인과학회 표준 임산부 검진 일정 참고 (일반 참고 목적)

export interface Checkup {
  id: string;
  name: string;
  description: string;
  weekStart: number;
  weekEnd: number;
  priority: "essential" | "recommended";
  emoji: string;
  cost?: string;
}

export const checkups: Checkup[] = [
  {
    id: "cu-1",
    name: "첫 산전 검진 (임신 확인)",
    description: "초음파로 임신 확인, 태낭·심박 확인. 임신확인서 발급.",
    weekStart: 5,
    weekEnd: 8,
    priority: "essential",
    emoji: "🩺",
  },
  {
    id: "cu-2",
    name: "기본 혈액검사",
    description: "혈액형, 빈혈, B형간염, 매독, AIDS, 풍진 항체 검사.",
    weekStart: 8,
    weekEnd: 12,
    priority: "essential",
    emoji: "🩸",
  },
  {
    id: "cu-3",
    name: "1차 기형아 검사 (통합선별검사)",
    description: "목덜미 투명대(NT) 초음파 + 혈액검사. 다운증후군 등 선별.",
    weekStart: 11,
    weekEnd: 13,
    priority: "essential",
    emoji: "🔬",
    cost: "10~15만원",
  },
  {
    id: "cu-4",
    name: "2차 기형아 검사 (쿼드검사)",
    description: "혈액검사로 신경관결손, 다운증후군 등 선별.",
    weekStart: 15,
    weekEnd: 20,
    priority: "essential",
    emoji: "🔬",
    cost: "5~10만원",
  },
  {
    id: "cu-5",
    name: "정밀 초음파 (태아 구조 초음파)",
    description: "태아의 장기, 뼈, 심장 등 구조적 이상 정밀 확인. 가장 중요한 초음파.",
    weekStart: 20,
    weekEnd: 24,
    priority: "essential",
    emoji: "📸",
    cost: "15~30만원",
  },
  {
    id: "cu-6",
    name: "임신성 당뇨 검사 (GDM)",
    description: "50g 포도당 부하 검사. 임산부의 약 10%에서 발생. 양성 시 100g 재검사.",
    weekStart: 24,
    weekEnd: 28,
    priority: "essential",
    emoji: "🍬",
  },
  {
    id: "cu-7",
    name: "빈혈 재검사",
    description: "임신 후기 빈혈 여부 재확인. 철분 보충 필요 여부 판단.",
    weekStart: 28,
    weekEnd: 32,
    priority: "recommended",
    emoji: "🩸",
  },
  {
    id: "cu-8",
    name: "B군 연쇄상구균 (GBS) 검사",
    description: "자연분만 시 신생아 감염 예방을 위한 검사. 양성 시 분만 중 항생제 투여.",
    weekStart: 35,
    weekEnd: 37,
    priority: "essential",
    emoji: "🦠",
  },
  {
    id: "cu-9",
    name: "태아 안녕 검사 (NST)",
    description: "태아 심박수 모니터링. 36주 이후 정기적으로 시행.",
    weekStart: 36,
    weekEnd: 40,
    priority: "recommended",
    emoji: "💓",
  },
  {
    id: "cu-10",
    name: "내진 (자궁경부 확인)",
    description: "자궁경부 개대, 소실 정도 확인. 출산 시기 예측에 참고.",
    weekStart: 37,
    weekEnd: 40,
    priority: "recommended",
    emoji: "🏥",
  },
];

/** 현재 주차에 해야 할 검진 반환 */
export function getCheckupsForWeek(week: number): Checkup[] {
  return checkups.filter((c) => week >= c.weekStart && week <= c.weekEnd);
}

/** 곧 해야 할 검진 (2주 이내 시작) */
export function getUpcomingCheckups(week: number): Checkup[] {
  return checkups.filter((c) => {
    const until = c.weekStart - week;
    return until > 0 && until <= 2;
  });
}
