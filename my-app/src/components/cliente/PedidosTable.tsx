// src/components/cliente/PedidosTable.tsx
'use client';

import Link from 'next/link';
import { Table, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Pedido } from '@/types/cliente';
import { PedidoEstadoTag } from './EstadoTag';

export function PedidosTable({ pedidos }: { pedidos: Pedido[] }) {
  const columns: ColumnsType<Pedido> = [
    { title: 'Pedido', dataIndex: 'id', key: 'id', render: (id) => <b>{id}</b> },
    { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (estado) => <PedidoEstadoTag estado={estado} />,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => `B/. ${total.toFixed(2)}`,
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, pedido) => (
        <Link href={`/mis-pedidos/${pedido.id}`}>
          <Button size="small">Ver detalles</Button>
        </Link>
      ),
    },
  ];

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        padding: 24,
        border: '1px solid var(--color-sidebar-border)',
      }}
    >
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Mis pedidos</h1>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={pedidos}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}
