#!/usr/bin/env bash
# 맘마(Mamma) 종합 QA 스크립트
# 사용: bash scripts/qa.sh  또는  npm run qa
# 정적 분석 → 빌드 → 런타임 라우트 확인 → API 엔드포인트 점검
set -uo pipefail
cd "$(dirname "$0")/.."

# ─── 색상 ────────────────────────────────────────────────
if [ -t 1 ]; then
  R=$'\033[31m'; G=$'\033[32m'; Y=$'\033[33m'; B=$'\033[34m'; D=$'\033[2m'; N=$'\033[0m'
else
  R=""; G=""; Y=""; B=""; D=""; N=""
fi

PASS=0; WARN=0; FAIL=0
section() { printf "\n${B}━━ %s ━━${N}\n" "$1"; }
ok()      { printf "  ${G}✅${N} %s\n" "$1"; PASS=$((PASS+1)); }
warn()    { printf "  ${Y}⚠️ ${N} %s\n" "$1"; WARN=$((WARN+1)); }
fail()    { printf "  ${R}❌${N} %s\n" "$1"; FAIL=$((FAIL+1)); }
info()    { printf "  ${D}%s${N}\n" "$1"; }

# ─── 1. 환경 ─────────────────────────────────────────────
section "1. 환경 확인"
[ -f package.json ] && ok "package.json 존재" || fail "package.json 없음"
[ -d node_modules ] && ok "node_modules 존재" || { fail "npm install 필요"; exit 1; }
NODE_VER=$(node -v 2>/dev/null || echo "?")
info "Node $NODE_VER"

# ─── 2. TypeScript 타입 체크 ─────────────────────────────
section "2. TypeScript 타입 체크"
TS_OUT=$(npx tsc --noEmit 2>&1)
if [ -z "$TS_OUT" ]; then
  ok "타입 에러 0건"
else
  fail "타입 에러 발견"
  echo "$TS_OUT" | head -20 | sed 's/^/    /'
fi

# ─── 3. ESLint (변경 우선 검사) ──────────────────────────
section "3. ESLint"
LINT_OUT=$(npx eslint src 2>&1 || true)
LINT_ERRORS=$(echo "$LINT_OUT" | grep -cE "^\s+[0-9]+:[0-9]+\s+error" || true)
LINT_WARNS=$(echo "$LINT_OUT" | grep -cE "^\s+[0-9]+:[0-9]+\s+warning" || true)
if [ "$LINT_ERRORS" -eq 0 ]; then
  ok "ESLint 에러 0건 (경고 ${LINT_WARNS}건)"
else
  fail "ESLint 에러 ${LINT_ERRORS}건"
  echo "$LINT_OUT" | grep -E "error\s" | head -10 | sed 's/^/    /'
fi

# ─── 4. 정적 안티패턴 검사 ────────────────────────────────
section "4. 정적 안티패턴 검사"

# 4-1. Zustand v5 객체 반환 selector → 무한 리렌더 위험
# 패턴: useStore((s) => s.fn()) 에서 fn이 객체/배열 반환
DANGEROUS_SELECTORS=$(grep -rnE "use(Baby)?Store\(\(s\) => s\.(get|generate|compute|build|filter|map)[A-Z][a-zA-Z]*\(\)\)" src/ 2>/dev/null || true)
if [ -z "$DANGEROUS_SELECTORS" ]; then
  ok "객체 반환 selector 없음 (Zustand v5 무한 리렌더 위험 패턴)"
else
  fail "객체/배열 반환 selector 발견 — useMemo로 derive 필요:"
  echo "$DANGEROUS_SELECTORS" | sed 's/^/    /'
fi

# 4-2. selector에서 객체/배열 리터럴 직접 반환
LITERAL_SELECTORS=$(grep -rnE "use(Baby)?Store\(\(s\) => \(\{|use(Baby)?Store\(\(s\) => \[" src/ 2>/dev/null || true)
if [ -z "$LITERAL_SELECTORS" ]; then
  ok "selector 객체 리터럴 반환 없음"
else
  warn "selector 객체 리터럴 반환 (useShallow 권장):"
  echo "$LITERAL_SELECTORS" | head -5 | sed 's/^/    /'
fi

# 4-3. selector에서 filter/map 체인
DERIVED_SELECTORS=$(grep -rnE "use(Baby)?Store\(\(s\) => s\.[a-zA-Z]+\.(filter|map|slice|sort)" src/ 2>/dev/null || true)
if [ -z "$DERIVED_SELECTORS" ]; then
  ok "selector 내 filter/map 체인 없음"
else
  warn "selector 내 derived collection (useMemo 권장):"
  echo "$DERIVED_SELECTORS" | head -5 | sed 's/^/    /'
fi

