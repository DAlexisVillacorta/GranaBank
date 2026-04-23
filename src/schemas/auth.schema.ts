import { z } from "zod";

/**
 * Contract del endpoint de login. Los tipos salen del schema vía
 * `z.infer`, así no hay duplicación de interfaces entre front y back.
 */
export const LoginSchema = z.object({
  email: z
    .string({ error: "Ingresá tu email" })
    .trim()
    .toLowerCase()
    .email("Email inválido"),
  password: z
    .string({ error: "Ingresá tu contraseña" })
    .min(1, "La contraseña no puede estar vacía"),
  remember: z.boolean().optional().default(false),
});

export type LoginInput = z.infer<typeof LoginSchema>;
