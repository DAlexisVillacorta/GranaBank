/**
 * Helpers de formateo. Centralizados para que el mismo número se muestre
 * igual en todos los componentes.
 */

/**
 * Formatea un monto en formato "$125" (sin decimales cuando son .00).
 * Acepta tanto number como string (los Decimal de Prisma llegan como string).
 */
export function formatAmount(amount: string | number, currency = "USD"): string {
  const num = typeof amount === "string" ? Number(amount) : amount;
  const hasDecimals = num % 1 !== 0;
  const formatted = new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(num);
  return currency === "USD" ? `$${formatted}` : `${formatted} ${currency}`;
}

/**
 * Formatea un balance para mostrar con "978.85" (siempre 2 decimales
 * cuando hay, el formato del diseño).
 */
export function formatBalance(amount: string | number): string {
  const num = typeof amount === "string" ? Number(amount) : amount;
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Formatea una fecha ISO al estilo "15 abr, 12:34". */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
