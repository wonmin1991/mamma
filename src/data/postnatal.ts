// ─── Postnatal Reference Data (출산 후 참조 데이터) ─────

// ─── Types ───────────────────────────────────────────────

export interface CareLogEntry {
  id: string;
  type: CareLogType;
  startTime: string; // ISO
  endTime?: string;
  amount?: number; // ml for bottle
  side?: "left" | "right" | "both"; // breast feed
  note?: string;
  createdAt: string;
}

export type CareLogType =
  | "breast_feed"
  | "bottle_feed"
  | "sleep"
  | "diaper_wet"
  | "diaper_dirty"
  | "diaper_both";

export interface GrowthRecord {
  id: string;
  date: string;
  weightKg?: number;
  heightCm?: number;
  headCm?: number;
  note?: string;
  createdAt: string;
}

export interface MilestoneRecord {
  id: string;
  title: string;
  category: MilestoneCategory;
  date: string;
  description?: string;
  createdAt: string;
}

export type MilestoneCategory =
  | "motor"
  | "language"
  | "social"
  | "cognitive"
  | "self_care"
  | "other";

export interface DiaryEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood?: string;
  createdAt: string;
}

export interface VaccinationInfo {
  name: string;
  koreanName: string;
  description: string;
  doses: { doseNumber: number; monthStart: number; monthEnd: number; description: string }[];
}

export interface BabyFoodStage {
  stage: number;
  title: string;
  monthStart: number;
  monthEnd: number;
  description: string;
  allowedFoods: string[];
  avoidFoods: string[];
  tips: string[];
  sampleMenu: string[];
}

export interface MilestoneSuggestion {
  title: string;
  category: MilestoneCategory;
  monthStart: number;
  monthEnd: number;
}

export interface GrowthPercentile {
  month: number;
  p3: number;
  p15: number;
  p50: number;
  p85: number;
  p97: number;
}

// ─── Care Log Constants ──────────────────────────────────

export const CARE_LOG_TYPES: {
  id: CareLogType;
  label: string;
  emoji: string;
  color: string;
}[] = [
  { id: "breast_feed", label: "모유수유", emoji: "🤱", color: "text-pink-500" },
  { id: "bottle_feed", label: "분유수유", emoji: "🍼", color: "text-blue-500" },
  { id: "sleep", label: "수면", emoji: "😴", color: "text-indigo-500" },
  { id: "diaper_wet", label: "소변", emoji: "💧", color: "text-sky-400" },
  { id: "diaper_dirty", label: "대변", emoji: "💩", color: "text-amber-600" },
  { id: "diaper_both", label: "소변+대변", emoji: "👶", color: "text-orange-500" },
];

export const CARE_LOG_TABS = [
  { id: "all", label: "전체", emoji: "📋" },
  { id: "feed", label: "수유", emoji: "🍼" },
  { id: "sleep", label: "수면", emoji: "😴" },
  { id: "diaper", label: "기저귀", emoji: "👶" },
];

export const DIARY_MOODS = ["😊", "😍", "😢", "😴", "🤒", "😤", "🥰", "😂"];

// ─── Milestone Categories ────────────────────────────────

export const MILESTONE_CATEGORIES: {
  id: MilestoneCategory | "all";
  label: string;
  emoji: string;
}[] = [
  { id: "all", label: "전체", emoji: "📋" },
  { id: "motor", label: "운동", emoji: "🏃" },
  { id: "language", label: "언어", emoji: "🗣️" },
  { id: "social", label: "사회성", emoji: "🤝" },
  { id: "cognitive", label: "인지", emoji: "🧠" },
  { id: "self_care", label: "자립", emoji: "🍼" },
  { id: "other", label: "기타", emoji: "⭐" },
];

// ─── Milestone Suggestions ───────────────────────────────

