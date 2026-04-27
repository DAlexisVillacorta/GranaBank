import { forwardRef, useId, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
};

/**
 * Input controlado con label arriba, mensaje de hint/error abajo y
 * manejo de accesibilidad (aria-invalid, aria-describedby) built-in.
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    { label, error, hint, className, id, ...props },
    ref,
  ) {
    const autoId = useId();
    const inputId = id ?? autoId;
    const descriptorId = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-foreground"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={descriptorId}
          className={cn(
            "h-12 w-full rounded-xl border bg-card px-4 text-base text-foreground outline-none transition-colors",
            "placeholder:text-muted",
            "focus:border-brand-500 focus:ring-2 focus:ring-brand-200",
            error
              ? "border-cash-in focus:border-cash-in focus:ring-cash-in-bg"
              : "border-border",
            className,
          )}
          {...props}
        />
        {error ? (
          <p id={descriptorId} className="text-xs text-cash-in" role="alert">
            {error}
          </p>
        ) : hint ? (
          <p id={descriptorId} className="text-xs text-muted-foreground">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);
