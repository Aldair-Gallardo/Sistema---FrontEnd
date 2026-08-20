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

export interface RegisterResponse {
  id: string;
  message: string;
  verification_token?: string;
}

export async function registerRequest(
  name: string,
  email: string,
  password: string,
  phone?: string
): Promise<RegisterResponse> {
  return api("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, phone: phone ?? null }),
  });
}