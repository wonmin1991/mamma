import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "이용약관",
  description: "맘마 서비스 이용약관",
};

export default function TermsPage() {
  return (
    <main className="flex flex-col">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-5 pt-12 pb-3">
        <div className="flex items-center gap-2">
          <Link href="/settings" className="p-1 -ml-1" aria-label="뒤로가기">
            <ChevronLeft size={22} className="text-foreground" />
          </Link>
          <h1 className="text-lg font-bold text-foreground">이용약관</h1>
        </div>
      </header>

      <section className="px-5 pb-28">
        <div className="prose prose-sm text-foreground max-w-none">
          <p className="text-xs text-muted mb-6">시행일: 2026년 4월 8일</p>

          <h2 className="text-base font-bold mt-6 mb-2">제1조 (목적)</h2>
          <p className="text-sm text-muted leading-relaxed">
            이 약관은 맘마(이하 &quot;서비스&quot;)가 제공하는 임신·난임·육아 정보 서비스의 이용 조건 및 절차, 이용자와 서비스 간의 권리·의무를 규정함을 목적으로 합니다.
          </p>

          <h2 className="text-base font-bold mt-6 mb-2">제2조 (서비스 내용)</h2>
          <p className="text-sm text-muted leading-relaxed">
            서비스는 다음을 제공합니다.
          </p>
          <ul className="text-sm text-muted leading-relaxed list-disc pl-5 space-y-1">
            <li>임신 주차별 가이드 및 건강 정보</li>
            <li>난임 시술 정보 및 지원금 안내</li>
            <li>정부 출산·육아 혜택 정보</li>
            <li>초음파 사진 기록 및 관리</li>
            <li>임산부 맛집·커뮤니티 정보</li>
            <li>데이터 클라우드 동기화 (회원 기능)</li>
          </ul>

          <h2 className="text-base font-bold mt-6 mb-2">제3조 (의료 면책)</h2>
          <p className="text-sm text-muted leading-relaxed">
            서비스에서 제공하는 건강·의료 정보는 일반적인 참고 목적으로만 제공되며, 의학적 진단이나 치료를 대체할 수 없습니다.
            영양제 복용량, 검사 일정, 응급 증상 판별 등 모든 의료 관련 정보는 반드시 담당 의료진과 상담 후 결정하시기 바랍니다.
            서비스는 정보의 정확성을 위해 ACOG, WHO, NIH, 대한산부인과학회 등 공신력 있는 출처를 참고하나,
            개인의 건강 상태에 따른 결과에 대해 책임을 지지 않습니다.
          </p>

          <h2 className="text-base font-bold mt-6 mb-2">제4조 (회원가입 및 탈퇴)</h2>
          <p className="text-sm text-muted leading-relaxed">
            서비스는 비회원도 기본 기능을 이용할 수 있습니다.
            회원가입은 이메일 또는 소셜 로그인(Google, Kakao)으로 가능하며,
            회원은 언제든지 설정에서 데이터 삭제 및 탈퇴를 요청할 수 있습니다.
          </p>

          <h2 className="text-base font-bold mt-6 mb-2">제5조 (데이터 저장 및 보호)</h2>
          <p className="text-sm text-muted leading-relaxed">
            비회원의 데이터는 기기의 브라우저(localStorage)에만 저장되며 서버로 전송되지 않습니다.
            회원의 데이터는 Supabase 클라우드에 암호화되어 저장되며, 본인만 접근할 수 있습니다.
            초음파 사진은 기기에 로컬 저장되며, 클라우드 동기화 시 암호화된 형태로 전송됩니다.
          </p>

          <h2 className="text-base font-bold mt-6 mb-2">제6조 (이용자의 의무)</h2>
          <ul className="text-sm text-muted leading-relaxed list-disc pl-5 space-y-1">
            <li>커뮤니티에 허위 정보, 광고, 비방 등을 게시하지 않습니다.</li>
            <li>타인의 개인정보를 무단으로 수집하거나 사용하지 않습니다.</li>
            <li>서비스의 정상적인 운영을 방해하지 않습니다.</li>
          </ul>

          <h2 className="text-base font-bold mt-6 mb-2">제7조 (면책 사항)</h2>
          <ul className="text-sm text-muted leading-relaxed list-disc pl-5 space-y-1">
            <li>서비스는 천재지변, 시스템 장애 등 불가항력으로 인한 서비스 중단에 대해 책임을 지지 않습니다.</li>
            <li>정부 혜택 정보는 정책 변경으로 인해 실제와 다를 수 있으며, 최종 확인은 해당 기관에 문의하시기 바랍니다.</li>
            <li>커뮤니티 게시물의 내용은 작성자 본인의 의견이며, 서비스의 공식 입장이 아닙니다.</li>
          </ul>

          <h2 className="text-base font-bold mt-6 mb-2">제8조 (약관 변경)</h2>
          <p className="text-sm text-muted leading-relaxed">
            서비스는 관련 법령에 위배되지 않는 범위에서 약관을 변경할 수 있으며,
            변경 시 앱 내 공지를 통해 알립니다. 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단할 수 있습니다.
          </p>

          <h2 className="text-base font-bold mt-6 mb-2">제9조 (문의)</h2>
          <p className="text-sm text-muted leading-relaxed">
            서비스 이용에 관한 문의는 앱 내 &quot;의견 보내기&quot; 기능을 통해 접수하실 수 있습니다.
          </p>
        </div>
      </section>
    </main>
  );
}
