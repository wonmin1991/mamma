// ─── Crawled data (auto-generated, `npm run crawl`) ─────

import {
  crawledRestaurants,
  crawledTips,
  crawledCurated,
} from "./crawled";

// ─── Types ───────────────────────────────────────────────

export interface Restaurant {
  id: number;
  name: string;
  category: string;
  region: "seoul" | "gyeonggi" | "incheon";
  area: string;
  rating: number;
  tags: string[];
  description: string;
  emoji: string;
  priceRange: string;
  pregnancyPerks: string[];
  address: string;
  savedCount: number;
  sourceUrl?: string;
}

export interface Tip {
  id: number;
  title: string;
  category: string;
  summary: string;
  content: string;
  source: string;
  emoji: string;
  likes: number;
  gradient: string;
  sourceUrl?: string;
}

export interface WeekInfo {
  week: number;
  trimester: number;
  babySize: string;
  babySizeEmoji: string;
  babyWeight: string;
  babyLength: string;
  babyDevelopment: string[];
  momChanges: string[];
  tips: string[];
  goodFoods: string[];
  avoidFoods: string[];
}

export interface CuratedPost {
  id: number;
  source: "instagram" | "blog" | "cafe";
  sourceAccount: string;
  title: string;
  summary: string;
  tags: string[];
  likes: number;
  emoji: string;
  gradient: string;
  sourceUrl?: string;
}

export interface CommunityPost {
  id: number;
  author: string;
  category: "restaurant" | "tip" | "question" | "review";
  title: string;
  content: string;
  likes: number;
  comments: number;
  createdAt: string;
  emoji: string;
}

// ─── Constants ───────────────────────────────────────────

export const CATEGORIES = [
  { id: "korean", label: "한식", emoji: "🍚" },
  { id: "western", label: "양식", emoji: "🍝" },
  { id: "japanese", label: "일식", emoji: "🍱" },
  { id: "chinese", label: "중식", emoji: "🥟" },
  { id: "cafe", label: "카페", emoji: "☕" },
  { id: "salad", label: "샐러드", emoji: "🥗" },
];

export const AREA_GROUPS = [
  { id: "all", label: "전체" },
  { id: "seoul", label: "서울" },
  { id: "gyeonggi", label: "경기" },
  { id: "incheon", label: "인천" },
];

export const TIP_CATEGORIES = [
  { id: "all", label: "전체" },
  { id: "nutrition", label: "영양" },
  { id: "exercise", label: "운동" },
  { id: "mental", label: "마음건강" },
  { id: "hospital", label: "병원" },
  { id: "product", label: "용품" },
];

export const COMMUNITY_CATEGORIES = [
  { id: "all", label: "전체", emoji: "📋" },
  { id: "restaurant", label: "맛집추천", emoji: "🍽️" },
  { id: "tip", label: "꿀팁공유", emoji: "💡" },
  { id: "question", label: "질문/고민", emoji: "🤔" },
  { id: "review", label: "후기", emoji: "✍️" },
];

// ─── Restaurants (서울 + 경기 + 인천) ────────────────────

