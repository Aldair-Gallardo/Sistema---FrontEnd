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
// por toRole() antes de guardarse en el estado de la app.asasasas

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
// Calza 1:1 con la tabla de roles definida por el profesor. El backend hoy
// autoriza algunas de estas rutas de forma más amplia (ver security.py) —
// esta tabla es la restricción real mientras eso no se ajusta ahí también.
export const ROUTE_ROLE_MAP: Record<string, Role[]> = {
  "/usuarios": ["admin"], // admin: acceso total
  // "/productos" (la lista) es lectura: vendedor también entra ahí. Crear y
  // editar (/productos/nuevo, /productos/{id}) son escritura: vendedor no.
  // El orden no importa acá — allowedRolesFor() siempre usa el prefijo más
  // específico que calce, así "/productos/" gana sobre "/productos" cuando
  // aplica.
  "/productos": ["admin", "editor", "manager", "sales"],
  "/productos/": ["admin", "editor", "manager"],
  "/pedidos": ["admin", "manager", "sales", "support"], // encargado y vendedor gestionan; soporte solo lectura
  "/devoluciones-admin": ["admin", "manager", "support"], // encargado y soporte; vendedor NO tiene alcance aquí
  "/finanzas": ["admin", "finance"], // finanzas: solo reportes financieros
  "/permisos": ["admin"], // no está en el alcance de ningún otro rol de la tabla
  // "/panel" queda abierto a todo el staff a propósito: es la página de aterrizaje
  // tras iniciar sesión (ver landingFor más abajo); si se restringiera solo a admin,
  // el resto de los roles quedaría sin ningún lugar al que el login los mande.
  "/panel": STAFF_ROLES,
};

/** Devuelve los roles permitidos para la ruta dada, o null si no está mapeada.
 * Cuando varios prefijos calzan (ej. "/productos" y "/productos/"), gana el
 * más específico (el más largo), no el primero que aparece en el objeto. */
export function allowedRolesFor(pathname: string): Role[] | null {
  const match = Object.keys(ROUTE_ROLE_MAP)
    .filter((route) => pathname.startsWith(route))
    .sort((a, b) => b.length - a.length)[0];
  return match ? ROUTE_ROLE_MAP[match] : null;
}

/** true si el rol dado puede acceder a la ruta dada. Rutas no mapeadas se consideran públicas para el rol. */
export function canAccessRoute(pathname: string, role: string | undefined): boolean {
  const allowed = allowedRolesFor(pathname);
  if (!allowed) return true;
  return !!role && (allowed as string[]).includes(role);
}
