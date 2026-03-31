import { restaurants } from "@/data/mock";
import { notFound } from "next/navigation";
import RestaurantDetail from "./RestaurantDetail";
import { BASE_URL, SITE_NAME } from "@/lib/constants";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return restaurants.map((r) => ({ id: String(r.id) }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const restaurant = restaurants.find((r) => String(r.id) === id);
  if (!restaurant) return { title: "맛집을 찾을 수 없습니다" };

  const title = `${restaurant.name} — ${SITE_NAME} 맛집`;
  const regionLabel =
    restaurant.region === "seoul" ? "서울" : restaurant.region === "gyeonggi" ? "경기" : "인천";
  const description = `${regionLabel} ${restaurant.area} · ${restaurant.tags.join(", ")} · ${restaurant.description}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/restaurants/${restaurant.id}`,
      type: "article",
    },
    twitter: { card: "summary", title, description },
  };
}

export default async function RestaurantPage({ params }: Props) {
  const { id } = await params;
  const restaurant = restaurants.find((r) => String(r.id) === id);
  if (!restaurant) notFound();
  return <RestaurantDetail key={restaurant.id} restaurant={restaurant} />;
}
