// src/types/resena.ts
// Tipos de las reseñas de producto. Calzan 1:1 con lo que devuelve
// GET/POST /products/{id}/reviews (ver teca-backend/backend/app/routers/products.py).

export interface Resena {
  id: string;
  usuarioNombre: string;
  calificacion: number;
  comentario: string;
  compraVerificada: boolean;
  fecha: string;
}

export interface ResenasResultado {
  resenas: Resena[];
  total: number;
  pagina: number;
  promedio: number;
  /** Cantidad de reseñas por calificación, claves "1".."5" (para las barras 5★–1★). */
  distribucion: Record<string, number>;
}

export interface ResenaInput {
  calificacion: number;
  comentario: string;
}
