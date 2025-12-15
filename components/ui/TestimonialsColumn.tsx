"use client";

import React from "react";
import { motion } from "motion/react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { InitialsAvatar } from "./InitialsAvatar";
import Image from "next/image";

export interface Testimonial {
  text: string;
  image?: string;
  name: string;
  role: string;
}

interface TestimonialsColumnProps {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}

export function TestimonialsColumn({
  className,
  testimonials,
  duration = 10,
}: TestimonialsColumnProps) {
  return (
    <div className={cn("", className)}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...Array(2)].map((_, index) => (
          <React.Fragment key={index}>
            {testimonials.map((testimonial, i) => (
              <div
                className="p-6 sm:p-8 rounded-2xl border border-border bg-background-elevated max-w-sm w-full"
                key={i}
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className="w-4 h-4 fill-primary-400 text-primary-400"
                    />
                  ))}
                </div>
                <p className="text-foreground/90 leading-relaxed">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 mt-5 pt-5 border-t border-border">
                  {testimonial.image ? (
                    <Image
                      width={40}
                      height={40}
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <InitialsAvatar name={testimonial.name} size="md" />
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium tracking-tight leading-5 text-foreground">
                      {testimonial.name}
                    </span>
                    <span className="leading-5 text-muted-foreground text-sm tracking-tight">
                      {testimonial.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}
