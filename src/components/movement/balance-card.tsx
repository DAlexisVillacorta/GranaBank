import { formatBalance } from "@/lib/format";
import type { CardDTO } from "@/schemas/movement.schema";

type Props = {
  card: CardDTO;
};

/**
 * Card que muestra la tarjeta del usuario (fondo granate, saldo, últimos 4,
 * nombre del titular, fecha de expiración y logo del issuer).
 */
export function BalanceCard({ card }: Props) {
  return (
    <div className="relative flex flex-col gap-6 overflow-hidden rounded-2xl bg-brand-700 p-5 text-white shadow-lg">
      {/* Adorno decorativo — emula el círculo del Figma. */}
      <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-brand-600/50" />
      <div className="pointer-events-none absolute -right-24 bottom-0 size-40 rounded-full bg-brand-800/40" />

      <div className="relative flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium uppercase tracking-wider text-white/70">
            Balance
          </p>
          <div className="flex items-baseline gap-2">
            <span className="rounded-full bg-brand-500/70 px-2 py-0.5 text-[10px] font-bold uppercase">
              {card.currency}
            </span>
            <span className="text-3xl font-bold tracking-tight">
              {formatBalance(card.balance)}
            </span>
          </div>
        </div>
        {card.issuer === "MASTERCARD" ? (
          <MastercardLogo />
        ) : (
          <VisaLogo />
        )}
      </div>

      <div className="relative flex flex-col gap-3">
        <p className="font-mono text-lg tracking-[0.3em]">
          ···· ···· ···· {card.last4}
        </p>
        <div className="flex items-end justify-between text-sm">
          <div>
            <p className="text-[10px] uppercase text-white/70">Titular</p>
            <p className="font-medium">{card.holder}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase text-white/70">Exp. Date</p>
            <p className="font-medium">{card.expDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MastercardLogo() {
  return (
    <div className="flex items-center" aria-label="Mastercard">
      <div className="size-7 rounded-full bg-[#EB001B]" />
      <div className="-ml-3 size-7 rounded-full bg-[#F79E1B]/90 mix-blend-screen" />
    </div>
  );
}

function VisaLogo() {
  return (
    <span
      aria-label="Visa"
      className="font-[Arial,sans-serif] text-xl font-extrabold italic tracking-tight"
    >
      VISA
    </span>
  );
}
