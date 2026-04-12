# 맘마 (Mamma) 프로젝트 현황

**최종 업데이트**: 2026-04-12

---

## 프로젝트 요약

| 항목 | 값 |
|------|-----|
| 앱 이름 | 맘마: 임신·출산·난임 필수 앱 |
| 앱 ID | `app.mamma.pregnancy` |
| 웹 URL | https://insta-rho-ten.vercel.app |
| GitHub | https://github.com/wonmin1991/mamma |
| 기술 스택 | Next.js 16.2.3, React 19.2.5, Zustand, Tailwind 4, Capacitor 8, Supabase |
| 총 커밋 | 58건 |
| 총 라우트 | 25개 (+ 동적 라우트) |
| 빌드 상태 | 126 페이지 정적 생성 |

---

## 기능 현황

### 완료된 기능 (24개)

| 기능 | 라우트 | 데이터 | 상태 |
|------|--------|--------|------|
| 홈 (3모드 전환) | `/` | - | 완료 |
| 주차별 가이드 (40주) | `/guide` | mock.ts | 완료 (의학 검증) |
| 정부 혜택 (3,000+건) | `/benefits` | benefits-api.ts | 완료 |
| 난임 시술 가이드 | `/infertility-guide` | infertility.ts | 완료 |
| 난임 꿀팁 (12개) | `/infertility-tips` | infertility.ts | 완료 |
| 초음파 앨범 | `/ultrasound` | useBabyStore | 완료 |
| 영양제 가이드 | `/supplements` | supplements.ts | 완료 (출처 검증) |
| 응급 상황 가이드 | `/emergency` | emergency.ts | 완료 |
| 임산부 맛집 (46개) | `/restaurants` | crawled.ts | 완료 |
| 건강 꿀팁 (20개) | `/tips` | crawled.ts | 완료 |
| SNS 큐레이션 (12개) | `/` | crawled.ts | 완료 |
| 커뮤니티 | `/community` | localStorage | 완료 |
| 북마크 | `/bookmarks` | useStore | 완료 |
| 통합 검색 | `/search` | - | 완료 |
| 아기방 꾸미기 | `/nursery` | nurseryItems.ts | 완료 |
| 부부 모드 | `/couple` | useStore | 완료 |
| 육아 기록 (수유/수면/기저귀) | `/care-log` | useBabyStore | 완료 |
| 성장 기록 | `/growth` | useBabyStore | 완료 |
| 발달 마일스톤 | `/milestones` | useBabyStore | 완료 |
| 예방접종 일정 | `/vaccination` | postnatal.ts | 완료 |
| 이유식 가이드 | `/baby-food` | postnatal.ts | 완료 |
| 성장 일기 | `/diary` | useBabyStore | 완료 |
| 회원가입/로그인 | `/login` | Supabase Auth | 완료 |
| 피드백 | `/feedback` | Supabase DB | 완료 |

### 인프라

| 항목 | 상태 |
|------|------|
| Supabase Auth (이메일) | 완료 |
| 클라우드 데이터 동기화 | 완료 (로그인 시 자동) |
| Vercel Analytics | 완료 |
| Sentry 에러 모니터링 | 준비 완료 (DSN 설정 필요) |
| PWA (오프라인/설치) | 완료 |
| 이용약관 / 개인정보처리방침 | 완료 |
| 자동 검증 스크립트 | 완료 (`scripts/verify-app.sh`) |
| Android 빌드 (서명 포함) | 완료 (AAB 5.9MB) |

---

## 환경변수

### 필수 (현재 사용 중)
```
NEXT_PUBLIC_SUPABASE_URL          # Supabase 프로젝트 URL
NEXT_PUBLIC_SUPABASE_ANON_KEY     # Supabase 공개 키
NAVER_CLIENT_ID                   # 네이버 검색 API (크롤링)
NAVER_CLIENT_SECRET               # 네이버 API 시크릿
DATA_GO_KR_SERVICE_KEY            # 공공데이터포털 (혜택 크롤링)
NEXT_PUBLIC_BASE_URL              # 앱 기본 URL
```

### 선택 (미래 기능)
```
NEXT_PUBLIC_SENTRY_DSN            # Sentry 에러 모니터링
NEXT_PUBLIC_AFFILIATE_ID          # 제휴 링크 (수익화)
NEXT_PUBLIC_BANNER_AD_UNIT_ID     # AdMob 배너 광고
NEXT_PUBLIC_REWARD_AD_UNIT_ID     # AdMob 보상형 광고
NEXT_PUBLIC_VAPID_KEY             # 웹 푸시 알림
```

---

## 외부 서비스

| 서비스 | 용도 | 상태 |
|--------|------|------|
| Supabase | 인증 + DB (user_data, feedback) | 활성 |
| Naver API | 맛집/팁/큐레이션 크롤링 | 활성 |
| 공공데이터포털 | 정부 혜택 3,000+건 | API 키 갱신 필요 |
| Vercel | 웹 호스팅 + Analytics | 활성 |
| Sentry | 에러 모니터링 | DSN 설정 필요 |
| Google Play | Android 앱 배포 | AAB 준비 완료 |
| Capacitor | iOS/Android 네이티브 | SDK 연동 완료 |

