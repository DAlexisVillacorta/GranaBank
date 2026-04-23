import { Search } from "lucide-react";
import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type SearchInputProps = InputHTMLAttributes<HTMLInputElement>;

/** Input de búsqueda con ícono de lupa a la izquierda. */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput({ className, ...props }, ref) {
    return (
      <div className="relative w-full">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
        />
        <input
          ref={ref}
          type="search"
          className={cn(
            "h-12 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm outline-none",
            "placeholder:text-muted",
            "focus:border-brand-500 focus:ring-2 focus:ring-brand-200",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);
