import { sampleCommunityPosts } from "@/data/mock";
import CommunityDetail from "./CommunityDetail";

export function generateStaticParams() {
  return sampleCommunityPosts.map((p) => ({ id: String(p.id) }));
}

export default function CommunityDetailPage() {
  return <CommunityDetail />;
}
