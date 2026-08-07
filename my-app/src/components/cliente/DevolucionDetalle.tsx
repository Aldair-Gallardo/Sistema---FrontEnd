// src/components/cliente/DevolucionDetalle.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { App, Button, Empty, Spin, Steps } from 'antd';
import { obtenerDevolucionConDetalle } from '@/lib/api/devoluciones';
import type { Devolucion, EstadoDevolucion } from '@/types/cliente';
import { DevolucionEstadoTag } from './EstadoTag';

const PASOS = ['Solicitud recibida', 'En revisión', 'Resolución'];

/** El backend solo guarda el estado actual (sin historial de fechas para devoluciones), así que el paso
 * actual se calcula a partir de "estado" en vez de una línea de tiempo real. */
function pasoActual(estado: EstadoDevolucion): number {
  return estado === 'en_revision' ? 1 : 2;
}

const MENSAJE_ESTADO: Partial<Record<EstadoDevolucion, string>> = {
  en_revision: 'Tu solicitud está siendo revisada por nuestro equipo.',
  aprobado: 'Tu solicitud fue aprobada. Te contactaremos para coordinar la recolección/cambio del producto.',
  completado: 'El cambio o devolución fue procesado.',
};

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  padding: 24,
  border: '1px solid var(--color-sidebar-border)',
};

export function DevolucionDetalle({ numero }: { numero: string }) {
  const { message } = App.useApp();
  const [devolucion, setDevolucion] = useState<Devolucion | null | undefined>(null);

  useEffect(() => {
    obtenerDevolucionConDetalle(numero)
      .then((resultado) => setDevolucion(resultado ?? undefined))
      .catch((error) => {
        message.error(error instanceof Error ? error.message : 'No se pudo cargar esta devolución');
        setDevolucion(undefined);
      });
  }, [numero, message]);

  if (devolucion === null) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
        <Spin />
      </div>
    );
  }

  if (!devolucion) {
    return (
      <div style={{ ...cardStyle, padding: 48 }}>
        <Empty description="No encontramos esta devolución" />
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link href="/devoluciones">
            <Button>Volver a mis devoluciones</Button>
          </Link>
        </div>
      </div>
    );
  }

  const actual = pasoActual(devolucion.estado);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <Link href="/devoluciones">
          <Button shape="round">Volver</Button>
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{devolucion.numero}</h1>
        <DevolucionEstadoTag estado={devolucion.estado} />
      </div>
      <p style={{ color: '#666', margin: '-12px 0 0' }}>
        Solicitada el {new Date(devolucion.fecha).toLocaleDateString('es-PA')} -- Pedido {devolucion.pedidoId}
      </p>

      {devolucion.estado !== 'rechazado' && (
        <div style={cardStyle}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, textAlign: 'center' }}>Proceso de la solicitud</h2>
          <Steps
            current={actual}
            items={PASOS.map((titulo, indice) => ({ title: titulo, status: indice <= actual ? 'finish' : undefined }))}
          />
        </div>
      )}

      <div
        style={{
          ...cardStyle,
          padding: 20,
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
          {devolucion.cantidad !== undefined && (
            <p style={{ color: '#666', fontSize: 13, margin: 0 }}>Cantidad: {devolucion.cantidad}</p>
          )}
          <p style={{ color: '#8c8c8c', fontSize: 12, margin: '8px 0 0' }}>Motivo</p>
          <p style={{ margin: 0 }}>{devolucion.motivo}</p>
        </div>
      </div>

      {devolucion.estado === 'rechazado' ? (
        <div
          style={{
            background: '#E6F7FF',
            border: '1px solid #91D5FF',
            borderRadius: 12,
            padding: 16,
            textAlign: 'center',
            color: '#096DD9',
          }}
        >
          ¿No estás de acuerdo? Puedes contactar a soporte para revisar el caso
        </div>
      ) : (
        MENSAJE_ESTADO[devolucion.estado] && (
          <div style={{ background: '#E6F7FF', border: '1px solid #91D5FF', borderRadius: 12, padding: 16, color: '#096DD9' }}>
            {MENSAJE_ESTADO[devolucion.estado]}
          </div>
        )
      )}
    </div>
  );
}
