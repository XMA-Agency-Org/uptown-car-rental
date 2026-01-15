"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type DrawerSide = "left" | "right";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  side?: DrawerSide;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className,
  side = "left",
}: DrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 animate-fade-in"
      />

      <div
        className={cn(
          "fixed inset-y-0 w-full max-w-sm bg-background-elevated border-border z-50 flex flex-col",
          side === "left" ? "left-0 border-r animate-slide-in-left" : "right-0 border-l animate-slide-in-right",
          className
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          {title && (
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="p-2 text-foreground-muted hover:text-foreground transition-colors ml-auto"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>

        {footer && (
          <div className="p-4 border-t border-border bg-background-elevated">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}

export { Drawer as MobileDrawer };
