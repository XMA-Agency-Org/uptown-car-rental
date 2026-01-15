import { forwardRef } from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative cursor-pointer inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 rounded-md hover:scale-[1.02] active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-500 text-neutral-950 hover:bg-primary-600 active:bg-primary-700 button button--mimas",
        secondary:
          "bg-neutral-800 text-neutral-50 hover:bg-neutral-700 active:bg-neutral-600",
        ghost:
          "bg-transparent text-neutral-50 hover:bg-neutral-800/50 active:bg-neutral-800",
        outline:
          "bg-transparent border border-primary-500 text-primary-500 hover:bg-primary-500/10 active:bg-primary-500/20 backdrop-blur-sm",
        whatsapp:
          "bg-[oklch(0.55_0.17_142)] text-white hover:bg-[oklch(0.50_0.17_142)] active:bg-[oklch(0.45_0.17_142)]",
        whatsappOutline:
          "text-[oklch(0.55_0.17_142)] hover:text-white active:text-white border border-green-500 hover:border-green-600 active:border-green-700 hover:bg-green-500/10 active:bg-green-500/20 backdrop-blur-sm",
      },
      size: {
        sm: "h-11 px-4 text-sm gap-2",
        md: "h-12 px-6 text-base gap-2",
        lg: "h-14 px-8 text-lg gap-3",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  as?: "button" | "a" | typeof Link;
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler;
}

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      as = "button",
      href,
      target,
      rel,
      type = "button",
      onClick,
    },
    ref
  ) => {
    const classes = cn(buttonVariants({ variant, size }), className);

    const content = (
      <>
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg
              className="h-5 w-5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        )}
        <span
          className={cn(
            "inline-flex items-center gap-2",
            isLoading && "invisible"
          )}
        >
          {leftIcon}
          {children}
          {rightIcon}
        </span>
      </>
    );

    if (as === Link && href) {
      return (
        <Link href={href} className={classes}>
          {content}
        </Link>
      );
    }

    if (as === "a" && href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={rel}
          className={classes}
          onClick={onClick}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        className={classes}
        disabled={disabled || isLoading}
        onClick={onClick}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

export { buttonVariants };
