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

export interface ForgotPasswordResponse {
  message?: string;
  reset_token?: string; // solo viene si el backend tiene DEV_MODE=true
}

export async function forgotPasswordRequest(email: string): Promise<ForgotPasswordResponse> {
  return api("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPasswordRequest(token: string, newPassword: string): Promise<void> {
  await api("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, new_password: newPassword }),
  });
}