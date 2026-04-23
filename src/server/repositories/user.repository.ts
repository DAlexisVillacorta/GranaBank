import { db } from "@/lib/db";

/**
 * Acceso a la tabla `users`. Todos los métodos retornan entidades
 * Prisma crudas — la traducción a DTOs se hace en la capa de servicio.
 */
export const userRepository = {
  findByEmail: (email: string) => db.user.findUnique({ where: { email } }),

  findById: (id: string) => db.user.findUnique({ where: { id } }),

  findByIdWithCard: (id: string) =>
    db.user.findUnique({
      where: { id },
      include: { cards: { take: 1, orderBy: { createdAt: "asc" } } },
    }),
};
