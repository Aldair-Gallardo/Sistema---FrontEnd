// src/components/cliente/PedidosTable.tsx
'use client';

import Link from 'next/link';
import { Button } from 'antd';

export default function PedidosPage() {
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
    </div>
  );
}