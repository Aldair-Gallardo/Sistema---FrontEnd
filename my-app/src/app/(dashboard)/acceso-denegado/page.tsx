// src/app/(dashboard)/acceso-denegado/page.tsx
'use client';

import Link from 'next/link';
import { Button } from 'antd';
import { LockOutlined } from '@ant-design/icons';

export default function AccesoDenegadoPage() {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        padding: 48,
        border: '1px solid var(--color-sidebar-border)',
        textAlign: 'center',
        maxWidth: 480,
        margin: '48px auto',
      }}
    >
      <LockOutlined style={{ fontSize: 40, color: 'var(--color-header)' }} />
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: '16px 0 8px' }}>Acceso denegado</h1>
      <p style={{ color: '#666', margin: '0 0 24px' }}>
        Tu rol no tiene permiso para entrar a esta sección del panel.
      </p>
      <Link href="/panel">
        <Button type="primary" style={{ background: 'var(--color-header)', border: 'none' }}>
          Volver al Panel
        </Button>
      </Link>
    </div>
  );
}
