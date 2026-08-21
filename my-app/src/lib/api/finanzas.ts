// src/lib/api/finanzas.ts
// Llamada del panel de administrador contra /admin/finance/summary (ver
// teca-backend/backend/app/routers/admin.py, sección "Panel y finanzas").
// Roles: admin, finanzas.

import { api } from "@/lib/api/client";
import type { ResumenFinanciero } from "@/types/finanzas";

interface FinanzasMesBackend {
  month: string;
  revenue: number;
  orders: number;
  discounts: number;
  shipping: number;
}

interface FinanzasMetodoBackend {
  method: string;
  revenue: number;
  orders: number;
}

interface ResumenFinancieroBackend {
  monthly: FinanzasMesBackend[];
  by_payment_method: FinanzasMetodoBackend[];
}

export async function obtenerResumenFinanciero(): Promise<ResumenFinanciero> {
  const doc: ResumenFinancieroBackend = await api("/admin/finance/summary");
  return {
    mensual: doc.monthly.map((m) => ({
      mes: m.month,
      ingresos: m.revenue,
      pedidos: m.orders,
      descuentos: m.discounts,
      envio: m.shipping,
    })),
    porMetodoPago: doc.by_payment_method.map((m) => ({
      metodo: m.method,
      ingresos: m.revenue,
      pedidos: m.orders,
    })),
  };
}
