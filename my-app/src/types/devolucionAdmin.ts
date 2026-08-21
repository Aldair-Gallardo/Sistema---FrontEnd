// src/types/devolucionAdmin.ts
// Devolución vista desde el panel de administrador: igual que Devolucion (área
// de cliente, ver types/cliente.ts) más el nombre del cliente. El backend no
// guarda ese nombre en el documento de la devolución (solo user_id) — se
// resuelve cruzando con el pedido asociado (GET /orders/{order_number}).

import type { Devolucion } from "@/types/cliente";

export interface DevolucionAdmin extends Devolucion {
  clienteNombre: string;
}
