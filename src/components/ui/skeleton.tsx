import { cn } from "@/lib/cn";

/** Placeholder animado usado durante la carga de datos. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Cargando"
      className={cn(
        "animate-pulse rounded-lg bg-border/60",
        className,
      )}
    />
  );
}
