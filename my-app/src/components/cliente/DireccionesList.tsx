// src/components/cliente/DireccionesList.tsx
'use client';

import { App, Button, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { Direccion } from '@/types/cliente';

export function DireccionesList({ direcciones }: { direcciones: Direccion[] }) {
  const { message } = App.useApp();
  // Sin backend conectado todavía: las acciones solo confirman visualmente la intención.
  const handleEditar = (direccion: Direccion) => message.info(`Editar dirección: ${direccion.etiqueta}`);
  const handleEliminar = (direccion: Direccion) => message.warning(`Eliminar dirección: ${direccion.etiqueta}`);
  const handleAgregar = () => message.info('Agregar nueva dirección');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Direcciones</h1>

      {direcciones.map((direccion) => (
        <div
          key={direccion.id}
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: 20,
            border: '1px solid var(--color-sidebar-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <p style={{ fontWeight: 700, margin: 0 }}>
                {direccion.etiqueta} - {direccion.calle}
              </p>
              {direccion.principal && <Tag color="brown" style={{ background: 'var(--color-header)', color: '#fff', border: 'none' }}>Principal</Tag>}
            </div>
            <p style={{ color: '#666', margin: '4px 0 0' }}>{direccion.ciudad}</p>
            {direccion.referencia && (
              <p style={{ color: '#8c8c8c', fontSize: 13, margin: '2px 0 0' }}>Referencia: {direccion.referencia}</p>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={() => handleEditar(direccion)}>Editar</Button>
            <Button danger onClick={() => handleEliminar(direccion)}>
              Eliminar
            </Button>
          </div>
        </div>
      ))}

      <button
        onClick={handleAgregar}
        style={{
          background: '#fff',
          border: '1px dashed var(--color-sidebar-border)',
          borderRadius: 12,
          padding: 32,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          color: '#8c8c8c',
          cursor: 'pointer',
        }}
      >
        <PlusOutlined style={{ fontSize: 22 }} />
        <span>Agregar nueva dirección</span>
      </button>
    </div>
  );
}
