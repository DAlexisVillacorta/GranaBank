import type { Movement } from "@prisma/client";

import type {
  MovementDTO,
  MovementQuery,
} from "@/schemas/movement.schema";

import { NotFoundError } from "../errors/app-error";
import { movementRepository } from "../repositories/movement.repository";

function toDTO(m: Movement): MovementDTO {
  return {
    id: m.id,
    type: m.type,
    counterparty: m.counterparty,
    description: m.description,
    amount: m.amount.toString(),
    currency: m.currency,
    date: m.date.toISOString(),
  };
}

export const movementService = {
  /**
   * Lista movimientos del usuario con filtros opcionales (tipo y búsqueda
   * por nombre de contraparte o descripción).
   */
  async listByUser(
    userId: string,
    query: MovementQuery,
  ): Promise<MovementDTO[]> {
    const movements = await movementRepository.listByUser({
      userId,
      search: query.search,
      type: query.type,
      limit: query.limit,
    });
    return movements.map(toDTO);
  },

  /**
   * Últimos N movimientos — usado en el bloque "Últimos movimientos"
   * del Home.
   */
  async getLatest(userId: string, limit = 4): Promise<MovementDTO[]> {
    const movements = await movementRepository.listByUser({ userId, limit });
    return movements.map(toDTO);
  },

  /** Detalle por id, solo si pertenece al usuario (filtro anti-IDOR). */
  async getByIdForUser(
    id: string,
    userId: string,
  ): Promise<MovementDTO> {
    const movement = await movementRepository.findByIdForUser(id, userId);
    if (!movement) throw new NotFoundError("Movimiento no encontrado");
    return toDTO(movement);
  },
};
