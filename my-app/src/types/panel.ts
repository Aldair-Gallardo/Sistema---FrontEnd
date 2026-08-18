// src/types/panel.ts
// Tipo de las tarjetas de la pantalla Panel. Calza 1:1 con lo que devuelve
// GET /admin/dashboard (ver teca-backend/backend/app/routers/admin.py,
// sección "Panel y finanzas"). Requiere solo rol interno (cualquiera).

export interface ResumenPanel {
  totalPedidos: number;
  ingresosTotales: number;
  totalProductos: number;
  productosStockBajo: number;
  totalClientes: number;
  devolucionesPendientes: number;
}
