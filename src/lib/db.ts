import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import { env } from "./env";

/**
 * Singleton de Prisma Client.
 *
 * En desarrollo Next.js hace hot-reload constante y cada reload crearía
 * una instancia nueva, agotando conexiones. Guardamos la instancia en
 * `globalThis` para reutilizarla entre reloads.
 *
 * A partir de Prisma 7 el cliente requiere un driver adapter explícito.
 * Usamos `@prisma/adapter-pg` que delega al driver oficial `pg`.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
