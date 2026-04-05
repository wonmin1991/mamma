import "dotenv/config";
import { writeFileSync, existsSync, readFileSync } from "fs";
import { join } from "path";

// ─── Config ──────────────────────────────────────────────

const CLIENT_ID = process.env.NAVER_CLIENT_ID;
const CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

function requireApiKeys() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error(
      "NAVER_CLIENT_ID / NAVER_CLIENT_SECRET 환경변수가 필요합니다.\n" +
        "  1. https://developers.naver.com/apps/#/register 에서 앱 등록\n" +
        '  2. 사용 API에서 "검색" 선택\n' +
        "  3. .env 파일에 ID/SECRET 입력  (.env.example 참고)"
    );
    process.exit(1);
  }
}

// ─── Helpers ─────────────────────────────────────────────

function strip(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function naverSearch(
  type: "local" | "blog" | "cafearticle",
  query: string,
  display = 20,
  sort = "comment"
): Promise<{ items: Record<string, string>[] }> {
  const url = new URL(`https://openapi.naver.com/v1/search/${type}.json`);
  url.searchParams.set("query", query);
  url.searchParams.set("display", String(display));
  url.searchParams.set("sort", sort);

  const res = await fetch(url, {
    headers: {
      "X-Naver-Client-Id": CLIENT_ID!,
      "X-Naver-Client-Secret": CLIENT_SECRET!,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Naver API ${res.status}: ${body}`);
  }
  return res.json() as Promise<{ items: Record<string, string>[] }>;
}

// ─── Seed types ──────────────────────────────────────────

interface SeedRestaurant {
  name: string;
  naverCategory: string;
  region: "seoul" | "gyeonggi" | "incheon";
  area: string;
  address: string;
  telephone: string;
  sourceUrl: string;
  imageUrl: string;
  // 아래 필드는 사용자가 직접 편집
  category: string;
  description: string;
  rating: number | null;
  priceRange: string;
  pregnancyPerks: string[];
  tags: string[];
  emoji: string;
  verified: boolean;
}

interface SeedTip {
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  postDate: string;
  category: string;
}

interface SeedCurated {
  title: string;
  summary: string;
  sourceType: "blog" | "cafe";
  sourceName: string;
  sourceUrl: string;
  postDate: string;
}

interface SeedData {
  _meta: { crawledAt: string; note: string };
  restaurants: SeedRestaurant[];
  tips: SeedTip[];
  curated: SeedCurated[];
}

// ─── Category detection ──────────────────────────────────

const CATEGORY_MAP: [RegExp, string][] = [
  [/한식|한정식|국밥|찌개|백반|비빔|불고기|갈비|삼계탕|죽|보쌈|순대|한우/i, "korean"],
  [/양식|이탈리|파스타|스테이크|브런치|피자|햄버거|프렌치|오므라이스/i, "western"],
  [/일식|초밥|스시|라멘|우동|소바|돈카츠|규동|덮밥/i, "japanese"],
  [/중식|중화|짜장|짬뽕|마라|딤섬|만두/i, "chinese"],
  [/카페|디저트|베이커리|케이크|빵|커피|브런치카페/i, "cafe"],
  [/샐러드|비건|채식|유기농|건강식|자연식|주스/i, "salad"],
];

function detectCategory(naverCategory: string, title: string): string {
  const text = `${naverCategory} ${title}`;
  for (const [re, cat] of CATEGORY_MAP) {
    if (re.test(text)) return cat;
  }
  return "korean";
}

function detectRegion(address: string): "seoul" | "gyeonggi" | "incheon" {
  if (/서울/.test(address)) return "seoul";
  if (/인천/.test(address)) return "incheon";
  return "gyeonggi";
}

function extractArea(address: string): string {
  const m = address.match(
    /(?:서울특별시|서울|경기도|경기|인천광역시|인천)\s*(\S+?[시구군])/
  );
  return m ? m[1] : "";
}

const CATEGORY_EMOJIS: Record<string, string> = {
  korean: "🍚",
  western: "🍝",
  japanese: "🍱",
  chinese: "🥟",
  cafe: "☕",
  salad: "🥗",
};

// ─── Phase 1: Crawl → seed.json ──────────────────────────

const RESTAURANT_QUERIES = [
  "임산부 맛집 서울",
  "건강식 맛집 서울 강남",
  "유기농 레스토랑 서울",
  "한정식 맛집 서울",
  "저염식 맛집 서울",
  "디카페인 카페 서울 성수",
  "비건 맛집 서울 마포",
  "건강식 맛집 분당",
  "유기농 레스토랑 수원",
  "건강식 카페 일산",
  "건강식 맛집 인천",
  "디카페인 카페 인천 송도",
];

async function searchImage(query: string): Promise<string> {
  try {
    const data = await naverSearch("image" as "local", query, 1, "sim");
    const item = data.items[0];
    return item?.thumbnail || item?.link || "";
  } catch {
    return "";
  }
}

async function crawlRestaurants(): Promise<SeedRestaurant[]> {
  console.log("  맛집 크롤링...");
  const seen = new Set<string>();
  const results: SeedRestaurant[] = [];

  for (const q of RESTAURANT_QUERIES) {
    try {
      const data = await naverSearch("local", q, 10);
      for (const item of data.items) {
        const name = strip(item.title);
        if (seen.has(name)) continue;
        seen.add(name);

        const addr = item.roadAddress || item.address || "";
        if (!addr) continue;

        const region = detectRegion(addr);
        const area = extractArea(addr);
        if (!area) continue;

        const cat = detectCategory(item.category || "", name);

        results.push({
          name,
          naverCategory: item.category || "",
          region,
          area,
          address: addr,
          telephone: item.telephone || "",
          sourceUrl: item.link || `https://map.naver.com/p/search/${encodeURIComponent(name + " " + area)}`,
          imageUrl: "",
          category: cat,
          description: "",
          rating: null,
          priceRange: "",
          pregnancyPerks: [],
          tags: [],
          emoji: CATEGORY_EMOJIS[cat] ?? "🍽️",
          verified: false,
        });
      }
      console.log(`    "${q}" -> ${data.items.length}건`);
    } catch (e) {
      console.warn(`    "${q}" 실패: ${e}`);
    }
    await sleep(200);
  }

  // 이미지 검색 (rate limit 고려해서 순차 처리)
  console.log(`    이미지 검색 중... (${results.length}개)`);
  for (const r of results) {
    r.imageUrl = await searchImage(`${r.name} ${r.area} 맛집`);
    await sleep(100);
  }
  const withImage = results.filter((r) => r.imageUrl).length;
  console.log(`    이미지 ${withImage}/${results.length}개 확보`);

  console.log(`    총 ${results.length}개\n`);
  return results;
}

