import type { AppMode } from "@/store/useBabyStore";

export interface GreetingContext {
  mode: AppMode;
  hour: number; // 0~23
  currentWeek?: number;
  daysUntilDue?: number;
  babyNickname?: string;
  babyAgeMonths?: number;
  parentRole?: "mom" | "dad";
}

export interface Greeting {
  /** 상단 작은 라벨 (예: "오늘도 건강하세요 ✨") */
  label: string;
  /** Hero 본문 라인 (배지 표시) */
  message: string;
  /** 시간대 색조 */
  tone: "dawn" | "morning" | "afternoon" | "evening" | "dusk" | "night";
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function timeBucket(hour: number): Greeting["tone"] {
  if (hour >= 0 && hour < 5) return "night"; // 새벽
  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "dusk"; // 밤
}

export function buildGreeting(ctx: GreetingContext): Greeting {
  const tone = timeBucket(ctx.hour);
  const baby = ctx.babyNickname ?? "아기";

  // ─── 임신 모드 ──────────────────────────────────────
  if (ctx.mode === "pregnancy") {
    const week = ctx.currentWeek ?? 0;
    const isImminent = (ctx.daysUntilDue ?? 999) <= 14;

    if (tone === "night") {
      return {
        label: "🌙 늦은 시간이네요",
        message: ctx.parentRole === "dad"
          ? "이 시간까지 깨어계셨다면, 무리하지 마세요."
          : pick([
              "이 시간까지 깨어 있다면, 무리하지 말아요.",
              "혹시 잠이 안 오나요? 따뜻한 우유 한 잔 어떠세요.",
              `${baby}도 함께 깨어있을지도 몰라요. 천천히 쉬어요.`,
            ]),
        tone,
      };
    }

    if (isImminent) {
      return {
        label: "👶 출산이 임박했어요",
        message: pick([
          `D-${ctx.daysUntilDue}, 출산 가방은 챙기셨나요?`,
          "오늘은 가벼운 산책이 좋아요. 진통 신호를 기억하세요.",
          "응급 상황 가이드를 한 번 더 확인해보세요.",
        ]),
        tone,
      };
    }

    if (tone === "morning") {
      return {
        label: "☀️ 좋은 아침이에요",
        message: pick([
          `${baby}와 함께하는 ${week}주차 아침입니다.`,
          "아침 식사 후 영양제 잊지 마세요.",
          ctx.parentRole === "dad" ? "오늘도 든든한 하루 되세요." : "오늘 컨디션은 어떠세요?",
        ]),
        tone,
      };
    }

    if (tone === "afternoon") {
      return {
        label: "🌤 활기찬 오후에요",
        message: pick([
          week < 14 ? "초기 입덧이 힘들 수 있어요. 가볍게 드세요." :
          week < 28 ? "오후 산책은 어떠세요? 30분이면 충분해요." :
                     "후기 부종이 있다면 발을 올리고 쉬어주세요.",
          "수분 섭취 충분히 하고 계신가요?",
        ]),
        tone,
      };
    }

    if (tone === "evening") {
      return {
        label: "🌆 오늘도 수고하셨어요",
        message: pick([
          "저녁 영양제 챙기셨나요?",
          `${baby}와 보낸 ${week}주차도 절반이 지났어요.`,
          "오늘 신청한 혜택이 있는지 확인해보세요.",
        ]),
        tone,
      };
    }

    // dusk (21~24시)
    return {
      label: "✨ 편안한 밤 되세요",
      message: pick([
        "오늘 하루 잘 보내셨어요. 푹 쉬세요.",
        "내일은 더 좋은 하루가 될 거예요.",
        `${baby}도 잘 자고 있을 거예요.`,
      ]),
      tone,
    };
  }

  // ─── 출산 후 모드 ───────────────────────────────────
  if (ctx.mode === "postnatal") {
    if (tone === "night") {
      return {
        label: "🌙 새벽 수유 중인가요?",
        message: pick([
          `${baby}가 무사히 잠들길. 엄마 아빠도 잠시 눈을 붙이세요.`,
          "이 시간은 정말 힘들어요. 잘 버티고 있어요.",
          "혹시 모유 수유 중이라면, 수분도 챙기세요.",
        ]),
        tone,
      };
    }
    if (tone === "morning") {
      return {
        label: "☀️ 좋은 아침이에요",
        message: pick([
          `${baby}는 잘 깼나요? 오늘도 화이팅!`,
          "아침 첫 수유 기록 잊지 마세요.",
          "오늘 예방접종 일정이 있는지 확인해보세요.",
        ]),
        tone,
      };
    }
    if (tone === "afternoon") {
      return {
        label: "🌤 함께 보내는 오후",
        message: pick([
          `${baby}와의 일과는 어떠세요?`,
          "낮잠 시간을 활용해 잠시 쉬세요.",
          "오늘 발달 마일스톤 하나 기록해볼까요?",
        ]),
        tone,
      };
    }
    if (tone === "evening") {
      return {
        label: "🌆 저녁 시간이에요",
        message: pick([
          "오늘 수유·기저귀 기록 정리해보세요.",
          `${baby}의 하루를 일기로 남겨보세요.`,
          "목욕 시간이 다가오고 있어요.",
        ]),
        tone,
      };
    }
    return {
      label: "✨ 편안한 밤 되세요",
      message: pick([
        `${baby}와 함께 푹 쉬세요.`,
        "오늘도 정말 잘 보내셨어요.",
      ]),
      tone,
    };
  }

  // ─── 난임 모드 ──────────────────────────────────────
  if (ctx.mode === "infertility") {
    if (tone === "night") {
      return {
        label: "🌙 마음이 복잡한 밤인가요",
        message: "혼자가 아니에요. 충분히 쉬는 것도 치료의 일부예요.",
        tone,
      };
    }
    if (tone === "morning") {
      return {
        label: "☀️ 새로운 하루",
        message: pick([
          "오늘 시술 일정이 있다면 차분하게 준비해요.",
          "꾸준히 잘하고 있어요. 조급해하지 말아요.",
        ]),
        tone,
      };
    }
    return {
      label: "💙 함께 응원해요",
      message: pick([
        "오늘도 한 걸음, 잘하고 있어요.",
        "정부 지원금 신청 기간을 놓치지 마세요.",
      ]),
      tone,
    };
  }

  return {
    label: "안녕하세요",
    message: "오늘도 좋은 하루 보내세요.",
    tone,
  };
}
