import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { MovementIcon } from "@/components/movement/movement-icon";
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

const TYPE_LABEL: Record<MovementType, string> = {
  SUS: "Débito automático",
  CASH_IN: "Pago recibido",
  CASH_OUT: "Pago enviado",
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

  return (
    <div className="flex flex-col gap-6 px-5 pt-6">
      <header className="flex items-center gap-3">
        <Link
          href="/movimientos"
          aria-label="Volver"
          className="flex size-10 items-center justify-center rounded-full text-foreground hover:bg-brand-50"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <h1 className="text-xl font-bold text-foreground">
          Detalle del movimiento
        </h1>
      </header>

      <div className="flex flex-col items-center gap-3 rounded-2xl bg-card p-6 shadow-sm">
        <MovementIcon type={movement.type} />
        <p className="text-sm uppercase tracking-wider text-muted-foreground">
          {TYPE_LABEL[movement.type]}
        </p>
        <p className={`text-4xl font-bold ${AMOUNT_COLOR[movement.type]}`}>
          {formatAmount(movement.amount, movement.currency)}
        </p>
      </div>

      <dl className="flex flex-col divide-y divide-border rounded-2xl bg-card p-4 shadow-sm">
        <Row label="Contraparte" value={movement.counterparty} />
        <Row label="Descripción" value={movement.description} />
        <Row label="Fecha" value={formatDate(movement.date)} />
        <Row label="Moneda" value={movement.currency} />
        <Row label="ID" value={movement.id} mono />
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
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd
        className={`truncate text-right text-sm font-medium text-foreground ${mono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}
