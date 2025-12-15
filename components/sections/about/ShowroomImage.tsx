"use client";

import Image, { type StaticImageData } from "next/image";
import { Section } from "@/components/ui";
import { RevealOnScroll } from "@/components/animation";

interface ShowroomImageProps {
  src: string | StaticImageData;
  alt: string;
  className?: string;
}

export function ShowroomImage({ src, alt, className }: ShowroomImageProps) {
  return (
    <Section spacing="none" className={`pb-20 ${className ?? ""}`}>
        <RevealOnScroll>
          <div className="relative aspect-[21/9] overflow-clip bg-background-elevated rounded-lg">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>
        </RevealOnScroll>
    </Section>
  );
}