export const MILESTONE_SUGGESTIONS: MilestoneSuggestion[] = [
  // Motor (운동)
  { title: "고개 들기", category: "motor", monthStart: 0, monthEnd: 2 },
  { title: "뒤집기", category: "motor", monthStart: 3, monthEnd: 5 },
  { title: "목 가누기", category: "motor", monthStart: 3, monthEnd: 4 },
  { title: "손으로 물건 잡기", category: "motor", monthStart: 3, monthEnd: 5 },
  { title: "혼자 앉기", category: "motor", monthStart: 5, monthEnd: 7 },
  { title: "배밀이", category: "motor", monthStart: 6, monthEnd: 9 },
  { title: "기어 다니기", category: "motor", monthStart: 7, monthEnd: 10 },
  { title: "잡고 서기", category: "motor", monthStart: 8, monthEnd: 10 },
  { title: "혼자 서기", category: "motor", monthStart: 9, monthEnd: 12 },
  { title: "첫 걸음마", category: "motor", monthStart: 9, monthEnd: 15 },
  { title: "걷기", category: "motor", monthStart: 12, monthEnd: 15 },
  { title: "뛰기", category: "motor", monthStart: 18, monthEnd: 24 },
  { title: "계단 오르기", category: "motor", monthStart: 18, monthEnd: 24 },
  { title: "공 차기", category: "motor", monthStart: 18, monthEnd: 24 },

  // Language (언어)
  { title: "옹알이 시작", category: "language", monthStart: 2, monthEnd: 4 },
  { title: "웃음소리 내기", category: "language", monthStart: 3, monthEnd: 5 },
  { title: "이름에 반응", category: "language", monthStart: 5, monthEnd: 7 },
  { title: "마마/빠빠 소리", category: "language", monthStart: 6, monthEnd: 9 },
  { title: "첫 단어", category: "language", monthStart: 10, monthEnd: 14 },
  { title: "단어 3~5개", category: "language", monthStart: 12, monthEnd: 18 },
  { title: "두 단어 조합", category: "language", monthStart: 18, monthEnd: 24 },
  { title: "문장 말하기", category: "language", monthStart: 24, monthEnd: 30 },
  { title: "노래 따라 부르기", category: "language", monthStart: 24, monthEnd: 30 },

  // Social (사회성)
  { title: "사회적 미소", category: "social", monthStart: 1, monthEnd: 3 },
  { title: "눈 맞춤", category: "social", monthStart: 1, monthEnd: 3 },
  { title: "낯가림 시작", category: "social", monthStart: 6, monthEnd: 9 },
  { title: "까꿍 놀이 반응", category: "social", monthStart: 6, monthEnd: 9 },
  { title: "바이바이 하기", category: "social", monthStart: 8, monthEnd: 12 },
  { title: "손가락으로 가리키기", category: "social", monthStart: 9, monthEnd: 14 },
  { title: "다른 아이에게 관심", category: "social", monthStart: 12, monthEnd: 18 },
  { title: "평행놀이", category: "social", monthStart: 18, monthEnd: 24 },

  // Cognitive (인지)
  { title: "물체 추적하기", category: "cognitive", monthStart: 1, monthEnd: 3 },
  { title: "손 발견하기", category: "cognitive", monthStart: 2, monthEnd: 4 },
  { title: "물건 입에 넣기", category: "cognitive", monthStart: 3, monthEnd: 6 },
  { title: "대상 영속성 이해", category: "cognitive", monthStart: 6, monthEnd: 9 },
  { title: "블록 쌓기", category: "cognitive", monthStart: 9, monthEnd: 12 },
  { title: "모양 맞추기", category: "cognitive", monthStart: 12, monthEnd: 18 },
  { title: "색깔 구분", category: "cognitive", monthStart: 18, monthEnd: 24 },
  { title: "숫자 세기(1~3)", category: "cognitive", monthStart: 24, monthEnd: 30 },

  // Self-care (자립)
  { title: "이유식 시작", category: "self_care", monthStart: 4, monthEnd: 6 },
  { title: "컵으로 마시기", category: "self_care", monthStart: 6, monthEnd: 9 },
  { title: "손가락 음식 먹기", category: "self_care", monthStart: 8, monthEnd: 10 },
  { title: "숟가락 사용", category: "self_care", monthStart: 12, monthEnd: 18 },
  { title: "젖병 졸업", category: "self_care", monthStart: 12, monthEnd: 18 },
  { title: "혼자 신발 벗기", category: "self_care", monthStart: 18, monthEnd: 24 },
  { title: "양치 시도", category: "self_care", monthStart: 18, monthEnd: 24 },
  { title: "배변 훈련 시작", category: "self_care", monthStart: 18, monthEnd: 30 },
];

// ─── Vaccination Schedule (Korean National) ──────────────

