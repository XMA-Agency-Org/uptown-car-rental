"use client";

import { WhatsAppIcon } from "@/components/ui";
import { getWhatsAppUrl, cn } from "@/lib/utils";

interface WhatsAppCTAProps {
  message?: string;
  className?: string;
}

export function WhatsAppCTA({ message, className }: WhatsAppCTAProps) {
  return (
    <a
      href={getWhatsAppUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40",
        "flex items-center justify-center",
        "w-14 h-14 rounded-full",
        "bg-[oklch(0.55_0.17_142)] hover:bg-[oklch(0.50_0.17_142)]",
        "text-white shadow-lg",
        "transition-all duration-300",
        "hover:scale-110 active:scale-95",
        "animate-whatsapp-in",
        className
      )}
      aria-label="Contact via WhatsApp"
    >
      <WhatsAppIcon className="w-7 h-7" />
      <span className="absolute inset-0 bg-[oklch(0.55_0.17_142)] animate-ping opacity-25 rounded-full" />
    </a>
  );
}
