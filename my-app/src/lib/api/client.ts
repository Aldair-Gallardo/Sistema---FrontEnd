// src/lib/api/client.ts
//
// Cliente HTTP genérico para hablar con la API de TECA (ver
// teca-backend/backend/README.md, sección "Cómo conectar el frontend de Next.js").
// Agrega el token guardado tras el login y convierte los errores de la API
// ({"detail": "mensaje"}) en excepciones con el mensaje en español.

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export async function api(endpoint: string, options: RequestInit = {}) {
  const token = getToken();

  const respuesta = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (respuesta.status === 204) return null;

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.detail || "Ocurrió un error inesperado");
  }

  return datos;
}
