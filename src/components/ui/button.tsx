import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
};

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand-700 text-white hover:bg-brand-800 active:bg-brand-900 disabled:bg-brand-400",
  secondary:
    "bg-card text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 hover:bg-brand-50 dark:hover:bg-brand-900",
  ghost: "bg-transparent text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-8 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "lg", loading, disabled, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        <span
          aria-label="Cargando"
          className="inline-block size-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
        />
      ) : null}
      {children}
    </button>
  );
});
