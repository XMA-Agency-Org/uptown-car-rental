"use client";

import { useState, Suspense } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button, Drawer, Section } from "@/components/ui";
import { PageHero } from "@/components/sections/shared";
import { FleetFilters, FleetGrid } from "@/components/sections/fleet";

function FleetContent() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <>
      <PageHero
        tagline="Our Collection"
        title="Luxury Fleet"
        description="Discover our handpicked selection of premium vehicles. From exotic supercars to elegant luxury sedans, find the perfect car for your Dubai experience."
      />

      {/* Fleet Grid with Filters */}
      <Section spacing="none" className="pb-24">
        {/* Filter Button */}
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30">
          <Button
            onClick={() => setIsFilterOpen(true)}
            leftIcon={<SlidersHorizontal className="w-4 h-4" />}
            className="shadow-lg"
          >
            Filters
          </Button>
        </div>

        {/* Filter Drawer */}
        <Drawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          title="Filters"
        >
          <FleetFilters onClose={() => setIsFilterOpen(false)} />
        </Drawer>

        {/* Car Grid */}
        <FleetGrid />
      </Section>
    </>
  );
}

export default function FleetPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <FleetContent />
    </Suspense>
  );
}
