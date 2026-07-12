// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const CLIENT_ROUTES = ['/mi-cuenta', '/mis-pedidos', '/direcciones', '/metodos-de-pago', '/devoluciones'];
const DASHBOARD_ROUTES = ['/panel', '/usuarios', '/finanzas', '/permisos'];
const DASHBOARD_ROLES = ['admin', 'vendedor', 'encargado', 'soporte', 'editor', 'finanzas'];
const AUTH_ROUTES = ['/login', '/registro'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value; // o decodificado del JWT

  const isClientRoute = CLIENT_ROUTES.some((route) => pathname.startsWith(route));
  const isDashboardRoute = DASHBOARD_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // Sin token intentando entrar a ruta privada de cliente
  if (isClientRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Sin token o rol no autorizado intentando entrar al dashboard
  if (isDashboardRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (!role || !DASHBOARD_ROLES.includes(role)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Ya tiene sesión e intenta ver login/registro de nuevo
  if (isAuthRoute && token) {
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
    '/panel/:path*',
    '/usuarios/:path*',
    '/finanzas/:path*',
    '/permisos/:path*',
    '/login',
    '/registro',
  ],
};