const _defaultRestaurants: Restaurant[] = [
  // ── 서울 ──
  {
    id: 1, name: "자연밥상", category: "korean", region: "seoul", area: "강남구",
    rating: 4.8, tags: ["유기농", "저염식", "개인실"],
    description: "유기농 재료로 만든 건강한 한식 정식. 임산부를 위한 저염 메뉴가 별도로 준비되어 있어요.",
    emoji: "🍚", priceRange: "15,000~25,000원",
    pregnancyPerks: ["저염 임산부 정식 메뉴", "넓은 개인실", "유기농 인증 식재료"],
    address: "서울 강남구 테헤란로 123", savedCount: 342,
  },
  {
    id: 2, name: "그린테이블", category: "salad", region: "seoul", area: "마포구",
    rating: 4.7, tags: ["비건옵션", "무농약", "테이크아웃"],
    description: "신선한 무농약 채소로 만든 샐러드와 건강 볼. 엽산이 풍부한 그린 메뉴가 인기!",
    emoji: "🥗", priceRange: "12,000~18,000원",
    pregnancyPerks: ["엽산 풍부한 메뉴", "무농약 채소 사용", "커스텀 토핑 가능"],
    address: "서울 마포구 연남로 45", savedCount: 287,
  },
  {
    id: 3, name: "수담", category: "korean", region: "seoul", area: "서초구",
    rating: 4.9, tags: ["한정식", "개인실", "주차"],
    description: "정성 가득한 한정식 코스. 편안한 좌석과 넓은 공간으로 임산부에게 특히 추천!",
    emoji: "🍲", priceRange: "25,000~45,000원",
    pregnancyPerks: ["좌식+입식 선택 가능", "넓은 주차장", "개인실 5개"],
    address: "서울 서초구 사평대로 67", savedCount: 456,
  },
  {
    id: 4, name: "르 봉뵈르", category: "western", region: "seoul", area: "용산구",
    rating: 4.6, tags: ["파스타", "스테이크", "브런치"],
    description: "임산부를 위한 웰던 스테이크와 크림 파스타가 맛있는 이태원 맛집.",
    emoji: "🍝", priceRange: "18,000~35,000원",
    pregnancyPerks: ["웰던 조리 가능", "디카페인 음료", "편안한 소파석"],
    address: "서울 용산구 이태원로 89", savedCount: 198,
  },
  {
    id: 5, name: "마마카페", category: "cafe", region: "seoul", area: "성동구",
    rating: 4.8, tags: ["디카페인", "유기농", "베이커리"],
    description: "임산부 & 맘을 위한 전용 카페. 디카페인 메뉴와 유기농 디저트가 가득!",
    emoji: "☕", priceRange: "5,000~12,000원",
    pregnancyPerks: ["전 메뉴 디카페인 가능", "수유실 완비", "유기농 디저트"],
    address: "서울 성동구 성수이로 34", savedCount: 521,
  },
  {
    id: 6, name: "미소정", category: "japanese", region: "seoul", area: "송파구",
    rating: 4.5, tags: ["우동", "덮밥", "키즈존"],
    description: "따뜻한 우동과 건강한 덮밥 전문점. 날것 없이 안심하고 먹을 수 있어요.",
    emoji: "🍱", priceRange: "10,000~16,000원",
    pregnancyPerks: ["생선회 없는 메뉴 구성", "넓은 좌석 간격", "키즈존"],
    address: "서울 송파구 올림픽로 156", savedCount: 178,
  },
  {
    id: 7, name: "만두공방", category: "chinese", region: "seoul", area: "종로구",
    rating: 4.7, tags: ["수제만두", "찐만두", "건강식"],
    description: "100% 국내산 재료로 빚은 수제 만두 전문점. 찐만두라 기름 걱정 없어요.",
    emoji: "🥟", priceRange: "8,000~15,000원",
    pregnancyPerks: ["찜 요리 위주", "MSG 무첨가", "포장 가능"],
    address: "서울 종로구 인사동길 22", savedCount: 234,
  },
  {
    id: 8, name: "봄날의 식탁", category: "korean", region: "seoul", area: "광진구",
    rating: 4.6, tags: ["가정식", "반찬가게", "영양밥"],
    description: "엄마 손맛 그대로! 철분과 엽산이 풍부한 나물 반찬과 영양밥이 인기.",
    emoji: "🌸", priceRange: "9,000~14,000원",
    pregnancyPerks: ["영양 성분표 제공", "소포장 반찬", "배달 가능"],
    address: "서울 광진구 아차산로 78", savedCount: 312,
  },
  {
    id: 9, name: "어반그로서리", category: "salad", region: "seoul", area: "강남구",
    rating: 4.4, tags: ["주스", "스무디", "샌드위치"],
    description: "매일 아침 직접 짜는 생과일 주스와 건강 샌드위치. 입덧 시기에 특히 좋아요.",
    emoji: "🍊", priceRange: "7,000~13,000원",
    pregnancyPerks: ["생과일 주스 전문", "저당 메뉴", "영양소 표기"],
    address: "서울 강남구 선릉로 91", savedCount: 267,
  },
  {
    id: 10, name: "더 키친", category: "western", region: "seoul", area: "마포구",
    rating: 4.7, tags: ["브런치", "수프", "홈메이드"],
    description: "매일 아침 직접 만드는 수프와 빵이 일품인 브런치 카페. 아늑한 분위기.",
    emoji: "🥖", priceRange: "14,000~22,000원",
    pregnancyPerks: ["홈메이드 수프", "편안한 소파석", "주차 가능"],
    address: "서울 마포구 와우산로 56", savedCount: 189,
  },

  // ── 경기 ──
  {
    id: 11, name: "맘스키친", category: "korean", region: "gyeonggi", area: "성남시",
    rating: 4.7, tags: ["산후조리식", "보양식", "배달"],
    description: "산후조리원 출신 셰프의 보양식 전문점. 미역국, 삼계탕 등 산모식이 일품!",
    emoji: "🍲", priceRange: "12,000~20,000원",
    pregnancyPerks: ["산모 맞춤 메뉴", "저염 조리", "배달 가능"],
    address: "경기 성남시 분당구 서현로 123", savedCount: 389,
  },
  {
    id: 12, name: "올리브가든", category: "western", region: "gyeonggi", area: "수원시",
    rating: 4.5, tags: ["파스타", "리조또", "넓은공간"],
    description: "넓은 공간에서 편안하게 즐기는 수제 파스타. 임산부 할인 이벤트도!",
    emoji: "🫒", priceRange: "15,000~28,000원",
    pregnancyPerks: ["넓은 좌석 간격", "임산부 10% 할인", "주차 편리"],
    address: "경기 수원시 영통구 광교로 45", savedCount: 201,
  },
  {
    id: 13, name: "숲속카페", category: "cafe", region: "gyeonggi", area: "고양시",
    rating: 4.8, tags: ["디카페인", "자연경관", "산책"],
    description: "숲 속에 위치한 힐링 카페. 디카페인 음료와 수제 쿠키가 유명해요.",
    emoji: "🌲", priceRange: "6,000~14,000원",
    pregnancyPerks: ["전 메뉴 디카페인 가능", "산책로 연결", "평상 좌석"],
    address: "경기 고양시 일산서구 호수로 67", savedCount: 445,
  },
  {
    id: 14, name: "청산가든", category: "korean", region: "gyeonggi", area: "용인시",
    rating: 4.6, tags: ["한우", "갈비", "넓은주차"],
    description: "프리미엄 한우 갈비와 건강한 반찬. 가족 모임에도 좋아요.",
    emoji: "🥩", priceRange: "25,000~50,000원",
    pregnancyPerks: ["웰던 가능", "넓은 개인실", "대형 주차장"],
    address: "경기 용인시 수지구 포은대로 89", savedCount: 167,
  },
  {
    id: 15, name: "하남 건강밥상", category: "salad", region: "gyeonggi", area: "하남시",
    rating: 4.5, tags: ["뷔페", "건강식", "유기농"],
    description: "유기농 건강식 뷔페. 샐러드바와 건강 주스가 무한리필!",
    emoji: "🥬", priceRange: "16,000~22,000원",
    pregnancyPerks: ["유기농 식재료", "다양한 메뉴 선택", "넓은 공간"],
    address: "경기 하남시 미사강변로 34", savedCount: 298,
  },

  // ── 인천 ──
  {
    id: 16, name: "바다정원", category: "korean", region: "incheon", area: "연수구",
    rating: 4.6, tags: ["해산물", "미역국", "바다전망"],
    description: "신선한 해산물과 정성스러운 미역국. 바다가 보이는 전망이 힐링돼요.",
    emoji: "🌊", priceRange: "13,000~25,000원",
    pregnancyPerks: ["완전 가열 해산물", "오션뷰 좌석", "개인실"],
    address: "인천 연수구 송도과학로 78", savedCount: 234,
  },
  {
    id: 17, name: "달콤한 오후", category: "cafe", region: "incheon", area: "부평구",
    rating: 4.4, tags: ["베이커리", "디카페인", "수제케이크"],
    description: "수제 케이크와 디카페인 음료가 맛있는 동네 카페. 임산부 사이 입소문!",
    emoji: "🍰", priceRange: "5,000~10,000원",
    pregnancyPerks: ["저당 케이크", "전 메뉴 디카페인 가능", "편한 좌석"],
    address: "인천 부평구 부평대로 45", savedCount: 156,
  },
  {
    id: 18, name: "소호정", category: "japanese", region: "incheon", area: "남동구",
    rating: 4.5, tags: ["소바", "우동", "덮밥"],
    description: "수타 소바와 따뜻한 우동이 맛있는 일식당. 날것 없이 안전해요.",
    emoji: "🍜", priceRange: "9,000~15,000원",
    pregnancyPerks: ["생선회 없음", "따뜻한 메뉴 위주", "조용한 분위기"],
    address: "인천 남동구 구월로 112", savedCount: 143,
  },
];

