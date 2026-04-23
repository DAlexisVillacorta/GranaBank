import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { cn } from "@/lib/cn";
import type { MovementType } from "@/schemas/movement.schema";

type Props = {
  type: MovementType;
  size?: "sm" | "md";
};

/** Estilos por tipo de movimiento — calzan con los chips del Figma. */
const STYLES: Record<MovementType, { bg: string; color: string }> = {
  SUS: { bg: "bg-sus-bg", color: "text-sus" },
  CASH_IN: { bg: "bg-cash-in-bg", color: "text-cash-in" },
  CASH_OUT: { bg: "bg-cash-out-bg", color: "text-cash-out" },
};

const ICONS: Record<MovementType, typeof ArrowDown> = {
  SUS: ArrowUpDown,
  CASH_IN: ArrowDown,
  CASH_OUT: ArrowUp,
};

export function MovementIcon({ type, size = "md" }: Props) {
  const Icon = ICONS[type];
  const { bg, color } = STYLES[type];
  const box = size === "sm" ? "size-10" : "size-12";
  const iconSize = size === "sm" ? "size-4" : "size-5";
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl",
        box,
        bg,
      )}
    >
      <Icon className={cn(iconSize, color)} strokeWidth={2.5} />
    </div>
  );
}
