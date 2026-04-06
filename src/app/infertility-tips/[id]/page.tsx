import { notFound } from "next/navigation";
import { infertilityTips } from "@/data/infertility";
import InfertilityTipDetail from "./InfertilityTipDetail";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return infertilityTips.map((t) => ({ id: String(t.id) }));
}

export default async function InfertilityTipDetailPage({ params }: Props) {
  const { id } = await params;
  const tip = infertilityTips.find((t) => String(t.id) === id);
  if (!tip) notFound();
  return <InfertilityTipDetail tip={tip} />;
}
