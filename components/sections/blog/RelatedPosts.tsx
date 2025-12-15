"use client";

import { motion } from "motion/react";
import { Heading, Text, Section } from "@/components/ui";
import { BlogCard } from "./BlogCard";
import { getRelatedBlogs } from "@/data/blogs";
import type { BlogPost } from "@/types";
import { cn } from "@/lib/utils";

interface RelatedPostsProps {
  currentBlog: BlogPost;
  limit?: number;
  className?: string;
}

export function RelatedPosts({
  currentBlog,
  limit = 3,
  className,
}: RelatedPostsProps) {
  const relatedBlogs = getRelatedBlogs(currentBlog, limit);

  if (relatedBlogs.length === 0) {
    return null;
  }

  return (
    <Section spacing="lg" className={cn("py-16 md:py-24 bg-neutral-900/50", className)}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Text
            size="sm"
            weight="medium"
            className="uppercase tracking-widest text-primary-500 mb-2"
          >
            Keep Reading
          </Text>
          <Heading as="h2" size="2xl">
            Related Articles
          </Heading>
        </motion.div>

        <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {relatedBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
    </Section>
  );
}