---

## NPM 스크립트

| 스크립트 | 용도 |
|----------|------|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run crawl` | 네이버 API 맛집/팁 크롤링 |
| `npm run fetch-benefits` | 공공데이터 혜택 크롤링 |
| `npm run build:static` | 정적 빌드 (모바일용) |
| `npm run build:android` | Android 빌드 + Capacitor 동기화 |
| `npm run build:ios` | iOS 빌드 + Capacitor 동기화 |
| `bash scripts/verify-app.sh` | 앱 품질 자동 검증 (9개 항목) |

---

## 의료 데이터 출처 현황

모든 의료 정보에 출처와 검증일(2026-04-08)이 명시되어 있습니다.

| 데이터 | 출처 |
|--------|------|
| 주차별 발달/증상/팁 | ACOG, Mayo Clinic, Cleveland Clinic, NHS |
| 영양제 용량/시기 | ACOG, WHO, NIH, 식약처, 한국영양학회 |
| 응급 증상 | ACOG, 대한산부인과학회, 서울아산병원 |
| 예방접종 일정 | 질병관리청, WHO, 대한소아과학회 |
| 산전검사 일정 | 대한산부인과학회, ACOG, 국민건강보험공단 |
| 난임 시술 정보 | 대한산부인과학회, 보건복지부, ACOG |

---

## 남은 할 일

### 출시 (필수)
- [ ] Google Play Console 앱 만들기 + AAB 업로드
- [ ] 스토어 등록정보 입력 (이름/설명/아이콘)
- [ ] 스크린샷 5장 캡처 및 업로드
- [ ] 콘텐츠 등급/데이터 안전 양식 작성
- [ ] Google Play 검토 제출

### iOS 출시
- [ ] Apple Developer 계정 등록 ($99/년)
- [ ] iOS 빌드 및 App Store 제출

### 기능 보완
- [ ] 소셜 로그인 설정 (Google/Kakao OAuth Provider)
- [ ] Sentry DSN 설정 및 활성화

### 데이터 확장
- [ ] 공공데이터포털 API 키 재발급 → 혜택 데이터 2026년 갱신
- [ ] 질병관리청 예방접종 일정 크롤링 추가
- [ ] 건강보험심사평가원 산부인과 병원 평가 데이터
- [ ] 식약처 건강기능식품 인증 데이터 연동

### 운영 개선 (선택)
- [ ] 커뮤니티 글 관리/신고 대시보드
- [ ] 푸시 알림 (영양제 복용, 검진 리마인드)
- [ ] 앱 내 공지사항 기능
- [ ] 피드백 관리 대시보드 (Supabase 외)

---

## 파일 구조 요약

```
src/
├── app/                    # 25개 라우트
│   ├── auth/callback/      # OAuth 콜백
│   ├── benefits/           # 혜택 (일반 + 난임 탭)
│   ├── feedback/           # 피드백 폼
│   ├── guide/              # 주차별 가이드
│   ├── infertility-guide/  # 난임 시술 가이드
│   ├── infertility-tips/   # 난임 꿀팁
│   ├── login/              # 로그인/회원가입
│   ├── settings/           # 설정
│   ├── terms/              # 이용약관
│   ├── ultrasound/         # 초음파 앨범
│   └── ...                 # 기타 라우트
├── components/             # 공통 컴포넌트
│   ├── HomeRouter.tsx      # 모드별 홈 라우팅
│   ├── BottomNav.tsx       # 하단 네비게이션
│   ├── InfertilityHome.tsx # 난임 모드 홈
│   └── ...
├── contexts/               # React Context
│   ├── AuthContext.tsx      # 인증 (Supabase)
│   └── PregnancyContext.tsx # 임신 정보
├── data/                   # 데이터 파일
│   ├── mock.ts             # 맛집/팁/주차가이드 (84KB)
│   ├── benefits-api.ts     # 정부 혜택 3000+건 (2.7MB, lazy load)
│   ├── infertility.ts      # 난임 데이터 (24KB)
│   ├── supplements.ts      # 영양제 (출처 검증)
│   └── ...
├── lib/                    # 유틸리티
│   ├── supabase.ts         # Supabase 클라이언트
│   ├── syncData.ts         # 클라우드 동기화
│   └── ...
└── store/                  # Zustand 스토어
    ├── useBabyStore.ts     # 모드/육아/초음파
    └── useStore.ts         # 북마크/테마/하트

scripts/
├── verify-app.sh           # 앱 품질 검증 (9개 항목)
├── crawl-data.ts           # 네이버 API 크롤링
└── fetch-benefits.ts       # 공공데이터 혜택 크롤링

android/                    # Capacitor Android 프로젝트
ios/                        # Capacitor iOS 프로젝트
```

---

## 키/인증서

| 항목 | 위치 | 비밀번호 |
|------|------|----------|
| Android 키스토어 | `android/mamma-release.keystore` | `mamma2026release` |
| Supabase | `.env.local` | - |
| Naver API | `.env.local` | - |

> ⚠️ 키스토어 분실 시 같은 앱 ID로 업데이트 불가. 별도 백업 필수.
