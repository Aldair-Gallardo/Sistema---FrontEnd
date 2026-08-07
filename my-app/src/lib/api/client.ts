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

async function parseJson(respuesta: Response) {
  try {
    return await respuesta.json();
  } catch {
    throw new Error("El servidor respondió con un formato inesperado");
  }
}

export async function api(endpoint: string, options: RequestInit = {}) {
  if (!API_URL) {
    throw new Error(
      "Falta configurar NEXT_PUBLIC_API_URL. Copia .env.example a .env.local con la URL del backend."
    );
  }

  const token = getToken();

  let respuesta: Response;
  try {
    respuesta = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(`No se pudo conectar con el servidor (${API_URL}). ¿Está corriendo el backend?`);
  }

  if (respuesta.status === 204) return null;

  const datos = await parseJson(respuesta);

  if (!respuesta.ok) {
    throw new Error(datos?.detail || "Ocurrió un error inesperado");
  }

  return datos;
}
