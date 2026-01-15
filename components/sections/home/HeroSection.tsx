"use client";

import { Suspense } from "react";
import { Search } from "lucide-react";
import { Container, Heading, Text, Section } from "@/components/ui";
import Image from "next/image";
import BgPic from "@/public/banner.webp";
import { BrandMarquee } from "./BrandMarquee";
import { VehicleSearch } from "@/components/sections/cars";

function SearchFallback() {
  return (
    <div className="w-full h-12 bg-background border border-border rounded-xl flex items-center px-4 gap-3">
      <Search className="w-4 h-4 text-foreground-subtle" />
      <span className="text-foreground-subtle">Search by car name, brand, or category...</span>
    </div>
  );
}

export function HeroSection() {
  return (
    <Section spacing="none" containerSize="none" className="relative flex flex-col">
      <div className="absolute h-36 w-full bottom-0 bg-linear-to-t from-background to-transparent z-10" />
      <div className="absolute inset-0 z-0">
        <Image
          src={BgPic}
          alt="McLaren Mercedes GT"
          fill
          className="object-cover"
          priority
          fetchPriority="high"
          sizes="100vw"
          placeholder="blur"
        />

        <div className="absolute inset-0 bg-linear-to-b from-neutral-950/70 via-neutral-950/50 to-neutral-950/80" />

        <div className="absolute inset-0 noise-texture" />
      </div>

      {/* Content */}
      <Container className="relative z-30 pt-32 pb-20 flex-1 flex items-center justify-center">
        <div className="max-w-6xl mx-auto text-center">
          <Heading as="h1" size="hero" className="mb-6">
            Any luxury car you desire, delivered clean, anywhere in Dubai
          </Heading>

          <Text
            size="xl"
            color="muted"
            className="max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            From Rolls Royce to Lamborghini. One WhatsApp message, car at your door by morning.
          </Text>

          <div className="mb-10 max-w-2xl mx-auto">
            <Suspense fallback={<SearchFallback />}>
              <VehicleSearch />
            </Suspense>
          </div>
        </div>
      </Container>

      <div className="relative z-20 py-8">
        <BrandMarquee fadeColor="bg-transparent" />
      </div>
    </Section>
  );
}
