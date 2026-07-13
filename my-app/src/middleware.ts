// middleware.ts
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const CLIENT_ROUTES = [
  '/mi-cuenta',
  '/mis-pedidos',
  '/direcciones',
  '/metodos-de-pago',
  '/devoluciones',
];

const DASHBOARD_ROUTES = [
  '/inicio-admin',
  '/panel',
  '/usuarios',
  '/productos',
  '/finanzas',
  '/permisos',
];

const DASHBOARD_ROLES = [
  'admin',
  'vendedor',
  'encargado',
  'soporte',
  'editor',
  'finanzas',
];

const AUTH_ROUTES = ['/login', '/registro'];

// ==============================
// SOLO PARA DESARROLLO
// Cambia a false cuando tengas
// el login real funcionando.
// ==============================
const DEV_MODE = true;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;

  const isClientRoute = CLIENT_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  const isDashboardRoute = DASHBOARD_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute = AUTH_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // ==========================
  // Rutas privadas del cliente
  // ==========================
  if (isClientRoute && !token && !DEV_MODE) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ==========================
  // Dashboard
  // ==========================
  if (isDashboardRoute) {
    if (!token && !DEV_MODE) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (
      !DEV_MODE &&
      (!role || !DASHBOARD_ROLES.includes(role))
    ) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // ==========================
  // Login / Registro
  // ==========================
  if (isAuthRoute && (token || DEV_MODE)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/mi-cuenta/:path*',
    '/mis-pedidos/:path*',
    '/direcciones/:path*',
    '/metodos-de-pago/:path*',
    '/devoluciones/:path*',

    '/inicio-admin/:path*',
    '/panel/:path*',
    '/usuarios/:path*',
    '/productos/:path*',
    '/finanzas/:path*',
    '/permisos/:path*',

    '/login',
    '/registro',
  ],
};