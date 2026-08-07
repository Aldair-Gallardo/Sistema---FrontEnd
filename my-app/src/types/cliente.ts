// src/types/cliente.ts
// Tipos del área de navegación de cliente (Mi cuenta, Pedidos, Direcciones,
// Métodos de pago, Devoluciones). Calzan 1:1 con lo que devuelve la API real
// (ver teca-backend/backend/app/routers/orders.py y app/routers/account.py).

export type EstadoPedido = "confirmado" | "en_preparacion" | "en_camino" | "entregado" | "cancelado";

export const ESTADO_PEDIDO_LABELS: Record<EstadoPedido, string> = {
  confirmado: "Confirmado",
  en_preparacion: "En preparación",
  en_camino: "En camino",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

/** Una entrada del historial de estados del pedido (status_history del backend). */
export interface PasoPedido {
  estado: EstadoPedido;
  fecha: string;
}

export interface ItemPedido {
  productoId: string;
  nombre: string;
  material?: string;
  imagenUrl?: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface DireccionEnvioPedido {
  nombreCompleto: string;
  telefono: string;
  provincia: string;
  ciudad: string;
  calle: string;
  referencia?: string;
}

export interface Pedido {
  id: string;
  fecha: string;
  estado: EstadoPedido;
  historial: PasoPedido[];
  numeroGuia?: string;
  metodoEnvio: string;
  metodoPago: string;
  direccionEnvio: DireccionEnvioPedido;
  subtotal: number;
  envio: number;
  descuento: number;
  cuponCodigo?: string;
  total: number;
  items: ItemPedido[];
}

export interface Direccion {
  id: string;
  nombreCompleto: string;
  telefono: string;
  provincia: string;
  ciudad: string;
  calle: string;
  referencia?: string;
  principal: boolean;
}

/** Lo que envía el formulario de Agregar/Editar dirección. */
export interface DireccionInput {
  nombreCompleto: string;
  telefono: string;
  provincia: string;
  ciudad: string;
  calle: string;
  referencia?: string;
  principal: boolean;
}

export type TipoMetodoPago = "visa" | "mastercard" | "paypal";

export interface MetodoPago {
  id: string;
  tipo: TipoMetodoPago;
  /** Texto ya armado por el backend, ej. "Visa terminada en 4821" o "PayPal". */
  etiqueta: string;
  titular?: string;
  vencimiento?: string;
  correo?: string;
  principal: boolean;
}

/** Lo que envía el formulario de Agregar/Editar; se traduce a la forma del backend en lib/api/cliente.ts. */
export interface MetodoPagoInput {
  tipo: TipoMetodoPago;
  titular?: string;
  ultimosDigitos?: string;
  vencimiento?: string;
  correo?: string;
  principal: boolean;
}

export type EstadoDevolucion = "en_revision" | "aprobado" | "rechazado" | "completado";

export const ESTADO_DEVOLUCION_LABELS: Record<EstadoDevolucion, string> = {
  en_revision: "En revisión",
  aprobado: "Aprobado",
  rechazado: "Rechazado",
  completado: "Completado",
};

export interface Devolucion {
  id: string;
  numero: string;
  pedidoId: string;
  productoId: string;
  producto: string;
  /** Completados cruzando con el pedido asociado; el documento de devolución no los guarda. */
  material?: string;
  cantidad?: number;
  imagenUrl?: string;
  motivo: string;
  estado: EstadoDevolucion;
  fecha: string;
}

/** Lo que envía el formulario "Solicitar devolución"; motivo+descripcion se combinan en un solo "reason" al mandarlo al backend. */
export interface DevolucionInput {
  pedidoId: string;
  productoId: string;
  motivo: string;
  descripcion?: string;
}

export interface UsuarioCliente {
  nombre: string;
  correo: string;
  telefono?: string;
  rol: string;
  iniciales: string;
}
