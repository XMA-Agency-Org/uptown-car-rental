"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function getPageNumbers(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-md border border-border transition-colors",
          currentPage === 1
            ? "text-foreground-subtle cursor-not-allowed opacity-50"
            : "text-foreground-muted hover:text-foreground hover:bg-background-elevated hover:border-primary-500/50"
        )}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="flex items-center justify-center w-10 h-10 text-foreground-subtle"
            >
              <MoreHorizontal className="w-5 h-5" />
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-md border transition-colors font-medium text-sm",
                currentPage === page
                  ? "bg-primary-500 border-primary-500 text-neutral-950"
                  : "border-border text-foreground-muted hover:text-foreground hover:bg-background-elevated hover:border-primary-500/50"
              )}
              aria-label={`Go to page ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-md border border-border transition-colors",
          currentPage === totalPages
            ? "text-foreground-subtle cursor-not-allowed opacity-50"
            : "text-foreground-muted hover:text-foreground hover:bg-background-elevated hover:border-primary-500/50"
        )}
        aria-label="Go to next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </nav>
  );
}
