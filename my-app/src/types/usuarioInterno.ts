// src/types/usuarioInterno.ts
// Tipos del panel de administrador de usuarios internos. Calzan 1:1 con lo que
// devuelve la API real (ver teca-backend/backend/app/models.py, InternalUserIn/
// InternalUserUpdateIn, y app/routers/admin.py, sección "Usuarios internos").

import type { Role } from "@/lib/roles";

/** Roles internos (todo Role menos "customer", que no puede iniciar sesión en el panel). */
export type RolInterno = Exclude<Role, "customer">;

export interface UsuarioInterno {
  id: string;
  nombre: string;
  correo: string;
  descripcion?: string;
  telefono?: string;
  rol: RolInterno;
  activo: boolean;
  debeCambiarPassword: boolean;
  creadoEn: string;
}

/** Lo que envía el formulario de crear usuario interno. */
export interface UsuarioInternoInput {
  nombre: string;
  correo: string;
  descripcion?: string;
  telefono?: string;
  rol: RolInterno;
  passwordTemporal: string;
  debeCambiarPassword: boolean;
  activo: boolean;
}

/** Lo que envía el formulario de editar usuario interno (sin contraseña ni estado: eso no se toca desde ahí). */
export interface UsuarioInternoUpdateInput {
  nombre?: string;
  correo?: string;
  descripcion?: string;
  telefono?: string;
  rol?: RolInterno;
}
