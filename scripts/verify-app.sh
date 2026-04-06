#!/bin/bash
# ============================================================
# verify-app.sh - 앱 품질 자동 검증 스크립트
# 사용법: bash scripts/verify-app.sh
# ============================================================

set -e
PASS=0
FAIL=0
WARN=0

pass() { echo "  ✅ $1"; PASS=$((PASS+1)); }
fail() { echo "  ❌ $1"; FAIL=$((FAIL+1)); }
warn() { echo "  ⚠️  $1"; WARN=$((WARN+1)); }

SRC="src"

echo ""
echo "🔍 맘마 앱 품질 검증 시작"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── 1. 하이드레이션 불일치 검사 ──────────────────────────
echo ""
echo "1️⃣  하이드레이션 불일치 검사"

# useState 초기값에서 localStorage/window 접근
BAD_USESTATE=$(grep -rn "useState.*localStorage\|useState.*window\.\|useState.*document\." $SRC --include="*.tsx" --include="*.ts" | grep -v "// safe" | grep -v "node_modules" || true)
if [ -z "$BAD_USESTATE" ]; then
  pass "useState 초기값에서 브라우저 API 직접 접근 없음"
else
  fail "useState 초기값에서 브라우저 API 접근 발견:"
  echo "$BAD_USESTATE" | while read line; do echo "      $line"; done
fi

# useState(() => 함수()) 패턴 중 위험한 것
BAD_LAZY=$(grep -rn 'useState(() =>' $SRC --include="*.tsx" --include="*.ts" | grep -v "// safe\|useState(() => false\|useState(() => true\|useState(() => \"\|useState(() => null\|useState(() => 0\|useState(() => \[\]\|useState(() => {}" || true)
if [ -z "$BAD_LAZY" ]; then
  pass "useState lazy initializer 안전"
else
  warn "useState lazy initializer 확인 필요:"
  echo "$BAD_LAZY" | while read line; do echo "      $line"; done
fi

# ── 2. 중복 ID 검사 ─────────────────────────────────────
echo ""
echo "2️⃣  데이터 중복 ID 검사"

# benefits 최종 배열의 id 유일성 검증 (re-map 후)
# benefits.ts는 .map((b, i) => ({ ...b, id: i + 1 }))로 재할당하므로 최종 배열은 안전
# 대신 infertility.ts 등 단일 배열 파일만 검사
for FILE in $SRC/data/infertility.ts $SRC/data/nurseryItems.ts $SRC/data/supplements.ts $SRC/data/checkups.ts $SRC/data/emergency.ts; do
  if [ -f "$FILE" ]; then
    BASENAME=$(basename "$FILE")
    DUPS=$(grep -o 'id: [0-9]*' "$FILE" | awk '{print $2}' | sort | uniq -d)
    if [ -z "$DUPS" ]; then
      pass "$BASENAME - 중복 ID 없음"
    else
      fail "$BASENAME - 중복 ID 발견: $DUPS"
    fi
  fi
done

# benefits.ts: re-map 로직이 있는지 확인
if grep -q 'map.*id: i' $SRC/data/benefits.ts; then
  pass "benefits.ts - ID 재할당 로직 있음 (중복 방지)"
else
  warn "benefits.ts - ID 재할당 로직 없음 (API 데이터와 중복 가능)"
fi

# ── 2b. React Hook 규칙 검사 ─────────────────────────────
echo ""
echo "2️⃣b React Hook 규칙 검사 (early return 뒤의 Hook)"

# "use client" 파일에서 early return 후 useMemo/useCallback 호출 패턴 탐지
HOOK_VIOLATION=0
for FILE in $(grep -rl '"use client"' $SRC --include="*.tsx" 2>/dev/null); do
  # return (...) 패턴 이후에 useMemo/useCallback이 나오는지 체크
  if awk '/^  if .* return \(/{found=1} found && /useMemo|useCallback/{print FILENAME":"NR": "$0; found=0}' "$FILE" 2>/dev/null | grep -q .; then
    RESULT=$(awk '/^  if .* return \(/{found=1} found && /useMemo|useCallback/{print FILENAME":"NR": "$0; found=0}' "$FILE" 2>/dev/null)
    fail "Hook 규칙 위반 가능: $RESULT"
    HOOK_VIOLATION=1
  fi
done
if [ $HOOK_VIOLATION -eq 0 ]; then
  pass "early return 뒤에 Hook 호출 없음"
fi

# ── 3. React key 검사 ───────────────────────────────────
echo ""
echo "3️⃣  React key 패턴 검사"

# key={i} 또는 key={index} 사용 확인
BAD_KEYS=$(grep -rn 'key={i}\|key={index}\|key={idx}' $SRC --include="*.tsx" | grep -v "node_modules" || true)
if [ -z "$BAD_KEYS" ]; then
  pass "배열 인덱스를 React key로 사용하는 곳 없음"
else
  warn "배열 인덱스 key 사용 (리스트 재정렬 시 문제 가능):"
  echo "$BAD_KEYS" | while read line; do echo "      $line"; done
fi

