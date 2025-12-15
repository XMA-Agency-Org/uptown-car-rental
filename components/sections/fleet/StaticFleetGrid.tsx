"use client";

import { useState, useMemo, useCallback } from "react";
import { LayoutGrid, List } from "lucide-react";
import { CarCard } from "./CarCard";
import { Text, Heading, Pagination } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Car } from "@/types";

const CARS_PER_PAGE = 12;

type ViewMode = "grid" | "list";
type SortOption =
  | "featured"
  | "price-low"
  | "price-high"
  | "name-asc"
  | "newest";

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
  { id: "name-asc", label: "Name: A to Z" },
  { id: "newest", label: "Newest First" },
];

interface StaticFleetGridProps {
  cars: Car[];
  emptyMessage?: string;
}

export function StaticFleetGrid({
  cars,
  emptyMessage = "No cars found",
}: StaticFleetGridProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [currentPage, setCurrentPage] = useState(1);

  const sortedCars = useMemo(() => {
    return [...cars].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.pricing.daily - b.pricing.daily;
        case "price-high":
          return b.pricing.daily - a.pricing.daily;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "newest":
          return b.year - a.year;
        case "featured":
        default:
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return b.pricing.daily - a.pricing.daily;
      }
    });
  }, [cars, sortBy]);

  const totalPages = Math.ceil(sortedCars.length / CARS_PER_PAGE);
  const paginatedCars = useMemo(() => {
    const startIndex = (currentPage - 1) * CARS_PER_PAGE;
    return sortedCars.slice(startIndex, startIndex + CARS_PER_PAGE);
  }, [sortedCars, currentPage]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (sortedCars.length === 0) {
    return (
      <div className="text-center py-20">
        <Heading as="h3" size="md" className="mb-4">
          {emptyMessage}
        </Heading>
        <Text color="muted">
          Try browsing our full fleet for available vehicles.
        </Text>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <Text size="sm" color="muted">
          {sortedCars.length} {sortedCars.length === 1 ? "vehicle" : "vehicles"} available
          {totalPages > 1 && ` · Page ${currentPage} of ${totalPages}`}
        </Text>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Text size="sm" color="muted" className="hidden sm:block">
              Sort:
            </Text>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as SortOption);
                setCurrentPage(1);
              }}
              className="h-11 bg-background-elevated border border-border rounded-md px-3 text-sm text-foreground focus:outline-none focus:border-primary-500 cursor-pointer"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="md:flex items-center gap-1 p-1 bg-background-elevated border border-border rounded-md hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2.5 rounded-sm transition-colors",
                viewMode === "grid"
                  ? "bg-primary-500 text-neutral-950"
                  : "text-foreground-muted hover:text-foreground hover:bg-neutral-800",
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2.5 rounded-sm transition-colors",
                viewMode === "list"
                  ? "bg-primary-500 text-neutral-950"
                  : "text-foreground-muted hover:text-foreground hover:bg-neutral-800",
              )}
              aria-label="List view"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCars.map((car, index) => (
            <CarCard key={car.id} car={car} index={index} variant="standard" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {paginatedCars.map((car, index) => (
            <CarCard key={car.id} car={car} index={index} variant="inline" />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className="mt-12"
      />
    </div>
  );
}
