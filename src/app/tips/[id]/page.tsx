import { tips, TIP_CATEGORIES } from "@/data/mock";
import { notFound } from "next/navigation";
import TipDetail from "./TipDetail";
import { BASE_URL, SITE_NAME } from "@/lib/constants";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return tips.map((t) => ({ id: String(t.id) }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const tip = tips.find((t) => String(t.id) === id);
  if (!tip) return { title: "팁을 찾을 수 없습니다" };

  const title = `${tip.title} — ${SITE_NAME} 꿀팁`;
  const description = `${tip.summary} · 출처: ${tip.source}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/tips/${tip.id}`,
      type: "article",
    },
    twitter: { card: "summary", title, description },
  };
}

export default async function TipPage({ params }: Props) {
  const { id } = await params;
  const tip = tips.find((t) => String(t.id) === id);
  if (!tip) notFound();
  const categoryLabel = TIP_CATEGORIES.find((c) => c.id === tip.category)?.label ?? tip.category;
  return <TipDetail key={tip.id} tip={tip} categoryLabel={categoryLabel} />;
}
