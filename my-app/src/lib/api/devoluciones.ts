// src/lib/api/devoluciones.ts
// Llamadas del área de cliente contra /account/returns (ver
// teca-backend/backend/app/routers/account.py). El backend no expone un
// endpoint de detalle por id ni guarda material/cantidad/imagen del producto
// en la devolución: obtenerDevolucionConDetalle() los completa cruzando con
// el pedido asociado (GET /orders/{order_number}).

import { api } from "@/lib/api/client";
import { obtenerPedido } from "@/lib/api/pedidos";
import type { Devolucion, DevolucionInput, EstadoDevolucion } from "@/types/cliente";

interface DevolucionBackend {
  id: string;
  return_number: string;
  order_number: string;
  product_id: string;
  product_name: string;
  reason: string;
  status: EstadoDevolucion;
  created_at: string;
}

function mapDevolucion(doc: DevolucionBackend): Devolucion {
  return {
    id: doc.id,
    numero: doc.return_number,
    pedidoId: doc.order_number,
    productoId: doc.product_id,
    producto: doc.product_name,
    motivo: doc.reason,
    estado: doc.status,
    fecha: doc.created_at,
  };
}

export async function listarDevoluciones(): Promise<Devolucion[]> {
  const docs = await api("/account/returns");
  return docs.map(mapDevolucion);
}

export async function obtenerDevolucionConDetalle(numero: string): Promise<Devolucion | undefined> {
  const devoluciones = await listarDevoluciones();
  const devolucion = devoluciones.find((d) => d.numero === numero);
  if (!devolucion) return undefined;

  try {
    const pedido = await obtenerPedido(devolucion.pedidoId);
    const item = pedido.items.find((i) => i.productoId === devolucion.productoId);
    if (item) {
      return { ...devolucion, material: item.material, cantidad: item.cantidad, imagenUrl: item.imagenUrl };
    }
  } catch {
    // Si el pedido asociado ya no se puede cargar, se muestra igual la devolución sin esos datos extra.
  }
  return devolucion;
}

export async function crearDevolucion(input: DevolucionInput): Promise<Devolucion> {
  const reason = input.descripcion ? `${input.motivo} — ${input.descripcion}` : input.motivo;
  const doc = await api("/account/returns", {
    method: "POST",
    body: JSON.stringify({
      order_number: input.pedidoId,
      product_id: input.productoId,
      reason,
    }),
  });
  return mapDevolucion(doc);
}