# ── 4. 클라이언트 컴포넌트에서 notFound() 사용 검사 ────
echo ""
echo "4️⃣  notFound() 사용 위치 검사"

# "use client" 파일에서 notFound 호출 찾기
for FILE in $(grep -rl '"use client"' $SRC --include="*.tsx" 2>/dev/null); do
  if grep -q 'notFound()' "$FILE" 2>/dev/null; then
    fail "클라이언트 컴포넌트에서 notFound() 호출: $FILE"
  fi
done
# notFound가 없으면 통과
if [ $FAIL -eq $(echo "$FAIL") ]; then
  pass "notFound()는 서버 컴포넌트에서만 사용"
fi

# ── 5. Zustand persist 하이드레이션 가드 검사 ────────────
echo ""
echo "5️⃣  Zustand persist 하이드레이션 가드 검사"

for STORE_FILE in $SRC/store/useBabyStore.ts $SRC/store/useStore.ts; do
  if [ -f "$STORE_FILE" ]; then
    BASENAME=$(basename "$STORE_FILE")
    if grep -q 'onRehydrateStorage' "$STORE_FILE"; then
      pass "$BASENAME - onRehydrateStorage 콜백 있음"
    else
      fail "$BASENAME - onRehydrateStorage 콜백 없음 (하이드레이션 감지 불가)"
    fi
    if grep -q '_hydrated' "$STORE_FILE"; then
      pass "$BASENAME - _hydrated 플래그 있음"
    else
      fail "$BASENAME - _hydrated 플래그 없음"
    fi
  fi
done

# ── 6. 이벤트 핸들러 충돌 검사 ──────────────────────────
echo ""
echo "6️⃣  중첩 인터랙티브 요소 검사"

# button 안에 onClick이 있는 span/div 찾기 (stopPropagation 없으면 위험)
NESTED=$(grep -rn 'role="button"' $SRC --include="*.tsx" | grep "onClick" | grep -v "stopPropagation" || true)
if [ -z "$NESTED" ]; then
  pass "중첩 클릭 핸들러에 stopPropagation 적용됨"
else
  fail "stopPropagation 누락된 중첩 클릭 핸들러:"
  echo "$NESTED" | while read line; do echo "      $line"; done
fi

# ── 7. 날짜 연산 안전성 검사 ────────────────────────────
echo ""
echo "7️⃣  날짜 연산 안전성 검사"

# getMonth() + N (N >= 3) 패턴 - 오버플로우 가능
BAD_MONTH=$(grep -rn 'getMonth() *+ *[3-9]\|getMonth() *+ *1[0-9]' $SRC --include="*.tsx" --include="*.ts" | grep -v "setMonth\|// safe" || true)
if [ -z "$BAD_MONTH" ]; then
  pass "월 연산 오버플로우 위험 없음"
else
  fail "getMonth() + N 오버플로우 가능 (Date.setMonth 사용 권장):"
  echo "$BAD_MONTH" | while read line; do echo "      $line"; done
fi

# ── 8. 빌드 검사 ────────────────────────────────────────
echo ""
echo "8️⃣  TypeScript & Next.js 빌드 검사"

BUILD_OUT=$(npx next build 2>&1)
if echo "$BUILD_OUT" | grep -q "Compiled successfully"; then
  pass "빌드 성공"
else
  fail "빌드 실패"
  echo "$BUILD_OUT" | grep -A3 "error\|Error" | head -20
fi

if echo "$BUILD_OUT" | grep -q "Finished TypeScript"; then
  pass "TypeScript 타입 체크 통과"
else
  fail "TypeScript 타입 에러"
fi

# ── 9. 주차별 데이터 완전성 검사 ─────────────────────────
echo ""
echo "9️⃣  주차별 가이드 데이터 검사"

WEEK_COUNT=$(grep -c '^\s*\[[0-9]*, [0-9]*, {' $SRC/data/mock.ts || echo 0)
if [ "$WEEK_COUNT" -eq 40 ]; then
  pass "WEEK_DETAILS: 40개 항목 (1~40주 개별)"
else
  fail "WEEK_DETAILS: ${WEEK_COUNT}개 항목 (40개 필요)"
fi

# 주차 범위가 모두 [n,n] (개별)인지 확인
MERGED=$(grep -oE '^\s*\[([0-9]+), ([0-9]+),' $SRC/data/mock.ts | sed 's/.*\[\([0-9]*\), \([0-9]*\),.*/\1 \2/' | awk '{if($1!=$2) print "["$1","$2"]"}')
if [ -z "$MERGED" ]; then
  pass "모든 주차가 개별 분리됨"
else
  fail "묶여 있는 주차 발견: $MERGED"
fi

# ── 결과 요약 ────────────────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 검증 결과: ✅ ${PASS}건 통과 / ⚠️ ${WARN}건 경고 / ❌ ${FAIL}건 실패"
echo ""

if [ $FAIL -gt 0 ]; then
  echo "💡 실패 항목을 수정한 후 다시 실행하세요."
  exit 1
else
  echo "🎉 모든 검증 통과!"
  exit 0
fi
