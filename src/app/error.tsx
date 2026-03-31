"use client";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ reset }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-5 text-center">
      <p className="text-5xl mb-4">😢</p>
      <h2 className="text-lg font-bold text-foreground mb-2">문제가 발생했어요</h2>
      <p className="text-sm text-muted mb-6 leading-relaxed">
        일시적인 오류가 발생했습니다.
        <br />
        다시 시도해주세요.
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 rounded-2xl bg-primary text-white text-sm font-semibold active:scale-[0.98] transition-transform"
      >
        다시 시도
      </button>
    </div>
  );
}
