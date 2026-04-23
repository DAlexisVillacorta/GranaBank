import { cookies } from "next/headers";

import { UnauthorizedError } from "@/server/errors/app-error";

import { verifyToken, type SessionToken } from "./jwt";

/**
 * Nombre de la cookie httpOnly que guarda el JWT firmado.
 * Centralizarla evita mismatches entre lectura y escritura.
 */
export const SESSION_COOKIE = "granabank_session";

/**
 * Lee la cookie de sesión y devuelve el payload del JWT.
 * Devuelve `null` si no hay sesión o si el token es inválido/expirado.
 * Solo para usar en route handlers / server components (usa next/headers).
 */
export async function getSession(): Promise<SessionToken | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}

/**
 * Igual que `getSession` pero tira `UnauthorizedError` si no hay sesión.
 * Pensada para API routes que asumen usuario logueado.
 */
export async function requireSession(): Promise<SessionToken> {
  const session = await getSession();
  if (!session) throw new UnauthorizedError();
  return session;
}
