// src/lib/api/auth.ts
// Llamadas de autenticación contra /auth (ver teca-backend/backend/app/routers/auth.py).

import { api } from "@/lib/api/client";
import { toRole } from "@/lib/roles";
import type { User } from "@/types/user";

export interface LoginResponse {
  access_token: string;
  token_type: string;
  must_change_password: boolean;
  user: User;
}

export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  const data = await api("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return { ...data, user: { ...data.user, role: toRole(data.user.role) } };
}

/** POST /auth/change-password. También es el endpoint que limpia must_change_password tras la contraseña temporal. */
export async function cambiarPassword(datos: { actual: string; nueva: string }): Promise<void> {
  await api("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ current_password: datos.actual, new_password: datos.nueva }),
  });
}
