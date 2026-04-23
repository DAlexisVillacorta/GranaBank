import { SignJWT, jwtVerify } from "jose";

import { env } from "./env";

/**
 * Firma y verificación de JWT usando `jose`.
 *
 * Elegimos `jose` sobre `jsonwebtoken` porque funciona en el runtime Edge
 * de Next.js (middleware), donde los módulos nativos de Node no están
 * disponibles.
 */
const secret = new TextEncoder().encode(env.JWT_SECRET);
const ALGORITHM = "HS256";

export type SessionToken = {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
};

export async function signToken(
  payload: Pick<SessionToken, "sub" | "email">,
  expiresIn: string = "7d",
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}

export async function verifyToken(token: string): Promise<SessionToken> {
  const { payload } = await jwtVerify<SessionToken>(token, secret, {
    algorithms: [ALGORITHM],
  });
  return payload;
}
