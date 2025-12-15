"use client";

import { Heading, Text, Section } from "@/components/ui";
import { RevealOnScroll } from "@/components/animation";

export interface StatItem {
  value: string;
  label: string;
}

interface StatsGridProps {
  stats: StatItem[];
  className?: string;
}

export function StatsGrid({ stats, className }: StatsGridProps) {
  return (
    <Section spacing="md" background="elevated" border="both" className={className}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <RevealOnScroll key={stat.label} delay={index * 0.1}>
              <div className="text-center">
                <Heading as="span" size="2xl" className="text-primary-500 block mb-2">
                  {stat.value}
                </Heading>
                <Text color="muted">{stat.label}</Text>
              </div>
            </RevealOnScroll>
          ))}
        </div>
    </Section>
  );
}
