// src/components/dashboard/PedidosAdminTable.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { App, Button, DatePicker, Descriptions, Divider, Input, Modal, Select, Spin, Table } from 'antd';
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { obtenerPedido } from '@/lib/api/pedidos';
import { actualizarEstadoPedido, listarPedidosAdmin } from '@/lib/api/pedidosAdmin';
import { ESTADO_PEDIDO_LABELS, type EstadoPedido, type Pedido } from '@/types/cliente';
import type { PedidoAdmin } from '@/types/pedidoAdmin';
import { PedidoEstadoTag } from '@/components/cliente/EstadoTag';

const { RangePicker } = DatePicker;
const ESTADOS: EstadoPedido[] = ['confirmado', 'en_preparacion', 'en_camino', 'entregado', 'cancelado'];

function formatFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-PA', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function exportarCsv(pedidos: PedidoAdmin[]) {
  const encabezado = ['N° pedido', 'Cliente', 'Correo', 'Fecha', 'Estado', 'Total'];
  const filas = pedidos.map((p) => [
    p.id,
    p.clienteNombre,
    p.clienteCorreo,
    formatFecha(p.fecha),
    ESTADO_PEDIDO_LABELS[p.estado],
    p.total.toFixed(2),
  ]);
  const csv = [encabezado, ...filas].map((fila) => fila.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');

  const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = `pedidos-${new Date().toISOString().slice(0, 10)}.csv`;
  enlace.click();
  URL.revokeObjectURL(url);
}

