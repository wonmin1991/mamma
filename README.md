# 맘마 (Mamma)

임산부를 위한 올인원 정보 앱. 맛집, 주차별 가이드, 건강 꿀팁, 커뮤니티까지 한곳에서.

## 기술 스택

- **Next.js 16** + **React 19** (App Router)
- **Tailwind CSS 4**
- **Zustand** (클라이언트 상태 관리)
- **PWA** (Service Worker, manifest)

## 주요 기능

| 기능 | 경로 | 설명 |
|------|------|------|
| 홈 | `/` | 주차별 하이라이트, SNS 큐레이션, 맛집/팁 추천 |
| 맛집 | `/restaurants` | 서울/경기/인천 임산부 친화 맛집 검색·필터 |
| 꿀팁 | `/tips` | 영양·운동·마음건강·병원·용품 카테고리별 팁 |
| 주차별 가이드 | `/guide` | 임신 1~40주 태아 발달·산모 변화·추천 음식 |
| 커뮤니티 | `/community` | 맛집 추천·꿀팁 공유·질문·후기 |
| 아기방 꾸미기 | `/nursery` | 가상 아기방 인테리어 + 출산 체크리스트 |
| 부부 모드 | `/couple` | 출산 준비 체크리스트 공유 |
| 북마크 | `/bookmarks` | 저장한 맛집·팁 모아보기 |
| 검색 | `/search` | 맛집·팁·큐레이션·커뮤니티 통합 검색 |
| 설정 | `/settings` | 출산예정일, 테마, 데이터 관리 |

## 시작하기

```bash
npm install
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

## 데이터 크롤링

앱의 맛집/팁/큐레이션 데이터를 네이버 검색 API로 수집할 수 있습니다.

### 1. 네이버 API 키 발급

[네이버 개발자센터](https://developers.naver.com/apps/#/register)에서 앱을 등록하고 사용 API에서 **검색**을 선택합니다.

### 2. 환경변수 설정

```bash
cp .env.example .env
```

`.env` 파일에 발급받은 키를 입력합니다:

```
NAVER_CLIENT_ID=your_client_id
NAVER_CLIENT_SECRET=your_client_secret
```

### 3. 크롤링 실행

```bash
npm run crawl
```

결과물:
- `data/seed.json` — 크롤링 원본 데이터 (직접 편집 가능)
- `src/data/crawled.ts` — 앱에서 사용하는 데이터

### 4. 맛집 데이터 편집

`data/seed.json`을 열어 맛집의 상세 정보를 직접 채워 넣습니다:

```json
{
  "name": "크롤링된 맛집 이름",
  "address": "크롤링된 실제 주소",
  "sourceUrl": "네이버 플레이스 링크",
  "description": "",          ← 직접 작성
  "rating": null,              ← 직접 입력
  "priceRange": "",            ← 직접 입력
  "pregnancyPerks": [],        ← 직접 입력
  "tags": [],                  ← 직접 입력
  "verified": false            ← 편집 완료 후 true
}
```

편집 후 앱 데이터를 재생성합니다:

```bash
npm run generate
```

`verified: true`로 표시한 맛집은 다음 크롤링 시에도 편집 내용이 보존됩니다.

### 팁/큐레이션 데이터

블로그·카페 글은 제목과 요약만 가져오고, 앱에서 **원문 링크**로 연결됩니다. 타인의 콘텐츠를 자체 콘텐츠로 표시하지 않습니다.

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── page.tsx            # 홈
│   ├── restaurants/        # 맛집 목록 + 상세
│   ├── tips/               # 꿀팁 목록 + 상세
│   ├── guide/              # 주차별 가이드
│   ├── community/          # 커뮤니티
│   ├── nursery/            # 아기방 꾸미기
│   ├── couple/             # 부부 모드
│   ├── bookmarks/          # 북마크
│   ├── search/             # 통합 검색
│   └── settings/           # 설정
├── components/             # 공통 컴포넌트
├── contexts/               # PregnancyContext (출산예정일, 주차)
├── data/                   # 데이터 (mock + crawled)
│   ├── mock.ts             # 타입, 상수, 기본 데이터
│   ├── crawled.ts          # 크롤링 데이터 (auto-generated)
│   └── nurseryItems.ts     # 아기방 아이템 + 출산 체크리스트
├── lib/                    # 유틸리티, 상수
└── store/                  # Zustand 스토어
scripts/
└── crawl-data.ts           # 네이버 API 크롤링 스크립트
data/
└── seed.json               # 크롤링 원본 (편집용, git-tracked)
```

## 데이터 저장

서버/DB 없이 브라우저 localStorage로 동작합니다:

- `mamma-store` — 북마크, 최근 본 항목, 하트, 아기방 상태
- `mamma-pregnancy` — 출산예정일, 현재 주차
- `mamma-theme` — 다크/라이트 테마
- `mamma-community` — 사용자 작성 커뮤니티 글
- `mamma-comments` — 댓글

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 검사 |
| `npm run crawl` | 네이버 API 크롤링 → seed.json + crawled.ts |
| `npm run generate` | seed.json → crawled.ts 재생성 |

## 배포

```bash
npm run build
```

Vercel, Netlify 등 정적 호스팅이나 Node.js 서버에 배포할 수 있습니다.
