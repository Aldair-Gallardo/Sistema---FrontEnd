// src/components/cliente/EstadoTag.tsx
'use client';

import { Tag } from 'antd';
import type { EstadoDevolucion, EstadoPedido } from '@/types/cliente';

const COLOR_PEDIDO: Record<EstadoPedido, string> = {
  Pendiente: 'default',
  Procesando: 'blue',
  'En camino': 'gold',
  Entregado: 'green',
};

export function PedidoEstadoTag({ estado }: { estado: EstadoPedido }) {
  return (
    <Tag color={COLOR_PEDIDO[estado]} style={{ fontWeight: 600, borderRadius: 6, padding: '2px 10px' }}>
      {estado}
    </Tag>
  );
}

const COLOR_DEVOLUCION: Record<EstadoDevolucion, string> = {
  'En revisión': 'gold',
  Aprobado: 'green',
  Rechazado: 'red',
  Completado: 'default',
};

export function DevolucionEstadoTag({ estado }: { estado: EstadoDevolucion }) {
  return (
    <Tag color={COLOR_DEVOLUCION[estado]} style={{ fontWeight: 600, borderRadius: 6, padding: '2px 10px' }}>
      {estado}
    </Tag>
  );
}
