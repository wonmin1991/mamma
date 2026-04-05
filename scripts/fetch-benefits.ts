import "dotenv/config";
import { writeFileSync, existsSync, readFileSync } from "fs";
import { join } from "path";

// ─── Config ──────────────────────────────────────────────

const SERVICE_KEY = process.env.DATA_GO_KR_SERVICE_KEY;

function requireApiKey() {
  if (!SERVICE_KEY) {
    console.error(
      "DATA_GO_KR_SERVICE_KEY 환경변수가 필요합니다.\n" +
        "  1. https://www.data.go.kr 에서 회원가입\n" +
        '  2. "행정안전부_대한민국 공공서비스(혜택) 정보" API 활용 신청\n' +
        "  3. .env 파일에 서비스키 입력  (.env.example 참고)"
    );
    process.exit(1);
  }
}

// ─── Helpers ─────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── API 설정 ────────────────────────────────────────────

const API_BASE = "https://api.odcloud.kr/api";
const SERVICE_PATH = "gov24/v3/serviceList";

const PREGNANCY_KEYWORDS = [
  "임산부", "임신", "출산", "산모", "신생아", "영유아",
  "육아", "아동", "영아", "모자보건", "산후", "태아",
  "출생", "양육", "보육", "아이돌봄", "첫만남", "부모급여",
  "난임", "산전", "수유", "모유", "분유", "어린이집",
  "유치원", "아동수당", "양육수당",
];

// ─── Types ───────────────────────────────────────────────

interface RawBenefit {
  [key: string]: string;
}

interface BenefitItem {
  id: number;
  name: string;
  summary: string;
  content: string;
  category: string;
  organization: string;
  criteria: string;
  howToApply: string;
  applyUrl: string;
  region: string;
  contact: string;
  lastUpdated: string;
}

interface BenefitData {
  _meta: {
    fetchedAt: string;
    totalFromApi: number;
    filteredCount: number;
    note: string;
  };
  benefits: BenefitItem[];
}

// ─── Category 분류 ───────────────────────────────────────

const CATEGORY_RULES: [RegExp, string][] = [
  [/지원금|수당|급여|바우처|쿠폰|이용권|축하금|장려금|현금|지급/i, "money"],
  [/의료|검진|건강|진료|병원|치료|접종|예방|난임|산전|산후/i, "medical"],
  [/보육|어린이집|돌봄|아이돌봄|유치원|양육|유아/i, "childcare"],
  [/주거|주택|임대|전세|매입|주거안정/i, "housing"],
  [/교육|학습|장학|학자금|학원/i, "education"],
];

function categorize(text: string): string {
  for (const [re, cat] of CATEGORY_RULES) {
    if (re.test(text)) return cat;
  }
  return "other";
}

function extractRegion(text: string): string {
  // 시/도 단위 추출 시도
  const regionMatch = text.match(
    /(서울특별시|부산광역시|대구광역시|인천광역시|광주광역시|대전광역시|울산광역시|세종특별자치시|경기도|강원특별자치도|충청북도|충청남도|전북특별자치도|전라남도|경상북도|경상남도|제주특별자치도)/
  );
  if (regionMatch) return regionMatch[1];

  // 짧은 이름으로 시도
  const shortMatch = text.match(
    /(서울|부산|대구|인천|광주|대전|울산|세종|경기|강원|충북|충남|전북|전남|경북|경남|제주)/
  );
  if (shortMatch) return shortMatch[1];

  return "전국";
}

// ─── Fetch 함수 ──────────────────────────────────────────

