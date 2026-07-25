// src/components/cliente/MetodosPagoList.tsx
'use client';

import { Button, Tag, message } from 'antd';
import { PlusOutlined, CreditCardOutlined } from '@ant-design/icons';
import type { MetodoPago, TipoMetodoPago } from '@/types/cliente';

const ETIQUETA_TIPO: Record<TipoMetodoPago, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  paypal: 'PayPal',
};

const COLOR_TIPO: Record<TipoMetodoPago, string> = {
  visa: '#1A1F71',
  mastercard: '#EB001B',
  paypal: '#003087',
};

function MetodoIcono({ tipo }: { tipo: TipoMetodoPago }) {
  return (
    <div
      style={{
        width: 48,
        height: 32,
        borderRadius: 6,
        background: COLOR_TIPO[tipo],
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {tipo === 'paypal' ? <CreditCardOutlined /> : ETIQUETA_TIPO[tipo].slice(0, 4).toUpperCase()}
    </div>
  );
}

export function MetodosPagoList({ metodos }: { metodos: MetodoPago[] }) {
  // Sin backend conectado todavía: las acciones solo confirman visualmente la intención.
  const handleEditar = (metodo: MetodoPago) => message.info(`Editar método: ${ETIQUETA_TIPO[metodo.tipo]}`);
  const handleEliminar = (metodo: MetodoPago) => message.warning(`Eliminar método: ${ETIQUETA_TIPO[metodo.tipo]}`);
  const handleAgregar = () => message.info('Agregar nuevo método de pago');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>Métodos de pago</h1>

      {metodos.map((metodo) => (
        <div
          key={metodo.id}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <MetodoIcono tipo={metodo.tipo} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <p style={{ fontWeight: 700, margin: 0 }}>
                  {metodo.tipo === 'paypal'
                    ? 'PayPal'
                    : `${ETIQUETA_TIPO[metodo.tipo]} terminada en ${metodo.ultimosDigitos}`}
                </p>
                {metodo.principal && (
                  <Tag style={{ background: 'var(--color-header)', color: '#fff', border: 'none' }}>Principal</Tag>
                )}
              </div>
              <p style={{ color: '#666', fontSize: 13, margin: '2px 0 0' }}>
                {metodo.tipo === 'paypal' ? metodo.correo : `Vence ${metodo.vencimiento}, ${metodo.titular}`}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {metodo.tipo !== 'paypal' && <Button onClick={() => handleEditar(metodo)}>Editar</Button>}
            <Button danger onClick={() => handleEliminar(metodo)}>
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
        <span>Agregar nuevo método de pago</span>
      </button>
    </div>
  );
}
