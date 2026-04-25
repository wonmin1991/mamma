import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/lib/env";
import {
  buildSystemPrompt,
  MAX_USER_MESSAGE_LENGTH,
  MAX_HISTORY_TURNS,
  type ChatContext,
} from "@/lib/chatSystemPrompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  messages: ChatTurn[];
  context: ChatContext;
}

function bad(status: number, message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  if (!env.anthropicApiKey) {
    return bad(503, "AI 상담 기능이 준비 중입니다. 잠시 후 다시 시도해주세요.");
  }

  let body: ChatRequest;
  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return bad(400, "잘못된 요청입니다.");
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (messages.length === 0) return bad(400, "메시지가 비어있습니다.");

  const last = messages[messages.length - 1];
  if (last.role !== "user") return bad(400, "마지막 메시지는 사용자 메시지여야 합니다.");
  if (!last.content?.trim()) return bad(400, "메시지가 비어있습니다.");
  if (last.content.length > MAX_USER_MESSAGE_LENGTH) {
    return bad(400, `메시지는 ${MAX_USER_MESSAGE_LENGTH}자 이내로 입력해주세요.`);
  }

  const trimmed = messages.slice(-MAX_HISTORY_TURNS * 2).map((m) => ({
    role: m.role,
    content: m.content.slice(0, MAX_USER_MESSAGE_LENGTH * 2),
  }));

  const systemPrompt = buildSystemPrompt(body.context ?? { mode: "pregnancy" });

  const client = new Anthropic({ apiKey: env.anthropicApiKey });

  try {
    const stream = await client.messages.stream({
      model: env.chatModel,
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: systemPrompt,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: trimmed,
    });

    const encoder = new TextEncoder();
    const sse = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ delta: event.delta.text })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
          controller.close();
        } catch (err) {
          const message = err instanceof Error ? err.message : "stream error";
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(sse, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return bad(500, `AI 응답 생성 실패: ${message}`);
  }
}
