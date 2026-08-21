// src/components/dashboard/FinanzasResumen.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button, Spin, Statistic, Table, Tooltip } from 'antd';
import { DollarOutlined, PercentageOutlined, ShoppingCartOutlined, TruckOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { obtenerResumenFinanciero } from '@/lib/api/finanzas';
import { METODO_PAGO_LABELS, type FinanzasPorMetodoPago, type ResumenFinanciero } from '@/types/finanzas';

function etiquetaMes(mes: string): string {
  const fecha = new Date(`${mes}-01T00:00:00`);
  const texto = fecha.toLocaleDateString('es-PA', { month: 'short', year: 'numeric' });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function formatoMoneda(valor: number): string {
  return `B/. ${valor.toFixed(2)}`;
}

export function FinanzasResumen() {
  const [resumen, setResumen] = useState<ResumenFinanciero | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let activo = true;

    const cargar = async () => {
      setCargando(true);
      setError(null);
      try {
        const datos = await obtenerResumenFinanciero();
        if (activo) setResumen(datos);
      } catch (error) {
        if (activo) setError(error instanceof Error ? error.message : 'No se pudo cargar el resumen financiero');
      } finally {
        if (activo) setCargando(false);
      }
    };

    cargar();
    return () => {
      activo = false;
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
        <p style={{ color: '#666', marginBottom: 16 }}>{error ?? 'No se pudo cargar el resumen financiero'}</p>
        <Button onClick={() => setIntento((actual) => actual + 1)}>Intentar nuevamente</Button>
      </div>
    );
  }

  const ingresosTotales = resumen.mensual.reduce((acc, m) => acc + m.ingresos, 0);
  const pedidosTotales = resumen.mensual.reduce((acc, m) => acc + m.pedidos, 0);
  const descuentosTotales = resumen.mensual.reduce((acc, m) => acc + m.descuentos, 0);
  const envioTotal = resumen.mensual.reduce((acc, m) => acc + m.envio, 0);
  const maxIngresoMensual = Math.max(...resumen.mensual.map((m) => m.ingresos), 1);
  const ingresoMetodoTotal = resumen.porMetodoPago.reduce((acc, m) => acc + m.ingresos, 0) || 1;

  const tarjetas = [
    { titulo: 'Ingresos totales', valor: ingresosTotales, icono: <DollarOutlined />, prefijo: 'B/. ', precision: 2 },
    { titulo: 'Pedidos facturados', valor: pedidosTotales, icono: <ShoppingCartOutlined /> },
    { titulo: 'Descuentos otorgados', valor: descuentosTotales, icono: <PercentageOutlined />, prefijo: 'B/. ', precision: 2 },
    { titulo: 'Envío cobrado', valor: envioTotal, icono: <TruckOutlined />, prefijo: 'B/. ', precision: 2 },
  ];

  const columnasMetodo: ColumnsType<FinanzasPorMetodoPago> = [
    {
      title: 'Método de pago',
      dataIndex: 'metodo',
      key: 'metodo',
      render: (metodo: string) => METODO_PAGO_LABELS[metodo] ?? metodo,
    },
    { title: 'Pedidos', dataIndex: 'pedidos', key: 'pedidos' },
    {
      title: 'Ingresos',
      dataIndex: 'ingresos',
      key: 'ingresos',
      render: formatoMoneda,
      sorter: (a, b) => a.ingresos - b.ingresos,
      defaultSortOrder: 'descend',
    },
    {
      title: '% del total',
      key: 'porcentaje',
      render: (_: unknown, fila: FinanzasPorMetodoPago) => {
        const porcentaje = (fila.ingresos / ingresoMetodoTotal) * 100;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 8, background: '#f3e8dc', borderRadius: 4, overflow: 'hidden', minWidth: 80 }}>
              <div style={{ width: `${porcentaje}%`, height: '100%', background: '#795538' }} />
            </div>
            <span style={{ fontSize: 12, color: '#666', minWidth: 40 }}>{porcentaje.toFixed(0)}%</span>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, marginBottom: 4 }}>Finanzas</h1>
      <p style={{ color: '#666', marginTop: 0, marginBottom: 20, fontSize: 13 }}>
        Resumen de ingresos por ventas (no incluye gastos: el sistema hoy solo registra ventas).
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        {tarjetas.map((tarjeta) => (
          <div
            key={tarjeta.titulo}
            style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid var(--color-sidebar-border)' }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 8,
                background: '#f3e8dc',
                color: '#795538',
                fontSize: 18,
                marginBottom: 12,
              }}
            >
              {tarjeta.icono}
            </div>
            <Statistic title={tarjeta.titulo} value={tarjeta.valor} prefix={tarjeta.prefijo} precision={tarjeta.precision} />
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid var(--color-sidebar-border)', marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 0, marginBottom: 20 }}>Ingresos por mes</h2>
        {resumen.mensual.length === 0 ? (
          <p style={{ color: '#666' }}>Todavía no hay pedidos facturados.</p>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 200, overflowX: 'auto', paddingBottom: 4 }}>
            {resumen.mensual.map((mes) => (
              <div key={mes.mes} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 56 }}>
                <Tooltip title={`${formatoMoneda(mes.ingresos)} · ${mes.pedidos} pedido(s)`}>
                  <div
                    style={{
                      width: 36,
                      height: Math.max((mes.ingresos / maxIngresoMensual) * 150, 4),
                      background: '#795538',
                      borderRadius: '4px 4px 0 0',
                    }}
                  />
                </Tooltip>
                <span style={{ fontSize: 11, color: '#666', marginTop: 8, textAlign: 'center' }}>{etiquetaMes(mes.mes)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid var(--color-sidebar-border)' }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 0, marginBottom: 20 }}>Ingresos por método de pago</h2>
        <Table
          rowKey="metodo"
          columns={columnasMetodo}
          dataSource={resumen.porMetodoPago}
          pagination={false}
        />
      </div>
    </div>
  );
}
