// src/components/cliente/EstadoTag.tsx
'use client';

import { Tag } from 'antd';
import {
  ESTADO_DEVOLUCION_LABELS,
  ESTADO_PEDIDO_LABELS,
  type EstadoDevolucion,
  type EstadoPedido,
} from '@/types/cliente';

const COLOR_PEDIDO: Record<EstadoPedido, string> = {
  confirmado: 'blue',
  en_preparacion: 'gold',
  en_camino: 'gold',
  entregado: 'green',
  cancelado: 'red',
};

export function PedidoEstadoTag({ estado }: { estado: EstadoPedido }) {
  return (
    <Tag color={COLOR_PEDIDO[estado]} style={{ fontWeight: 600, borderRadius: 6, padding: '2px 10px' }}>
      {ESTADO_PEDIDO_LABELS[estado]}
    </Tag>
  );
}

const COLOR_DEVOLUCION: Record<EstadoDevolucion, string> = {
  en_revision: 'gold',
  aprobado: 'green',
  rechazado: 'red',
  completado: 'default',
};

export function DevolucionEstadoTag({ estado }: { estado: EstadoDevolucion }) {
  return (
    <Tag color={COLOR_DEVOLUCION[estado]} style={{ fontWeight: 600, borderRadius: 6, padding: '2px 10px' }}>
      {ESTADO_DEVOLUCION_LABELS[estado]}
    </Tag>
  );
}
