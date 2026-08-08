// src/proxy.ts
//
// Guarda de rutas del lado del servidor. En Next.js 16 "middleware" pasó a
// llamarse "proxy" (mismo comportamiento, archivo y export renombrados) — ver
// node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md.
//
// Solo hace verificaciones "optimistas" leyendo las cookies `token`/`role`
// (puestas por AuthContext.login tras el POST /auth/login). La seguridad real
// la sigue aplicando el backend con el JWT en cada petición.
import { NextRequest, NextResponse } from "next/server";
import { canAccessRoute, isStaffRole } from "@/lib/roles";

const CLIENT_ROUTES = [
  "/mi-cuenta",
  "/mis-pedidos",
  "/direcciones",
  "/metodos-de-pago",
  "/devoluciones",
];

const DASHBOARD_ROUTES = [
  "/panel",
  "/usuarios",
  "/productos",
  "/pedidos",
  "/devoluciones-admin",
  "/finanzas",
  "/permisos",
  "/cambiar-password",
  "/auditoria",
];

const AUTH_ROUTES = ["/login", "/registro"];

function landingFor(role: string | undefined): string {
  return isStaffRole(role) ? "/panel" : "/";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  const isClientRoute = CLIENT_ROUTES.some((route) => pathname.startsWith(route));
  const isDashboardRoute = DASHBOARD_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // ==========================
  // Rutas privadas del cliente
  // ==========================
  if (isClientRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ==========================
  // Dashboard
  // ==========================
  if (isDashboardRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (!canAccessRoute(pathname, role)) {
      // Rol autenticado pero sin permiso para esta sección: mostramos un
      // mensaje explícito en vez de redirigirlo en silencio.
      return NextResponse.redirect(new URL("/acceso-denegado", request.url));
    }
  }

  // ==========================
  // Login / Registro
  // ==========================
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL(landingFor(role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/mi-cuenta/:path*",
    "/mis-pedidos/:path*",
    "/direcciones/:path*",
    "/metodos-de-pago/:path*",
    "/devoluciones/:path*",

    "/panel/:path*",
    "/usuarios/:path*",
    "/productos/:path*",
    "/pedidos/:path*",
    "/devoluciones-admin/:path*",
    "/finanzas/:path*",
    "/permisos/:path*",
    "/cambiar-password/:path*",
    "/auditoria/:path*",

    "/login",
    "/registro",
  ],
};
