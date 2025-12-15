"use client";

import Link from "next/link";
import { Calendar, Clock, Tag } from "lucide-react";
import { Badge, Text } from "@/components/ui";
import { getCategoryDisplayName } from "@/data/blogs";
import type { BlogPost } from "@/types";
import { cn } from "@/lib/utils";

interface ArticleMetaProps {
  blog: BlogPost;
  className?: string;
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function ArticleMeta({ blog, className }: ArticleMetaProps) {
  return (
    <div className={cn("max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 border-b border-neutral-800", className)}>
      <div className="flex flex-wrap items-center gap-4 md:gap-6 text-neutral-400">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary-500" />
          <Text size="sm">{formatDate(blog.publishedAt)}</Text>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary-500" />
          <Text size="sm">{blog.readingTime}</Text>
        </div>

        <Link
          href={`/blog?category=${blog.category}`}
          className="flex items-center gap-2 hover:text-primary-500 transition-colors"
        >
          <Badge variant="ghost" size="sm">
            {getCategoryDisplayName(blog.category)}
          </Badge>
        </Link>
      </div>

      {blog.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Tag className="w-4 h-4 text-neutral-500" />
          {blog.tags.map((tag) => (
            <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
              <Badge
                variant="secondary"
                size="xs"
                className="hover:bg-neutral-700 transition-colors"
              >
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
