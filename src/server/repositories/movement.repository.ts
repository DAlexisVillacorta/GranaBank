import type { $Enums, Movement } from "@prisma/client";

import { db } from "@/lib/db";

export type MovementFilter = {
  userId: string;
  search?: string;
  type?: $Enums.MovementType;
  limit?: number;
};

/**
 * Acceso a la tabla `movements`. Aísla las queries Prisma para que la
 * capa de servicio solo conozca un contrato simple (`listByUser`).
 */
export const movementRepository = {
  listByUser: ({
    userId,
    search,
    type,
    limit = 50,
  }: MovementFilter): Promise<Movement[]> => {
    return db.movement.findMany({
      where: {
        userId,
        ...(type ? { type } : {}),
        ...(search
          ? {
              OR: [
                { counterparty: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { date: "desc" },
      take: limit,
    });
  },

  findByIdForUser: (id: string, userId: string) =>
    db.movement.findFirst({ where: { id, userId } }),
};