export const restaurants: Restaurant[] = crawledRestaurants.length > 0 ? crawledRestaurants : _defaultRestaurants;

// ─── Tips ────────────────────────────────────────────────

const _defaultTips: Tip[] = [
  {
    id: 1, title: "임신 초기, 꼭 챙겨야 할 영양제 TOP 5", category: "nutrition",
    summary: "엽산, 철분, 비타민D, 오메가3, 칼슘 — 시기별 복용법과 추천 제품을 정리했어요.",
    content: "임신 초기에는 엽산이 가장 중요합니다. 임신 전부터 복용하는 것이 좋으며, 하루 400~800mcg을 권장합니다.",
    source: "서울대학교병원 산부인과", emoji: "💊", likes: 1243,
    gradient: "from-rose-400 to-pink-300",
  },
  {
    id: 2, title: "임산부 요가, 집에서 따라할 수 있는 5가지 동작", category: "exercise",
    summary: "허리 통증 완화와 순산을 위한 안전한 요가 동작. 각 트리메스터별 주의사항도 함께!",
    content: "임산부 요가는 혈액순환을 돕고 스트레스를 줄여줍니다.",
    source: "대한산부인과학회", emoji: "🧘‍♀️", likes: 987,
    gradient: "from-violet-400 to-purple-300",
  },
  {
    id: 3, title: "입덧이 심할 때 먹기 좋은 음식 리스트", category: "nutrition",
    summary: "크래커, 레몬수, 생강차부터 의외의 입덧 완화 음식까지. 실제 맘들의 후기 모음!",
    content: "입덧은 보통 임신 6~12주에 가장 심합니다. 소량씩 자주 먹는 것이 도움이 됩니다.",
    source: "임산부 커뮤니티 설문", emoji: "🤢", likes: 2156,
    gradient: "from-emerald-400 to-teal-300",
  },
  {
    id: 4, title: "임신 중 우울감, 혼자 이겨내지 마세요", category: "mental",
    summary: "산전 우울증의 증상과 대처법. 전문 상담 기관 리스트와 자가 진단 체크리스트.",
    content: "임신 중 호르몬 변화로 인한 우울감은 자연스러운 것입니다.",
    source: "국립정신건강센터", emoji: "💜", likes: 876,
    gradient: "from-sky-400 to-blue-300",
  },
  {
    id: 5, title: "서울 산부인과 베스트 10 (2026년 최신)", category: "hospital",
    summary: "실제 출산 후기를 바탕으로 선정한 서울 지역 산부인과 추천 리스트.",
    content: "병원 선택 시 의사의 전문성, 시설, 접근성, 야간 진료 여부 등을 종합적으로 고려하세요.",
    source: "맘마 에디터", emoji: "🏥", likes: 1567,
    gradient: "from-amber-400 to-orange-300",
  },
  {
    id: 6, title: "출산 가방 체크리스트 — 이것만 챙기세요", category: "product",
    summary: "출산 예정일 4주 전부터 준비! 산모용, 신생아용, 퇴원용으로 나눠 정리했어요.",
    content: "출산 가방은 임신 36주 전에 미리 준비해두는 것이 좋습니다.",
    source: "맘마 에디터", emoji: "🧳", likes: 2341,
    gradient: "from-rose-400 to-red-300",
  },
  {
    id: 7, title: "임산부를 위한 안전한 스트레칭 루틴", category: "exercise",
    summary: "하루 15분, 부종과 허리 통증을 줄여주는 간단한 스트레칭 가이드.",
    content: "가벼운 스트레칭은 임신 중 흔한 불편함을 완화하는 데 큰 도움이 됩니다.",
    source: "분당서울대학교병원", emoji: "🤸‍♀️", likes: 654,
    gradient: "from-lime-400 to-green-300",
  },
  {
    id: 8, title: "임신 중기, 태교 음악 플레이리스트 추천", category: "mental",
    summary: "클래식부터 자연의 소리까지, 아기와 엄마 모두를 위한 태교 음악 모음.",
    content: "태교 음악은 임신 16주 이후부터 효과적입니다.",
    source: "한국태교학회", emoji: "🎵", likes: 743,
    gradient: "from-indigo-400 to-violet-300",
  },
  {
    id: 9, title: "신생아 용품, 꼭 필요한 것 vs 낭비되는 것", category: "product",
    summary: "선배맘 500명에게 물었습니다. 실제로 쓰는 용품과 안 쓰는 용품 정리!",
    content: "신생아 용품은 생각보다 많이 필요하지 않습니다.",
    source: "임산부 커뮤니티 설문", emoji: "👶", likes: 1890,
    gradient: "from-pink-400 to-rose-300",
  },
  {
    id: 10, title: "임신성 당뇨, 이렇게 관리하세요", category: "nutrition",
    summary: "임신성 당뇨 진단 후 식단 관리법과 혈당 체크 요령.",
    content: "임신성 당뇨는 전체 임산부의 약 10%에서 발생합니다.",
    source: "대한당뇨병학회", emoji: "🩺", likes: 1102,
    gradient: "from-cyan-400 to-sky-300",
  },
];

