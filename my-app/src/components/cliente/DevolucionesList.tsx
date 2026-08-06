// src/components/cliente/DevolucionesList.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { App, Button, Spin } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { listarDevoluciones } from '@/lib/api/devoluciones';
import type { Devolucion } from '@/types/cliente';
import { DevolucionEstadoTag } from './EstadoTag';

/** El "reason" que se manda al backend combina motivo+descripción en un solo texto ("Motivo — descripción"); acá se muestra solo el motivo corto en la tarjeta. */
function motivoCorto(motivo: string) {
  return motivo.split(' — ')[0];
}

export function DevolucionesList() {
  const { message } = App.useApp();
  const [devoluciones, setDevoluciones] = useState<Devolucion[] | null>(null);

  useEffect(() => {
    listarDevoluciones()
      .then(setDevoluciones)
      .catch((error) => message.error(error instanceof Error ? error.message : 'No se pudieron cargar tus devoluciones'));
  }, [message]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Mis devoluciones</h1>
          <p style={{ color: '#666', margin: '4px 0 0' }}>Consulta el estado de tus solicitudes de devolución o cambio</p>
        </div>
        <Link href="/devoluciones/nueva">
          <Button type="primary">Solicitar devolución</Button>
        </Link>
      </div>

      {!devoluciones ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <Spin />
        </div>
      ) : (
        devoluciones.map((devolucion) => (
          <Link key={devolucion.id} href={`/devoluciones/${devolucion.numero}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div
              style={{
                background: '#fff',
                borderRadius: 12,
                padding: 20,
                border: '1px solid var(--color-sidebar-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  background: 'var(--color-sidebar)',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <p style={{ fontWeight: 700, margin: 0 }}>{devolucion.numero}</p>
                  <DevolucionEstadoTag estado={devolucion.estado} />
                </div>
                <p style={{ color: '#666', fontSize: 13, margin: '2px 0 0' }}>
                  {devolucion.producto} · {motivoCorto(devolucion.motivo)}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#8c8c8c' }}>
                <span>{new Date(devolucion.fecha).toLocaleDateString('es-PA')}</span>
                <RightOutlined />
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
