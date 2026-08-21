// src/types/pedidoAdmin.ts
// Fila de la bandeja de pedidos del panel de administrador. Resumen liviano —
// calza con lo que devuelve GET /admin/orders (ver
// teca-backend/backend/app/routers/admin.py). El detalle completo (items,
// dirección, historial) se trae aparte con obtenerPedido() (lib/api/pedidos.ts),
// el mismo endpoint que ya usa el área de cliente.

import type { EstadoPedido } from "@/types/cliente";

export interface PedidoAdmin {
  id: string; // order_number, ej. "TEC-2026-001"
  clienteNombre: string;
  clienteCorreo: string;
  invitado: boolean;
  fecha: string;
  estado: EstadoPedido;
  total: number;
  numeroGuia?: string;
}
