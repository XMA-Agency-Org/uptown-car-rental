import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sectionVariants = cva("w-full", {
  variants: {
    background: {
      default: "bg-background",
      elevated: "bg-background-elevated",
      muted: "bg-neutral-900",
      transparent: "bg-transparent",
    },
    spacing: {
      none: "",
      sm: "py-8 sm:py-12",
      md: "py-12 sm:py-16",
      lg: "py-12 sm:py-16 lg:py-24",
      xl: "py-16 sm:py-20 lg:py-32",
    },
    border: {
      none: "",
      top: "border-t border-border",
      bottom: "border-b border-border",
      both: "border-y border-border",
    },
  },
  defaultVariants: {
    background: "default",
    spacing: "lg",
    border: "none",
  },
});

type SectionVariantProps = VariantProps<typeof sectionVariants>;

interface SectionProps extends SectionVariantProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: "section" | "div" | "article" | "aside";
  containerSize?: "default" | "wide" | "narrow" | "none";
}

export function Section({
  children,
  className,
  id,
  as: Component = "section",
  background,
  spacing,
  border,
  containerSize = "default",
}: SectionProps) {
  const content =
    containerSize === "none" ? (
      children
    ) : (
      <div
        className={cn(
          "mx-auto w-full px-4 sm:px-6 lg:px-8",
          containerSize === "default" && "max-w-[1280px]",
          containerSize === "wide" && "max-w-[1536px]",
          containerSize === "narrow" && "max-w-[960px]"
        )}
      >
        {children}
      </div>
    );

  return (
    <Component
      id={id}
      className={cn(sectionVariants({ background, spacing, border }), className)}
    >
      {content}
    </Component>
  );
}

export { sectionVariants };
