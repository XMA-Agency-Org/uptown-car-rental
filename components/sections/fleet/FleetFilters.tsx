"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, FilterGroup } from "@/components/ui";
import { CAR_BODY_TYPES, CAR_BRANDS, PRICE_RANGES } from "@/lib/constants";

interface FleetFiltersProps {
  onClose?: () => void;
}

export function FleetFilters({ onClose }: FleetFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category");
  const currentBrand = searchParams.get("brand");
  const currentPriceRange = searchParams.get("price");

  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      router.push(`/fleet?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const clearAllFilters = useCallback(() => {
    router.push("/fleet", { scroll: false });
  }, [router]);

  const hasActiveFilters = currentCategory || currentBrand || currentPriceRange;

  return (
    <div className="space-y-8">
      {hasActiveFilters && (
        <div className="flex justify-end">
          <button
            onClick={clearAllFilters}
            className="text-sm text-primary-500 hover:text-primary-400 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      <FilterGroup
        title="Body Type"
        items={CAR_BODY_TYPES}
        value={currentCategory}
        onChange={(value) => updateFilter("category", value)}
        allOptionId="all"
      />

      <FilterGroup
        title="Brand"
        items={CAR_BRANDS}
        value={currentBrand}
        onChange={(value) => updateFilter("brand", value)}
        scrollable
      />

      <FilterGroup
        title="Daily Price"
        items={PRICE_RANGES}
        value={currentPriceRange}
        onChange={(value) => updateFilter("price", value)}
      />

      {onClose && (
        <Button onClick={onClose} className="w-full">
          Apply Filters
        </Button>
      )}
    </div>
  );
}
