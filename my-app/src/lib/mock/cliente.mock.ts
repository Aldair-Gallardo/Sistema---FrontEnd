// src/lib/mock/cliente.mock.ts
//
// Datos de prueba para el área de navegación de cliente, mientras no está
// conectado el backend. La forma de estos objetos sigue los tipos de
// "@/types/cliente" para que, al conectar la API real, solo haya que
// reemplazar estas constantes por llamadas a "@/lib/api/cliente".

import type { Devolucion, Direccion, Pedido } from "@/types/cliente";

export const mockPedidos: Pedido[] = [
  {
    id: "TEC-2026-001",
    fecha: "05/07/2026",
    estado: "Entregado",
    total: 245.0,
    direccionEnvio: "Casa - Calle 50, Edif. Las Palmas, Apto 3B, Marbella",
    metodoPago: "Visa terminada en 4821",
    items: [
      { id: "1", nombre: "Silla Nórdica", material: "Madera de roble", cantidad: 2, precioUnitario: 89.5 },
      { id: "2", nombre: "Cojín decorativo", material: "Algodón", cantidad: 2, precioUnitario: 33.0 },
    ],
  },
  {
    id: "TEC-2026-002",
    fecha: "12/07/2026",
    estado: "En camino",
    total: 560.0,
    direccionEnvio: "Casa - Calle 50, Edif. Las Palmas, Apto 3B, Marbella",
    metodoPago: "Mastercard terminada en 9034",
    items: [{ id: "3", nombre: "Mesa de comedor", material: "Madera de roble", cantidad: 1, precioUnitario: 560.0 }],
  },
  {
    id: "TEC-2026-003",
    fecha: "18/07/2026",
    estado: "Procesando",
    total: 132.75,
    direccionEnvio: "Oficina - Calle 50, Edif. Las Palmas, Apto 3B, Marbella",
    metodoPago: "PayPal",
    items: [{ id: "4", nombre: "Lámpara de piso", material: "Metal y lino", cantidad: 1, precioUnitario: 132.75 }],
  },
  {
    id: "TEC-2026-004",
    fecha: "22/07/2026",
    estado: "Pendiente",
    total: 78.0,
    direccionEnvio: "Casa - Calle 50, Edif. Las Palmas, Apto 3B, Marbella",
    metodoPago: "Visa terminada en 4821",
    items: [{ id: "5", nombre: "Portamacetas de madera", material: "Madera de pino", cantidad: 2, precioUnitario: 39.0 }],
  },
];

export function getPedidoById(id: string): Pedido | undefined {
  return mockPedidos.find((pedido) => pedido.id === id);
}

export const mockDirecciones: Direccion[] = [
  {
    id: "dir-1",
    etiqueta: "Casa",
    calle: "Calle 50, Edif. Las Palmas, Apto 3B",
    ciudad: "Marbella, Ciudad de Panamá, Panamá",
    referencia: "Frente al supermercado Rey",
    principal: true,
  },
  {
    id: "dir-2",
    etiqueta: "Oficina",
    calle: "Av. Balboa, Torre Global Bank, Piso 12",
    ciudad: "Ciudad de Panamá, Panamá",
    referencia: "Recepción en piso 12",
    principal: false,
  },
];

export const mockDevoluciones: Devolucion[] = [
  {
    id: "DEV-2026-0347",
    pedidoId: "TEC-2026-001",
    producto: "Silla Nórdica",
    material: "Madera de roble",
    cantidad: 1,
    motivo: "Producto dañado",
    descripcion: "La silla llegó con una raya visible en una de las patas.",
    estado: "En revisión",
    fecha: "01/07/2026",
    pasos: [
      { label: "Solicitud recibida", completado: true },
      { label: "En revisión", completado: false },
      { label: "Resolución", completado: false },
    ],
    mensajeEstado: "Tu solicitud está siendo revisada por el equipo de calidad.",
  },
  {
    id: "DEV-2026-0289",
    pedidoId: "TEC-2026-004",
    producto: "Mesa",
    material: "Madera de roble",
    cantidad: 1,
    motivo: "Producto dañado",
    descripcion: "El color se ve diferente a las fotos del catálogo.",
    estado: "Aprobado",
    fecha: "10/06/2026",
    pasos: [
      { label: "Solicitud recibida", completado: true },
      { label: "En revisión", completado: true },
      { label: "Resolución", completado: false },
    ],
    mensajeEstado: "Tu solicitud fue aprobada. Te contactaremos para coordinar la recolección del producto.",
  },
  {
    id: "DEV-2026-0198",
    pedidoId: "TEC-2026-002",
    producto: "Mesa",
    material: "Madera de roble",
    cantidad: 1,
    motivo: "Producto dañado",
    descripcion: "El color se ve diferente a las fotos del catálogo.",
    estado: "Rechazado",
    fecha: "13/06/2026",
    pasos: [
      { label: "Solicitud recibida", completado: true },
      { label: "En revisión", completado: true },
      { label: "Resolución", completado: true },
    ],
    motivoRechazo:
      "La variación del color reportada está dentro del rango normal de fabricación del producto y no constituye un defecto. Revisado el 13/06/2026 por el equipo de calidad.",
  },
  {
    id: "DEV-2026-0142",
    pedidoId: "TEC-2026-003",
    producto: "Cojín decorativo",
    material: "Algodón",
    cantidad: 2,
    motivo: "Cambio de talla/modelo",
    descripcion: "Quiero cambiarlos por el modelo en color gris.",
    estado: "Completado",
    fecha: "20/05/2026",
    pasos: [
      { label: "Solicitud recibida", completado: true },
      { label: "En revisión", completado: true },
      { label: "Resolución", completado: true },
    ],
    mensajeEstado: "El cambio fue procesado y el nuevo producto fue entregado.",
  },
];

export function getDevolucionById(id: string): Devolucion | undefined {
  return mockDevoluciones.find((devolucion) => devolucion.id === id);
}
