import { PrismaClient } from "@prisma/client";

import { env } from "./env";

/**
 * Singleton de Prisma Client.
 *
 * En desarrollo, Next.js hace hot-reload constante y cada reload crearía
 * una instancia nueva, agotando conexiones. Guardamos la instancia en
 * `globalThis` para reutilizarla entre reloads.
 *
 * En producción esto no es necesario (cada lambda tiene su propio proceso),
 * pero mantenerlo unificado simplifica el código.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