const TIP_QUERIES: { query: string; category: string }[] = [
  { query: "임신 초기 영양제 추천 2026", category: "nutrition" },
  { query: "임산부 엽산 철분 복용법", category: "nutrition" },
  { query: "입덧 완화 음식 방법", category: "nutrition" },
  { query: "임신성 당뇨 식단 관리", category: "nutrition" },
  { query: "임산부 요가 운동 추천", category: "exercise" },
  { query: "임산부 스트레칭 루틴", category: "exercise" },
  { query: "임산부 수영 걷기 운동", category: "exercise" },
  { query: "임신 중 우울감 극복 방법", category: "mental" },
  { query: "태교 음악 추천", category: "mental" },
  { query: "서울 산부인과 추천 2026", category: "hospital" },
  { query: "정밀초음파 검사 후기 비용", category: "hospital" },
  { query: "출산 준비물 리스트 2026", category: "product" },
  { query: "신생아 용품 추천 가성비", category: "product" },
  { query: "산후조리원 추천 후기 2026", category: "postpartum" },
  { query: "산후조리원 선택 체크리스트", category: "postpartum" },
  { query: "산후조리원 비용 절약 꿀팁", category: "postpartum" },
  { query: "산후조리 음식 식단 추천", category: "postpartum" },
  { query: "산후우울증 증상 대처법", category: "postpartum" },
];

