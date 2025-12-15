export type BlogCategory =
  | "car-rental"
  | "dubai-guide"
  | "driving-tips"
  | "luxury-lifestyle"
  | "travel"
  | "uncategorized";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  publishedAt: string;
  modifiedAt?: string;
  readingTime: string;
  category: BlogCategory;
  tags: string[];
  author?: string;
}

export interface BlogFilters {
  category?: BlogCategory;
  tag?: string;
  search?: string;
}
