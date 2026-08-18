// src/components/cliente/PedidoDetalle.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { App, Button, Empty, Spin, Steps } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import { obtenerPedido } from '@/lib/api/pedidos';
import { ESTADO_PEDIDO_LABELS, type EstadoPedido, type Pedido } from '@/types/cliente';
import { PedidoEstadoTag } from './EstadoTag';

const STATUS_FLOW: EstadoPedido[] = ['confirmado', 'en_preparacion', 'en_camino', 'entregado'];
const DIAS_PLAZO_DEVOLUCION = 15;

function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString('es-PA', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatFechaHora(iso: string) {
  return new Date(iso).toLocaleString('es-PA', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  padding: 24,
  border: '1px solid var(--color-sidebar-border)',
};

export function PedidoDetalle({ numero }: { numero: string }) {
  const { message } = App.useApp();
  const [pedido, setPedido] = useState<Pedido | null | undefined>(null);
  // Date.now() no puede llamarse durante el render (regla react-hooks/purity); se
  // guarda como estado, leído una sola vez al montar, para calcular el plazo de devolución.
  const [ahora] = useState(() => Date.now());

  useEffect(() => {
    obtenerPedido(numero)
      .then(setPedido)
      .catch((error) => {
        message.error(error instanceof Error ? error.message : 'No se pudo cargar este pedido');
        setPedido(undefined);
      });
  }, [numero, message]);

  if (pedido === null) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
        <Spin />
      </div>
    );
  }

  if (!pedido) {
    return (
      <div style={{ ...cardStyle, padding: 48 }}>
        <Empty description="No encontramos este pedido" />
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link href="/mis-pedidos">
            <Button>Volver a mis pedidos</Button>
          </Link>
        </div>
      </div>
    );
  }

  const fechaPorEstado = Object.fromEntries(pedido.historial.map((paso) => [paso.estado, paso.fecha])) as Partial<
    Record<EstadoPedido, string>
  >;

  const fechaEntregado = fechaPorEstado.entregado;
  const fechaLimiteDevolucion = fechaEntregado
    ? new Date(new Date(fechaEntregado).getTime() + DIAS_PLAZO_DEVOLUCION * 24 * 60 * 60 * 1000)
    : undefined;
  const dentroDePlazoDevolucion = fechaLimiteDevolucion ? ahora <= fechaLimiteDevolucion.getTime() : false;

  const pasos = [
    ...STATUS_FLOW.map((estado) => ({
      title: ESTADO_PEDIDO_LABELS[estado],
      content: fechaPorEstado[estado] ? formatFechaHora(fechaPorEstado[estado]!) : undefined,
      status: (fechaPorEstado[estado] ? 'finish' : 'wait') as 'finish' | 'wait',
    })),
    { title: '', icon: <StarOutlined />, status: 'wait' as const, disabled: true },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <Link href="/mis-pedidos">
          <Button shape="round">Volver</Button>
        </Link>
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{pedido.id}</h1>
            <p style={{ color: '#666', margin: '4px 0 0' }}>Realizado el {formatFecha(pedido.fecha)}</p>
          </div>
          <PedidoEstadoTag estado={pedido.estado} />
        </div>
      </div>

      {pedido.estado === 'cancelado' ? (
        <div style={{ ...cardStyle, background: '#FFF1F0', borderColor: '#FFA39E' }}>
          <p style={{ color: '#CF1322', fontWeight: 600, margin: 0 }}>Este pedido fue cancelado.</p>
        </div>
      ) : (
        <div style={cardStyle}>
          <Steps items={pasos} />
        </div>
      )}

      {pedido.estado !== 'cancelado' &&
        (pedido.numeroGuia ? (
          <div style={{ background: '#E6F7FF', border: '1px solid #91D5FF', borderRadius: 12, padding: 16, textAlign: 'center' }}>
            <p style={{ fontWeight: 700, margin: 0 }}>Número de guía</p>
            <p style={{ margin: '4px 0' }}>{pedido.numeroGuia}</p>
            <p style={{ color: '#096DD9', margin: 0, fontSize: 13 }}>Rastrear pedido en el portal de courier</p>
          </div>
        ) : (
          <div style={{ background: '#F6FFED', border: '1px solid #B7EB8F', borderRadius: 12, padding: 16, color: '#389E0D' }}>
            ! Aún no hay número de guía asignado, Aparecerá cuando el pedido salga a reparto
          </div>
        ))}

      {pedido.estado === 'entregado' && fechaEntregado && (
        <>
          <div style={{ background: '#F6FFED', border: '1px solid #B7EB8F', borderRadius: 12, padding: 16, color: '#389E0D' }}>
            ✓ Tu pedido fue entregado el {formatFecha(fechaEntregado)}. Gracias por tu compra!!!
          </div>
          {dentroDePlazoDevolucion && fechaLimiteDevolucion && (
            <div
              style={{
                background: '#fff',
                border: '1px solid var(--color-sidebar-border)',
                borderRadius: 12,
                padding: 16,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <span>
                Tienes hasta el {formatFecha(fechaLimiteDevolucion.toISOString())} para solicitar una devolución o cambio (
                {DIAS_PLAZO_DEVOLUCION} días desde la entrega)
              </span>
              <div style={{ display: 'flex', gap: 12 }}>
                <Link href={`/devoluciones/nueva?pedido=${pedido.id}`}>
                  <Button style={{ background: 'var(--color-header)', color: '#fff', border: 'none' }}>
                    Solicitar devolución/cambio
                  </Button>
                </Link>
                <Link href="/mis-pedidos">
                  <Button>Volver a mis pedidos</Button>
                </Link>
              </div>
            </div>
          )}
        </>
      )}

      <div style={cardStyle}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Productos</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {pedido.items.map((item) => (
            <div
              key={item.productoId}
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
                {item.material && <p style={{ color: '#666', fontSize: 13, margin: 0 }}>Material: {item.material}</p>}
                <p style={{ color: '#666', fontSize: 13, margin: 0 }}>Cantidad: {item.cantidad}</p>
              </div>
              <p style={{ fontWeight: 600, margin: 0 }}>B/. {item.subtotal.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ ...cardStyle, flex: 1, minWidth: 260 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Información de envío</h2>
          <p style={{ color: '#8c8c8c', fontSize: 12, margin: 0 }}>Cliente</p>
          <p style={{ margin: '0 0 8px' }}>{pedido.direccionEnvio.nombreCompleto}</p>
          <p style={{ color: '#8c8c8c', fontSize: 12, margin: 0 }}>Dirección</p>
          <p style={{ margin: '0 0 8px' }}>
            {pedido.direccionEnvio.calle}, {pedido.direccionEnvio.ciudad}, {pedido.direccionEnvio.provincia}
            {pedido.direccionEnvio.referencia && ` — ${pedido.direccionEnvio.referencia}`}
          </p>
          <p style={{ color: '#8c8c8c', fontSize: 12, margin: 0 }}>Teléfono</p>
          <p style={{ margin: '0 0 8px' }}>{pedido.direccionEnvio.telefono}</p>
          <p style={{ color: '#8c8c8c', fontSize: 12, margin: 0 }}>Método de envío</p>
          <p style={{ margin: 0 }}>{pedido.metodoEnvio}</p>
        </div>

        <div style={{ ...cardStyle, flex: 1, minWidth: 260 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Resumen del Pedido</h2>
          <p style={{ color: '#8c8c8c', fontSize: 12, margin: 0 }}>Método de pago</p>
          <p style={{ margin: '0 0 12px' }}>{pedido.metodoPago}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0' }}>
            <span>Subtotal:</span>
            <b>B/. {pedido.subtotal.toFixed(2)}</b>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0' }}>
            <span>Envío:</span>
            <b>B/. {pedido.envio.toFixed(2)}</b>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0' }}>
            <span>Descuento{pedido.cuponCodigo ? ` (${pedido.cuponCodigo})` : ''}:</span>
            <b>B/. {pedido.descuento.toFixed(2)}</b>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 12,
              paddingTop: 12,
              borderTop: '1px solid var(--color-sidebar-border)',
              fontSize: 18,
            }}
          >
            <b>Total:</b>
            <b>B/. {pedido.total.toFixed(2)}</b>
          </div>
        </div>
      </div>
    </div>
  );
}
