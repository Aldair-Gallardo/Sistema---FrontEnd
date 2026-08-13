// src/lib/api/resenas.ts
// Llamadas contra /products/{id}/reviews (ver
// teca-backend/backend/app/routers/products.py, sección "Reseñas").

import { api } from "@/lib/api/client";
import type { Resena, ResenaInput, ResenasResultado } from "@/types/resena";

interface ResenaBackend {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  verified_purchase: boolean;
  created_at: string;
}

function mapResena(doc: ResenaBackend): Resena {
  return {
    id: doc.id,
    usuarioNombre: doc.user_name,
    calificacion: doc.rating,
    comentario: doc.comment,
    compraVerificada: doc.verified_purchase,
    fecha: doc.created_at,
  };
}

export const RESENAS_POR_PAGINA = 10;

export async function listarResenas(productoId: string, pagina = 1): Promise<ResenasResultado> {
  const respuesta = await api(`/products/${productoId}/reviews?page=${pagina}&page_size=${RESENAS_POR_PAGINA}`);
  return {
    resenas: respuesta.items.map(mapResena),
    total: respuesta.total,
    pagina: respuesta.page,
    promedio: respuesta.average,
    distribucion: respuesta.distribution,
  };
}

export async function crearResena(productoId: string, input: ResenaInput): Promise<Resena> {
  const doc = await api(`/products/${productoId}/reviews`, {
    method: "POST",
    body: JSON.stringify({ rating: input.calificacion, comment: input.comentario }),
  });
  return mapResena(doc);
}
