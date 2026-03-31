export interface NurseryItem {
  id: string;
  name: string;
  category: "wallpaper" | "floor" | "furniture" | "deco" | "toy" | "mobile";
  price: number;
  emoji: string;
  cssClass: string;
  description: string;
  unlockWeek?: number;
}

export const NURSERY_CATEGORIES = [
  { id: "wallpaper", label: "벽지", emoji: "🎨" },
  { id: "floor", label: "바닥", emoji: "🪵" },
  { id: "furniture", label: "가구", emoji: "🪑" },
  { id: "deco", label: "장식", emoji: "✨" },
  { id: "toy", label: "장난감", emoji: "🧸" },
  { id: "mobile", label: "모빌", emoji: "🌙" },
] as const;

export const nurseryItems: NurseryItem[] = [
  // Wallpapers
  { id: "wp-cream", name: "크림 벽지", category: "wallpaper", price: 0, emoji: "🤍", cssClass: "bg-[#FFF9F0]", description: "따뜻한 크림색 기본 벽지" },
  { id: "wp-pink", name: "핑크 벽지", category: "wallpaper", price: 30, emoji: "🩷", cssClass: "bg-[#FFF0F3]", description: "사랑스러운 핑크색 벽지" },
  { id: "wp-sky", name: "하늘 벽지", category: "wallpaper", price: 30, emoji: "💙", cssClass: "bg-[#F0F6FF]", description: "맑은 하늘색 벽지" },
  { id: "wp-mint", name: "민트 벽지", category: "wallpaper", price: 30, emoji: "💚", cssClass: "bg-[#F0FFF6]", description: "상쾌한 민트색 벽지" },
  { id: "wp-lavender", name: "라벤더 벽지", category: "wallpaper", price: 50, emoji: "💜", cssClass: "bg-[#F5F0FF]", description: "은은한 라벤더색 벽지" },
  { id: "wp-star", name: "별빛 벽지", category: "wallpaper", price: 80, emoji: "⭐", cssClass: "bg-gradient-to-b from-[#1a1a3e] to-[#2d2d5e]", description: "밤하늘에 별이 가득한 벽지" },
  { id: "wp-cloud", name: "구름 벽지", category: "wallpaper", price: 60, emoji: "☁️", cssClass: "bg-gradient-to-b from-[#E8F4FD] to-[#F8FCFF]", description: "포근한 구름무늬 벽지" },

  // Floors
  { id: "fl-wood", name: "원목 바닥", category: "floor", price: 0, emoji: "🪵", cssClass: "bg-[#DEB887]", description: "따뜻한 원목 바닥" },
  { id: "fl-white", name: "화이트 타일", category: "floor", price: 40, emoji: "⬜", cssClass: "bg-[#F5F5F0]", description: "깔끔한 화이트 타일" },
  { id: "fl-pink", name: "핑크 카펫", category: "floor", price: 50, emoji: "🩷", cssClass: "bg-[#FFD6DD]", description: "부드러운 핑크 카펫" },
  { id: "fl-green", name: "잔디 매트", category: "floor", price: 60, emoji: "🌿", cssClass: "bg-[#B5D89A]", description: "자연을 닮은 잔디 매트" },

  // Furniture
  { id: "fu-crib", name: "아기 침대", category: "furniture", price: 50, emoji: "🛏️", cssClass: "", description: "포근한 아기 침대" },
  { id: "fu-dresser", name: "서랍장", category: "furniture", price: 40, emoji: "🗄️", cssClass: "", description: "아기 옷을 넣는 서랍장" },
  { id: "fu-chair", name: "수유 의자", category: "furniture", price: 60, emoji: "🪑", cssClass: "", description: "편안한 수유 의자" },
  { id: "fu-shelf", name: "동화책 선반", category: "furniture", price: 45, emoji: "📚", cssClass: "", description: "동화책을 꽂는 선반" },
  { id: "fu-lamp", name: "무드등", category: "furniture", price: 30, emoji: "💡", cssClass: "", description: "은은한 아기 무드등" },
  { id: "fu-rug", name: "놀이 매트", category: "furniture", price: 35, emoji: "🟫", cssClass: "", description: "폭신한 놀이 매트" },

  // Decorations
  { id: "de-frame", name: "초음파 액자", category: "deco", price: 25, emoji: "🖼️", cssClass: "", description: "소중한 초음파 사진 액자" },
  { id: "de-garland", name: "가랜드", category: "deco", price: 20, emoji: "🎀", cssClass: "", description: "알록달록 가랜드 장식" },
  { id: "de-plant", name: "작은 화분", category: "deco", price: 15, emoji: "🪴", cssClass: "", description: "공기정화 식물 화분" },
  { id: "de-clock", name: "동물 시계", category: "deco", price: 30, emoji: "🐻", cssClass: "", description: "귀여운 동물 시계" },
  { id: "de-star", name: "별 조명", category: "deco", price: 35, emoji: "✨", cssClass: "", description: "반짝이는 별 조명" },
  { id: "de-rainbow", name: "무지개 장식", category: "deco", price: 40, emoji: "🌈", cssClass: "", description: "행복한 무지개 장식" },
  { id: "de-name", name: "이름 월아트", category: "deco", price: 50, emoji: "🔤", cssClass: "", description: "아기 이름 월아트", unlockWeek: 20 },

  // Toys
  { id: "to-bear", name: "곰돌이", category: "toy", price: 20, emoji: "🧸", cssClass: "", description: "부드러운 곰돌이 인형" },
  { id: "to-bunny", name: "토끼 인형", category: "toy", price: 25, emoji: "🐰", cssClass: "", description: "사랑스러운 토끼 인형" },
  { id: "to-blocks", name: "블록 세트", category: "toy", price: 30, emoji: "🧱", cssClass: "", description: "알록달록 블록 세트" },
  { id: "to-rattle", name: "딸랑이", category: "toy", price: 15, emoji: "🎵", cssClass: "", description: "소리나는 딸랑이" },
  { id: "to-duck", name: "오리 인형", category: "toy", price: 20, emoji: "🦆", cssClass: "", description: "귀여운 오리 인형" },

  // Mobiles
  { id: "mo-star", name: "별 모빌", category: "mobile", price: 40, emoji: "⭐", cssClass: "", description: "반짝이는 별 모빌" },
  { id: "mo-cloud", name: "구름 모빌", category: "mobile", price: 45, emoji: "☁️", cssClass: "", description: "포근한 구름 모빌" },
  { id: "mo-animal", name: "동물 모빌", category: "mobile", price: 55, emoji: "🦁", cssClass: "", description: "귀여운 동물들 모빌" },
  { id: "mo-moon", name: "달 모빌", category: "mobile", price: 50, emoji: "🌙", cssClass: "", description: "은은한 달빛 모빌" },
];

