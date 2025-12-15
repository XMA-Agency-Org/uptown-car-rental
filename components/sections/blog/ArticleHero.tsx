"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Heading, Badge, Text } from "@/components/ui";
import type { BlogPost } from "@/types";
import { getCategoryDisplayName } from "@/data/blogs";
import { cn } from "@/lib/utils";

interface ArticleHeroProps {
  blog: BlogPost;
  className?: string;
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function ArticleHero({ blog, className }: ArticleHeroProps) {
  return (
    <section className={cn("bg-neutral-950 pt-28 md:pt-36", className)}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-primary-500 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <Text size="sm">Back to Blog</Text>
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="outline" size="sm">
              {getCategoryDisplayName(blog.category)}
            </Badge>
            <div className="flex items-center gap-4 text-neutral-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <Text size="xs">{formatDate(blog.publishedAt)}</Text>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <Text size="xs">{blog.readingTime}</Text>
              </div>
            </div>
          </div>

          <Heading as="h1" size="3xl" className="mb-6">
            {blog.title}
          </Heading>

          {blog.excerpt && (
            <Text
              size="lg"
              color="muted"
              className="leading-relaxed"
            >
              {blog.excerpt}
            </Text>
          )}
        </motion.div>

        {blog.featuredImage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 pb-8"
          >
            <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-800">
              <Image
                src={blog.featuredImage}
                alt={blog.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