export function PedidosAdminTable() {
  const { message } = App.useApp();

  const [pedidos, setPedidos] = useState<PedidoAdmin[] | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState<EstadoPedido | undefined>();
  const [rango, setRango] = useState<[string, string] | null>(null);
  // Fuerza el remontaje del RangePicker (no controlado) para que "Limpiar filtros" también borre lo seleccionado en su UI.
  const [filtroFechaKey, setFiltroFechaKey] = useState(0);

  const [numeroSeleccionado, setNumeroSeleccionado] = useState<string | null>(null);
  const [detalle, setDetalle] = useState<Pedido | null>(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState<EstadoPedido | undefined>();
  const [numeroGuia, setNumeroGuia] = useState('');
  const [guardando, setGuardando] = useState(false);

  function cargar() {
    listarPedidosAdmin()
      .then(setPedidos)
      .catch((error) => message.error(error instanceof Error ? error.message : 'No se pudieron cargar los pedidos'));
  }

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtrados = useMemo(() => {
    if (!pedidos) return [];
    const texto = busqueda.trim().toLowerCase();
    return pedidos.filter((p) => {
      if (estado && p.estado !== estado) return false;
      if (rango) {
        const fecha = p.fecha.slice(0, 10);
        if (fecha < rango[0] || fecha > rango[1]) return false;
      }
      if (
        texto &&
        !p.id.toLowerCase().includes(texto) &&
        !p.clienteNombre.toLowerCase().includes(texto) &&
        !p.clienteCorreo.toLowerCase().includes(texto)
      ) {
        return false;
      }
      return true;
    });
  }, [pedidos, busqueda, estado, rango]);

  function limpiarFiltros() {
    setBusqueda('');
    setEstado(undefined);
    setRango(null);
    setFiltroFechaKey((actual) => actual + 1);
  }

  function abrirDetalle(pedido: PedidoAdmin) {
    setNumeroSeleccionado(pedido.id);
    setDetalle(null);
    setCargandoDetalle(true);
    obtenerPedido(pedido.id)
      .then((data) => {
        setDetalle(data);
        setNuevoEstado(data.estado);
        setNumeroGuia(data.numeroGuia ?? '');
      })
      .catch((error) => message.error(error instanceof Error ? error.message : 'No se pudo cargar el pedido'))
      .finally(() => setCargandoDetalle(false));
  }

  async function guardarEstado() {
    if (!numeroSeleccionado || !nuevoEstado) return;
    setGuardando(true);
    try {
      await actualizarEstadoPedido(numeroSeleccionado, { estado: nuevoEstado, numeroGuia: numeroGuia || undefined });
      message.success('Estado del pedido actualizado');
      setPedidos((actual) =>
        actual?.map((p) => (p.id === numeroSeleccionado ? { ...p, estado: nuevoEstado, numeroGuia: numeroGuia || undefined } : p)) ??
        actual
      );
      setNumeroSeleccionado(null);
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'No se pudo actualizar el pedido');
    } finally {
      setGuardando(false);
    }
  }

  const columns: ColumnsType<PedidoAdmin> = [
    { title: 'N° pedido', dataIndex: 'id', key: 'id', render: (id: string) => <b>{id}</b> },
    {
      title: 'Cliente',
      key: 'cliente',
      render: (_: unknown, pedido: PedidoAdmin) => (
        <div>
          <div>{pedido.clienteNombre}</div>
          <div style={{ fontSize: 12, color: '#999' }}>
            {pedido.clienteCorreo}
            {pedido.invitado ? ' · invitado' : ''}
          </div>
        </div>
      ),
    },
    { title: 'Fecha', dataIndex: 'fecha', key: 'fecha', render: formatFecha },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (valor: EstadoPedido) => <PedidoEstadoTag estado={valor} />,
    },
    { title: 'Total', dataIndex: 'total', key: 'total', render: (total: number) => `B/. ${total.toFixed(2)}` },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_: unknown, pedido: PedidoAdmin) => (
        <Button size="small" icon={<EyeOutlined />} onClick={() => abrirDetalle(pedido)}>
          Ver
        </Button>
      ),
    },
  ];

  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid var(--color-sidebar-border)' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, marginBottom: 20 }}>Pedidos</h1>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16, alignItems: 'center' }}>
        <Input.Search
          placeholder="Buscar por cliente, correo o N° de pedido..."
          allowClear
          value={busqueda}
          style={{ flex: 1, minWidth: 220 }}
          onChange={(e) => setBusqueda(e.target.value)}
          onSearch={setBusqueda}
        />
        <Select
          placeholder="Estado"
          allowClear
          style={{ minWidth: 180 }}
          value={estado}
          onChange={setEstado}
          options={ESTADOS.map((e) => ({ value: e, label: ESTADO_PEDIDO_LABELS[e] }))}
        />
        <RangePicker
          key={filtroFechaKey}
          onChange={(_, fechas) => setRango(fechas[0] && fechas[1] ? [fechas[0], fechas[1]] : null)}
        />
        <Button onClick={limpiarFiltros}>Limpiar filtros</Button>
        <Button icon={<DownloadOutlined />} onClick={() => exportarCsv(filtrados)} style={{ marginLeft: 'auto' }}>
          Exportar CSV
        </Button>
      </div>

      <Table
        rowKey="id"
        loading={!pedidos}
        columns={columns}
        dataSource={filtrados}
        pagination={{ pageSize: 10, showTotal: (total, rango) => `Mostrando ${rango[1]} de ${total} pedidos` }}
      />

      <Modal
        title={numeroSeleccionado ? `Pedido ${numeroSeleccionado}` : 'Detalle de pedido'}
        open={!!numeroSeleccionado}
        onCancel={() => setNumeroSeleccionado(null)}
        footer={null}
        width={640}
      >
        {cargandoDetalle || !detalle ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
            <Spin />
          </div>
        ) : (
          <>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Cliente">{detalle.direccionEnvio.nombreCompleto}</Descriptions.Item>
              <Descriptions.Item label="Teléfono">{detalle.direccionEnvio.telefono}</Descriptions.Item>
              <Descriptions.Item label="Dirección">
                {detalle.direccionEnvio.calle}, {detalle.direccionEnvio.ciudad}, {detalle.direccionEnvio.provincia}
              </Descriptions.Item>
              <Descriptions.Item label="Método de envío">{detalle.metodoEnvio}</Descriptions.Item>
              <Descriptions.Item label="Método de pago">{detalle.metodoPago}</Descriptions.Item>
              <Descriptions.Item label="Total">B/. {detalle.total.toFixed(2)}</Descriptions.Item>
            </Descriptions>

            <Divider style={{ margin: '16px 0' }}>Productos</Divider>
            {detalle.items.map((item) => (
              <div key={item.productoId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0' }}>
                <span>
                  {item.nombre} × {item.cantidad}
                </span>
                <span>B/. {item.subtotal.toFixed(2)}</span>
              </div>
            ))}

            <Divider style={{ margin: '16px 0' }}>Cambiar estado</Divider>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <Select
                value={nuevoEstado}
                onChange={setNuevoEstado}
                style={{ minWidth: 180 }}
                options={ESTADOS.map((e) => ({ value: e, label: ESTADO_PEDIDO_LABELS[e] }))}
              />
              <Input
                placeholder="N° de guía (opcional)"
                value={numeroGuia}
                onChange={(e) => setNumeroGuia(e.target.value)}
                style={{ maxWidth: 220 }}
              />
              <Button
                type="primary"
                loading={guardando}
                style={{ background: '#6F4E37', borderColor: '#6F4E37' }}
                onClick={guardarEstado}
              >
                Guardar
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
