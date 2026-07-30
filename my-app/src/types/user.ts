// src/types/user.ts
// Forma del usuario tal como lo devuelve POST /auth/login y GET /auth/me.

export type { Role } from "@/lib/roles";
import type { Role } from "@/lib/roles";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  email_verified: boolean;
}