export const tips: Tip[] = crawledTips.length > 0 ? crawledTips : _defaultTips;

// ─── Weekly Guide (40주 전체) ────────────────────────────

const BABY_SIZES: [string, string, string, string][] = [
  ["수정 준비기", "✨", "-", "-"],
  ["수정란 형성", "✨", "-", "-"],
  ["배아 착상", "🌱", "-", "0.01cm"],
  ["양귀비 씨앗", "🌱", "<0.1g", "0.1cm"],
  ["참깨", "🌱", "<0.1g", "0.2cm"],
  ["렌즈콩", "🫘", "<1g", "0.6cm"],
  ["블루베리", "🫐", "약 1g", "1.0cm"],
  ["라즈베리", "🫐", "약 1g", "1.6cm"],
  ["포도알", "🍇", "약 2g", "2.3cm"],
  ["금귤", "🍊", "약 4g", "3.1cm"],
  ["무화과", "🫒", "약 7g", "4.1cm"],
  ["라임", "🍋", "약 14g", "5.4cm"],
  ["레몬", "🍋", "약 23g", "7.4cm"],
  ["복숭아", "🍑", "약 43g", "8.7cm"],
  ["사과", "🍎", "약 70g", "10cm"],
  ["아보카도", "🥑", "약 100g", "11.6cm"],
  ["순무", "🥔", "약 140g", "13cm"],
  ["고구마", "🍠", "약 190g", "14.2cm"],
  ["망고", "🥭", "약 240g", "15.3cm"],
  ["바나나", "🍌", "약 300g", "25cm"],
  ["당근", "🥕", "약 360g", "26.7cm"],
  ["파파야", "🥭", "약 430g", "27.8cm"],
  ["자몽", "🍊", "약 500g", "28.9cm"],
  ["옥수수", "🌽", "약 600g", "30cm"],
  ["콜리플라워", "🥦", "약 660g", "34.6cm"],
  ["양상추", "🥬", "약 760g", "35.6cm"],
  ["브로콜리", "🥦", "약 875g", "36.6cm"],
  ["가지", "🍆", "약 1.0kg", "37.6cm"],
  ["호박", "🎃", "약 1.15kg", "38.6cm"],
  ["양배추", "🥬", "약 1.3kg", "39.9cm"],
  ["코코넛", "🥥", "약 1.5kg", "41.1cm"],
  ["파인애플", "🍍", "약 1.7kg", "42.4cm"],
  ["파인애플", "🍍", "약 1.9kg", "43.7cm"],
  ["멜론", "🍈", "약 2.1kg", "45cm"],
  ["허니듀 멜론", "🍈", "약 2.4kg", "46.2cm"],
  ["큰 상추", "🥬", "약 2.6kg", "47.4cm"],
  ["근대 한 단", "🥬", "약 2.9kg", "48.6cm"],
  ["대파 한 단", "🥬", "약 3.0kg", "49.8cm"],
  ["작은 수박", "🍉", "약 3.2kg", "50.7cm"],
  ["수박", "🍉", "약 3.3kg", "51cm"],
];

