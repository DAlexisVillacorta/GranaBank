import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/server/repositories/movement.repository", () => ({
  movementRepository: {
    listByUser: vi.fn(),
    findByIdForUser: vi.fn(),
  },
}));

import { NotFoundError } from "@/server/errors/app-error";
import { movementRepository } from "@/server/repositories/movement.repository";
import { movementService } from "@/server/services/movement.service";

// Helper para construir una row tipo Prisma sin depender del runtime.
const row = (overrides: Record<string, unknown> = {}) => ({
  id: "mov_1",
  userId: "user_1",
  type: "SUS" as const,
  counterparty: "Adobe",
  description: "Pago de suscripción",
  amount: { toString: () => "125.00" },
  currency: "USD",
  date: new Date("2026-04-01T00:00:00.000Z"),
  createdAt: new Date(),
  ...overrides,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any;

describe("movementService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("listByUser", () => {
    it("mapea las entidades Prisma a DTOs serializables", async () => {
      vi.mocked(movementRepository.listByUser).mockResolvedValue([row()]);

      const result = await movementService.listByUser("user_1", {});

      expect(result).toEqual([
        {
          id: "mov_1",
          type: "SUS",
          counterparty: "Adobe",
          description: "Pago de suscripción",
          amount: "125.00",
          currency: "USD",
          date: "2026-04-01T00:00:00.000Z",
        },
      ]);
    });

    it("propaga search, type y limit al repository", async () => {
      vi.mocked(movementRepository.listByUser).mockResolvedValue([]);

      await movementService.listByUser("user_1", {
        search: "adobe",
        type: "SUS",
        limit: 10,
      });

      expect(movementRepository.listByUser).toHaveBeenCalledWith({
        userId: "user_1",
        search: "adobe",
        type: "SUS",
        limit: 10,
      });
    });
  });

  describe("getLatest", () => {
    it("usa limit por defecto de 4", async () => {
      vi.mocked(movementRepository.listByUser).mockResolvedValue([]);

      await movementService.getLatest("user_1");

      expect(movementRepository.listByUser).toHaveBeenCalledWith({
        userId: "user_1",
        limit: 4,
      });
    });

    it("respeta un limit custom", async () => {
      vi.mocked(movementRepository.listByUser).mockResolvedValue([]);

      await movementService.getLatest("user_1", 2);

      expect(movementRepository.listByUser).toHaveBeenCalledWith({
        userId: "user_1",
        limit: 2,
      });
    });
  });

  describe("getByIdForUser", () => {
    it("lanza NotFoundError cuando no existe o pertenece a otro usuario", async () => {
      vi.mocked(movementRepository.findByIdForUser).mockResolvedValue(null);

      await expect(
        movementService.getByIdForUser("missing", "user_1"),
      ).rejects.toBeInstanceOf(NotFoundError);
    });

    it("devuelve el DTO cuando encuentra el movimiento", async () => {
      vi.mocked(movementRepository.findByIdForUser).mockResolvedValue(row());

      const result = await movementService.getByIdForUser("mov_1", "user_1");

      expect(result.id).toBe("mov_1");
      expect(result.counterparty).toBe("Adobe");
    });
  });
});
