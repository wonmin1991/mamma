export interface Restaurant {
  id: number;
  name: string;
  category: string;
  region: "seoul" | "gyeonggi" | "incheon";
  area: string;
  rating: number;
  tags: string[];
  description: string;
  emoji: string;
  priceRange: string;
  pregnancyPerks: string[];
  address: string;
  savedCount: number;
  sourceUrl?: string;
  imageUrl?: string;
}

export interface Tip {
  id: number;
  title: string;
  category: string;
  summary: string;
  content: string;
  source: string;
  emoji: string;
  likes: number;
  gradient: string;
  sourceUrl?: string;
}

export interface WeekInfo {
  week: number;
  trimester: number;
  babySize: string;
  babySizeEmoji: string;
  babyWeight: string;
  babyLength: string;
  babyDevelopment: string[];
  momChanges: string[];
  tips: string[];
  goodFoods: string[];
  avoidFoods: string[];
}

export interface CuratedPost {
  id: number;
  source: "instagram" | "blog" | "cafe";
  sourceAccount: string;
  title: string;
  summary: string;
  tags: string[];
  likes: number;
  emoji: string;
  gradient: string;
  sourceUrl?: string;
}

export interface CommunityPost {
  id: number;
  author: string;
  category: "restaurant" | "tip" | "question" | "review";
  title: string;
  content: string;
  likes: number;
  comments: number;
  createdAt: string;
  emoji: string;
}
