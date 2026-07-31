// src/lib/roles.ts
//
// Fuente única de verdad de roles y permisos por ruta del panel. La usan tanto
// el proxy (guarda de rutas del lado del servidor) como los componentes de
// cliente (Header, SidebarDashboard) para mostrar/ocultar opciones.
//
// El backend (teca-backend/backend/app/security.py) todavía guarda y devuelve
// los roles en español — ver BackendRole y toRole() más abajo, que traducen
// eso al identificador en inglés que usa el resto del frontend. Cualquier
// respuesta de la API que traiga un rol (login, /auth/me, etc.) debe pasar
// por toRole() antes de guardarse en el estado de la app.

export type Role =
  | "customer"
  | "admin"
  | "editor"
  | "manager"
  | "sales"
  | "support"
  | "finance";

export const CUSTOMER_ROLE: Role = "customer";

// Coincide con INTERNAL_ROLES en app/security.py
export const STAFF_ROLES: Role[] = [
  "admin",
  "editor",
  "manager",
  "sales",
  "support",
  "finance",
];

/** Roles tal como los devuelve hoy teca-backend (app/security.py, en español). */
export type BackendRole =
  | "cliente"
  | "admin"
  | "editor"
  | "encargado"
  | "vendedor"
  | "soporte"
  | "finanzas";

const BACKEND_ROLE_TO_ROLE: Record<BackendRole, Role> = {
  cliente: "customer",
  admin: "admin",
  editor: "editor",
  encargado: "manager",
  vendedor: "sales",
  soporte: "support",
  finanzas: "finance",
};

/** Traduce el rol en español que manda el backend al identificador en inglés que usa el frontend. */
export function toRole(backendRole: string): Role {
  const role = BACKEND_ROLE_TO_ROLE[backendRole as BackendRole];
  if (!role) {
    throw new Error(`Rol desconocido recibido del backend: "${backendRole}"`);
  }
  return role;
}

/** Etiquetas en español para mostrar el rol en la UI (Header, tabla de usuarios, etc). */
export const ROLE_LABELS: Record<Role, string> = {
  customer: "Cliente",
  admin: "Administrador",
  editor: "Editor",
  manager: "Encargado",
  sales: "Vendedor",
  support: "Soporte",
  finance: "Finanzas",
};

export function isStaffRole(role: string | undefined): role is Role {
  return !!role && (STAFF_ROLES as string[]).includes(role);
}

// Rutas del panel (dashboard) y los roles que pueden entrar a cada una.
export const ROUTE_ROLE_MAP: Record<string, Role[]> = {
  "/usuarios": ["admin"],
  "/productos": ["admin", "editor", "manager"],
  "/finanzas": ["admin", "finance"],
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
