import type { BlogPost, BlogCategory } from "@/types";
import { blogs } from "./blogs-data";

const categoryDisplayNames: Record<BlogCategory, string> = {
  "car-rental": "Car Rental",
  "dubai-guide": "Dubai Guide",
  "driving-tips": "Driving Tips",
  "luxury-lifestyle": "Luxury Lifestyle",
  travel: "Travel",
  uncategorized: "Uncategorized",
};

export function getAllBlogs(): BlogPost[] {
  return blogs;
}

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return blogs.find((blog) => blog.slug === slug);
}

export function getBlogsByCategory(category: BlogCategory): BlogPost[] {
  return blogs.filter((blog) => blog.category === category);
}

export function getFeaturedBlogs(limit: number = 6): BlogPost[] {
  return blogs.slice(0, limit);
}

export function getRecentBlogs(limit: number = 10): BlogPost[] {
  return [...blogs]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, limit);
}

export function getRelatedBlogs(
  currentBlog: BlogPost,
  limit: number = 4,
): BlogPost[] {
  const sameCategoryBlogs = blogs.filter(
    (blog) =>
      blog.id !== currentBlog.id && blog.category === currentBlog.category,
  );

  if (sameCategoryBlogs.length >= limit) {
    return sameCategoryBlogs.slice(0, limit);
  }

  const sameTagBlogs = blogs.filter(
    (blog) =>
      blog.id !== currentBlog.id &&
      blog.category !== currentBlog.category &&
      blog.tags.some((tag) => currentBlog.tags.includes(tag)),
  );

  const combined = [...sameCategoryBlogs, ...sameTagBlogs];
  const unique = Array.from(new Map(combined.map((b) => [b.id, b])).values());

  if (unique.length >= limit) {
    return unique.slice(0, limit);
  }

  const remaining = blogs.filter(
    (blog) => blog.id !== currentBlog.id && !unique.some((u) => u.id === blog.id),
  );

  return [...unique, ...remaining].slice(0, limit);
}

export function getAllCategories(): BlogCategory[] {
  const categories = new Set(blogs.map((blog) => blog.category));
  return Array.from(categories);
}

export function getBlogCountByCategory(): Record<BlogCategory, number> {
  return blogs.reduce(
    (acc, blog) => {
      acc[blog.category] = (acc[blog.category] || 0) + 1;
      return acc;
    },
    {} as Record<BlogCategory, number>,
  );
}

export function getCategoryDisplayName(categoryId: BlogCategory): string {
  return categoryDisplayNames[categoryId] || categoryId;
}

export function getAllTags(): string[] {
  const tags = new Set(blogs.flatMap((blog) => blog.tags));
  return Array.from(tags).sort();
}

export function getBlogsByTag(tag: string): BlogPost[] {
  return blogs.filter((blog) =>
    blog.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
  );
}

export function searchBlogs(query: string): BlogPost[] {
  const lowerQuery = query.toLowerCase();
  return blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(lowerQuery) ||
      blog.excerpt.toLowerCase().includes(lowerQuery) ||
      blog.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
  );
}

export function getTotalBlogCount(): number {
  return blogs.length;
}

export function getAllCategoriesWithCount(): {
  id: BlogCategory;
  name: string;
  count: number;
}[] {
  const counts = getBlogCountByCategory();
  const categories = getAllCategories();

  return categories
    .map((categoryId) => ({
      id: categoryId,
      name: getCategoryDisplayName(categoryId),
      count: counts[categoryId] || 0,
    }))
    .sort((a, b) => b.count - a.count);
}
