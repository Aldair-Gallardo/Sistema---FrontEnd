// src/components/dashboard/PanelResumen.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button, Spin, Statistic } from 'antd';
import {
  DollarOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UndoOutlined,
  UserOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { obtenerResumenPanel } from '@/lib/api/panel';
import type { ResumenPanel } from '@/types/panel';

interface Tarjeta {
  titulo: string;
  valor: number;
  icono: React.ReactNode;
  prefijo?: string;
  precision?: number;
  alerta?: boolean;
}

export function PanelResumen() {
  const [resumen, setResumen] = useState<ResumenPanel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let componenteActivo = true;

    const cargar = async () => {
      setCargando(true);
      setError(null);
      try {
        const datos = await obtenerResumenPanel();
        if (componenteActivo) setResumen(datos);
      } catch (error) {
        if (componenteActivo) setError(error instanceof Error ? error.message : 'No se pudo cargar el panel');
      } finally {
        if (componenteActivo) setCargando(false);
      }
    };

    cargar();

    return () => {
      componenteActivo = false;
    };
  }, [intento]);

  if (cargando) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !resumen) {
    return (
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: 40,
          border: '1px solid var(--color-sidebar-border)',
          textAlign: 'center',
        }}
      >
        <p style={{ color: '#666', marginBottom: 16 }}>{error ?? 'No se pudo cargar el panel'}</p>
        <Button onClick={() => setIntento((actual) => actual + 1)}>Intentar nuevamente</Button>
      </div>
    );
  }

  const tarjetas: Tarjeta[] = [
    { titulo: 'Pedidos', valor: resumen.totalPedidos, icono: <ShoppingCartOutlined /> },
    { titulo: 'Ingresos totales', valor: resumen.ingresosTotales, icono: <DollarOutlined />, prefijo: 'B/. ', precision: 2 },
    { titulo: 'Productos en catálogo', valor: resumen.totalProductos, icono: <ShoppingOutlined /> },
    {
      titulo: 'Productos con stock bajo',
      valor: resumen.productosStockBajo,
      icono: <WarningOutlined />,
      alerta: resumen.productosStockBajo > 0,
    },
    { titulo: 'Clientes registrados', valor: resumen.totalClientes, icono: <UserOutlined /> },
    { titulo: 'Devoluciones pendientes', valor: resumen.devolucionesPendientes, icono: <UndoOutlined /> },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, marginBottom: 20 }}>Panel</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {tarjetas.map((tarjeta) => (
          <div
            key={tarjeta.titulo}
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: 24,
              border: '1px solid var(--color-sidebar-border)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 8,
                background: tarjeta.alerta ? '#fff1f0' : '#f3e8dc',
                color: tarjeta.alerta ? '#cf1322' : '#795538',
                fontSize: 18,
                marginBottom: 12,
              }}
            >
              {tarjeta.icono}
            </div>
            <Statistic
              title={tarjeta.titulo}
              value={tarjeta.valor}
              prefix={tarjeta.prefijo}
              precision={tarjeta.precision}
              styles={tarjeta.alerta ? { content: { color: '#cf1322' } } : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
