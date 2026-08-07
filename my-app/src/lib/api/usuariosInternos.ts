// src/lib/api/usuariosInternos.ts
// Llamadas del panel de administrador contra /admin/users y /admin/roles (ver
// teca-backend/backend/app/routers/admin.py, sección "Usuarios internos").
// Todos estos endpoints requieren rol admin.
//
// "Eliminar" no llama a DELETE /admin/users/{id} (borrado permanente): llama a
// PATCH con {"active": false}, que ya existe en el backend para el switch
// Activo/Inactivo de la tabla. Así el registro nunca se borra de la base de datos.

import { api } from "@/lib/api/client";
import { fromRole, toRole, type BackendRole } from "@/lib/roles";
import type {
  RolInterno,
  UsuarioInterno,
  UsuarioInternoInput,
  UsuarioInternoUpdateInput,
} from "@/types/usuarioInterno";

interface UsuarioInternoBackend {
  id: string;
  name: string;
  email: string;
  description?: string;
  phone?: string;
  role: BackendRole;
  active: boolean;
  must_change_password: boolean;
  created_at: string;
}

function mapUsuarioInterno(doc: UsuarioInternoBackend): UsuarioInterno {
  return {
    id: doc.id,
    nombre: doc.name,
    correo: doc.email,
    descripcion: doc.description,
    telefono: doc.phone,
    rol: toRole(doc.role) as RolInterno,
    activo: doc.active,
    debeCambiarPassword: doc.must_change_password,
    creadoEn: doc.created_at,
  };
}

/** GET /admin/users. El backend no pagina esto: siempre devuelve la lista completa (solo roles internos, nunca clientes). */
export async function listarUsuariosInternos(rol?: RolInterno): Promise<UsuarioInterno[]> {
  const query = rol ? `?role=${fromRole(rol)}` : "";
  const docs = await api(`/admin/users${query}`);
  return docs.map(mapUsuarioInterno);
}

/** No existe GET /admin/users/{id}; se busca en el listado completo. */
export async function obtenerUsuarioInterno(id: string): Promise<UsuarioInterno | undefined> {
  const usuarios = await listarUsuariosInternos();
  return usuarios.find((u) => u.id === id);
}

export async function crearUsuarioInterno(input: UsuarioInternoInput): Promise<UsuarioInterno> {
  const doc = await api("/admin/users", {
    method: "POST",
    body: JSON.stringify({
      name: input.nombre,
      email: input.correo,
      description: input.descripcion,
      phone: input.telefono,
      role: fromRole(input.rol),
      temp_password: input.passwordTemporal,
      must_change_password: input.debeCambiarPassword,
      active: input.activo,
    }),
  });
  return mapUsuarioInterno(doc);
}

export async function actualizarUsuarioInterno(
  id: string,
  input: UsuarioInternoUpdateInput
): Promise<UsuarioInterno> {
  const doc = await api(`/admin/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      name: input.nombre,
      email: input.correo,
      description: input.descripcion,
      phone: input.telefono,
      role: input.rol ? fromRole(input.rol) : undefined,
    }),
  });
  return mapUsuarioInterno(doc);
}

/** Baja lógica: marca active:false. El registro se queda en la base de datos. */
export async function desactivarUsuarioInterno(id: string): Promise<UsuarioInterno> {
  const doc = await api(`/admin/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ active: false }),
  });
  return mapUsuarioInterno(doc);
}

export async function reactivarUsuarioInterno(id: string): Promise<UsuarioInterno> {
  const doc = await api(`/admin/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ active: true }),
  });
  return mapUsuarioInterno(doc);
}

export interface RolPermisos {
  rol: RolInterno;
  permisos: string[];
}

/** GET /admin/roles: matriz de accesos por rol (pantalla Permisos), reusada acá para mostrar qué puede hacer el rol elegido en el formulario. */
export async function listarRolesPermisos(): Promise<RolPermisos[]> {
  const docs: { role: BackendRole; permissions: string[] }[] = await api("/admin/roles");
  return docs
    .filter((doc) => doc.role !== "cliente")
    .map((doc) => ({ rol: toRole(doc.role) as RolInterno, permisos: doc.permissions }));
}
