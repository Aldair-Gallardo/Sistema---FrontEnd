// src/components/cliente/PedidoDetalle.tsx
// Nota: no había una imagen de referencia para esta pantalla en el Word;
// se diseñó siguiendo el mismo lenguaje visual (tarjetas, tipografía,
// paleta) que el resto de las pantallas de navegación de cliente.
'use client';

import Link from 'next/link';
import { Button, Empty } from 'antd';
import type { Pedido } from '@/types/cliente';
import { PedidoEstadoTag } from './EstadoTag';

export function PedidoDetalle({ pedido }: { pedido?: Pedido }) {
  if (!pedido) {
    return (
      <div style={{ background: '#fff', borderRadius: 12, padding: 48, border: '1px solid var(--color-sidebar-border)' }}>
        <Empty description="No encontramos este pedido" />
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link href="/mis-pedidos">
            <Button>Volver a mis pedidos</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <Link href="/mis-pedidos">
          <Button shape="round">Volver</Button>
        </Link>
      </div>

      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: 24,
          border: '1px solid var(--color-sidebar-border)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{pedido.id}</h1>
            <p style={{ color: '#666', margin: '4px 0 0' }}>Realizado el {pedido.fecha}</p>
          </div>
          <PedidoEstadoTag estado={pedido.estado} />
        </div>
      </div>

      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: 24,
          border: '1px solid var(--color-sidebar-border)',
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Productos</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {pedido.items.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                gap: 16,
                alignItems: 'center',
                padding: 12,
                background: 'var(--color-background)',
                borderRadius: 10,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 8,
                  background: 'var(--color-sidebar)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#8c8c8c',
                  fontSize: 12,
                  flexShrink: 0,
                }}
              >
                Imagen
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, margin: 0 }}>{item.nombre}</p>
                {item.material && (
                  <p style={{ color: '#666', fontSize: 13, margin: 0 }}>Material: {item.material}</p>
                )}
                <p style={{ color: '#666', fontSize: 13, margin: 0 }}>Cantidad: {item.cantidad}</p>
              </div>
              <p style={{ fontWeight: 600, margin: 0 }}>B/. {(item.precioUnitario * item.cantidad).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <div
          style={{
            flex: 1,
            minWidth: 240,
            background: '#fff',
            borderRadius: 12,
            padding: 24,
            border: '1px solid var(--color-sidebar-border)',
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Envío</h2>
          <p style={{ color: '#666', margin: 0 }}>{pedido.direccionEnvio}</p>
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 240,
            background: '#fff',
            borderRadius: 12,
            padding: 24,
            border: '1px solid var(--color-sidebar-border)',
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Pago</h2>
          <p style={{ color: '#666', margin: 0 }}>{pedido.metodoPago}</p>
          <p style={{ fontWeight: 700, marginTop: 12, fontSize: 18 }}>Total: B/. {pedido.total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