export const VACCINATIONS: VaccinationInfo[] = [
  {
    name: "BCG",
    koreanName: "결핵",
    description: "결핵 예방을 위한 접종으로, 출생 후 가능한 빨리 접종합니다.",
    doses: [
      { doseNumber: 1, monthStart: 0, monthEnd: 1, description: "출생 직후~4주 이내" },
    ],
  },
  {
    name: "HepB",
    koreanName: "B형간염",
    description: "B형간염 바이러스 감염을 예방합니다.",
    doses: [
      { doseNumber: 1, monthStart: 0, monthEnd: 0, description: "출생 직후" },
      { doseNumber: 2, monthStart: 1, monthEnd: 1, description: "생후 1개월" },
      { doseNumber: 3, monthStart: 6, monthEnd: 6, description: "생후 6개월" },
    ],
  },
  {
    name: "DTaP",
    koreanName: "디프테리아/파상풍/백일해",
    description: "디프테리아, 파상풍, 백일해 3가지 질병을 한 번에 예방합니다.",
    doses: [
      { doseNumber: 1, monthStart: 2, monthEnd: 2, description: "생후 2개월" },
      { doseNumber: 2, monthStart: 4, monthEnd: 4, description: "생후 4개월" },
      { doseNumber: 3, monthStart: 6, monthEnd: 6, description: "생후 6개월" },
      { doseNumber: 4, monthStart: 15, monthEnd: 18, description: "생후 15~18개월" },
      { doseNumber: 5, monthStart: 48, monthEnd: 72, description: "만 4~6세" },
    ],
  },
  {
    name: "IPV",
    koreanName: "폴리오",
    description: "소아마비를 예방하는 불활성화 백신입니다.",
    doses: [
      { doseNumber: 1, monthStart: 2, monthEnd: 2, description: "생후 2개월" },
      { doseNumber: 2, monthStart: 4, monthEnd: 4, description: "생후 4개월" },
      { doseNumber: 3, monthStart: 6, monthEnd: 18, description: "생후 6~18개월" },
      { doseNumber: 4, monthStart: 48, monthEnd: 72, description: "만 4~6세" },
    ],
  },
  {
    name: "Hib",
    koreanName: "b형 헤모필루스 인플루엔자",
    description: "세균성 뇌수막염, 폐렴, 후두염 등을 예방합니다.",
    doses: [
      { doseNumber: 1, monthStart: 2, monthEnd: 2, description: "생후 2개월" },
      { doseNumber: 2, monthStart: 4, monthEnd: 4, description: "생후 4개월" },
      { doseNumber: 3, monthStart: 6, monthEnd: 6, description: "생후 6개월" },
      { doseNumber: 4, monthStart: 12, monthEnd: 15, description: "생후 12~15개월" },
    ],
  },
  {
    name: "PCV",
    koreanName: "폐렴구균",
    description: "폐렴구균에 의한 침습성 감염을 예방합니다.",
    doses: [
      { doseNumber: 1, monthStart: 2, monthEnd: 2, description: "생후 2개월" },
      { doseNumber: 2, monthStart: 4, monthEnd: 4, description: "생후 4개월" },
      { doseNumber: 3, monthStart: 6, monthEnd: 6, description: "생후 6개월" },
      { doseNumber: 4, monthStart: 12, monthEnd: 15, description: "생후 12~15개월" },
    ],
  },
  {
    name: "Rotavirus",
    koreanName: "로타바이러스",
    description: "로타바이러스 감염에 의한 심한 설사를 예방합니다.",
    doses: [
      { doseNumber: 1, monthStart: 2, monthEnd: 2, description: "생후 2개월" },
      { doseNumber: 2, monthStart: 4, monthEnd: 4, description: "생후 4개월" },
      { doseNumber: 3, monthStart: 6, monthEnd: 6, description: "생후 6개월" },
    ],
  },
  {
    name: "MMR",
    koreanName: "홍역/유행성이하선염/풍진",
    description: "홍역, 유행성이하선염(볼거리), 풍진을 예방합니다.",
    doses: [
      { doseNumber: 1, monthStart: 12, monthEnd: 15, description: "생후 12~15개월" },
      { doseNumber: 2, monthStart: 48, monthEnd: 72, description: "만 4~6세" },
    ],
  },
  {
    name: "Varicella",
    koreanName: "수두",
    description: "수두 바이러스 감염을 예방합니다.",
    doses: [
      { doseNumber: 1, monthStart: 12, monthEnd: 15, description: "생후 12~15개월" },
    ],
  },
  {
    name: "HepA",
    koreanName: "A형간염",
    description: "A형간염 바이러스 감염을 예방합니다.",
    doses: [
      { doseNumber: 1, monthStart: 12, monthEnd: 23, description: "생후 12~23개월" },
      { doseNumber: 2, monthStart: 18, monthEnd: 36, description: "1차 접종 후 6~18개월 후" },
    ],
  },
  {
    name: "JE",
    koreanName: "일본뇌염(불활성화)",
    description: "일본뇌염 바이러스를 예방합니다.",
    doses: [
      { doseNumber: 1, monthStart: 12, monthEnd: 24, description: "생후 12~24개월 (1~2주 간격 2회)" },
      { doseNumber: 2, monthStart: 12, monthEnd: 24, description: "1차 후 1~2주" },
      { doseNumber: 3, monthStart: 24, monthEnd: 36, description: "2차 후 12개월" },
    ],
  },
];

