// src/hooks/AuthContext.tsx
"use client";

import { createContext, useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { App } from "antd";
import { loginRequest, registerRequest, type RegisterResponse } from "@/lib/api/auth";
import type { User } from "@/types/user";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<RegisterResponse>;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// El JWT del backend dura 24h (JWT_EXPIRE_MINUTES=1440) — las cookies usadas por
// el proxy para las guardas de rol expiran al mismo tiempo.
const TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24;

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}

// Cierra la sesión sola si no hay actividad del usuario (clicks, teclado,
// scroll) durante este tiempo, aunque el token siga siendo válido.
const IDLE_TIMEOUT_MS = 15 * 60 * 1000;
const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"] as const;

// El usuario logueado vive en localStorage, una fuente externa a React. Se expone
// a través de useSyncExternalStore (en vez de useState + useEffect) para que la
// hidratación en el cliente no dispare un setState dentro de un efecto ni cause
// un parpadeo de "no autenticado" antes de reflejar el valor real.
let cachedUser: User | null = null;
let hydrated = false;
const listeners = new Set<() => void>();

function readStoredUser(): User | null {
  try {
    const token = localStorage.getItem("token");
    const guardado = localStorage.getItem("usuario");
    if (!token || !guardado) return null;
    return JSON.parse(guardado) as User;
  } catch {
    return null;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): User | null {
  if (!hydrated) {
    cachedUser = readStoredUser();
    hydrated = true;
  }
  return cachedUser;
}

function getServerSnapshot(): User | null {
  return null;
}

function setStoredUser(user: User | null) {
  cachedUser = user;
  hydrated = true;
  listeners.forEach((listener) => listener());
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const router = useRouter();
  const { message } = App.useApp();

  useEffect(() => {
    if (!user) return;

    let timer: ReturnType<typeof setTimeout>;

    function resetTimer() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        logout();
        message.info("Tu sesión se cerró por inactividad");
        router.push("/login");
      }, IDLE_TIMEOUT_MS);
    }

    resetTimer();
    ACTIVITY_EVENTS.forEach((evento) => window.addEventListener(evento, resetTimer));

    return () => {
      clearTimeout(timer);
      ACTIVITY_EVENTS.forEach((evento) => window.removeEventListener(evento, resetTimer));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- logout no depende de nada por render, solo nos interesa reiniciar el timer cuando cambia el usuario
  }, [user]);

  async function login(email: string, password: string): Promise<User> {
    const data = await loginRequest(email, password);

    localStorage.setItem("token", data.access_token);
    localStorage.setItem("usuario", JSON.stringify(data.user));
    setCookie("token", data.access_token, TOKEN_MAX_AGE_SECONDS);
    setCookie("role", data.user.role, TOKEN_MAX_AGE_SECONDS);

    setStoredUser(data.user);
    return data.user;
  }

  async function register(
  name: string,
  email: string,
  password: string,
  phone?: string
): Promise<RegisterResponse> {
  return registerRequest(name, email, password, phone);
}

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    deleteCookie("token");
    deleteCookie("role");
    setStoredUser(null);
  }

  // Actualiza el usuario cacheado (ej. tras editar el nombre en "Mi cuenta") sin
  // necesitar un nuevo login. No toca el token ni las cookies de rol.
  function updateUser(patch: Partial<User>) {
    const actual = getSnapshot();
    if (!actual) return;
    const actualizado = { ...actual, ...patch };
    localStorage.setItem("usuario", JSON.stringify(actualizado));
    setStoredUser(actualizado);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading: false, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