interface WeekDetail {
  dev: string[];
  mom: string[];
  tips: string[];
  good: string[];
  avoid: string[];
}

const WEEK_DETAILS: [number, number, WeekDetail][] = [
  [1, 2, {
    dev: ["난자와 정자가 만날 준비를 합니다", "자궁 내막이 두꺼워지고 있어요"],
    mom: ["아직 임신 증상은 없어요", "생리 주기가 진행 중이에요"],
    tips: ["엽산 복용을 미리 시작하세요", "건강한 생활 습관을 유지하세요"],
    good: ["엽산 풍부 식품 (시금치, 브로콜리)", "견과류", "통곡물"],
    avoid: ["알코올", "과도한 카페인", "흡연"],
  }],
  [3, 3, {
    dev: ["수정란이 자궁으로 이동 중", "세포 분열이 활발히 진행"],
    mom: ["착상 시 미세한 출혈 가능", "가벼운 복부 당김"],
    tips: ["아직 임신 확인이 어려운 시기예요", "규칙적인 생활을 유지하세요"],
    good: ["단백질 풍부 식품", "비타민C 과일", "물 충분히"],
    avoid: ["알코올", "날 음식", "과도한 운동"],
  }],
  [4, 5, {
    dev: ["수정란이 자궁에 착상!", "태반과 탯줄이 형성되기 시작", "심장이 만들어지기 시작"],
    mom: ["생리가 멈춤", "임신 테스트기 양성 반응 가능", "가벼운 피로감"],
    tips: ["산부인과 첫 방문을 예약하세요", "엽산을 꾸준히 복용하세요"],
    good: ["시금치", "브로콜리", "견과류", "계란"],
    avoid: ["생선회", "덜 익힌 고기", "카페인 과다 섭취"],
  }],
  [6, 7, {
    dev: ["심장 박동이 시작됨!", "팔다리 싹이 나타남", "뇌가 빠르게 발달 시작"],
    mom: ["입덧이 시작될 수 있어요", "극심한 졸림", "가슴이 민감해짐"],
    tips: ["입덧이 심하면 소량씩 자주 드세요", "충분한 수면을 취하세요"],
    good: ["생강차", "레몬수", "크래커", "바나나"],
    avoid: ["기름진 음식", "강한 냄새 나는 음식", "매운 음식"],
  }],
  [8, 9, {
    dev: ["손가락과 발가락이 형성되기 시작", "심장이 분당 150~170회 뜀", "모든 주요 장기의 기초 형성"],
    mom: ["입덧이 가장 심한 시기", "잦은 소변", "감정 기복"],
    tips: ["수분 섭취를 충분히 하세요", "비타민 B6가 입덧에 도움 될 수 있어요"],
    good: ["토스트", "수박", "요거트", "쌀죽"],
    avoid: ["탄산음료", "인스턴트 식품", "과도한 당류"],
  }],
  [10, 11, {
    dev: ["태아기로 전환 (배아→태아)", "손톱, 머리카락이 자라기 시작", "치아 싹이 형성"],
    mom: ["배에 약간의 변화", "피부 변화 (여드름, 기미)", "정맥이 두드러질 수 있음"],
    tips: ["충분한 수분과 섬유질 섭취", "편한 옷을 준비하세요"],
    good: ["비타민C 과일", "유제품", "철분 식품"],
    avoid: ["고카페인 음료", "생고기", "소프트 치즈"],
  }],
  [12, 13, {
    dev: ["모든 주요 기관이 형성 완료!", "반사 작용이 시작됨", "초음파에서 움직이는 모습 확인 가능"],
    mom: ["입덧이 줄어들기 시작", "에너지가 조금씩 회복", "배가 약간 나오기 시작"],
    tips: ["1차 기형아 검사 시기예요", "치과 검진을 받아두세요", "편한 속옷으로 교체"],
    good: ["연어 (익힌 것)", "고구마", "아보카도"],
    avoid: ["참치 과다 섭취 (수은)", "생햄", "훈제 연어"],
  }],
  [14, 15, {
    dev: ["얼굴 표정을 지을 수 있음", "솜털(배냇머리)이 온몸에 생김", "성별 구분이 가능해지기 시작"],
    mom: ["안정기 진입! 컨디션 회복", "식욕이 돌아옴", "코막힘이 생길 수 있음"],
    tips: ["2차 기형아 검사 시기", "가벼운 운동 시작 가능!"],
    good: ["소고기 (철분)", "시금치", "두부", "우유"],
    avoid: ["가공육", "과도한 소금", "알코올"],
  }],
  [16, 17, {
    dev: ["태동을 느끼기 시작!", "청각이 발달하기 시작", "골격이 단단해지는 중"],
    mom: ["태동 느낌 (포근포근, 가스 같은 느낌)", "배가 눈에 띄게 나옴", "허리 통증 시작"],
    tips: ["태교를 시작하기 좋은 시기", "임산부 수영/요가 추천", "태동일지를 써보세요"],
    good: ["칼슘 풍부 식품 (우유, 치즈)", "비타민D", "오메가3"],
    avoid: ["인스턴트 식품", "과도한 설탕", "날 달걀"],
  }],
  [18, 19, {
    dev: ["귀가 완성되어 소리를 들을 수 있음", "태지(보호막)가 형성되기 시작", "활발한 움직임"],
    mom: ["배가 빠르게 커짐", "현기증이 날 수 있음", "다리 경련 시작 가능"],
    tips: ["정밀 초음파 준비", "임산부 전용 바디크림 사용", "왼쪽으로 눕기 연습"],
    good: ["마그네슘 식품 (바나나, 견과류)", "단백질", "해조류"],
    avoid: ["오래 서 있기", "높은 굽 신발", "과격한 운동"],
  }],
  [20, 21, {
    dev: ["성별 확인 가능!", "태동이 활발해짐", "피부에 태지가 형성됨"],
    mom: ["배꼽 위까지 자궁이 올라옴", "허리 통증 증가", "피부 변화 (임신선)"],
    tips: ["정밀 초음파 시기", "스트레칭을 꾸준히!", "임산부 전용 크림으로 보습"],
    good: ["오메가3 (견과류)", "칼슘 식품", "철분 식품"],
    avoid: ["고카페인 음료", "날것", "과도한 소금"],
  }],
  [22, 23, {
    dev: ["눈썹과 속눈썹이 생김", "미각이 발달하여 양수 맛을 느낌", "폐가 발달 시작"],
    mom: ["손발 부종 시작 가능", "브랙스톤 힉스(가진통) 가능", "숨이 조금 가빠짐"],
    tips: ["다리를 높이 올리고 쉬세요", "적절한 체중 관리", "부종에는 수박이 도움"],
    good: ["수박", "오이", "단호박", "잡곡밥"],
    avoid: ["짠 음식", "오래 앉아있기", "무거운 물건 들기"],
  }],
  [24, 25, {
    dev: ["폐에서 호흡 연습 시작", "맛을 느낄 수 있음", "수면/각성 패턴이 생김"],
    mom: ["임신성 당뇨 검사 시기", "다리 경련이 심해질 수 있음", "변비"],
    tips: ["임신성 당뇨 검사 꼭 받으세요!", "섬유질 섭취를 늘리세요", "적절한 산책"],
    good: ["통곡물", "녹색 채소", "해조류", "잡곡밥"],
    avoid: ["고당분 간식", "과도한 탄수화물", "가공식품"],
  }],
  [26, 27, {
    dev: ["눈을 뜨고 감을 수 있음!", "뇌가 급격히 발달", "면역 체계 발달 시작"],
    mom: ["잠자기 힘들어짐", "속쓰림 증가", "빈혈 위험 증가"],
    tips: ["철분 보충에 신경 쓰세요", "수면 자세: 왼쪽이 최적", "백일해 예방접종 상담"],
    good: ["소간 (철분)", "깻잎", "콩류", "비타민C와 함께"],
    avoid: ["카페인 (철분 흡수 방해)", "야식", "눕자마자 잠자기"],
  }],
  [28, 29, {
    dev: ["체온 조절 능력 발달 시작", "REM 수면을 함", "지방이 축적되기 시작"],
    mom: ["숨이 차기 시작", "잦은 화장실", "요통/좌골신경통 가능"],
    tips: ["출산 준비 교실 등록", "태동 횟수 체크 시작", "편한 신발 착용"],
    good: ["호두", "블루베리", "달걀", "콩류"],
    avoid: ["야식", "과도한 나트륨", "오래 서있기"],
  }],
  [30, 31, {
    dev: ["뇌가 빠르게 성장", "피하지방이 쌓여 통통해짐", "골수에서 적혈구 생성"],
    mom: ["수면의 질 저하", "브랙스톤 힉스 빈번", "유방에서 초유가 나올 수 있음"],
    tips: ["출산 계획서를 작성해보세요", "아기 용품 준비 시작", "모유수유 교실 등록"],
    good: ["DHA 풍부 식품", "칼슘", "단백질"],
    avoid: ["과식", "자극적인 음식", "장시간 이동"],
  }],
  [32, 33, {
    dev: ["폐 발달이 거의 완성", "뼈가 단단해짐 (두개골 제외)", "머리카락이 자라남"],
    mom: ["가진통이 시작될 수 있음", "빈뇨가 심해짐", "불면증"],
    tips: ["출산 가방 준비!", "분만 방법 결정하기", "소아과 미리 알아보기"],
    good: ["미역", "쇠고기", "단백질 식품", "과일"],
    avoid: ["고열량 간식", "짠 음식", "스트레스"],
  }],
  [34, 35, {
    dev: ["폐 표면활성제 분비 시작", "면역 항체를 엄마에게서 전달받는 중", "거의 완성 단계!"],
    mom: ["배가 많이 무거워짐", "골반 통증", "손목터널증후군 가능"],
    tips: ["주 1회 산전 검진 시작", "회음부 마사지", "충분한 휴식"],
    good: ["소화 잘 되는 음식", "단백질", "비타민K 식품"],
    avoid: ["과식", "무리한 활동", "장거리 여행"],
  }],
  [36, 37, {
    dev: ["대부분의 장기가 완성!", "머리가 아래로 내려옴 (두정위)", "체중이 빠르게 증가"],
    mom: ["배가 많이 처짐", "걷기가 힘들어짐", "소화 불량"],
    tips: ["출산 징후를 숙지하세요", "병원 가는 경로 확인", "아기 카시트 설치"],
    good: ["소화가 잘 되는 음식", "따뜻한 음식", "과일"],
    avoid: ["소화 안 되는 음식", "과식", "격한 운동"],
  }],
  [38, 39, {
    dev: ["모든 장기가 성숙!", "태지가 줄어듦", "세상에 나올 준비 거의 완료"],
    mom: ["이슬이 비칠 수 있음", "진통 시작 가능", "극심한 피로"],
    tips: ["진통 간격을 체크하세요", "병원 가방 최종 확인", "충분히 쉬세요"],
    good: ["가벼운 식사", "에너지바", "충분한 수분"],
    avoid: ["과식", "불안감", "무리한 외출"],
  }],
  [40, 40, {
    dev: ["모든 장기가 완성!", "세상에 나올 준비 100% 완료", "평균 3.3kg, 51cm"],
    mom: ["이슬/양수 파수 가능", "규칙적인 진통 시작", "출산 임박!"],
    tips: ["진통 5분 간격이면 병원으로!", "편안한 마음가짐을 유지하세요", "파트너와 호흡법 연습"],
    good: ["가벼운 식사", "에너지 보충 간식", "충분한 수분"],
    avoid: ["과식", "자극적인 음식", "불안감"],
  }],
];

