import { z } from "zod";

/**
 * Valores matchean el enum `MovementType` de Prisma. Duplicar el enum
 * acá (en vez de importar de @prisma/client) nos deja usar el schema
 * también en el browser sin arrastrar el runtime de Prisma.
 */
export const MovementTypeSchema = z.enum(["SUS", "CASH_IN", "CASH_OUT"]);
export type MovementType = z.infer<typeof MovementTypeSchema>;

export const MovementQuerySchema = z.object({
  search: z
    .string()
    .trim()
    .min(1)
    .max(100)
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  type: MovementTypeSchema.optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export type MovementQuery = z.infer<typeof MovementQuerySchema>;

/**
 * DTO que viaja por la API. Los Decimal y Date se serializan a string
 * para evitar los "BigInt"/"Date" issues de JSON.
 */
export type MovementDTO = {
  id: string;
  type: MovementType;
  counterparty: string;
  description: string;
  amount: string;
  currency: string;
  date: string;
};

export type CardDTO = {
  balance: string;
  currency: string;
  last4: string;
  holder: string;
  expDate: string;
  issuer: "MASTERCARD" | "VISA";
};

export type UserDTO = {
  id: string;
  email: string;
  name: string;
};

export type MeResponse = {
  user: UserDTO;
  card: CardDTO | null;
};

export type MovementsResponse = {
  data: MovementDTO[];
};