async function crawlTips(): Promise<SeedTip[]> {
  console.log("  팁 크롤링...");
  const seen = new Set<string>();
  const results: SeedTip[] = [];

  for (const { query, category } of TIP_QUERIES) {
    try {
      const data = await naverSearch("blog", query, 5, "sim");
      for (const item of data.items) {
        const title = strip(item.title);
        if (seen.has(title) || title.length < 5) continue;
        seen.add(title);

        results.push({
          title,
          summary: strip(item.description || ""),
          source: item.bloggername || "네이버 블로그",
          sourceUrl: item.link || "",
          postDate: item.postdate || "",
          category,
        });
      }
      console.log(`    "${query}" -> ${data.items.length}건`);
    } catch (e) {
      console.warn(`    "${query}" 실패: ${e}`);
    }
    await sleep(200);
  }

  console.log(`    총 ${results.length}개\n`);
  return results;
}

const CURATED_QUERIES: { query: string; type: "blog" | "cafearticle" }[] = [
  { query: "임산부 디저트 카페 추천", type: "blog" },
  { query: "정밀초음파 후기 2026", type: "blog" },
  { query: "임산부 필라테스 요가 후기", type: "blog" },
  { query: "임산부 패션 코디 봄", type: "blog" },
  { query: "산후조리원 추천 후기 2026", type: "blog" },
  { query: "임신 주차별 변화 기록", type: "blog" },
  { query: "신생아 용품 추천 2026", type: "cafearticle" },
  { query: "출산 병원 비교 서울 경기", type: "cafearticle" },
  { query: "임산부 안전한 약 정리", type: "cafearticle" },
  { query: "임신성 당뇨 식단 후기", type: "cafearticle" },
];

async function crawlCurated(): Promise<SeedCurated[]> {
  console.log("  큐레이션 크롤링...");
  const seen = new Set<string>();
  const results: SeedCurated[] = [];

  for (const { query, type } of CURATED_QUERIES) {
    try {
      const data = await naverSearch(type, query, 3, "sim");
      const sourceType = type === "blog" ? "blog" : "cafe";

      for (const item of data.items) {
        const title = strip(item.title);
        if (seen.has(title) || title.length < 5) continue;
        seen.add(title);

        results.push({
          title,
          summary: strip(item.description || ""),
          sourceType: sourceType as "blog" | "cafe",
          sourceName:
            sourceType === "blog"
              ? item.bloggername || "네이버 블로그"
              : item.cafename || "네이버 카페",
          sourceUrl: item.link || item.cafeurl || "",
          postDate: item.postdate || "",
        });
      }
      console.log(`    "${query}" (${type}) -> ${data.items.length}건`);
    } catch (e) {
      console.warn(`    "${query}" 실패: ${e}`);
    }
    await sleep(200);
  }

  console.log(`    총 ${results.length}개\n`);
  return results;
}

// ─── Main ────────────────────────────────────────────────

