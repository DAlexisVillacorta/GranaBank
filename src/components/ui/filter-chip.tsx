import { type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type FilterChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

export function FilterChip({
  active,
  className,
  children,
  ...props
}: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "inline-flex h-9 items-center whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
        active
          ? "bg-brand-700 text-white"
          : "bg-card text-muted-foreground hover:bg-brand-50 hover:text-brand-700",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
