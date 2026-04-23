import { RateLimitError } from "./errors/app-error";

/**
 * Rate limiter en memoria por key (típicamente la IP).
 *
 * Es intencionalmente simple: sliding window fijo, sin persistencia.
 * En un deploy serverless cada lambda tiene su propio Map, así que
 * el límite real es por instancia. Alcanza para ralentizar un ataque
 * de fuerza bruta trivial en un challenge; para producción real se
 * reemplaza por `@upstash/ratelimit` sin cambiar la API expuesta.
 */
type Hit = { count: number; resetAt: number };
const store = new Map<string, Hit>();

export function checkRateLimit(
  key: string,
  max: number,
  windowMs: number,
): void {
  const now = Date.now();
  const hit = store.get(key);

  if (!hit || hit.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (hit.count >= max) {
    throw new RateLimitError();
  }

  hit.count++;
}

/** Limpieza oportunista para que el Map no crezca sin límite en tests. */
export function resetRateLimit(): void {
  store.clear();
}