function getDetailForWeek(week: number): WeekDetail {
  for (const [from, to, detail] of WEEK_DETAILS) {
    if (week >= from && week <= to) return detail;
  }
  return WEEK_DETAILS[WEEK_DETAILS.length - 1][2];
}

export const weeklyGuide: WeekInfo[] = BABY_SIZES.map(([size, emoji, weight, length], i) => {
  const week = i + 1;
  const detail = getDetailForWeek(week);
  return {
    week,
    trimester: week <= 13 ? 1 : week <= 27 ? 2 : 3,
    babySize: size,
    babySizeEmoji: emoji,
    babyWeight: weight,
    babyLength: length,
    babyDevelopment: detail.dev,
    momChanges: detail.mom,
    tips: detail.tips,
    goodFoods: detail.good,
    avoidFoods: detail.avoid,
  };
});

// ─── Curated Feed (SNS 큐레이션) ─────────────────────────

const _defaultCurated: CuratedPost[] = [
  {
    id: 1, source: "instagram", sourceAccount: "@mama_foodie",
    title: "임산부 추천 디저트 카페 5곳",
    summary: "디카페인 라떼와 저당 디저트가 있는 카페만 모았어요!",
    tags: ["#임산부맛집", "#디카페인카페"],
    likes: 1523, emoji: "☕", gradient: "from-pink-400 to-rose-300",
  },
  {
    id: 2, source: "blog", sourceAccount: "달콩이네 육아일기",
    title: "임신 20주 정밀초음파 후기",
    summary: "강남 OO병원에서 정밀초음파 받았어요. 비용, 소요시간, 느낌 공유!",
    tags: ["#정밀초음파", "#임신20주"],
    likes: 892, emoji: "🏥", gradient: "from-sky-400 to-blue-300",
  },
  {
    id: 3, source: "instagram", sourceAccount: "@preggo_yoga",
    title: "임산부 필라테스 동작 3가지 (영상)",
    summary: "집에서 매트 하나로 따라하는 안전한 필라테스 루틴",
    tags: ["#임산부운동", "#필라테스"],
    likes: 2341, emoji: "🧘‍♀️", gradient: "from-violet-400 to-purple-300",
  },
  {
    id: 4, source: "cafe", sourceAccount: "맘스홀릭 베이비",
    title: "2026년 신생아 용품 가성비 랭킹",
    summary: "실제 사용 후기 기반! 꼭 필요한 vs 안 사도 되는 용품 정리",
    tags: ["#신생아용품", "#출산준비"],
    likes: 3102, emoji: "🍼", gradient: "from-amber-400 to-orange-300",
  },
  {
    id: 5, source: "blog", sourceAccount: "소소한 임신일기",
    title: "임신성 당뇨 식단 일주일 실전 기록",
    summary: "혈당 관리하면서도 맛있게 먹기! 실제 식단 사진 포함",
    tags: ["#임신성당뇨", "#식단관리"],
    likes: 1876, emoji: "📝", gradient: "from-emerald-400 to-teal-300",
  },
  {
    id: 6, source: "instagram", sourceAccount: "@bump_style_kr",
    title: "임산부 패션 코디 모음 (봄/여름)",
    summary: "편하면서도 예쁜! 배 나와도 멋스러운 코디 20가지",
    tags: ["#임산부패션", "#맘룩"],
    likes: 2756, emoji: "👗", gradient: "from-rose-400 to-pink-300",
  },
  {
    id: 7, source: "cafe", sourceAccount: "예비맘 정보공유",
    title: "출산 병원 선택 가이드 (서울/경기)",
    summary: "분만비용, 시설, 의사 상담 후기까지 한번에 비교",
    tags: ["#출산병원", "#병원비교"],
    likes: 1432, emoji: "🏥", gradient: "from-indigo-400 to-blue-300",
  },
  {
    id: 8, source: "instagram", sourceAccount: "@healthy_preggo",
    title: "임신 중 먹어도 되는 약 총정리",
    summary: "두통, 감기, 소화불량… 상황별 안전한 약 가이드",
    tags: ["#임산부약", "#임신건강"],
    likes: 4521, emoji: "💊", gradient: "from-cyan-400 to-sky-300",
  },
];