# 4-4. 렌더 본문 Date.now() / Math.random()
IMPURE_RENDER=$(grep -rnE "Math\.random\(\)|Date\.now\(\)" src/app src/components 2>/dev/null \
  | grep -vE "useEffect|useMemo|useCallback|useState\(|setInterval|setTimeout|//|/\*|\.lib/|Math\.random\(\)\.toString\(36\)" \
  | grep -vE "^[^:]+:\s*$" || true)
if [ -z "$IMPURE_RENDER" ]; then
  ok "렌더 본문 impure 호출 없음"
else
  IMPURE_COUNT=$(echo "$IMPURE_RENDER" | wc -l | tr -d ' ')
  warn "렌더 본문에서 Date.now()/Math.random() 호출 ${IMPURE_COUNT}건:"
  echo "$IMPURE_RENDER" | head -5 | sed 's/^/    /'
fi

# 4-5. baby/dueDate 미가드 접근
UNGUARDED=$(grep -rnE "baby\.(name|birthDate|gender)\b" src/app src/components 2>/dev/null \
  | grep -vE "baby\?|baby &&|if \(baby|if \(\!baby|baby \?" || true)
if [ -z "$UNGUARDED" ]; then
  ok "baby 객체 null 가드 적용됨"
else
  # 이 grep는 false positive가 많아 정보로만 표시
  UNGUARDED_COUNT=$(echo "$UNGUARDED" | wc -l | tr -d ' ')
  info "baby 직접 접근 ${UNGUARDED_COUNT}건 (각 호출부에서 가드 여부 수동 확인 필요)"
fi

# 4-6. _hydrated 가드 부재 (persist 사용 페이지)
NO_HYDRATION_GUARD=""
for f in src/app/care-log/page.tsx src/app/growth/page.tsx src/app/milestones/page.tsx \
         src/app/diary/page.tsx src/app/baby-food/page.tsx src/app/vaccination/page.tsx \
         src/app/ultrasound/page.tsx src/app/bookmarks/page.tsx src/app/nursery/page.tsx \
         src/app/couple/page.tsx; do
  [ -f "$f" ] || continue
  uses=$(grep -E "useBabyStore|useStore" "$f" 2>/dev/null | head -1)
  has=$(grep -E "_hydrated" "$f" 2>/dev/null)
  if [ -n "$uses" ] && [ -z "$has" ]; then
    NO_HYDRATION_GUARD+="$f\n"
  fi
done
if [ -z "$NO_HYDRATION_GUARD" ]; then
  ok "persist 페이지 _hydrated 가드 적용됨"
else
  COUNT=$(printf "$NO_HYDRATION_GUARD" | grep -c .)
  info "persist 사용 페이지 중 _hydrated 가드 없음 ${COUNT}건 (UX 깜빡임만, 크래시 아님)"
fi

# ─── 5. 기존 verify-app.sh 호출 ──────────────────────────
section "5. 도메인 검증 (verify-app.sh)"
if [ -f scripts/verify-app.sh ]; then
  VERIFY_OUT=$(bash scripts/verify-app.sh 2>&1)
  if echo "$VERIFY_OUT" | grep -q "모든 검증 통과"; then
    ok "verify-app.sh 통과"
    echo "$VERIFY_OUT" | grep -E "✅|⚠️|❌" | tail -5 | sed 's/^/    /'
  else
    fail "verify-app.sh 실패"
    echo "$VERIFY_OUT" | tail -15 | sed 's/^/    /'
  fi
else
  warn "scripts/verify-app.sh 없음"
fi

# ─── 6. 프로덕션 빌드 ─────────────────────────────────────
section "6. 프로덕션 빌드"
BUILD_OUT=$(npx next build 2>&1)
if echo "$BUILD_OUT" | grep -q "Compiled successfully"; then
  ok "빌드 성공"
  ROUTE_COUNT=$(echo "$BUILD_OUT" | grep -cE "^├ |^└ " || echo "?")
  info "라우트 ${ROUTE_COUNT}개 생성"
else
  fail "빌드 실패"
  echo "$BUILD_OUT" | tail -15 | sed 's/^/    /'
  exit 1
fi

# ─── 7. 런타임 라우트 스모크 테스트 ───────────────────────
section "7. 런타임 라우트 스모크 (dev 서버)"

# 기존 dev 서버 정리
pkill -f "next dev" 2>/dev/null || true
sleep 1

DEV_LOG=$(mktemp)
npm run dev > "$DEV_LOG" 2>&1 &
DEV_PID=$!
trap "kill $DEV_PID 2>/dev/null; rm -f $DEV_LOG" EXIT

# 준비 대기 (최대 30초)
WAIT_START=$(date +%s)
until /usr/bin/curl -sf http://localhost:3000/ > /dev/null 2>&1; do
  if [ $(($(date +%s) - WAIT_START)) -gt 30 ]; then
    fail "dev 서버 30초 내 준비 실패"
    tail -20 "$DEV_LOG" | sed 's/^/    /'
    exit 1
  fi
  sleep 1
done
ok "dev 서버 준비 완료"

