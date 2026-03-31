import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-5 text-center">
      <p className="text-5xl mb-4">🔍</p>
      <h2 className="text-lg font-bold text-foreground mb-2">페이지를 찾을 수 없어요</h2>
      <p className="text-sm text-muted mb-6 leading-relaxed">
        요청하신 페이지가 존재하지 않거나
        <br />
        이동되었을 수 있습니다.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-2xl bg-primary text-white text-sm font-semibold"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
