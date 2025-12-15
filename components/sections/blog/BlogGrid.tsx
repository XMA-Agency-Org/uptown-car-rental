"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button, Text } from "@/components/ui";
import { BlogCard } from "./BlogCard";
import type { BlogPost, BlogCategory } from "@/types";
import { getAllCategoriesWithCount } from "@/data/blogs";
import { cn } from "@/lib/utils";

interface BlogGridProps {
  blogs: BlogPost[];
  showFilters?: boolean;
  initialCategory?: BlogCategory | "all";
  itemsPerPage?: number;
  className?: string;
}

export function BlogGrid({
  blogs,
  showFilters = true,
  initialCategory = "all",
  itemsPerPage = 12,
  className,
}: BlogGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | "all">(
    initialCategory,
  );
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);

  const categories = useMemo(() => getAllCategoriesWithCount(), []);

  const filteredBlogs = useMemo(() => {
    if (selectedCategory === "all") return blogs;
    return blogs.filter((blog) => blog.category === selectedCategory);
  }, [blogs, selectedCategory]);

  const visibleBlogs = filteredBlogs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredBlogs.length;

  function handleLoadMore() {
    setVisibleCount((prev) => prev + itemsPerPage);
  }

  function handleCategoryChange(category: BlogCategory | "all") {
    setSelectedCategory(category);
    setVisibleCount(itemsPerPage);
  }

  return (
    <div className={className}>
      {showFilters && (
        <div className="mb-8 flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "all" ? "primary" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange("all")}
          >
            All ({blogs.length})
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "primary" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(cat.id)}
            >
              {cat.name} ({cat.count})
            </Button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "grid gap-6 md:gap-8",
            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {visibleBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </motion.div>
      </AnimatePresence>

      {filteredBlogs.length === 0 && (
        <div className="text-center py-12">
          <Text color="muted">No blog posts found in this category.</Text>
        </div>
      )}

      {hasMore && (
        <div className="mt-12 flex justify-center">
          <Button variant="outline" size="lg" onClick={handleLoadMore}>
            Load More ({filteredBlogs.length - visibleCount} remaining)
          </Button>
        </div>
      )}
    </div>
  );
}
