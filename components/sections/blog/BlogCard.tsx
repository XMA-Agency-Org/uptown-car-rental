"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Clock, Calendar } from "lucide-react";
import { Badge, Heading, Text } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { BlogPost, BlogCategory } from "@/types";
import { getCategoryDisplayName } from "@/data/blogs";

interface BlogCardProps {
  blog: BlogPost;
  showCategory?: boolean;
  className?: string;
}

const categoryVariants: Record<BlogCategory, "default" | "secondary" | "ghost"> = {
  "car-rental": "default",
  "dubai-guide": "secondary",
  "driving-tips": "ghost",
  "luxury-lifestyle": "default",
  travel: "secondary",
  uncategorized: "ghost",
};

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function BlogCard({
  blog,
  showCategory = true,
  className,
}: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/blog/${blog.slug}`} className="group block h-full">
        <div
          className={cn(
            "relative transition-all duration-300",
            "h-full flex flex-col",
            className,
          )}
        >
          <div className="relative aspect-16/10 rounded-lg overflow-hidden bg-neutral-800">
            {blog.featuredImage ? (
              <Image
                src={blog.featuredImage}
                alt={blog.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Text color="muted">No image</Text>
              </div>
            )}

            {showCategory && (
              <div className="absolute top-3 left-3">
                <Badge
                  variant={categoryVariants[blog.category]}
                  size="sm"
                  shape="soft"
                >
                  {getCategoryDisplayName(blog.category)}
                </Badge>
              </div>
            )}
          </div>

          <div className="pt-4 flex flex-col flex-1">
            <Heading
              as="h3"
              size="sm"
              className="group-hover:text-primary-500 transition-colors mb-2 line-clamp-2"
            >
              {blog.title}
            </Heading>

            <Text
              size="sm"
              color="muted"
              className="mb-4 line-clamp-2 flex-1"
            >
              {blog.excerpt}
            </Text>

            <div className="flex items-center gap-4 text-neutral-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <Text size="xs" color="muted">
                  {formatDate(blog.publishedAt)}
                </Text>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <Text size="xs" color="muted">
                  {blog.readingTime}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
