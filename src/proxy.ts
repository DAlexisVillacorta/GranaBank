import { NextResponse, type NextRequest } from "next/server";

import { verifyToken } from "@/lib/jwt";
import { SESSION_COOKIE } from "@/lib/session";

/**
 * Rutas que requieren usuario autenticado. Si no hay sesión válida
 * redirige a /login preservando la URL original como `?redirect=`.
 */
const PROTECTED_PREFIXES = ["/home", "/movimientos"];

/**
 * Rutas donde un usuario ya logueado no debería estar (no tiene sentido
 * mostrarle el login). Lo mandamos directo al Home.
 */
const AUTH_ONLY_LOGGED_OUT = ["/login"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;

  let isAuthenticated = false;
  if (token) {
    try {
      await verifyToken(token);
      isAuthenticated = true;
    } catch {
      // Token inválido o expirado → tratamos como no logueado.
      isAuthenticated = false;
    }
  }

  const isProtected = PROTECTED_PREFIXES.some((p) =>
    pathname === p || pathname.startsWith(`${p}/`),
  );
  const isLoginPage = AUTH_ONLY_LOGGED_OUT.includes(pathname);

  if (isProtected && !isAuthenticated) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (isLoginPage && isAuthenticated) {
    const url = req.nextUrl.clone();
    url.pathname = "/home";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Excluye assets estáticos y API. El matcher se queda con las páginas.
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