async function fetchPage(page: number, perPage: number): Promise<{ data: RawBenefit[]; totalCount: number }> {
  // serviceKey는 이미 인코딩된 값을 그대로 넣어야 함 (new URL 사용 시 이중 인코딩 방지)
  const encodedKey = encodeURIComponent(SERVICE_KEY!);
  const urlStr = `${API_BASE}/${SERVICE_PATH}?serviceKey=${encodedKey}&page=${page}&perPage=${perPage}`;

  const res = await fetch(urlStr, {
    headers: { accept: "application/json" },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }

  const json = await res.json();
  return {
    data: json.data ?? [],
    totalCount: json.totalCount ?? 0,
  };
}

async function fetchAllBenefits(): Promise<{ raw: RawBenefit[]; totalCount: number }> {
  const perPage = 1000;
  let page = 1;
  let totalCount = 0;
  const allData: RawBenefit[] = [];

  console.log("  공공데이터포털에서 혜택 데이터 수집 중...\n");

  // 첫 페이지로 전체 건수 파악
  const first = await fetchPage(1, perPage);
  totalCount = first.totalCount;
  allData.push(...first.data);
  console.log(`    페이지 1 / ${Math.ceil(totalCount / perPage)} (${first.data.length}건)`);

  const totalPages = Math.ceil(totalCount / perPage);

  for (page = 2; page <= totalPages; page++) {
    await sleep(300); // rate limit 배려
    try {
      const result = await fetchPage(page, perPage);
      allData.push(...result.data);
      console.log(`    페이지 ${page} / ${totalPages} (${result.data.length}건)`);
    } catch (e) {
      console.warn(`    페이지 ${page} 실패: ${e}`);
    }
  }

  console.log(`\n    전체 ${allData.length} / ${totalCount}건 수집 완료\n`);
  return { raw: allData, totalCount };
}

// ─── Filter & Transform ─────────────────────────────────

function isPregnancyRelated(item: RawBenefit): boolean {
  const text = Object.values(item).join(" ");
  return PREGNANCY_KEYWORDS.some((kw) => text.includes(kw));
}

function transformBenefit(item: RawBenefit, id: number): BenefitItem {
  const allText = Object.values(item).join(" ");

  return {
    id,
    name: item["서비스명"] || item["사업명"] || item["서비스목적요약"] || "혜택 정보",
    summary: item["서비스목적요약"] || item["지원내용"] || item["서비스목적"] || "",
    content: item["지원내용"] || "",
    category: categorize(allText),
    organization: item["소관기관명"] || item["부서명"] || "",
    criteria: item["선정기준"] || "",
    howToApply: item["신청방법"] || "",
    applyUrl: item["신청url주소"] || item["상세조회URL"] || "",
    region: extractRegion(allText),
    contact: item["문의처전화번호"] || item["전화문의"] || "",
    lastUpdated: item["최종수정일"] || item["수정일"] || "",
  };
}

// ─── Generate TS 파일 ────────────────────────────────────

function generateBenefitsTS(data: BenefitData) {
  const lines = data.benefits.map((b) => {
    return `  {
    id: ${b.id},
    name: ${J(b.name)},
    summary: ${J(b.summary)},
    content: ${J(b.content)},
    category: ${J(b.category)},
    organization: ${J(b.organization)},
    criteria: ${J(b.criteria)},
    howToApply: ${J(b.howToApply)},
    applyUrl: ${J(b.applyUrl)},
    region: ${J(b.region)},
    contact: ${J(b.contact)},
    lastUpdated: ${J(b.lastUpdated)},
  }`;
  });

  const now = new Date().toISOString().slice(0, 10);
  const output = `// Auto-generated from data/benefits-seed.json — ${now}
// 공공데이터포털 정부24 공공서비스 혜택 정보 기반
// 수동 편집 금지 — \`npm run fetch-benefits\` 으로 갱신하세요.

import type { BenefitItem } from "./benefits";

export const benefits: BenefitItem[] = [
${lines.join(",\n")}
];

export const benefitsMeta = {
  fetchedAt: ${J(data._meta.fetchedAt)},
  totalFromApi: ${data._meta.totalFromApi},
  filteredCount: ${data._meta.filteredCount},
};
`;

  const outPath = join(__dirname, "..", "src", "data", "benefits-api.ts");
  writeFileSync(outPath, output, "utf-8");
  console.log(`benefits-api.ts 생성 완료 (src/data/benefits-api.ts)`);
}

function J(v: unknown): string {
  return JSON.stringify(v);
}

// ─── Main ────────────────────────────────────────────────

async function main() {
  const seedPath = join(__dirname, "..", "data", "benefits-seed.json");
  const mode = process.argv[2];

  if (mode === "generate") {
    // seed.json → benefits.ts 만 재생성
    if (!existsSync(seedPath)) {
      console.error("data/benefits-seed.json이 없습니다. 먼저 npm run fetch-benefits 를 실행하세요.");
      process.exit(1);
    }
    const seed: BenefitData = JSON.parse(readFileSync(seedPath, "utf-8"));
    generateBenefitsTS(seed);
    return;
  }

  requireApiKey();
  console.log("임산부/육아 혜택 데이터 수집을 시작합니다...\n");

  const { raw, totalCount } = await fetchAllBenefits();

  // 임산부/육아 관련 필터링
  console.log("  임산부/육아 관련 혜택 필터링 중...");
  const filtered = raw.filter(isPregnancyRelated);
  console.log(`    ${raw.length}건 중 ${filtered.length}건 해당\n`);

  if (filtered.length === 0) {
    console.error("필터링된 혜택이 없습니다. API 응답을 확인해주세요.");
    process.exit(1);
  }

  // 중복 제거 (같은 서비스명)
  const seen = new Set<string>();
  const unique = filtered.filter((item) => {
    const name = item["서비스명"] || item["사업명"] || "";
    if (!name || seen.has(name)) return false;
    seen.add(name);
    return true;
  });
  console.log(`  중복 제거 후: ${unique.length}건\n`);

  // Transform
  const benefits = unique.map((item, i) => transformBenefit(item, i + 1));

  const data: BenefitData = {
    _meta: {
      fetchedAt: new Date().toISOString(),
      totalFromApi: totalCount,
      filteredCount: benefits.length,
      note:
        "공공데이터포털 행정안전부_대한민국 공공서비스(혜택) 정보에서 수집. " +
        "npm run fetch-benefits generate 로 benefits.ts 재생성 가능.",
    },
    benefits,
  };

  // data/ 디렉토리 확인
  const dataDir = join(__dirname, "..", "data");
  if (!existsSync(dataDir)) {
    const { mkdirSync } = await import("fs");
    mkdirSync(dataDir, { recursive: true });
  }

  writeFileSync(seedPath, JSON.stringify(data, null, 2), "utf-8");

  console.log("-------------------------------------------");
  console.log(`benefits-seed.json 저장 완료 (data/benefits-seed.json)`);
  console.log(`  전체 API 데이터: ${totalCount}건`);
  console.log(`  임산부/육아 관련: ${benefits.length}건`);

  // 지역별 통계
  const regionStats = new Map<string, number>();
  for (const b of benefits) {
    regionStats.set(b.region, (regionStats.get(b.region) ?? 0) + 1);
  }
  console.log("\n  지역별 분포:");
  for (const [region, count] of [...regionStats.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`    ${region}: ${count}건`);
  }

  // 카테고리별 통계
  const catStats = new Map<string, number>();
  for (const b of benefits) {
    catStats.set(b.category, (catStats.get(b.category) ?? 0) + 1);
  }
  console.log("\n  카테고리별 분포:");
  const catLabels: Record<string, string> = {
    money: "지원금/수당", medical: "의료/건강", childcare: "보육/돌봄",
    housing: "주거", education: "교육", other: "기타",
  };
  for (const [cat, count] of [...catStats.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`    ${catLabels[cat] ?? cat}: ${count}건`);
  }

  console.log("-------------------------------------------\n");

  // TS 파일 생성
  generateBenefitsTS(data);
}

main().catch((e) => {
  console.error("혜택 데이터 수집 실패:", e);
  process.exit(1);
});
