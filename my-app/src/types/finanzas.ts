// src/types/finanzas.ts
// Calza 1:1 con lo que devuelve GET /admin/finance/summary (ver
// teca-backend/backend/app/routers/admin.py, sección "Panel y finanzas").
//
// El backend solo agrega ingresos de pedidos (no cancelados) — no existe en
// el modelo de datos un concepto de "gasto"/egreso, así que este resumen es
// puramente de ingresos, no un libro de movimientos con entradas y salidas.

export interface FinanzasMes {
  mes: string; // "YYYY-MM"
  ingresos: number;
  pedidos: number;
  descuentos: number;
  envio: number;
}

export interface FinanzasPorMetodoPago {
  metodo: string; // card | paypal | bitcoin | yappy
  ingresos: number;
  pedidos: number;
}

export interface ResumenFinanciero {
  mensual: FinanzasMes[];
  porMetodoPago: FinanzasPorMetodoPago[];
}

export const METODO_PAGO_LABELS: Record<string, string> = {
  card: "Tarjeta",
  paypal: "PayPal",
  bitcoin: "Bitcoin",
  yappy: "Yappy",
};
