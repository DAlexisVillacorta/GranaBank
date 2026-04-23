import { AlertCircle } from "lucide-react";

import { cn } from "@/lib/cn";

type ErrorBannerProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorBanner({
  title = "Algo salió mal",
  message,
  onRetry,
  className,
}: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-xl border border-cash-in/30 bg-cash-in-bg p-4",
        className,
      )}
    >
      <AlertCircle className="mt-0.5 size-5 shrink-0 text-cash-in" />
      <div className="flex flex-1 flex-col gap-1">
        <p className="text-sm font-semibold text-cash-in">{title}</p>
        <p className="text-sm text-foreground">{message}</p>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-1 self-start text-sm font-medium text-cash-in underline-offset-2 hover:underline"
          >
            Reintentar
          </button>
        ) : null}
      </div>
    </div>
  );
}