// ─── Baby Food Guide ─────────────────────────────────────

export const BABY_FOOD_STAGES: BabyFoodStage[] = [
  {
    stage: 1,
    title: "이유식 초기",
    monthStart: 4,
    monthEnd: 6,
    description: "처음 시작하는 이유식. 쌀미음부터 시작해 한 가지씩 새로운 재료를 시도합니다.",
    allowedFoods: ["쌀", "감자", "고구마", "당근", "브로콜리", "호박", "애호박", "배", "사과", "바나나"],
    avoidFoods: ["꿀(보툴리눔 위험)", "우유", "견과류", "소금/설탕", "생선/해산물"],
    tips: [
      "물과 쌀 10:1 비율의 미음부터 시작",
      "수유 전 1스푼부터 시작",
      "새로운 재료는 3~5일 간격으로 하나씩",
      "알레르기 반응(발진, 구토, 설사) 관찰",
    ],
    sampleMenu: ["쌀미음", "감자 미음", "고구마 미음", "당근 미음", "브로콜리 미음"],
  },
  {
    stage: 2,
    title: "이유식 중기",
    monthStart: 7,
    monthEnd: 8,
    description: "식감에 변화를 주는 시기. 으깬 형태에서 곱게 다진 형태로 전환합니다.",
    allowedFoods: ["쌀죽(7:1)", "닭가슴살", "소고기", "두부", "달걀노른자", "오이", "시금치", "무", "양배추", "미역"],
    avoidFoods: ["달걀 흰자(1세 이전)", "꿀", "생우유", "염분이 높은 음식"],
    tips: [
      "하루 2회로 늘리기",
      "고기류 시작 (철분 보충)",
      "으깬 것에서 곱게 다진 형태로",
      "달걀노른자부터 시도",
    ],
    sampleMenu: ["소고기 당근죽", "닭가슴살 감자죽", "두부 시금치죽", "달걀노른자 브로콜리죽"],
  },
  {
    stage: 3,
    title: "이유식 후기",
    monthStart: 9,
    monthEnd: 11,
    description: "잇몸으로 으깨 먹을 수 있는 무른 밥. 핑거푸드를 시작합니다.",
    allowedFoods: ["무른밥(5:1)", "생선(흰살)", "달걀 전체", "치즈", "요거트", "토마토", "파프리카", "콩", "버섯"],
    avoidFoods: ["꿀", "생우유(음료용)", "단단한 견과류", "자극적인 양념"],
    tips: [
      "하루 3회 + 간식",
      "핑거푸드 시작 (5mm 크기)",
      "달걀 흰자 시도 가능",
      "다양한 질감 경험",
    ],
    sampleMenu: ["소고기 야채 무른밥", "흰살생선 채소죽", "달걀찜 + 야채스틱", "치즈 감자볼"],
  },
  {
    stage: 4,
    title: "이유식 완료기",
    monthStart: 12,
    monthEnd: 15,
    description: "어른 식사에 가까워지는 시기. 가족과 함께 식사하는 습관을 들입니다.",
    allowedFoods: ["진밥", "생우유(음료 가능)", "대부분의 식재료", "부드러운 과일", "잘 익힌 야채"],
    avoidFoods: ["꿀(12개월 이후 가능)", "딱딱한 음식", "과도한 간", "가공식품"],
    tips: [
      "1cm 크기로 잘라주기",
      "하루 3끼 + 간식 1~2회",
      "생우유 음료로 시작 가능",
      "가족과 함께 식사 습관 형성",
    ],
    sampleMenu: ["소고기 야채 진밥", "생선구이 + 야채반찬", "미니 주먹밥", "과일 요거트"],
  },
  {
    stage: 5,
    title: "유아식",
    monthStart: 15,
    monthEnd: 36,
    description: "성인 식사로 전환하는 시기. 편식하지 않도록 다양한 재료를 경험시킵니다.",
    allowedFoods: ["대부분의 일반 식재료", "다양한 곡물", "모든 종류의 고기", "해산물", "유제품"],
    avoidFoods: ["과도한 당분", "카페인", "질식 위험 식품(통포도, 핫도그 등)"],
    tips: [
      "규칙적인 식사 시간",
      "다양한 식감과 맛 경험",
      "스스로 먹는 연습",
      "편식 방지를 위한 반복 노출",
    ],
    sampleMenu: ["야채 볶음밥", "된장국 + 생선구이", "카레라이스", "파스타"],
  },
];

