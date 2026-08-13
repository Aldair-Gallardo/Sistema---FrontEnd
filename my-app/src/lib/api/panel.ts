// src/lib/api/panel.ts
// Llamada contra /admin/dashboard (ver
// teca-backend/backend/app/routers/admin.py, sección "Panel y finanzas").

import { api } from "@/lib/api/client";
import type { ResumenPanel } from "@/types/panel";

interface ResumenPanelBackend {
  total_orders: number;
  total_revenue: number;
  total_products: number;
  low_stock_products: number;
  total_customers: number;
  pending_returns: number;
}

export async function obtenerResumenPanel(): Promise<ResumenPanel> {
  const doc: ResumenPanelBackend = await api("/admin/dashboard");
  return {
    totalPedidos: doc.total_orders,
    ingresosTotales: doc.total_revenue,
    totalProductos: doc.total_products,
    productosStockBajo: doc.low_stock_products,
    totalClientes: doc.total_customers,
    devolucionesPendientes: doc.pending_returns,
  };
}
