"use client";

import { useBabyStore } from "@/store/useBabyStore";
import PostnatalHome from "./PostnatalHome";
import InfertilityHome from "./InfertilityHome";

export default function HomeRouter({ pregnancyHome }: { pregnancyHome: React.ReactNode }) {
  const hydrated = useBabyStore((s) => s._hydrated);
  const mode = useBabyStore((s) => s.mode);
  const baby = useBabyStore((s) => s.baby);

  // Wait for Zustand to hydrate from localStorage before routing
  if (!hydrated) return <>{pregnancyHome}</>;

  if (mode === "infertility") {
    return <InfertilityHome />;
  }

  if (mode === "postnatal" && baby) {
    return <PostnatalHome />;
  }

  return <>{pregnancyHome}</>;
}
