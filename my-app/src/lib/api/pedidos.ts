// src/lib/api/pedidos.ts
// Llamadas del área de cliente contra /orders (ver
// teca-backend/backend/app/routers/orders.py).

import { api } from "@/lib/api/client";
import type { EstadoPedido, ItemPedido, PasoPedido, Pedido } from "@/types/cliente";

interface ItemPedidoBackend {
  product_id: string;
  name: string;
  price: number;
  material?: string;
  image?: string;
  quantity: number;
  subtotal: number;
}

interface ShippingAddressBackend {
  full_name: string;
  phone: string;
  province: string;
  city: string;
  address_line: string;
  reference?: string;
}

interface StatusHistoryBackend {
  status: EstadoPedido;
  timestamp: string;
}

interface PedidoBackend {
  id: string;
  order_number: string;
  created_at: string;
  status: EstadoPedido;
  status_history: StatusHistoryBackend[];
  tracking_number?: string;
  shipping_method: string;
  payment_method: string;
  shipping_address: ShippingAddressBackend;
  subtotal: number;
  shipping: number;
  discount: number;
  coupon_code?: string;
  total: number;
  items: ItemPedidoBackend[];
}

function mapItemPedido(doc: ItemPedidoBackend): ItemPedido {
  return {
    productoId: doc.product_id,
    nombre: doc.name,
    material: doc.material,
    imagenUrl: doc.image,
    cantidad: doc.quantity,
    precioUnitario: doc.price,
    subtotal: doc.subtotal,
  };
}

function mapPasoPedido(doc: StatusHistoryBackend): PasoPedido {
  return { estado: doc.status, fecha: doc.timestamp };
}

function mapPedido(doc: PedidoBackend): Pedido {
  return {
    id: doc.order_number,
    fecha: doc.created_at,
    estado: doc.status,
    historial: doc.status_history.map(mapPasoPedido),
    numeroGuia: doc.tracking_number,
    metodoEnvio: doc.shipping_method,
    metodoPago: doc.payment_method,
    direccionEnvio: {
      nombreCompleto: doc.shipping_address.full_name,
      telefono: doc.shipping_address.phone,
      provincia: doc.shipping_address.province,
      ciudad: doc.shipping_address.city,
      calle: doc.shipping_address.address_line,
      referencia: doc.shipping_address.reference,
    },
    subtotal: doc.subtotal,
    envio: doc.shipping,
    descuento: doc.discount,
    cuponCodigo: doc.coupon_code,
    total: doc.total,
    items: doc.items.map(mapItemPedido),
  };
}

export async function listarPedidos(): Promise<Pedido[]> {
  const docs = await api("/orders/mine");
  return docs.map(mapPedido);
}

export async function obtenerPedido(numero: string): Promise<Pedido> {
  const doc = await api(`/orders/${numero}`);
  return mapPedido(doc);
}
