// src/lib/api/devolucionesAdmin.ts
// Llamadas del panel de administrador contra /admin/returns (ver
// teca-backend/backend/app/routers/admin.py, sección "Devoluciones").
// Todos estos endpoints requieren rol interno (admin, vendedor, encargado o
// soporte — ver require_sales en app/security.py).
//
// El backend no guarda el nombre del cliente en la devolución, solo
// order_number — se resuelve con obtenerPedido() (mismo endpoint que ya usa
// el área de cliente), cacheando por número de pedido para no repetir la
// llamada cuando varias devoluciones comparten un mismo pedido.

import { api } from "@/lib/api/client";
import { obtenerPedido } from "@/lib/api/pedidos";
import type { EstadoDevolucion } from "@/types/cliente";
import type { DevolucionAdmin } from "@/types/devolucionAdmin";

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

function nombreClientePorPedido() {
  const cache = new Map<string, Promise<string>>();
  return (orderNumber: string): Promise<string> => {
    if (!cache.has(orderNumber)) {
      cache.set(
        orderNumber,
        obtenerPedido(orderNumber)
          .then((pedido) => pedido.direccionEnvio.nombreCompleto)
          .catch(() => orderNumber) // si el pedido ya no se puede cargar, mostramos el número de pedido
      );
    }
    return cache.get(orderNumber)!;
  };
}

/** GET /admin/returns: bandeja de solicitudes de todos los clientes. */
export async function listarDevolucionesAdmin(estado?: EstadoDevolucion): Promise<DevolucionAdmin[]> {
  const query = estado ? `?status=${estado}` : "";
  const docs: DevolucionBackend[] = await api(`/admin/returns${query}`);
  const clientePara = nombreClientePorPedido();

  return Promise.all(
    docs.map(async (doc) => ({
      id: doc.id,
      numero: doc.return_number,
      pedidoId: doc.order_number,
      productoId: doc.product_id,
      producto: doc.product_name,
      motivo: doc.reason,
      estado: doc.status,
      fecha: doc.created_at,
      clienteNombre: await clientePara(doc.order_number),
    }))
  );
}

/** PATCH /admin/returns/{id}/status: aprueba, rechaza o marca como completada una solicitud. */
export async function actualizarEstadoDevolucion(id: string, estado: EstadoDevolucion): Promise<void> {
  await api(`/admin/returns/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: estado }),
  });
}