// ─── WHO Growth Percentiles (Boys, 0-24 months) ──────────

export const WHO_WEIGHT_BOYS: GrowthPercentile[] = [
  { month: 0, p3: 2.5, p15: 2.9, p50: 3.3, p85: 3.9, p97: 4.3 },
  { month: 1, p3: 3.4, p15: 3.9, p50: 4.5, p85: 5.1, p97: 5.7 },
  { month: 2, p3: 4.3, p15: 4.9, p50: 5.6, p85: 6.3, p97: 7.0 },
  { month: 3, p3: 5.0, p15: 5.7, p50: 6.4, p85: 7.2, p97: 7.9 },
  { month: 4, p3: 5.6, p15: 6.3, p50: 7.0, p85: 7.8, p97: 8.6 },
  { month: 5, p3: 6.0, p15: 6.7, p50: 7.5, p85: 8.4, p97: 9.2 },
  { month: 6, p3: 6.4, p15: 7.1, p50: 7.9, p85: 8.8, p97: 9.7 },
  { month: 7, p3: 6.7, p15: 7.4, p50: 8.3, p85: 9.2, p97: 10.2 },
  { month: 8, p3: 6.9, p15: 7.7, p50: 8.6, p85: 9.6, p97: 10.5 },
  { month: 9, p3: 7.1, p15: 7.9, p50: 8.9, p85: 9.9, p97: 10.9 },
  { month: 10, p3: 7.4, p15: 8.1, p50: 9.1, p85: 10.2, p97: 11.2 },
  { month: 11, p3: 7.6, p15: 8.4, p50: 9.4, p85: 10.5, p97: 11.5 },
  { month: 12, p3: 7.7, p15: 8.6, p50: 9.6, p85: 10.8, p97: 11.8 },
  { month: 15, p3: 8.3, p15: 9.2, p50: 10.3, p85: 11.5, p97: 12.7 },
  { month: 18, p3: 8.8, p15: 9.8, p50: 10.9, p85: 12.2, p97: 13.4 },
  { month: 21, p3: 9.3, p15: 10.3, p50: 11.5, p85: 12.9, p97: 14.2 },
  { month: 24, p3: 9.7, p15: 10.8, p50: 12.2, p85: 13.6, p97: 15.0 },
];

export const WHO_WEIGHT_GIRLS: GrowthPercentile[] = [
  { month: 0, p3: 2.4, p15: 2.8, p50: 3.2, p85: 3.7, p97: 4.2 },
  { month: 1, p3: 3.2, p15: 3.6, p50: 4.2, p85: 4.8, p97: 5.4 },
  { month: 2, p3: 3.9, p15: 4.5, p50: 5.1, p85: 5.8, p97: 6.5 },
  { month: 3, p3: 4.5, p15: 5.1, p50: 5.8, p85: 6.6, p97: 7.4 },
  { month: 4, p3: 5.0, p15: 5.6, p50: 6.4, p85: 7.3, p97: 8.1 },
  { month: 5, p3: 5.4, p15: 6.1, p50: 6.9, p85: 7.8, p97: 8.7 },
  { month: 6, p3: 5.7, p15: 6.5, p50: 7.3, p85: 8.2, p97: 9.2 },
  { month: 7, p3: 6.0, p15: 6.8, p50: 7.6, p85: 8.6, p97: 9.6 },
  { month: 8, p3: 6.3, p15: 7.0, p50: 7.9, p85: 9.0, p97: 10.0 },
  { month: 9, p3: 6.5, p15: 7.3, p50: 8.2, p85: 9.3, p97: 10.3 },
  { month: 10, p3: 6.7, p15: 7.5, p50: 8.5, p85: 9.6, p97: 10.6 },
  { month: 11, p3: 6.9, p15: 7.7, p50: 8.7, p85: 9.9, p97: 10.9 },
  { month: 12, p3: 7.0, p15: 7.9, p50: 8.9, p85: 10.1, p97: 11.2 },
  { month: 15, p3: 7.6, p15: 8.5, p50: 9.6, p85: 10.9, p97: 12.1 },
  { month: 18, p3: 8.1, p15: 9.1, p50: 10.2, p85: 11.6, p97: 12.9 },
  { month: 21, p3: 8.6, p15: 9.6, p50: 10.9, p85: 12.4, p97: 13.7 },
  { month: 24, p3: 9.0, p15: 10.2, p50: 11.5, p85: 13.1, p97: 14.6 },
];

