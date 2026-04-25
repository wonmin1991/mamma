import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/lib/env";
import type { AppMode } from "@/store/useBabyStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface BriefRequest {
  mode: AppMode;
  currentWeek?: number;
  babyAgeMonths?: number;
  babyNickname?: string;
  region?: string;
  /** 오늘 이미 한 일 (UI에서 가져온 부드러운 컨텍스트) */
  todayContext?: {
    suppPending?: number;
    suppDone?: number;
    upcomingCheckup?: string;
    urgentBenefit?: string;
  };
}

const SYSTEM_PROMPT = `당신은 "맘마(Mamma)" 앱의 오늘의 브리핑을 작성합니다.
임신·출산·육아 중인 한국 사용자를 위해 한 줄~두 줄(50~120자) 따뜻하고 실용적인 메시지를 만드세요.

[규칙]
- 출력은 한국어, 평문 1~2문장, 마크다운/이모지 1개 이내.
- 의학 진단·처방은 금지. 일반적인 권장만.
- 사용자의 컨텍스트(주차/월령/지역/오늘 할 일)를 반드시 1개 이상 반영.
- 응급 상황 언급 금지 (별도 페이지에서 처리).
- "오늘"이라는 단어는 자연스럽게 사용.
- 출력 시 따옴표/접두어 없이 메시지 본문만.`;

function bad(status: number, message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  if (!env.anthropicApiKey) return bad(503, "AI 브리핑이 준비 중입니다.");

  let body: BriefRequest;
  try {
    body = (await request.json()) as BriefRequest;
  } catch {
    return bad(400, "잘못된 요청입니다.");
  }

  const ctxLines: string[] = [];
  ctxLines.push(`모드: ${body.mode}`);
  if (typeof body.currentWeek === "number") ctxLines.push(`임신 ${body.currentWeek}주차`);
  if (typeof body.babyAgeMonths === "number") ctxLines.push(`아기 ${body.babyAgeMonths}개월${body.babyNickname ? ` (${body.babyNickname})` : ""}`);
  if (body.region) ctxLines.push(`지역: ${body.region}`);
  if (body.todayContext?.suppPending && body.todayContext.suppPending > 0) {
    ctxLines.push(`오늘 미복용 영양제 ${body.todayContext.suppPending}종`);
  }
  if (body.todayContext?.upcomingCheckup) ctxLines.push(`다가오는 검진: ${body.todayContext.upcomingCheckup}`);
  if (body.todayContext?.urgentBenefit) ctxLines.push(`마감 임박 혜택: ${body.todayContext.urgentBenefit}`);

  const userPrompt = `다음 컨텍스트를 반영해 오늘의 브리핑을 한 문장 또는 두 문장으로 작성해주세요.

${ctxLines.map((l) => `- ${l}`).join("\n")}

[월/일] ${new Date().toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "long" })}`;

  try {
    const client = new Anthropic({ apiKey: env.anthropicApiKey });
    const res = await client.messages.create({
      model: env.chatModel,
      max_tokens: 200,
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = res.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("")
      .trim();

    return new Response(
      JSON.stringify({ brief: text, generatedAt: new Date().toISOString() }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown error";
    return bad(500, `브리핑 생성 실패: ${msg}`);
  }
}
