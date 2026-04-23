import Link from "next/link";

import { cn } from "@/lib/cn";
import { formatAmount } from "@/lib/format";
import type { MovementDTO, MovementType } from "@/schemas/movement.schema";

import { MovementIcon } from "./movement-icon";

type Props = {
  movement: MovementDTO;
  href?: string;
};

const AMOUNT_COLOR: Record<MovementType, string> = {
  SUS: "text-sus",
  CASH_IN: "text-cash-in",
  CASH_OUT: "text-cash-out",
};

/**
 * Fila de movimiento. Si recibe `href` se renderiza como Link (clickable),
 * si no, como un div estático. Usado tanto en Home (últimos) como en
 * Movimientos (lista completa).
 */
export function MovementItem({ movement, href }: Props) {
  const amountColor = AMOUNT_COLOR[movement.type];
  const baseClasses = cn(
    "flex items-center gap-3 rounded-2xl bg-card p-3 shadow-sm transition-transform",
    href && "hover:-translate-y-0.5 hover:shadow-md active:translate-y-0",
  );

  const content = (
    <>
      <MovementIcon type={movement.type} />
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="truncate text-sm font-semibold text-foreground">
          {movement.counterparty}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {movement.description}
        </p>
      </div>
      <p className={cn("text-sm font-semibold", amountColor)}>
        {formatAmount(movement.amount, movement.currency)}
      </p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return <div className={baseClasses}>{content}</div>;
}
