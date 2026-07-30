// src/lib/roles.ts
//
// Fuente única de verdad de roles y permisos por ruta del panel. La usan tanto
// el proxy (guarda de rutas del lado del servidor) como los componentes de
// cliente (Header, SidebarDashboard) para mostrar/ocultar opciones. Los roles
// y el alcance de cada uno vienen de teca-backend/backend/app/security.py.

export type Role =
  | "cliente"
  | "admin"
  | "editor"
  | "encargado"
  | "vendedor"
  | "soporte"
  | "finanzas";

export const CUSTOMER_ROLE: Role = "cliente";

// Coincide con INTERNAL_ROLES en app/security.py
export const STAFF_ROLES: Role[] = [
  "admin",
  "editor",
  "encargado",
  "vendedor",
  "soporte",
  "finanzas",
];

export function isStaffRole(role: string | undefined): role is Role {
  return !!role && (STAFF_ROLES as string[]).includes(role);
}

// Rutas del panel (dashboard) y los roles que pueden entrar a cada una.
export const ROUTE_ROLE_MAP: Record<string, Role[]> = {
  "/usuarios": ["admin"],
  "/productos": ["admin", "editor", "encargado"],
  "/finanzas": ["admin", "finanzas"],
  "/permisos": STAFF_ROLES,
  "/panel": STAFF_ROLES,
};

/** Devuelve los roles permitidos para la ruta dada, o null si no está mapeada. */
export function allowedRolesFor(pathname: string): Role[] | null {
  const match = Object.keys(ROUTE_ROLE_MAP).find((route) =>
    pathname.startsWith(route)
  );
  return match ? ROUTE_ROLE_MAP[match] : null;
}

/** true si el rol dado puede acceder a la ruta dada. Rutas no mapeadas se consideran públicas para el rol. */
export function canAccessRoute(pathname: string, role: string | undefined): boolean {
  const allowed = allowedRolesFor(pathname);
  if (!allowed) return true;
  return !!role && (allowed as string[]).includes(role);
}
