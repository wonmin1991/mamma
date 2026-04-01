"use client";

import { useBabyStore } from "@/store/useBabyStore";
import PostnatalHome from "./PostnatalHome";

export default function HomeRouter({ pregnancyHome }: { pregnancyHome: React.ReactNode }) {
  const mode = useBabyStore((s) => s.mode);
  const baby = useBabyStore((s) => s.baby);

  if (mode === "postnatal" && baby) {
    return <PostnatalHome />;
  }

  return <>{pregnancyHome}</>;
}
