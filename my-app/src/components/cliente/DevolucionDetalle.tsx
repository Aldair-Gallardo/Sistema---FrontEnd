// src/components/cliente/DevolucionDetalle.tsx
'use client';

import Link from 'next/link';
import { Button, Empty, Steps } from 'antd';
import type { Devolucion } from '@/types/cliente';
import { DevolucionEstadoTag } from './EstadoTag';

export function DevolucionDetalle({ devolucion }: { devolucion?: Devolucion }) {
  if (!devolucion) {
    return (
      <div style={{ background: '#fff', borderRadius: 12, padding: 48, border: '1px solid var(--color-sidebar-border)' }}>
        <Empty description="No encontramos esta devolución" />
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link href="/devoluciones">
            <Button>Volver a mis devoluciones</Button>
          </Link>
        </div>
      </div>
    );
  }

  const pasoActualIndex = devolucion.pasos.findIndex((paso) => !paso.completado);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <Link href="/devoluciones">
          <Button shape="round">Volver</Button>
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{devolucion.id}</h1>
        <DevolucionEstadoTag estado={devolucion.estado} />
      </div>
      <p style={{ color: '#666', margin: '-12px 0 0' }}>
        Solicitada el {devolucion.fecha} -- Pedido {devolucion.pedidoId}
      </p>

      {devolucion.estado !== 'Rechazado' && (
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: 24,
            border: '1px solid var(--color-sidebar-border)',
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, textAlign: 'center' }}>
            Proceso de la solicitud
          </h2>
          <Steps
            current={pasoActualIndex === -1 ? devolucion.pasos.length - 1 : pasoActualIndex}
            items={devolucion.pasos.map((paso) => ({
              title: paso.label,
              status: paso.completado ? 'finish' : undefined,
            }))}
          />
        </div>
      )}

      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: 20,
          border: '1px solid var(--color-sidebar-border)',
          display: 'flex',
          gap: 16,
          alignItems: 'flex-start',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
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
          <p style={{ fontWeight: 700, margin: 0 }}>{devolucion.producto}</p>
          {devolucion.material && <p style={{ color: '#666', fontSize: 13, margin: 0 }}>Material: {devolucion.material}</p>}
          <p style={{ color: '#666', fontSize: 13, margin: 0 }}>Cantidad: {devolucion.cantidad}</p>
          <p style={{ color: '#8c8c8c', fontSize: 12, margin: '8px 0 0' }}>Motivo</p>
          <p style={{ margin: 0 }}>{devolucion.descripcion ?? devolucion.motivo}</p>
        </div>
        <p style={{ color: '#666', fontSize: 13, margin: 0, whiteSpace: 'nowrap' }}>{devolucion.motivo}</p>
      </div>

      {devolucion.estado === 'Rechazado' && devolucion.motivoRechazo && (
        <>
          <div
            style={{
              background: '#FFF1F0',
              border: '1px solid #FFA39E',
              borderRadius: 12,
              padding: 20,
            }}
          >
            <p style={{ fontWeight: 700, color: '#CF1322', margin: '0 0 8px' }}>Motivo del rechazo</p>
            <p style={{ color: '#5c2223', margin: 0 }}>{devolucion.motivoRechazo}</p>
          </div>
          <div
            style={{
              background: '#E6F7FF',
              border: '1px solid #91D5FF',
              borderRadius: 12,
              padding: 16,
              textAlign: 'center',
              color: '#096DD9',
              cursor: 'pointer',
            }}
          >
            ¿No estás de acuerdo? Puedes contactar a soporte para revisar el caso
          </div>
        </>
      )}

      {devolucion.estado !== 'Rechazado' && devolucion.mensajeEstado && (
        <div
          style={{
            background: '#E6F7FF',
            border: '1px solid #91D5FF',
            borderRadius: 12,
            padding: 16,
            color: '#096DD9',
          }}
        >
          {devolucion.mensajeEstado}
        </div>
      )}
    </div>
  );
}
