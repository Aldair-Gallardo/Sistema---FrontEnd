// src/types/cliente.ts
// Tipos del área de navegación de cliente (Mi cuenta, Pedidos, Direcciones,
// Métodos de pago, Devoluciones). Pensados para calzar 1:1 con lo que
// debería devolver la API real cuando se conecte el backend.

export type EstadoPedido = "Pendiente" | "Procesando" | "En camino" | "Entregado";

export interface ItemPedido {
  id: string;
  nombre: string;
  material?: string;
  cantidad: number;
  precioUnitario: number;
  imagenUrl?: string;
}

export interface Pedido {
  id: string;
  fecha: string;
  estado: EstadoPedido;
  total: number;
  direccionEnvio: string;
  metodoPago: string;
  items: ItemPedido[];
}

export interface Direccion {
  id: string;
  etiqueta: string;
  calle: string;
  ciudad: string;
  referencia?: string;
  principal: boolean;
}

export type TipoMetodoPago = "visa" | "mastercard" | "paypal";

export interface MetodoPago {
  id: string;
  tipo: TipoMetodoPago;
  titular: string;
  ultimosDigitos?: string;
  vencimiento?: string;
  correo?: string;
  principal: boolean;
}

export type EstadoDevolucion = "En revisión" | "Aprobado" | "Rechazado" | "Completado";

export interface PasoDevolucion {
  label: string;
  completado: boolean;
}

export interface Devolucion {
  id: string;
  pedidoId: string;
  producto: string;
  material?: string;
  cantidad: number;
  motivo: string;
  descripcion?: string;
  estado: EstadoDevolucion;
  fecha: string;
  pasos: PasoDevolucion[];
  motivoRechazo?: string;
  mensajeEstado?: string;
}

export interface UsuarioCliente {
  nombre: string;
  correo: string;
  telefono?: string;
  rol: string;
  iniciales: string;
}