export const WHO_HEIGHT_BOYS: GrowthPercentile[] = [
  { month: 0, p3: 46.3, p15: 47.9, p50: 49.9, p85: 51.8, p97: 53.4 },
  { month: 1, p3: 50.8, p15: 52.3, p50: 54.7, p85: 56.7, p97: 58.4 },
  { month: 2, p3: 54.4, p15: 56.0, p50: 58.4, p85: 60.6, p97: 62.2 },
  { month: 3, p3: 57.3, p15: 59.0, p50: 61.4, p85: 63.5, p97: 65.3 },
  { month: 4, p3: 59.7, p15: 61.3, p50: 63.9, p85: 66.0, p97: 67.8 },
  { month: 5, p3: 61.7, p15: 63.3, p50: 65.9, p85: 68.0, p97: 69.9 },
  { month: 6, p3: 63.3, p15: 65.1, p50: 67.6, p85: 69.8, p97: 71.6 },
  { month: 9, p3: 67.5, p15: 69.4, p50: 72.0, p85: 74.2, p97: 76.2 },
  { month: 12, p3: 71.0, p15: 73.0, p50: 75.7, p85: 78.1, p97: 80.2 },
  { month: 15, p3: 74.1, p15: 76.2, p50: 79.1, p85: 81.7, p97: 83.9 },
  { month: 18, p3: 76.9, p15: 79.2, p50: 82.3, p85: 85.0, p97: 87.3 },
  { month: 21, p3: 79.5, p15: 81.8, p50: 84.8, p85: 87.7, p97: 90.2 },
  { month: 24, p3: 81.7, p15: 84.1, p50: 87.1, p85: 90.2, p97: 92.9 },
];

export const WHO_HEIGHT_GIRLS: GrowthPercentile[] = [
  { month: 0, p3: 45.4, p15: 47.0, p50: 49.1, p85: 51.0, p97: 52.7 },
  { month: 1, p3: 49.8, p15: 51.3, p50: 53.7, p85: 55.6, p97: 57.4 },
  { month: 2, p3: 53.0, p15: 54.6, p50: 57.1, p85: 59.1, p97: 60.9 },
  { month: 3, p3: 55.6, p15: 57.2, p50: 59.8, p85: 62.0, p97: 63.8 },
  { month: 4, p3: 57.8, p15: 59.5, p50: 62.1, p85: 64.3, p97: 66.2 },
  { month: 5, p3: 59.6, p15: 61.4, p50: 64.0, p85: 66.2, p97: 68.2 },
  { month: 6, p3: 61.2, p15: 63.0, p50: 65.7, p85: 68.0, p97: 69.9 },
  { month: 9, p3: 65.3, p15: 67.2, p50: 70.1, p85: 72.6, p97: 74.7 },
  { month: 12, p3: 68.9, p15: 71.0, p50: 74.0, p85: 76.5, p97: 78.7 },
  { month: 15, p3: 72.0, p15: 74.2, p50: 77.5, p85: 80.2, p97: 82.5 },
  { month: 18, p3: 74.9, p15: 77.2, p50: 80.7, p85: 83.6, p97: 86.0 },
  { month: 21, p3: 77.5, p15: 80.0, p50: 83.7, p85: 86.7, p97: 89.3 },
  { month: 24, p3: 80.0, p15: 82.5, p50: 86.4, p85: 89.6, p97: 92.2 },
];
