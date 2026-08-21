// src/components/dashboard/DevolucionesAdminTable.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { App, Button, Descriptions, Input, Modal, Select, Table } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { actualizarEstadoDevolucion, listarDevolucionesAdmin } from '@/lib/api/devolucionesAdmin';
import { DevolucionEstadoTag } from '@/components/cliente/EstadoTag';
import { ESTADO_DEVOLUCION_LABELS, type EstadoDevolucion } from '@/types/cliente';
import type { DevolucionAdmin } from '@/types/devolucionAdmin';

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-PA', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function DevolucionesAdminTable() {
  const { message, modal } = App.useApp();

  const [devoluciones, setDevoluciones] = useState<DevolucionAdmin[] | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState<EstadoDevolucion | undefined>();
  const [detalle, setDetalle] = useState<DevolucionAdmin | null>(null);
  const [actualizando, setActualizando] = useState<string | null>(null);

  function cargar() {
    listarDevolucionesAdmin()
      .then(setDevoluciones)
      .catch((error) => message.error(error instanceof Error ? error.message : 'No se pudieron cargar las devoluciones'));
  }

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtradas = useMemo(() => {
    if (!devoluciones) return [];
    const texto = busqueda.trim().toLowerCase();
    return devoluciones.filter((d) => {
      if (estado && d.estado !== estado) return false;
      if (
        texto &&
        !d.clienteNombre.toLowerCase().includes(texto) &&
        !d.pedidoId.toLowerCase().includes(texto) &&
        !d.numero.toLowerCase().includes(texto)
      ) {
        return false;
      }
      return true;
    });
  }, [devoluciones, busqueda, estado]);

  function cambiarEstado(devolucion: DevolucionAdmin, nuevoEstado: EstadoDevolucion, titulo: string, contenido: string) {
    modal.confirm({
      title: titulo,
      content: contenido,
      okText: 'Confirmar',
      okButtonProps: { danger: nuevoEstado === 'rechazado' },
      cancelText: 'Cancelar',
      onOk: async () => {
        setActualizando(devolucion.id);
        try {
          await actualizarEstadoDevolucion(devolucion.id, nuevoEstado);
          setDevoluciones((actual) =>
            actual?.map((d) => (d.id === devolucion.id ? { ...d, estado: nuevoEstado } : d)) ?? actual
          );
          message.success('Estado actualizado');
        } catch (error) {
          message.error(error instanceof Error ? error.message : 'Ocurrió un error inesperado');
        } finally {
          setActualizando(null);
        }
      },
    });
  }

  const columns: ColumnsType<DevolucionAdmin> = [
    { title: 'N° caso', dataIndex: 'numero', key: 'numero' },
    { title: 'Cliente', dataIndex: 'clienteNombre', key: 'clienteNombre' },
    { title: 'Pedido', dataIndex: 'pedidoId', key: 'pedidoId' },
    { title: 'Producto', dataIndex: 'producto', key: 'producto' },
    {
      title: 'Motivo',
      dataIndex: 'motivo',
      key: 'motivo',
      ellipsis: true,
      render: (motivo: string) => <span title={motivo}>{motivo}</span>,
    },
    { title: 'Fecha', dataIndex: 'fecha', key: 'fecha', render: formatearFecha },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (valor: EstadoDevolucion) => <DevolucionEstadoTag estado={valor} />,
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_: unknown, devolucion: DevolucionAdmin) => (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button size="small" icon={<EyeOutlined />} onClick={() => setDetalle(devolucion)} />
          {devolucion.estado === 'en_revision' && (
            <>
              <Button
                size="small"
                type="primary"
                loading={actualizando === devolucion.id}
                style={{ background: '#6F4E37', borderColor: '#6F4E37' }}
                onClick={() =>
                  cambiarEstado(
                    devolucion,
                    'aprobado',
                    'Aprobar solicitud',
                    `¿Aprobar la devolución ${devolucion.numero}? El cliente verá el nuevo estado en "Mis devoluciones".`
                  )
                }
              >
                Aprobar
              </Button>
              <Button
                size="small"
                danger
                loading={actualizando === devolucion.id}
                onClick={() =>
                  cambiarEstado(
                    devolucion,
                    'rechazado',
                    'Rechazar solicitud',
                    `¿Rechazar la devolución ${devolucion.numero}? Esta acción no se puede deshacer.`
                  )
                }
              >
                Rechazar
              </Button>
            </>
          )}
          {devolucion.estado === 'aprobado' && (
            <Button
              size="small"
              loading={actualizando === devolucion.id}
              onClick={() =>
                cambiarEstado(
                  devolucion,
                  'completado',
                  'Marcar como completada',
                  `¿Confirmas que la devolución ${devolucion.numero} ya se finalizó (producto recibido o reembolso hecho)?`
                )
              }
            >
              Marcar completado
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        padding: 24,
        border: '1px solid var(--color-sidebar-border)',
      }}
    >
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, marginBottom: 20 }}>Devoluciones y cambios</h1>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <Input.Search
          placeholder="Buscar por cliente, pedido o N° de caso..."
          allowClear
          style={{ flex: 1, minWidth: 220 }}
          onSearch={setBusqueda}
        />
        <Select
          placeholder="Estado"
          allowClear
          style={{ minWidth: 180 }}
          value={estado}
          onChange={setEstado}
          options={(Object.keys(ESTADO_DEVOLUCION_LABELS) as EstadoDevolucion[]).map((e) => ({
            value: e,
            label: ESTADO_DEVOLUCION_LABELS[e],
          }))}
        />
      </div>

      <Table
        rowKey="id"
        loading={!devoluciones}
        columns={columns}
        dataSource={filtradas}
        pagination={{
          pageSize: 10,
          showTotal: (totalItems, rango) => `Mostrando ${rango[1]} de ${totalItems} solicitudes`,
        }}
      />

      <Modal
        title={detalle ? `Detalle de ${detalle.numero}` : 'Detalle de solicitud'}
        open={!!detalle}
        onCancel={() => setDetalle(null)}
        footer={null}
      >
        {detalle && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Cliente">{detalle.clienteNombre}</Descriptions.Item>
            <Descriptions.Item label="Pedido">{detalle.pedidoId}</Descriptions.Item>
            <Descriptions.Item label="Producto">{detalle.producto}</Descriptions.Item>
            <Descriptions.Item label="Motivo">{detalle.motivo}</Descriptions.Item>
            <Descriptions.Item label="Fecha">{formatearFecha(detalle.fecha)}</Descriptions.Item>
            <Descriptions.Item label="Estado">
              <DevolucionEstadoTag estado={detalle.estado} />
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
