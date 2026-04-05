import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보 처리방침",
};

export default function PrivacyPage() {
  return (
    <main className="flex flex-col">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md px-5 pt-12 pb-3">
        <div className="flex items-center gap-2">
          <Link href="/settings" className="p-1 -ml-1" aria-label="뒤로가기">
            <ChevronLeft size={22} className="text-foreground" />
          </Link>
          <h1 className="text-lg font-bold text-foreground">개인정보 처리방침</h1>
        </div>
      </header>

      <section className="px-5 pb-8">
        <div className="bg-card rounded-2xl border border-card-border shadow-sm p-5 flex flex-col gap-6 text-sm text-foreground leading-relaxed">

          <div>
            <h2 className="font-bold text-base mb-2">1. 개요</h2>
            <p className="text-muted">
              맘마(이하 &quot;서비스&quot;)는 임산부 및 육아 정보를 제공하는 서비스로,
              개인정보보호법에 따라 이용자의 개인정보를 보호하고 있습니다.
              본 서비스는 이용자의 개인정보를 수집하는 서버를 운영하지 않으며,
              모든 데이터는 이용자의 기기(브라우저)에만 저장됩니다.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-base mb-2">2. 수집하는 정보</h2>
            <p className="text-muted mb-2">서비스는 다음 정보를 이용자의 기기에만 저장합니다. 서버로 전송되지 않습니다.</p>
            <ul className="list-disc list-inside text-muted flex flex-col gap-1">
              <li>출산 예정일 또는 임신 주차 (맞춤 정보 제공용)</li>
              <li>거주 지역 (지역별 혜택 필터링용)</li>
              <li>북마크, 좋아요, 최근 본 항목</li>
              <li>영양제 복용 체크 기록</li>
              <li>혜택 체크리스트 진행 상태</li>
              <li>위젯 설정, 테마 설정</li>
              <li>알림 설정 (시간, 활성화 여부)</li>
            </ul>
          </div>

          <div>
            <h2 className="font-bold text-base mb-2">3. 서버 전송 정보</h2>
            <p className="text-muted">
              본 서비스는 자체 서버를 운영하지 않으며, 이용자의 개인정보를 수집·저장·전송하지 않습니다.
              모든 데이터는 브라우저의 로컬 저장소(localStorage)에만 보관됩니다.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-base mb-2">4. 외부 서비스 연동</h2>
            <ul className="list-disc list-inside text-muted flex flex-col gap-1">
              <li><strong>공공데이터포털</strong> — 정부 혜택 정보를 제공하기 위해 공공데이터를 활용합니다. 이용자의 개인정보는 전송되지 않습니다.</li>
              <li><strong>제휴 링크</strong> — 일부 육아 용품 링크에는 제휴(어필리에이트) 추적 파라미터가 포함됩니다. 이는 서비스 운영을 위한 것이며, 이용자의 구매 결정에 영향을 주지 않습니다. 클릭 기록은 기기에만 저장됩니다.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-bold text-base mb-2">5. 알림</h2>
            <p className="text-muted">
              이용자가 알림을 활성화할 경우, 영양제 복용 리마인더 등을 브라우저 알림으로 제공합니다.
              알림 설정은 언제든지 변경하거나 비활성화할 수 있습니다.
              알림 관련 데이터는 서버로 전송되지 않습니다.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-base mb-2">6. 데이터 삭제</h2>
            <p className="text-muted">
              설정 &gt; 데이터 관리에서 &quot;모든 데이터 삭제&quot;를 통해
              기기에 저장된 모든 정보를 즉시 삭제할 수 있습니다.
              브라우저 설정에서 사이트 데이터를 삭제해도 동일한 효과가 있습니다.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-base mb-2">7. 의료 정보 면책</h2>
            <p className="text-muted">
              본 서비스에서 제공하는 임신·출산·영양 관련 정보는 일반적인 참고 목적으로만 제공되며,
              의학적 진단이나 처방을 대체하지 않습니다.
              건강 관련 결정은 반드시 의료 전문가와 상담하시기 바랍니다.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-base mb-2">8. 콘텐츠 출처</h2>
            <ul className="list-disc list-inside text-muted flex flex-col gap-1">
              <li><strong>정부 혜택</strong> — 공공데이터포털(data.go.kr), 정부24 공공서비스 정보 (공공누리 이용)</li>
              <li><strong>영양제 정보</strong> — 대한산부인과학회, 보건복지부 권장 기준 참고 (일반 정보 목적)</li>
              <li><strong>맛집·꿀팁</strong> — 네이버 검색 API를 통해 수집한 공개 정보이며, 원저작자의 원문 링크를 제공합니다</li>
            </ul>
          </div>

          <div>
            <h2 className="font-bold text-base mb-2">9. 문의</h2>
            <p className="text-muted">
              개인정보 처리방침에 대한 문의사항은 아래로 연락해 주세요.
            </p>
            <p className="text-muted mt-1">
              서비스명: 맘마 (Mamma)<br />
              이메일: support@mamma.app
            </p>
          </div>

          <p className="text-xs text-muted text-center pt-4 border-t border-card-border">
            시행일: 2026년 4월 5일
          </p>
        </div>
      </section>
    </main>
  );
}
