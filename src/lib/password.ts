import { compare, hash } from "bcryptjs";

/**
 * bcryptjs es la implementación JS pura (no nativa), lo que garantiza que
 * funciona sin problemas en el build de Vercel. 12 rounds es un buen
 * balance seguridad/performance para un login interactivo.
 */
const SALT_ROUNDS = 12;

export const hashPassword = (plain: string): Promise<string> =>
  hash(plain, SALT_ROUNDS);

export const verifyPassword = (
  plain: string,
  hashed: string,
): Promise<boolean> => compare(plain, hashed);