async function main() {
  const seedPath = join(__dirname, "..", "data", "seed.json");
  const mode = process.argv[2];

  if (mode === "generate") {
    if (!existsSync(seedPath)) {
      console.error("data/seed.json이 없습니다. 먼저 npm run crawl 을 실행하세요.");
      process.exit(1);
    }
    const seed: SeedData = JSON.parse(readFileSync(seedPath, "utf-8"));
    generateCrawledTS(seed);
    return;
  }

  requireApiKeys();
  console.log("데이터 크롤링을 시작합니다...\n");

  const [restaurants, tips, curated] = await Promise.all([
    crawlRestaurants(),
    crawlTips(),
    crawlCurated(),
  ]);

  if (restaurants.length === 0 && tips.length === 0 && curated.length === 0) {
    console.error("크롤링 결과가 없습니다. API 키를 확인해주세요.");
    process.exit(1);
  }

  // seed.json 에 기존 데이터가 있으면, 사용자가 편집한 내용을 보존
  let existingSeed: SeedData | null = null;
  if (existsSync(seedPath)) {
    existingSeed = JSON.parse(readFileSync(seedPath, "utf-8"));
  }

  const mergedRestaurants = mergeRestaurants(restaurants, existingSeed?.restaurants ?? []);

  const seed: SeedData = {
    _meta: {
      crawledAt: new Date().toISOString(),
      note:
        "이 파일을 직접 편집하세요! " +
        "맛집의 description, rating, priceRange, pregnancyPerks, tags를 채운 뒤 " +
        "verified: true로 변경하세요. " +
        "npm run generate 으로 앱 데이터에 반영됩니다.",
    },
    restaurants: mergedRestaurants,
    tips,
    curated,
  };

  writeFileSync(seedPath, JSON.stringify(seed, null, 2), "utf-8");
  console.log("-------------------------------------------");
  console.log(`seed.json 저장 완료 (data/seed.json)`);
  console.log(`  맛집: ${mergedRestaurants.length}개`);
  console.log(`  팁: ${tips.length}개`);
  console.log(`  큐레이션: ${curated.length}개`);
  console.log("-------------------------------------------\n");

  generateCrawledTS(seed);
}

/** 새로 크롤링한 맛집에, 기존에 사용자가 편집한 내용을 보존 */
function mergeRestaurants(
  fresh: SeedRestaurant[],
  existing: SeedRestaurant[]
): SeedRestaurant[] {
  const existingMap = new Map(existing.map((r) => [r.name, r]));
  return fresh.map((r) => {
    const prev = existingMap.get(r.name);
    if (prev && prev.verified) {
      return { ...r, ...prev, sourceUrl: r.sourceUrl || prev.sourceUrl };
    }
    return r;
  });
}

// ─── Phase 2: seed.json → crawled.ts ─────────────────────

const GRADIENTS = [
  "from-rose-400 to-pink-300",
  "from-violet-400 to-purple-300",
  "from-emerald-400 to-teal-300",
  "from-sky-400 to-blue-300",
  "from-amber-400 to-orange-300",
  "from-rose-400 to-red-300",
  "from-lime-400 to-green-300",
  "from-indigo-400 to-violet-300",
  "from-pink-400 to-rose-300",
  "from-cyan-400 to-sky-300",
  "from-teal-400 to-emerald-300",
  "from-orange-400 to-amber-300",
  "from-fuchsia-400 to-pink-300",
  "from-blue-400 to-indigo-300",
  "from-yellow-400 to-amber-300",
];

const TIP_EMOJIS: Record<string, string> = {
  nutrition: "💊",
  exercise: "🧘‍♀️",
  mental: "💜",
  hospital: "🏥",
  product: "👶",
  postpartum: "🏥",
};

const CATEGORY_PRICES: Record<string, string> = {
  korean: "10,000~25,000원",
  western: "15,000~35,000원",
  japanese: "10,000~20,000원",
  chinese: "8,000~18,000원",
  cafe: "5,000~12,000원",
  salad: "10,000~18,000원",
};

