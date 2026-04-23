import { forwardRef, useId, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ label, className, id, ...props }, ref) {
    const autoId = useId();
    const inputId = id ?? autoId;

    return (
      <label
        htmlFor={inputId}
        className="inline-flex cursor-pointer items-center gap-2 text-sm text-foreground"
      >
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className={cn(
            "size-4 cursor-pointer rounded border-border accent-brand-700",
            className,
          )}
          {...props}
        />
        {label}
      </label>
    );
  },
);