export const curatedFeed: CuratedPost[] = crawledCurated.length > 0 ? crawledCurated : _defaultCurated;

// ─── Community Posts (샘플) ──────────────────────────────

export const sampleCommunityPosts: CommunityPost[] = [
  {
    id: 1, author: "예비맘소연", category: "restaurant",
    title: "임신 16주, 강남역 근처 맛집 추천해요!",
    content: "자연밥상이라는 곳인데 저염식 정식이 있어서 너무 좋았어요. 개인실도 넓고 편안했습니다. 임산부분들 꼭 가보세요!",
    likes: 23, comments: 8, createdAt: "2026-03-30", emoji: "🍽️",
  },
  {
    id: 2, author: "둘째맘지은", category: "tip",
    title: "입덧 완화에 진짜 효과 있었던 방법",
    content: "저는 레몬 향 맡기 + 탄산수 + 크래커 조합이 효과 있었어요. 생강차는 오히려 역효과… 개인차가 크니까 다양하게 시도해보세요!",
    likes: 45, comments: 12, createdAt: "2026-03-29", emoji: "💡",
  },
  {
    id: 3, author: "첫째맘하나", category: "question",
    title: "임신 28주인데 다리 경련이 너무 심해요 ㅠㅠ",
    content: "밤에 자다가 다리 경련 때문에 깨는 일이 많아졌어요. 마그네슘 먹고 있는데도 계속 그래요. 다른 분들은 어떻게 하시나요?",
    likes: 18, comments: 15, createdAt: "2026-03-28", emoji: "🤔",
  },
  {
    id: 4, author: "행복한예비맘", category: "review",
    title: "강남 차앤박 산부인과 정밀초음파 후기",
    content: "20주 정밀초음파 받고 왔어요! 원장님이 정말 친절하시고 설명도 자세하게 해주셨어요. 대기 시간은 좀 길었지만 만족합니다.",
    likes: 31, comments: 6, createdAt: "2026-03-27", emoji: "✍️",
  },
  {
    id: 5, author: "서현맘", category: "restaurant",
    title: "분당 맘스키친 진짜 맛있어요!",
    content: "산후조리원 출신 셰프가 운영하시는데, 미역국이 정말 일품이에요. 저염이라 맛없을 줄 알았는데 감칠맛이 장난 아닙니다.",
    likes: 37, comments: 9, createdAt: "2026-03-26", emoji: "🍽️",
  },
  {
    id: 6, author: "예비파파준혁", category: "question",
    title: "남편이 임산부 아내를 위해 해줄 수 있는 것?",
    content: "아내가 임신 12주인데 입덧이 심합니다. 남편으로서 뭘 해줄 수 있을까요? 선배 아빠/맘들의 조언 부탁드려요!",
    likes: 52, comments: 23, createdAt: "2026-03-25", emoji: "🤔",
  },
];