function generateCrawledTS(seed: SeedData) {
  const restLines = seed.restaurants.map((r, i) => {
    const desc =
      r.description ||
      `${r.area}에 위치한 ${r.name}. 상세 정보는 네이버 플레이스를 확인하세요.`;
    const rating = r.rating ?? 0;
    const price = r.priceRange || CATEGORY_PRICES[r.category] || "";
    const perks = r.pregnancyPerks.length > 0 ? r.pregnancyPerks : [];
    const tags = r.tags.length > 0 ? r.tags : [r.naverCategory.split(">")[0] || "맛집"];
    return `  {
    id: ${i + 1}, name: ${J(r.name)}, category: ${J(r.category)}, region: ${J(r.region)}, area: ${J(r.area)},
    rating: ${rating}, tags: ${J(tags)},
    description: ${J(desc)},
    emoji: ${J(r.emoji)}, priceRange: ${J(price)},
    pregnancyPerks: ${J(perks)},
    address: ${J(r.address)}, savedCount: 0,
    sourceUrl: ${J(r.sourceUrl)},
    imageUrl: ${J(r.imageUrl || "")},
  }`;
  });

  const tipLines = seed.tips.slice(0, 20).map((t, i) => {
    const summary =
      t.summary.length > 100 ? t.summary.slice(0, 100) + "..." : t.summary;
    return `  {
    id: ${i + 1}, title: ${J(t.title)}, category: ${J(t.category)},
    summary: ${J(summary)},
    content: ${J(t.summary)},
    source: ${J(t.source)}, emoji: ${J(TIP_EMOJIS[t.category] ?? "💡")}, likes: 0,
    gradient: ${J(GRADIENTS[i % GRADIENTS.length])},
    sourceUrl: ${J(t.sourceUrl)},
  }`;
  });

  const curatedEmojis = ["☕", "🏥", "🧘‍♀️", "🍼", "📝", "👗", "💊", "🍽️", "👶", "📋"];
  const curatedLines = seed.curated.slice(0, 12).map((c, i) => {
    const summary =
      c.summary.length > 80 ? c.summary.slice(0, 80) + "..." : c.summary;
    const tags = extractHashtags(c.title, c.summary);
    return `  {
    id: ${i + 1}, source: ${J(c.sourceType)}, sourceAccount: ${J(c.sourceName)},
    title: ${J(c.title)},
    summary: ${J(summary)},
    tags: ${J(tags)},
    likes: 0, emoji: ${J(curatedEmojis[i % curatedEmojis.length])}, gradient: ${J(GRADIENTS[i % GRADIENTS.length])},
    sourceUrl: ${J(c.sourceUrl)},
  }`;
  });

  const now = new Date().toISOString().slice(0, 10);
  const output = `// Auto-generated from data/seed.json — ${now}
// 맛집 데이터: seed.json에서 직접 편집 후 \`npm run generate\`
// 팁/큐레이션: 원문 링크(sourceUrl)로 연결됩니다.

import type { Restaurant, Tip, CuratedPost } from "./mock";

export const crawledRestaurants: Restaurant[] = [
${restLines.join(",\n")}
];

export const crawledTips: Tip[] = [
${tipLines.join(",\n")}
];

export const crawledCurated: CuratedPost[] = [
${curatedLines.join(",\n")}
];
`;

  const outPath = join(__dirname, "..", "src", "data", "crawled.ts");
  writeFileSync(outPath, output, "utf-8");

  const verified = seed.restaurants.filter((r) => r.verified).length;
  console.log("crawled.ts 생성 완료 (src/data/crawled.ts)");
  console.log(`  맛집: ${seed.restaurants.length}개 (검증됨: ${verified}개)`);
  console.log(`  팁: ${Math.min(seed.tips.length, 20)}개 (원문 링크 포함)`);
  console.log(`  큐레이션: ${Math.min(seed.curated.length, 12)}개 (원문 링크 포함)`);
}

function J(v: unknown): string {
  return JSON.stringify(v);
}

function extractHashtags(title: string, desc: string): string[] {
  const text = `${title} ${desc}`;
  const tags: string[] = [];
  if (/맛집|카페|디저트/.test(text)) tags.push("#임산부맛집");
  if (/운동|요가|필라테스|스트레칭/.test(text)) tags.push("#임산부운동");
  if (/영양|비타민|엽산|철분/.test(text)) tags.push("#임신영양");
  if (/병원|산부인과|초음파/.test(text)) tags.push("#산부인과");
  if (/용품|준비물|출산/.test(text)) tags.push("#출산준비");
  if (/패션|코디/.test(text)) tags.push("#임산부패션");
  if (/당뇨|식단/.test(text)) tags.push("#식단관리");
  if (/산후|조리/.test(text)) tags.push("#산후조리");
  if (tags.length === 0) tags.push("#임산부");
  return tags.slice(0, 3);
}

main().catch((e) => {
  console.error("크롤링 실패:", e);
  process.exit(1);
});
