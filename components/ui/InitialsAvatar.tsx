"use client";

import { cn } from "@/lib/utils";

interface InitialsAvatarProps {
  name: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function stringToColor(str: string): string {
  const colors = [
    "bg-primary-500",
    "bg-primary-600",
    "bg-primary-700",
    "bg-amber-600",
    "bg-amber-700",
    "bg-stone-600",
    "bg-stone-700",
  ];

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

export function InitialsAvatar({ name, className, size = "md" }: InitialsAvatarProps) {
  const initials = getInitials(name);
  const bgColor = stringToColor(name);

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold text-white",
        bgColor,
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