# 라우트 목록
ROUTES=(
  "/" "/guide" "/benefits" "/supplements" "/restaurants" "/tips"
  "/search" "/bookmarks" "/community" "/nursery" "/couple" "/chat"
  "/feedback" "/settings" "/login" "/privacy" "/terms" "/emergency"
  "/care-log" "/growth" "/milestones" "/diary" "/vaccination"
  "/baby-food" "/ultrasound" "/infertility-guide" "/infertility-tips"
  "/prenatal-care"
)
ROUTE_FAIL=0
for path in "${ROUTES[@]}"; do
  code=$(/usr/bin/curl -o /dev/null -s -w "%{http_code}" "http://localhost:3000$path")
  if [ "$code" = "200" ]; then
    :
  else
    fail "$path → $code"
    ROUTE_FAIL=$((ROUTE_FAIL+1))
  fi
done
if [ $ROUTE_FAIL -eq 0 ]; then
  ok "${#ROUTES[@]}개 라우트 모두 200 OK"
fi

# 동적 라우트 샘플 (1개씩)
DYN_FAIL=0
for path in "/tips/1" "/restaurants/1" "/community/1" "/infertility-tips/101"; do
  code=$(/usr/bin/curl -o /dev/null -s -w "%{http_code}" "http://localhost:3000$path")
  [ "$code" = "200" ] || { fail "$path → $code"; DYN_FAIL=$((DYN_FAIL+1)); }
done
[ $DYN_FAIL -eq 0 ] && ok "동적 라우트 샘플 4개 200 OK"

# ─── 8. API 엔드포인트 점검 ───────────────────────────────
section "8. API 엔드포인트 점검"

# /api/chat: GET → 405
CHAT_GET=$(/usr/bin/curl -o /dev/null -s -w "%{http_code}" http://localhost:3000/api/chat)
[ "$CHAT_GET" = "405" ] && ok "POST 전용 메서드 보호 (GET → 405)" || warn "GET /api/chat → $CHAT_GET (예상 405)"

# /api/chat: 잘못된 JSON → 400 또는 503
BAD_BODY=$(/usr/bin/curl -s -X POST http://localhost:3000/api/chat \
  -H 'Content-Type: application/json' -d 'garbage' \
  -o /dev/null -w "%{http_code}")
case "$BAD_BODY" in
  400|503) ok "잘못된 JSON → $BAD_BODY (입력 검증 또는 키 미설정)" ;;
  *) warn "POST /api/chat (bad body) → $BAD_BODY (예상 400/503)" ;;
esac

# 정상 페이로드 — API 키 미설정 시 503, 설정 시 200 (스트림)
GOOD_PAYLOAD='{"messages":[{"role":"user","content":"테스트"}],"context":{"mode":"pregnancy","currentWeek":20}}'
GOOD_CODE=$(/usr/bin/curl -s -X POST http://localhost:3000/api/chat \
  -H 'Content-Type: application/json' -d "$GOOD_PAYLOAD" \
  -o /dev/null -w "%{http_code}")
case "$GOOD_CODE" in
  200) ok "정상 챗봇 호출 → 200 (Anthropic 키 활성)" ;;
  503) info "정상 페이로드 → 503 (ANTHROPIC_API_KEY 미설정 — 로컬 정상)" ;;
  *) warn "정상 페이로드 → $GOOD_CODE" ;;
esac

# ─── 9. 런타임 에러 로그 확인 ─────────────────────────────
section "9. dev 서버 런타임 에러"
ERR_LINES=$(grep -iE "error|maximum update depth|hydration mismatch" "$DEV_LOG" \
  | grep -vE "Compiled|warn|Sentry|Sourcemap|MODULE_NOT_FOUND.*config" || true)
if [ -z "$ERR_LINES" ]; then
  ok "런타임 에러 없음"
else
  ERR_COUNT=$(echo "$ERR_LINES" | wc -l | tr -d ' ')
  fail "런타임 에러 ${ERR_COUNT}건:"
  echo "$ERR_LINES" | head -10 | sed 's/^/    /'
fi

# ─── 정리 ────────────────────────────────────────────────
kill $DEV_PID 2>/dev/null || true

# ─── 요약 ────────────────────────────────────────────────
echo
printf "${B}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${N}\n"
printf "📊 QA 결과: ${G}✅ %d 통과${N} / ${Y}⚠️  %d 경고${N} / ${R}❌ %d 실패${N}\n" "$PASS" "$WARN" "$FAIL"
printf "${B}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${N}\n"

if [ $FAIL -gt 0 ]; then
  printf "\n${R}🚨 QA 실패 — 위 에러를 수정 후 재실행하세요.${N}\n"
  exit 1
elif [ $WARN -gt 0 ]; then
  printf "\n${Y}⚡ 경고 있음 — 운영 영향은 없지만 검토 권장.${N}\n"
  exit 0
else
  printf "\n${G}🎉 모든 검사 통과!${N}\n"
  exit 0
fi
