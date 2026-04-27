import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { formatAmount, formatDate } from "@/lib/format";
import { getSession } from "@/lib/session";
import type { MovementType } from "@/schemas/movement.schema";
import { NotFoundError } from "@/server/errors/app-error";
import { movementService } from "@/server/services/movement.service";

export const dynamic = "force-dynamic";

const AMOUNT_COLOR: Record<MovementType, string> = {
  SUS: "text-sus",
  CASH_IN: "text-cash-in",
  CASH_OUT: "text-cash-out",
};

const HERO_BG: Record<MovementType, string> = {
  SUS: "bg-sus-bg",
  CASH_IN: "bg-cash-in-bg",
  CASH_OUT: "bg-cash-out-bg",
};

const TYPE_LABEL: Record<MovementType, string> = {
  SUS: "Débito automático",
  CASH_IN: "Pago recibido",
  CASH_OUT: "Pago enviado",
};

const TYPE_ICON: Record<MovementType, typeof ArrowDown> = {
  SUS: ArrowUpDown,
  CASH_IN: ArrowDown,
  CASH_OUT: ArrowUp,
};

export default async function MovementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;

  let movement;
  try {
    movement = await movementService.getByIdForUser(id, session.sub);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  const Icon = TYPE_ICON[movement.type];
  const amountColor = AMOUNT_COLOR[movement.type];
  const heroBg = HERO_BG[movement.type];

  return (
    <div className="flex flex-col gap-5 px-5 pt-6 pb-4">
      <header className="flex items-center gap-2">
        <Link
          href="/movimientos"
          aria-label="Volver a movimientos"
          className="flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-brand-50 dark:hover:bg-brand-900"
        >
          <ChevronLeft className="size-5" strokeWidth={2.5} />
        </Link>
        <h1 className="text-lg font-bold text-foreground">Detalle</h1>
      </header>

      {/* Hero card */}
      <div className={`relative flex flex-col items-center gap-5 overflow-hidden rounded-3xl p-8 ${heroBg}`}>
        {/* Adorno de fondo */}
        <div className={`pointer-events-none absolute -right-10 -top-10 size-40 rounded-full opacity-30 ${heroBg}`} />

        {/* Ícono grande */}
        <div className={`flex size-16 items-center justify-center rounded-2xl bg-white/60 dark:bg-black/20 ${amountColor}`}>
          <Icon className="size-8" strokeWidth={2} />
        </div>

        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {TYPE_LABEL[movement.type]}
          </p>
          <p className={`text-5xl font-bold tracking-tight ${amountColor}`}>
            {formatAmount(movement.amount, movement.currency)}
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {movement.counterparty}
          </p>
        </div>

        {/* Badge de fecha */}
        <span className="rounded-full border border-border/50 bg-white/50 dark:bg-black/20 px-3 py-1 text-xs text-muted-foreground">
          {formatDate(movement.date)}
        </span>
      </div>

      {/* Tabla de detalle */}
      <dl className="flex flex-col divide-y divide-border rounded-2xl bg-card shadow-sm">
        <Row label="Descripción" value={movement.description} />
        <Row label="Moneda" value={movement.currency} />
        <Row label="ID de transacción" value={movement.id} mono />
      </dl>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <dt className="shrink-0 text-sm text-muted-foreground">{label}</dt>
      <dd
        className={`truncate text-right text-sm font-medium text-foreground ${mono ? "font-mono text-xs text-muted-foreground" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}
