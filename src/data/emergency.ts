// ─── 응급 상황 가이드 ────────────────────────────────────
// 출처: ACOG(미국산부인과학회), 대한산부인과학회, 서울아산병원, Mayo Clinic
// 검증일: 2026-04-08
// ⚠️ 일반 참고용 정보이며, 실제 응급 상황에서는 반드시 119 또는 병원에 연락하세요.
// 이 정보는 의학적 진단이나 치료를 대체할 수 없습니다.

export interface EmergencyItem {
  id: string;
  symptom: string;
  emoji: string;
  severity: "danger" | "warning" | "caution";
  description: string;
  action: string;
  callNumber?: string;
  relatedWeeks?: string;
}

export const emergencyGuide: EmergencyItem[] = [
  {
    id: "em-1",
    symptom: "질 출혈",
    emoji: "🩸",
    severity: "danger",
    description: "소량의 갈색 출혈은 착상혈일 수 있으나, 선홍색 출혈이나 양이 많으면 즉시 병원으로.",
    action: "즉시 119 호출 또는 응급실 방문. 나온 혈의 색깔과 양을 기억하세요. 패드를 착용하고 눕는 것이 좋습니다.",
    callNumber: "119",
    relatedWeeks: "전 주차",
  },
  {
    id: "em-2",
    symptom: "양수 파수 (물 같은 것이 흐름)",
    emoji: "💧",
    severity: "danger",
    description: "양수가 터지면 맑은 물 같은 액체가 조절 없이 흘러나옵니다. 소변과 달리 멈출 수 없습니다.",
    action: "즉시 병원에 연락. 깨끗한 패드를 대고 눕는 자세로 이동. 양수의 색깔(맑은지, 녹색인지) 확인.",
    callNumber: "119",
    relatedWeeks: "28주 이후",
  },
  {
    id: "em-3",
    symptom: "태동 감소/소실",
    emoji: "🤰",
    severity: "danger",
    description: "28주 이후 2시간 동안 태동이 10회 미만이면 주의. 태동이 아예 없으면 즉시 병원으로.",
    action: "차가운 음료를 마시고 왼쪽으로 누워서 1시간 태동을 세어보세요. 10회 미만이면 즉시 병원 방문.",
    relatedWeeks: "28주 이후",
  },
  {
    id: "em-4",
    symptom: "심한 두통 + 시야 흐림",
    emoji: "🤕",
    severity: "danger",
    description: "임신중독증(자간전증) 가능성. 두통, 시야 변화, 상복부 통증이 동반되면 위험.",
    action: "즉시 응급실 방문. 혈압이 140/90 이상이면 특히 위험. 부종이 갑자기 심해졌는지도 확인.",
    callNumber: "119",
    relatedWeeks: "20주 이후",
  },
  {
    id: "em-5",
    symptom: "규칙적 배 수축 (37주 이전)",
    emoji: "⚡",
    severity: "danger",
    description: "37주 이전에 10분 간격으로 규칙적 수축이 1시간 이상 지속되면 조기진통 가능성.",
    action: "물을 충분히 마시고 왼쪽으로 누워서 안정. 30분 후에도 지속되면 즉시 병원 연락.",
    relatedWeeks: "20~37주",
  },
  {
    id: "em-6",
    symptom: "심한 구토/탈수",
    emoji: "🤮",
    severity: "warning",
    description: "하루 종일 아무것도 못 먹거나 마시지 못하면 탈수 위험. 소변이 짙은 노란색이면 탈수 징후.",
    action: "소량씩 자주 물을 마시세요. 12시간 이상 아무것도 못 먹으면 병원에서 수액 치료 필요.",
    relatedWeeks: "5~16주",
  },
  {
    id: "em-7",
    symptom: "고열 (38도 이상)",
    emoji: "🌡️",
    severity: "warning",
    description: "임신 중 38도 이상의 고열은 태아에게 영향을 줄 수 있습니다.",
    action: "타이레놀(아세트아미노펜)은 임신 중 복용 가능. 열이 떨어지지 않으면 당일 병원 방문.",
    relatedWeeks: "전 주차",
  },
  {
    id: "em-8",
    symptom: "소변 시 통증/혈뇨",
    emoji: "🚿",
    severity: "warning",
    description: "방광염/요로감염 가능성. 임신 중 자주 발생하며 치료하지 않으면 신우신염으로 악화.",
    action: "물을 많이 마시고 산부인과 방문. 임신 중 안전한 항생제로 치료 가능.",
    relatedWeeks: "전 주차",
  },
  {
    id: "em-9",
    symptom: "극심한 가려움 (특히 손바닥/발바닥)",
    emoji: "😣",
    severity: "caution",
    description: "임신성 담즙정체(ICP) 가능성. 주로 임신 후기에 발생하며 태아에게 위험할 수 있습니다.",
    action: "가려움이 심하면 간기능 검사(혈액검사) 필요. 산부인과 방문하세요.",
    relatedWeeks: "28주 이후",
  },
  {
    id: "em-10",
    symptom: "갑작스러운 부종 (얼굴/손)",
    emoji: "🫧",
    severity: "caution",
    description: "다리 부종은 흔하지만, 얼굴이나 손이 갑자기 붓거나 한쪽 다리만 부으면 주의.",
    action: "혈압 측정 후 산부인과 방문. 한쪽 다리만 붓고 통증이 있으면 혈전 가능성 → 즉시 병원.",
    relatedWeeks: "20주 이후",
  },
];

export const SEVERITY_CONFIG = {
  danger: { label: "즉시 병원", color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20", border: "border-red-200 dark:border-red-900/50" },
  warning: { label: "당일 방문", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-200 dark:border-amber-900/50" },
  caution: { label: "주의 관찰", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-200 dark:border-blue-900/50" },
};
