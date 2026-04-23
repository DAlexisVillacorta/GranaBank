import { z } from "zod";

/**
 * Validación de variables de entorno al arranque.
 *
 * Si falta alguna variable crítica el proceso falla de inmediato con un
 * mensaje claro, en vez de romper en runtime cuando se intenta usarla.
 */
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET debe tener al menos 32 caracteres"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const formatted = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(
    `Variables de entorno inválidas o faltantes:\n${formatted}\n\nRevisá tu archivo .env contra .env.example.`,
  );
}

export const env = parsed.data;
export type Env = typeof env;