export interface ChecklistItem {
  id: string;
  label: string;
  category: "hospital" | "baby" | "mom" | "home";
  recommendedWeek: number;
}

export const CHECKLIST_CATEGORIES = [
  { id: "all", label: "전체", emoji: "📋" },
  { id: "hospital", label: "병원/검진", emoji: "🏥" },
  { id: "baby", label: "아기 용품", emoji: "👶" },
  { id: "mom", label: "엄마 준비", emoji: "🤰" },
  { id: "home", label: "집 준비", emoji: "🏠" },
] as const;

export const birthChecklist: ChecklistItem[] = [
  { id: "ck-1", label: "산부인과 첫 방문 및 임신 확인", category: "hospital", recommendedWeek: 5 },
  { id: "ck-2", label: "엽산제 복용 시작", category: "mom", recommendedWeek: 1 },
  { id: "ck-3", label: "1차 기형아 검사", category: "hospital", recommendedWeek: 12 },
  { id: "ck-4", label: "2차 기형아 검사", category: "hospital", recommendedWeek: 15 },
  { id: "ck-5", label: "정밀 초음파 검사", category: "hospital", recommendedWeek: 20 },
  { id: "ck-6", label: "임신성 당뇨 검사", category: "hospital", recommendedWeek: 24 },
  { id: "ck-7", label: "백일해 예방접종", category: "hospital", recommendedWeek: 27 },
  { id: "ck-8", label: "임산부 요가/운동 시작", category: "mom", recommendedWeek: 14 },
  { id: "ck-9", label: "태교 시작 (음악, 독서)", category: "mom", recommendedWeek: 16 },
  { id: "ck-10", label: "아기 이름 후보 정하기", category: "baby", recommendedWeek: 20 },
  { id: "ck-11", label: "아기 침대 구매", category: "baby", recommendedWeek: 28 },
  { id: "ck-12", label: "카시트 구매 및 설치", category: "baby", recommendedWeek: 32 },
  { id: "ck-13", label: "신생아 옷 준비", category: "baby", recommendedWeek: 30 },
  { id: "ck-14", label: "기저귀/물티슈 구매", category: "baby", recommendedWeek: 34 },
  { id: "ck-15", label: "분유/젖병 준비", category: "baby", recommendedWeek: 34 },
  { id: "ck-16", label: "출산 가방 챙기기", category: "mom", recommendedWeek: 36 },
  { id: "ck-17", label: "산후조리원 예약", category: "mom", recommendedWeek: 16 },
  { id: "ck-18", label: "소아과 미리 알아보기", category: "hospital", recommendedWeek: 32 },
  { id: "ck-19", label: "아기방 정리/꾸미기", category: "home", recommendedWeek: 28 },
  { id: "ck-20", label: "집 안전점검 (모서리, 콘센트)", category: "home", recommendedWeek: 30 },
  { id: "ck-21", label: "출생신고 서류 준비", category: "mom", recommendedWeek: 36 },
  { id: "ck-22", label: "출산 계획서 작성", category: "hospital", recommendedWeek: 34 },
  { id: "ck-23", label: "신생아 보험 알아보기", category: "baby", recommendedWeek: 28 },
  { id: "ck-24", label: "산모 패드/속옷 준비", category: "mom", recommendedWeek: 36 },
];
