// src/components/cliente/PedidosTable.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { App, Button, Spin, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { listarPedidos } from '@/lib/api/pedidos';
import type { Pedido } from '@/types/cliente';
import { PedidoEstadoTag } from './EstadoTag';

export function PedidosTable() {
  const { message } = App.useApp();
  const [pedidos, setPedidos] = useState<Pedido[] | null>(null);

  useEffect(() => {
    listarPedidos()
      .then(setPedidos)
      .catch((error) => message.error(error instanceof Error ? error.message : 'No se pudieron cargar tus pedidos'));
  }, [message]);

  const columns: ColumnsType<Pedido> = [
    { title: 'Pedido', dataIndex: 'id', key: 'id', render: (id) => <b>{id}</b> },
    { title: 'Fecha', dataIndex: 'fecha', key: 'fecha', render: (fecha: string) => new Date(fecha).toLocaleDateString('es-PA') },
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
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>
        Mis pedidos
      </h1>

      {!pedidos ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <Spin />
        </div>
      ) : pedidos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <h2>No tienes pedidos todavía</h2>

          <p style={{ marginBottom: 24, color: '#666' }}>
            Cuando realices una compra, tus pedidos aparecerán aquí.
          </p>

          <Link href="/catalogo">
            <Button
              type="primary"
              style={{
                background: '#6F4E37',
                borderColor: '#6F4E37',
              }}
            >
              Explorar catálogo
            </Button>
          </Link>
        </div>
      ) : (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={pedidos}
          pagination={{ pageSize: 5 }}
        />
      )}
    </div>
  );
}