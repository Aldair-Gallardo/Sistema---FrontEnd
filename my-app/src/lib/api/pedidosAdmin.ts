// src/lib/api/pedidosAdmin.ts
// Llamadas del panel de administrador contra /admin/orders (ver
// teca-backend/backend/app/routers/admin.py, sección "Pedidos").
// Roles: admin, vendedor, encargado, soporte (require_sales en app/security.py).

import { api } from "@/lib/api/client";
import type { EstadoPedido } from "@/types/cliente";
import type { PedidoAdmin } from "@/types/pedidoAdmin";

interface PedidoAdminBackend {
  order_number: string;
  email: string;
  guest: boolean;
  shipping_address: { full_name: string };
  created_at: string;
  status: EstadoPedido;
  total: number;
  tracking_number?: string;
}

interface ListarPedidosAdminBackend {
  items: PedidoAdminBackend[];
  total: number;
  page: number;
  total_pages: number;
}

function mapPedidoAdmin(doc: PedidoAdminBackend): PedidoAdmin {
  return {
    id: doc.order_number,
    clienteNombre: doc.shipping_address.full_name,
    clienteCorreo: doc.email,
    invitado: doc.guest,
    fecha: doc.created_at,
    estado: doc.status,
    total: doc.total,
    numeroGuia: doc.tracking_number,
  };
}

// Tope de página que acepta /admin/orders (ver admin.py: page_size <= 50).
const BACKEND_PAGE_SIZE = 50;

function traerPagina(estado: EstadoPedido | undefined, pagina: number, acumulado: PedidoAdmin[]): Promise<PedidoAdmin[]> {
  const query = estado ? `&status=${estado}` : "";
  return api(`/admin/orders?page=${pagina}&page_size=${BACKEND_PAGE_SIZE}${query}`).then(
    (respuesta: ListarPedidosAdminBackend) => {
      const nuevoAcumulado = acumulado.concat(respuesta.items.map(mapPedidoAdmin));
      return pagina >= respuesta.total_pages ? nuevoAcumulado : traerPagina(estado, pagina + 1, nuevoAcumulado);
    }
  );
}

/** Trae todos los pedidos (encadenando páginas de a 50), opcionalmente filtrados por estado. */
export async function listarPedidosAdmin(estado?: EstadoPedido): Promise<PedidoAdmin[]> {
  return traerPagina(estado, 1, []);
}

export interface CambiarEstadoPedidoInput {
  estado: EstadoPedido;
  numeroGuia?: string;
}

/** PATCH /admin/orders/{order_number}/status: cambia el estado y, opcionalmente, la guía. */
export async function actualizarEstadoPedido(numero: string, input: CambiarEstadoPedidoInput): Promise<void> {
  await api(`/admin/orders/${numero}/status`, {
    method: "PATCH",
    body: JSON.stringify({
      status: input.estado,
      tracking_number: input.numeroGuia || undefined,
    }),
  });
}
