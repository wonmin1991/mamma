# 맘마 (Mamma) - 출시 가이드

## 프로젝트 개요

임신·난임·육아 올인원 정보 앱. Next.js 16 + Capacitor로 웹/Android/iOS 동시 지원.

| 항목 | 값 |
|------|-----|
| 앱 ID | `app.mamma.pregnancy` |
| 앱 이름 | 맘마 |
| 웹 URL | https://insta-rho-ten.vercel.app |
| 기술 스택 | Next.js 16, React 19, Zustand, Tailwind 4, Capacitor 8, Supabase |
| 데이터 저장 | localStorage (비로그인) + Supabase (로그인) |

---

## 배포 환경

### 웹 (Vercel)
```bash
git push origin main                    # GitHub에 push
npx vercel --prod --scope wonmins-projects-b70fbb67  # Vercel 배포
```

### Android
```bash
STATIC_EXPORT=true npx next build       # 정적 빌드
npx cap sync android                    # Capacitor 동기화
cd android && ./gradlew bundleRelease   # AAB 빌드 (Java 21 필요)
```

**빌드 환경변수:**
```bash
export JAVA_HOME="/opt/homebrew/opt/openjdk@21"
export PATH="$JAVA_HOME/bin:$PATH"
export ANDROID_HOME="$HOME/Library/Android/sdk"
```

**빌드 결과물:** `android/app/build/outputs/bundle/release/app-release.aab`

### iOS (미완성)
```bash
STATIC_EXPORT=true npx next build
npx cap sync ios
npx cap open ios                        # Xcode에서 빌드
```
Apple Developer 계정($99/년) 필요.

---

## 키/인증서 관리

| 항목 | 위치 | 비밀번호 |
|------|------|----------|
| Android 키스토어 | `android/mamma-release.keystore` | `mamma2026release` |
| Android 키 별칭 | `mamma` | `mamma2026release` |
| Supabase URL | `.env.local` | - |
| Supabase anon key | `.env.local` | - |

> ⚠️ 키스토어를 분실하면 같은 앱 ID로 업데이트 불가. 안전한 곳에 백업하세요.

---

## Google Play Store 등록

### 앱 정보
- **앱 이름**: 맘마: 임신·출산·난임 필수 앱 (또는 선택한 이름)
- **짧은 설명**: 임신 주차별 가이드, 난임 시술 정보, 정부 혜택, 초음파 앨범까지 한곳에서
- **긴 설명**: `store-listing.md` 참고
- **카테고리**: 건강 및 피트니스 > 임신
- **콘텐츠 등급**: 전체 이용가
- **개인정보 URL**: https://insta-rho-ten.vercel.app/privacy

### 업로드할 파일
| 파일 | 위치 |
|------|------|
| AAB | `~/Desktop/mamma-v1.0.0.aab` |
| 앱 아이콘 (512x512) | `android/app/src/main/ic_launcher-playstore.png` |

### 스크린샷 촬영 방법
1. Chrome > https://insta-rho-ten.vercel.app
2. F12 > Device Toolbar > Pixel 7 (412x915)
3. 5개 화면 캡처: `/`, `/guide`, `/benefits`, `/ultrasound`, `/infertility-guide`

---

## Supabase 설정

### 테이블
| 테이블 | 용도 |
|--------|------|
| `user_data` | 사용자 데이터 동기화 (pregnancy_data, store_data, baby_data) |
| `feedback` | 사용자 피드백 |

### RLS 정책
- `user_data`: 본인 데이터만 읽기/쓰기
- `feedback`: 누구나 작성 가능, 본인만 조회

### OAuth Provider 설정 (미완)
- Google: Google Cloud Console에서 OAuth 클라이언트 생성 필요
- Kakao: Kakao Developers에서 앱 등록 필요
- Redirect URI: `https://elothdvvkjxqwasuktdp.supabase.co/auth/v1/callback`

---

## 운영 도구

### 검증 스크립트
```bash
bash scripts/verify-app.sh
```
하이드레이션, 중복 ID, Hook 규칙, 데이터 완전성 등 9개 항목 자동 검사.

### 피드백 확인
Supabase Dashboard > Table Editor > `feedback`

### Analytics
Vercel Dashboard > 프로젝트 > Analytics 탭

### 에러 모니터링 (설정 필요)
1. https://sentry.io 가입 > Next.js 프로젝트 생성
2. DSN을 Vercel 환경변수에 추가: `NEXT_PUBLIC_SENTRY_DSN`
3. 재배포하면 자동 활성화

---

## 주요 기능 목록

| 기능 | 경로 | 설명 |
|------|------|------|
| 홈 (임신/난임/출산 모드) | `/` | 모드별 다른 홈 화면 |
| 주차별 가이드 (40주) | `/guide` | 아기 발달, 엄마 변화, 팁, 음식 |
| 혜택 (3000+건) | `/benefits` | 지역별 필터 + 카테고리 + 난임 탭 |
| 난임 시술 가이드 | `/infertility-guide` | 6단계 타임라인 |
| 난임 꿀팁 (12개) | `/infertility-tips` | 카테고리별 필터 |
| 초음파 앨범 | `/ultrasound` | 사진 업로드 + 주차별 발달 매칭 |
| 영양제 가이드 | `/supplements` | 주차별 필수 영양제 체크리스트 |
| 맛집 | `/restaurants` | 임산부 친화 맛집 |
| 커뮤니티 | `/community` | 사용자 게시물 |
| 출산 후 육아 | `/care-log`, `/growth` | 수유/수면/기저귀 + 성장 기록 |
| 로그인 | `/login` | 이메일 + Google + Kakao |
| 피드백 | `/feedback` | 사용자 의견 수집 |
| 설정 | `/settings` | 모드 전환, 계정, 데이터 관리 |

---

## 의료 데이터 출처

모든 의료 정보에 출처가 명시되어 있습니다.

| 파일 | 출처 |
|------|------|
| supplements.ts | ACOG, WHO, NIH, 식약처, 한국영양학회 |
| emergency.ts | ACOG, 대한산부인과학회, 서울아산병원 |
| postnatal.ts | 질병관리청, WHO, 대한소아과학회 |
| infertility.ts | 대한산부인과학회, 보건복지부, ACOG |
| checkups.ts | 대한산부인과학회, ACOG, 국민건강보험공단 |
| mock.ts (weeklyGuide) | ACOG, Mayo Clinic, Cleveland Clinic, NHS |

검증일: 2026-04-08

---

## 남은 작업

### 필수
- [ ] Google Play 스토어 등록 및 검토 제출
- [ ] 스크린샷 5장 촬영 및 업로드

### 권장
- [ ] Apple Developer 계정 등록 → iOS 출시
- [ ] 소셜 로그인 설정 (Google, Kakao)
- [ ] Sentry 에러 모니터링 활성화
- [ ] 혜택 데이터 2026년 갱신 (`npm run fetch-benefits`)

### 선택
- [ ] 커뮤니티 글 관리/신고 대시보드
- [ ] 푸시 알림 (영양제, 검진 리마인드)
- [ ] 앱 내 공지사항 기능
