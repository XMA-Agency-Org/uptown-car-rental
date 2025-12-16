"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

interface MarqueeProps {
  children: React.ReactNode;
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
  gap?: number;
}

const speedMap = {
  fast: "20s",
  normal: "40s",
  slow: "80s",
};

export function Marquee({
  children,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className,
  gap = 16,
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !scrollerRef.current) return;

    const scrollerContent = Array.from(scrollerRef.current.children);
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      scrollerRef.current?.appendChild(duplicatedItem);
    });

    containerRef.current.style.setProperty(
      "--animation-direction",
      direction === "left" ? "forwards" : "reverse"
    );
    containerRef.current.style.setProperty(
      "--animation-duration",
      speedMap[speed]
    );

    setIsReady(true);
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
    >
      <div
        ref={scrollerRef}
        style={{ gap: `${gap}px` }}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap",
          isReady && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {children}
      </div>
    </div>
  );
}
