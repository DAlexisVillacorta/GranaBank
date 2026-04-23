import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/lib/env";
import { SESSION_COOKIE } from "@/lib/session";
import { LoginSchema } from "@/schemas/auth.schema";
import { handleError } from "@/server/errors/handle";
import { checkRateLimit } from "@/server/rate-limit";
import { authService } from "@/server/services/auth.service";

// 5 intentos cada 15 minutos por IP.
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";
    checkRateLimit(`login:${ip}`, MAX_ATTEMPTS, WINDOW_MS);

    const body = await req.json();
    const input = LoginSchema.parse(body);
    const { token, user } = await authService.login(input);

    // Duración de la cookie alineada a la del JWT.
    const maxAge = input.remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24;

    const res = NextResponse.json({ user });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });
    return res;
  } catch (error) {
    return handleError(error);
  }
}
